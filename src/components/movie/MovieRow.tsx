import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorDisplay from '../ui/ErrorDisplay';
import type { Movie } from '../../types/movie.types';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  error?: Error | null;
  onPlayTrailer?: (movieId: number) => void;
}

const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  isLoading = false,
  error = null,
  onPlayTrailer
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        {title && (
          <h2 className="text-2xl font-bold text-white mb-6 px-4">
            {title}
          </h2>
        )}
        <LoadingSpinner size="large" className="h-64" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        {title && (
          <h2 className="text-2xl font-bold text-white mb-6 px-4">
            {title}
          </h2>
        )}
        <ErrorDisplay message={error.message} />
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <section className="mb-12">
        {title && (
          <h2 className="text-2xl font-bold text-white mb-6 px-4">
            {title}
          </h2>
        )}
        <div className="text-center text-gray-400 py-8">
          No hay películas disponibles
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 sm:mb-12 group">
      {title && (
        <h2 className="text-lg landscape-title sm:text-2xl font-bold text-white mb-4 sm:mb-6 px-4">
          {title}
        </h2>
      )}
      
      <div className="relative">
        <div 
          ref={containerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            <div key={movie.id} className="flex-shrink-0 w-36 sm:w-48">
              <MovieCard 
                movie={movie} 
                index={index}
                variant="compact"
                onPlayTrailer={onPlayTrailer}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default MovieRow;