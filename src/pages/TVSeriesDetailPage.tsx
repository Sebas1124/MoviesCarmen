import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Calendar, Tv, Play, Info, Users, Award } from 'lucide-react';
import { useTVSeriesDetail, useSeasonDetail } from '../hooks/useMovies';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import OptimizedImage from '../components/ui/OptimizedImage';

import OptimizedModal from '../components/ui/OptimizedModal';
import { getYearFromDate } from '../utils/helpers';

const TVSeriesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const seriesId = id ? parseInt(id, 10) : 0;
  
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<string>('');

  const { data: series, isLoading, error } = useTVSeriesDetail(seriesId);
  const { data: seasonDetail, isLoading: seasonLoading } = useSeasonDetail(seriesId, selectedSeason);

  const handlePlayTrailer = () => {
    const trailers = series?.videos?.results?.filter(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    ) || [];
    
    if (trailers.length > 0) {
      setSelectedTrailer(trailers[0].key);
      setShowTrailerModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <ErrorDisplay message="Error al cargar la serie" />
      </div>
    );
  }

  const trailers = series.videos?.results?.filter(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  ) || [];

  return (
    <div className="min-h-screen bg-black">
      {/* Backdrop Hero Section */}
      <div className="relative h-screen">
        <OptimizedImage
          src={series.backdrop_path}
          alt={series.name}
          type="backdrop"
          size="large"
          className="w-full h-full object-cover object-center"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="text-6xl font-black text-white mb-4 animate-fade-in">
                {series.name}
              </h1>
              
              <div className="flex items-center gap-6 mb-6 text-lg animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star size={24} className="fill-current" />
                  <span className="font-bold">{series.vote_average.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar size={20} />
                  <span>{series.first_air_date ? getYearFromDate(series.first_air_date) : 'N/A'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-purple-400">
                  <Tv size={20} />
                  <span>{series.number_of_seasons} temporadas</span>
                </div>
                
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  SERIE
                </span>
              </div>
              
              <p className="text-gray-200 text-xl mb-8 max-w-3xl leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
                {series.overview}
              </p>
              
              <div className="flex gap-4 animate-fade-in" style={{animationDelay: '0.3s'}}>
                {trailers.length > 0 && (
                  <button
                    onClick={handlePlayTrailer}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors duration-200 transform hover:scale-105"
                  >
                    <Play size={20} />
                    Ver Trailer
                  </button>
                )}
                
                <button className="bg-gray-800/80 hover:bg-gray-700/80 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors duration-200">
                  <Info size={20} />
                  Más Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Series Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Cast */}
            {series.credits?.cast && series.credits.cast.length > 0 && (
              <section className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Users size={24} />
                  Reparto Principal
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {series.credits.cast.slice(0, 8).map((actor, index) => (
                    <div key={actor.id} className="text-center animate-fade-in hover:scale-105 transition-transform duration-200" 
                         style={{animationDelay: `${0.5 + index * 0.1}s`}}>
                      <OptimizedImage
                        src={actor.profile_path}
                        alt={actor.name}
                        type="profile"
                        size="medium"
                        className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                      />
                      <h3 className="text-white font-semibold text-sm mb-1">{actor.name}</h3>
                      <p className="text-gray-400 text-xs">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Seasons */}
            <section className="animate-fade-in" style={{animationDelay: '0.6s'}}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Tv size={24} />
                Temporadas
              </h2>
              
              {/* Season Selector */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {series.seasons?.map((season) => (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeason(season.season_number)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors duration-200 ${
                      selectedSeason === season.season_number
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {season.name}
                  </button>
                ))}
              </div>

              {/* Episodes */}
              {seasonLoading ? (
                <LoadingSpinner />
              ) : seasonDetail?.episodes ? (
                <div className="space-y-4">
                  {seasonDetail.episodes.map((episode) => (
                    <div key={episode.id} className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors duration-200">
                      <div className="flex gap-4">
                        <OptimizedImage
                          src={episode.still_path}
                          alt={episode.name}
                          type="backdrop"
                          size="small"
                          className="w-32 h-18 rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-bold mb-1">
                            {episode.episode_number}. {episode.name}
                          </h3>
                          <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                            {episode.overview || 'Sin descripción disponible.'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{episode.air_date}</span>
                            {episode.runtime && <span>{episode.runtime} min</span>}
                            {episode.vote_average > 0 && (
                              <div className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-400 fill-current" />
                                <span>{episode.vote_average.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No hay episodios disponibles para esta temporada.</p>
              )}
            </section>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Series Details */}
            <div className="bg-gray-900 rounded-lg p-6 animate-fade-in" style={{animationDelay: '0.7s'}}>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award size={20} />
                Información
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Estado:</span>
                  <span className="text-white ml-2">{series.status}</span>
                </div>
                <div>
                  <span className="text-gray-400">Primera emisión:</span>
                  <span className="text-white ml-2">
                    {series.first_air_date ? getYearFromDate(series.first_air_date) : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Episodios:</span>
                  <span className="text-white ml-2">{series.number_of_episodes}</span>
                </div>
                <div>
                  <span className="text-gray-400">Duración promedio:</span>
                  <span className="text-white ml-2">
                    {series.episode_run_time?.[0] ? `${series.episode_run_time[0]} min` : 'N/A'}
                  </span>
                </div>
                {series.created_by && series.created_by.length > 0 && (
                  <div>
                    <span className="text-gray-400">Creada por:</span>
                    <span className="text-white ml-2">
                      {series.created_by.map(creator => creator.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {series.genres && series.genres.length > 0 && (
              <div className="animate-fade-in" style={{animationDelay: '0.8s'}}>
                <h3 className="text-lg font-bold text-white mb-3">Géneros</h3>
                <div className="flex flex-wrap gap-2">
                  {series.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Streaming Providers */}
            <div className="animate-fade-in" style={{animationDelay: '0.9s'}}>
              <h3 className="text-lg font-bold text-white mb-3">Dónde Ver</h3>
              <p className="text-gray-400 text-sm">Información de streaming próximamente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && selectedTrailer && (
        <OptimizedModal
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          size="xl"
        >
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${selectedTrailer}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
              title="Trailer"
              className="w-full h-full rounded-lg"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        </OptimizedModal>
      )}
    </div>
  );
};

export default TVSeriesDetailPage;