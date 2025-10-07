import React from 'react';
import MovieRow from '../components/movie/MovieRow';
import { useTopRatedMovies } from '../hooks/useMovies';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';

const TopRatedPage: React.FC = () => {
  const { data, isLoading, error } = useTopRatedMovies();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <ErrorDisplay message={error.message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-6 animate-fade-in">
            🏆 Mejor Valoradas
          </h1>
          <p className="text-gray-300 text-xl animate-fade-in" style={{animationDelay: '0.1s'}}>
            Las películas con las puntuaciones más altas de todos los tiempos
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-yellow-500 mx-auto mt-4 rounded animate-fade-in" style={{animationDelay: '0.2s'}}></div>
        </div>
        
        <div className="space-y-12">
          <div className="animate-slide-in-right" style={{animationDelay: '0.3s'}}>
            <MovieRow
              title="🎯 Top Películas de Todos los Tiempos"
              movies={data?.results?.slice(0, 10) || []}
            />
          </div>
          
          <div className="animate-slide-in-right" style={{animationDelay: '0.4s'}}>
            <MovieRow
              title="🌟 Clásicos Inmortales"
              movies={data?.results?.slice(10, 20) || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopRatedPage;