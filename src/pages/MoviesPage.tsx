import React from 'react';
import MovieRow from '../components/movie/MovieRow';
import { 
  usePopularMovies, 
  useTopRatedMovies, 
  useTrendingMovies,
  useUpcomingMovies,
  useNowPlayingMovies 
} from '../hooks/useMovies';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';

const MoviesPage: React.FC = () => {
  const { data: popularMovies, isLoading: popularLoading, error: popularError } = usePopularMovies();
  const { data: topRatedMovies, isLoading: topRatedLoading, error: topRatedError } = useTopRatedMovies();
  const { data: trendingMovies, isLoading: trendingLoading, error: trendingError } = useTrendingMovies();
  const { data: upcomingMovies, isLoading: upcomingLoading, error: upcomingError } = useUpcomingMovies();
  const { data: nowPlayingMovies, isLoading: nowPlayingLoading, error: nowPlayingError } = useNowPlayingMovies();

  const isLoading = popularLoading || topRatedLoading || trendingLoading || upcomingLoading || nowPlayingLoading;
  const hasError = popularError || topRatedError || trendingError || upcomingError || nowPlayingError;

  if (isLoading && !popularMovies && !topRatedMovies && !trendingMovies) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (hasError && !popularMovies && !topRatedMovies && !trendingMovies) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <ErrorDisplay message="Error al cargar las películas" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-6 animate-fade-in">
            🎬 Películas
          </h1>
          <p className="text-gray-300 text-xl animate-fade-in" style={{animationDelay: '0.1s'}}>
            El mejor cine para disfrutar
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-yellow-500 mx-auto mt-4 rounded animate-fade-in" style={{animationDelay: '0.2s'}}></div>
        </div>
        
        <div className="space-y-12">
          {trendingMovies && (
            <div className="animate-slide-in-right" style={{animationDelay: '0.3s'}}>
              <MovieRow
                title="🔥 Trending Ahora"
                movies={trendingMovies.results}
                isLoading={trendingLoading}
                error={trendingError}
              />
            </div>
          )}

          {popularMovies && (
            <div className="animate-slide-in-right" style={{animationDelay: '0.4s'}}>
              <MovieRow
                title="🌟 Más Populares"
                movies={popularMovies.results}
                isLoading={popularLoading}
                error={popularError}
              />
            </div>
          )}

          {topRatedMovies && (
            <div className="animate-slide-in-right" style={{animationDelay: '0.5s'}}>
              <MovieRow
                title="🏆 Mejor Valoradas"
                movies={topRatedMovies.results}
                isLoading={topRatedLoading}
                error={topRatedError}
              />
            </div>
          )}

          {upcomingMovies && (
            <div className="animate-slide-in-right" style={{animationDelay: '0.6s'}}>
              <MovieRow
                title="🎬 Próximos Estrenos"
                movies={upcomingMovies.results}
                isLoading={upcomingLoading}
                error={upcomingError}
              />
            </div>
          )}

          {nowPlayingMovies && (
            <div className="animate-slide-in-right" style={{animationDelay: '0.7s'}}>
              <MovieRow
                title="🎭 En Cines Ahora"
                movies={nowPlayingMovies.results}
                isLoading={nowPlayingLoading}
                error={nowPlayingError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;