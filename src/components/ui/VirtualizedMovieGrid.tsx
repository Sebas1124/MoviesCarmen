import React, { useMemo } from 'react';
import type { Movie } from '../../types/movie.types';
import MovieCard from '../movie/MovieCard';

interface VirtualizedMovieGridProps {
  movies: Movie[];
  itemsPerRow?: number;
  maxItems?: number;
  onPlayTrailer?: (movieId: number) => void;
}

const VirtualizedMovieGrid: React.FC<VirtualizedMovieGridProps> = ({
  movies,
  itemsPerRow = 6,
  maxItems = 18,
  onPlayTrailer
}) => {
  const visibleMovies = useMemo(() => {
    return movies.slice(0, maxItems);
  }, [movies, maxItems]);

  if (!visibleMovies.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        No hay películas para mostrar
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(itemsPerRow, 6)} gap-4 md:gap-6`}>
      {visibleMovies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          index={index}
          variant="compact"
          onPlayTrailer={onPlayTrailer}
        />
      ))}
    </div>
  );
};

export default React.memo(VirtualizedMovieGrid);