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
    <section className="relative h-[100vh] sm:h-[80vh] overflow-hidden hero-section">
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
          {/* Overlay con gradiente para legibilidad - más fuerte en móvil */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 sm:from-black/80 sm:via-black/50 sm:to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:from-black/60 sm:via-transparent sm:to-transparent z-10" />
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
            {/* Overlay para backdrop - más fuerte en móvil */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 sm:from-black/80 sm:via-black/40 sm:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:from-black/60 sm:via-transparent sm:to-transparent" />
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative z-20 h-full flex items-center landscape-compact landscape-hero-content">
        <div className="container mx-auto px-4 sm:px-6 mobile-safe-area">
          <div className={`max-w-3xl transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            {/* Título con animación - responsive y landscape */}
            <h1 className="mobile-title-responsive landscape-title sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-3 sm:mb-4 leading-tight animate-fade-in">
              {currentMovie.title}
            </h1>
            
            {/* Información de la película - responsive */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 text-white/90 text-sm sm:text-base landscape-content-spacing">
              <div className="flex items-center gap-1 sm:gap-2">
                <Star size={14} className="sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" />
                <span className="font-semibold">{currentMovie.vote_average.toFixed(1)}</span>
              </div>
              
              {movieDetails?.release_date && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Calendar size={14} className="sm:w-4 sm:h-4" />
                  <span>{getYearFromDate(movieDetails.release_date)}</span>
                </div>
              )}
              
              {movieDetails?.runtime && (
                <div className="hidden sm:flex items-center gap-2">
                  <Clock size={16} />
                  <span>{formatRuntime(movieDetails.runtime)}</span>
                </div>
              )}

              {movieDetails?.genres && (
                <div className="hidden md:flex flex-wrap gap-2">
                  {movieDetails.genres.slice(0, 2).map((genre: any) => (
                    <span 
                      key={genre.id}
                      className="px-2 sm:px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm backdrop-blur-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Descripción - responsive y landscape */}
            <p className="mobile-text-responsive landscape-description sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl landscape-content-spacing">
              {truncateText(currentMovie.overview, 150)}
            </p>

            {/* Botones de acción - responsive y landscape */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 landscape-compact landscape-content-spacing">
              <Link
                to={`/movie/${currentMovie.id}`}
                className="mobile-button landscape-button flex items-center justify-center gap-2 sm:gap-3 bg-white text-black px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base lg:text-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
              >
                <Info size={16} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Más información</span>
              </Link>
              
              {backgroundTrailer && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="mobile-button landscape-button flex items-center justify-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base lg:text-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  <Play size={16} className="sm:w-5 sm:h-5 fill-current" />
                  <span className="whitespace-nowrap">Ver tráiler</span>
                </button>
              )}
            </div>

            {/* Indicadores de carrusel - responsive y landscape */}
            <div className="flex gap-2 justify-center sm:justify-start landscape-indicators">
              {movies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 landscape-indicators ${
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

      {/* Controles del trailer - responsive */}
      {backgroundTrailer && (
        <div className="absolute top-16 sm:top-20 right-4 sm:right-6 z-30 flex gap-2 sm:gap-3">
          <button
            onClick={() => setIsTrailerPlaying(!isTrailerPlaying)}
            className="p-2 sm:p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
            title={isTrailerPlaying ? 'Mostrar imagen' : 'Mostrar trailer'}
          >
            <span className="text-sm sm:text-base">{isTrailerPlaying ? '🎬' : '🖼️'}</span>
          </button>
          
          {/* Control de sonido solo cuando el trailer está reproduciéndose */}
          {isTrailerPlaying && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 sm:p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX size={14} className="sm:w-[18px] sm:h-[18px]" /> : <Volume2 size={14} className="sm:w-[18px] sm:h-[18px]" />}
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