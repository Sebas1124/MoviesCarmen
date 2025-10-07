import React, { useState, useEffect } from 'react';
import { Play, Info, Star, Calendar, Clock, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import OptimizedImage from '../ui/OptimizedImage';
import TrailerPlayer from '../ui/TrailerPlayer';
import BackgroundTrailer from '../ui/BackgroundTrailer';
import { getYearFromDate, formatRuntime, truncateText } from '../../utils/helpers';
import { tmdbService } from '../../services/tmdb.service';
import type { Movie } from '../../types/movie.types';

interface HeroSectionProps {
  movies: Movie[];
}

interface TrailerData {
  key: string;
  site: string;
  type: string;
  name: string;
}

const OptimizedHeroSection: React.FC<HeroSectionProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentMovie = movies[currentIndex];

  // Obtener detalles y trailers de la película actual
  const { data: movieDetails } = useQuery({
    queryKey: ['movieDetails', currentMovie?.id],
    queryFn: () => currentMovie ? tmdbService.getMovieDetail(currentMovie.id) : null,
    enabled: !!currentMovie,
    staleTime: 15 * 60 * 1000, // 15 minutos
  });

  const { data: trailers } = useQuery({
    queryKey: ['movieVideos', currentMovie?.id],
    queryFn: () => currentMovie ? tmdbService.getMovieVideos(currentMovie.id) : [],
    enabled: !!currentMovie,
    staleTime: 15 * 60 * 1000,
  });

  // Buscar trailer en español o inglés
  const backgroundTrailer = trailers?.find((video: TrailerData) => 
    video.type === 'Trailer' && 
    video.site === 'YouTube'
  );

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    // Duración más larga para que no se sienta brusco
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === movies.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 300); // Transición de 300ms

    }, 60000); // Cambio cada 60 segundos, más similar a Netflix

    return () => clearInterval(interval);
  }, [movies]);

  if (!currentMovie) {
    return (
      <div className="relative h-[80vh] bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Trailer de fondo */}
      {backgroundTrailer && isTrailerPlaying ? (
        <>
          <div className="absolute inset-0 z-0">
            <BackgroundTrailer
              trailerKey={backgroundTrailer.key}
              title={currentMovie.title}
              autoPlay={true}
              muted={isMuted}
            />
          </div>
          {/* Overlay con gradiente para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        </>
      ) : (
        /* Backdrop de fallback */
        <div className="absolute inset-0 z-0 w-full h-full">
            <OptimizedImage
                src={currentMovie.backdrop_path}
                alt={currentMovie.title}
                type="backdrop"
                size="large"
                className="w-full h-full min-w-full min-h-full max-w-none object-cover object-center block"
            />
            {/* Overlay para backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className={`max-w-3xl transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            {/* Título con animación */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight animate-fade-in">
              {currentMovie.title}
            </h1>
            
            {/* Información de la película */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-400" fill="currentColor" />
                <span className="font-semibold">{currentMovie.vote_average.toFixed(1)}</span>
              </div>
              
              {movieDetails?.release_date && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{getYearFromDate(movieDetails.release_date)}</span>
                </div>
              )}
              
              {movieDetails?.runtime && (
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{formatRuntime(movieDetails.runtime)}</span>
                </div>
              )}

              {movieDetails?.genres && (
                <div className="flex flex-wrap gap-2">
                  {movieDetails.genres.slice(0, 3).map((genre: any) => (
                    <span 
                      key={genre.id}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Descripción */}
            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl">
              {truncateText(currentMovie.overview, 200)}
            </p>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                to={`/movie/${currentMovie.id}`}
                className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
              >
                <Info size={20} />
                Más información
              </Link>
              
              {backgroundTrailer && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  <Play size={20} className="fill-current" />
                  Ver tráiler
                </button>
              )}
            </div>

            {/* Indicadores de carrusel */}
            <div className="flex gap-2">
              {movies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controles del trailer */}
      {backgroundTrailer && (
        <div className="absolute top-20 right-6 z-30 flex gap-3">
          <button
            onClick={() => setIsTrailerPlaying(!isTrailerPlaying)}
            className="p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
            title={isTrailerPlaying ? 'Mostrar imagen' : 'Mostrar trailer'}
          >
            {isTrailerPlaying ? '🎬' : '🖼️'}
          </button>
          
          {/* Control de sonido solo cuando el trailer está reproduciéndose */}
          {isTrailerPlaying && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}
        </div>
      )}

      {/* Modal de trailer */}
      {showTrailerModal && backgroundTrailer && (
        <TrailerPlayer
          trailerKey={backgroundTrailer.key}
          title={currentMovie.title}
          autoPlay={true}
          muted={false}
          onClose={() => setShowTrailerModal(false)}
        />
      )}
    </section>
  );
};

export default OptimizedHeroSection;