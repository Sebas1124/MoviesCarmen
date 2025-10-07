import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Play, ArrowLeft, Star, Clock, DollarSign, Users, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useMovieDetail } from '../hooks/useMovies';
import OptimizedImage from '../components/ui/OptimizedImage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';

import StreamingProviders from '../components/ui/StreamingProviders';
import OptimizedModal from '../components/ui/OptimizedModal';

import { tmdbService } from '../services/tmdb.service';
import { formatCurrency, formatRuntime, formatDate } from '../utils/helpers';
import type { Video, CastMember, CrewMember } from '../types/movie.types';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedTrailer, setSelectedTrailer] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState<'cast' | 'crew' | 'trailers'>('cast');
  
  const movieId = Number(id);
  const { data: movie, isLoading, error } = useMovieDetail(movieId);

  // Obtener proveedores de streaming
  const { data: streamingProviders } = useQuery({
    queryKey: ['streamingProviders', movieId],
    queryFn: () => tmdbService.getStreamingProviders(movieId),
    enabled: !!movieId,
    staleTime: 30 * 60 * 1000, // 30 minutos
  });

  useEffect(() => {
    const autoplay = searchParams.get('autoplay');
    if (autoplay === 'trailer' && movie?.videos?.results) {
      const trailer = getSpanishTrailer(movie.videos.results);
      if (trailer) {
        setSelectedTrailer(trailer);
      }
    }
  }, [movie, searchParams]);

  const getSpanishTrailer = (videos: Video[]): Video | null => {
    // Prioridad: Trailer oficial en español de España
    const spanishTrailer = videos.find(
      video => video.type === 'Trailer' && 
                video.site === 'YouTube' && 
                video.iso_639_1 === 'es' && 
                video.iso_3166_1 === 'ES'
    );
    
    if (spanishTrailer) return spanishTrailer;
    
    // Fallback: Cualquier trailer en español
    const anySpanishTrailer = videos.find(
      video => video.type === 'Trailer' && 
                video.site === 'YouTube' && 
                video.iso_639_1 === 'es'
    );
    
    if (anySpanishTrailer) return anySpanishTrailer;
    
    // Último fallback: Cualquier trailer
    return videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || null;
  };

  const getSpanishTrailers = (videos: Video[]): Video[] => {
    return videos.filter(
      video => video.site === 'YouTube' && 
                video.iso_639_1 === 'es' &&
                (video.type === 'Trailer' || video.type === 'Teaser')
    ).sort((a, b) => {
      // Priorizar trailers oficiales
      if (a.official && !b.official) return -1;
      if (!a.official && b.official) return 1;
      // Priorizar por tipo (Trailer > Teaser)
      if (a.type === 'Trailer' && b.type === 'Teaser') return -1;
      if (a.type === 'Teaser' && b.type === 'Trailer') return 1;
      return 0;
    });
  };

  const getMainCrew = (crew: CrewMember[]) => {
    const roles = ['Director', 'Producer', 'Screenplay', 'Writer', 'Executive Producer'];
    return crew.filter(member => roles.includes(member.job));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ErrorDisplay 
          message={error?.message || 'No se pudo cargar la información de la película'} 
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const spanishTrailers = movie.videos ? getSpanishTrailers(movie.videos.results) : [];
  const mainTrailer = movie.videos ? getSpanishTrailer(movie.videos.results) : null;
  const mainCrew = movie.credits ? getMainCrew(movie.credits.crew) : [];

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src={movie.backdrop_path}
            alt={movie.title}
            type="backdrop"
            size="large"
            className="w-full h-full object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-8 z-20 bg-black/50 hover:bg-black/70 p-3 rounded-full transition-all duration-200"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Poster con animación */}
              <div className="lg:col-span-1 animate-fade-in">
                <OptimizedImage
                  src={movie.poster_path}
                  alt={movie.title}
                  type="poster"
                  size="large"
                  className="w-full max-w-md mx-auto rounded-xl shadow-2xl transform transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Info con animación */}
              <div className="lg:col-span-2 animate-slide-in-right">
                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight transform transition-all duration-500 hover:text-red-400">
                  {movie.title}
                </h1>
                
                {movie.tagline && (
                  <p className="text-xl text-gray-300 mb-6 italic opacity-80 hover:opacity-100 transition-opacity duration-300">"{movie.tagline}"</p>
                )}

                {/* Stats con animación */}
                <div className="flex flex-wrap gap-6 mb-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-yellow-400 fill-current" />
                    <span className="text-xl font-bold">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                    <span className="text-gray-400">({movie.vote_count} votos)</span>
                  </div>
                  
                  {movie.runtime && (
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-gray-400" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                  
                  {movie.release_date && (
                    <div className="flex items-center gap-2">
                      <Calendar size={20} className="text-gray-400" />
                      <span>{formatDate(movie.release_date)}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map(genre => (
                      <span 
                        key={genre.id} 
                        className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  {movie.overview || 'No hay descripción disponible.'}
                </p>

                {/* Action Buttons con animaciones */}
                <div className="flex flex-wrap gap-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
                  {mainTrailer && (
                    <button
                      onClick={() => setSelectedTrailer(mainTrailer)}
                      className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg animate-pulse-glow"
                    >
                      <Play size={24} className="fill-current" />
                      Ver Tráiler
                    </button>
                  )}
                  
                  <button className="flex items-center gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-8 py-3 rounded-lg font-bold text-lg border border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <Users size={24} />
                    Mi Lista
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Production Info con animaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {movie.budget > 0 && (
            <div className="text-center p-6 bg-gray-900/50 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/60 animate-fade-in">
              <DollarSign size={32} className="mx-auto mb-2 text-green-400 transition-colors duration-300 hover:text-green-300" />
              <h3 className="font-bold mb-1">Presupuesto</h3>
              <p className="text-gray-300">{formatCurrency(movie.budget)}</p>
            </div>
          )}
          
          {movie.revenue > 0 && (
            <div className="text-center p-6 bg-gray-900/50 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/60 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <DollarSign size={32} className="mx-auto mb-2 text-yellow-400 transition-colors duration-300 hover:text-yellow-300" />
              <h3 className="font-bold mb-1">Recaudación</h3>
              <p className="text-gray-300">{formatCurrency(movie.revenue)}</p>
            </div>
          )}
          
          <div className="text-center p-6 bg-gray-900/50 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/60 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <Star size={32} className="mx-auto mb-2 text-blue-400 transition-colors duration-300 hover:text-blue-300" />
            <h3 className="font-bold mb-1">Estado</h3>
            <p className="text-gray-300">{movie.status}</p>
          </div>
          
          <div className="text-center p-6 bg-gray-900/50 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/60 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <Users size={32} className="mx-auto mb-2 text-purple-400 transition-colors duration-300 hover:text-purple-300" />
            <h3 className="font-bold mb-1">Popularidad</h3>
            <p className="text-gray-300">{movie.popularity.toFixed(0)}</p>
          </div>
        </div>

        {/* Streaming Providers */}
        {streamingProviders && Object.keys(streamingProviders).length > 0 && (
          <div className="mb-16">
            {streamingProviders.ES && (
              <StreamingProviders 
                providers={streamingProviders.ES}
                country="ES"
              />
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-gray-800">
            {[
              { id: 'cast', label: 'Reparto', count: movie.credits?.cast?.length || 0 },
              { id: 'crew', label: 'Equipo', count: mainCrew.length },
              { id: 'trailers', label: 'Tráilers', count: spanishTrailers.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'cast' && movie.credits?.cast && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movie.credits.cast.slice(0, 12).map((actor: CastMember, index) => (
              <div 
                key={actor.id} 
                className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <OptimizedImage
                  src={actor.profile_path}
                  alt={actor.name}
                  type="profile"
                  size="medium"
                  className="w-full aspect-[2/3] rounded-lg mb-3 group-hover:shadow-xl transition-shadow duration-300"
                />
                <h4 className="font-bold text-sm mb-1 group-hover:text-red-400 transition-colors duration-200">{actor.name}</h4>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-200">{actor.character}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'crew' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mainCrew.map((crew: CrewMember, index) => (
              <div 
                key={`${crew.id}-${crew.job}`} 
                className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <OptimizedImage
                  src={crew.profile_path}
                  alt={crew.name}
                  type="profile"
                  size="medium"
                  className="w-full aspect-[2/3] rounded-lg mb-3 group-hover:shadow-xl transition-shadow duration-300"
                />
                <h4 className="font-bold text-sm mb-1 group-hover:text-red-400 transition-colors duration-200">{crew.name}</h4>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-200">{crew.job}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trailers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spanishTrailers.map((trailer: Video, index) => (
              <div 
                key={trailer.id}
                className="relative bg-gray-900 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in group"
                style={{animationDelay: `${index * 0.15}s`}}
                onClick={() => setSelectedTrailer(trailer)}
              >
                <img
                  src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                  alt={trailer.name}
                  className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={48} className="text-white fill-current transform scale-90 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                </div>
                <div className="p-4 transform group-hover:-translate-y-1 transition-transform duration-300">
                  <h4 className="font-bold mb-1 group-hover:text-red-400 transition-colors duration-200">{trailer.name}</h4>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">{trailer.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trailer Modal Optimizado */}
      {selectedTrailer && (
        <OptimizedModal isOpen={true} onClose={() => setSelectedTrailer(null)} size="xl">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Tráiler - {movie.title}
            </h3>
            <div className="aspect-video w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedTrailer.key}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1&hl=es`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  border: 'none',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              />
            </div>
          </div>
        </OptimizedModal>
      )}
    </div>
  );
};

export default MovieDetailPage;