import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OptimizedHeroSection from '../components/movie/OptimizedHeroSection';
import MovieRow from '../components/movie/MovieRow';
import TVSeriesRow from '../components/tv/TVSeriesRow';
import { 
  usePopularMovies, 
  useTrendingMovies, 
  useTopRatedMovies, 
  useUpcomingMovies,
  usePopularTVSeries,
  useTrendingTVSeries 
} from '../hooks/useMovies';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [_, setLoadSecondaryData] = useState(false);
  
  // Load primary data first (Popular movies for hero)
  const { data: popularMovies, isLoading: popularLoading, error: popularError } = usePopularMovies();
  
  // Load secondary data progressively
  const { data: trendingMovies, isLoading: trendingLoading, error: trendingError } = useTrendingMovies(1);
  const { data: topRatedMovies, isLoading: topRatedLoading, error: topRatedError } = useTopRatedMovies(1);
  const { data: upcomingMovies, isLoading: upcomingLoading, error: upcomingError } = useUpcomingMovies(1);
  
  // TV Series data
  const { data: popularSeries, isLoading: popularSeriesLoading, error: popularSeriesError } = usePopularTVSeries(1);
  const { data: trendingSeries, isLoading: trendingSeriesLoading, error: trendingSeriesError } = useTrendingTVSeries(1);

  useEffect(() => {
    // Load secondary data after hero is ready
    const timer = setTimeout(() => {
      setLoadSecondaryData(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handlePlayTrailer = (movieId: number) => {
    navigate(`/movie/${movieId}?autoplay=trailer`);
  };

  const handlePlaySeriesTrailer = (seriesId: number) => {
    navigate(`/tv/${seriesId}?autoplay=trailer`);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      {popularMovies && popularMovies.results.length > 0 && (
        <OptimizedHeroSection 
          movies={popularMovies.results.slice(0, 8)} 
        />
      )}

      {/* Movie Rows */}
      <div className="relative z-10 -mt-32 pb-20">
        <div className="container mx-auto">
          <MovieRow
            title="Tendencias de la Semana"
            movies={trendingMovies?.results || []}
            isLoading={trendingLoading}
            error={trendingError}
            onPlayTrailer={handlePlayTrailer}
          />

          <MovieRow
            title="Populares"
            movies={popularMovies?.results || []}
            isLoading={popularLoading}
            error={popularError}
            onPlayTrailer={handlePlayTrailer}
          />

          <MovieRow
            title="Mejor Valoradas"
            movies={topRatedMovies?.results || []}
            isLoading={topRatedLoading}
            error={topRatedError}
            onPlayTrailer={handlePlayTrailer}
          />

          <MovieRow
            title="Próximos Estrenos"
            movies={upcomingMovies?.results || []}
            isLoading={upcomingLoading}
            error={upcomingError}
            onPlayTrailer={handlePlayTrailer}
          />

          {/* TV Series Sections */}
          <TVSeriesRow
            title="📺 Series Trending"
            series={trendingSeries?.results || []}
            isLoading={trendingSeriesLoading}
            error={trendingSeriesError}
            onPlayTrailer={handlePlaySeriesTrailer}
          />

          <TVSeriesRow
            title="🌟 Series Populares"
            series={popularSeries?.results || []}
            isLoading={popularSeriesLoading}
            error={popularSeriesError}
            onPlayTrailer={handlePlaySeriesTrailer}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;