import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Info } from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';
import { getYearFromDate } from '../../utils/helpers';
import type { Movie } from '../../types/movie.types';

interface MovieCardProps {
  movie: Movie;
  index?: number;
  variant?: 'default' | 'hero' | 'compact';
  onPlayTrailer?: (movieId: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  variant = 'default',
  onPlayTrailer 
}) => {

  if (variant === 'compact') {
    return (
      <Link to={`/movie/${movie.id}`}>
        <div className="group relative overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200">
          <OptimizedImage
            src={movie.poster_path}
            alt={movie.title}
            type="poster"
            size="medium"
            className="w-full aspect-[2/3]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-sm font-bold mb-1 line-clamp-2">{movie.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">
                  {movie.release_date ? getYearFromDate(movie.release_date) : 'N/A'}
                </span>
                <div className="flex items-center text-yellow-400">
                  <Star size={12} className="mr-1 fill-current" />
                  <span className="text-xs">{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 hover:-translate-y-2 hover:shadow-2xl">
      <OptimizedImage
        src={movie.poster_path}
        alt={movie.title}
        type="poster"
        size="large"
        className="w-full aspect-[2/3] transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="absolute inset-0 p-4 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
          <h3 className="text-white text-lg font-bold mb-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
            <span className="text-gray-300 text-sm">
              {movie.release_date ? getYearFromDate(movie.release_date) : 'N/A'}
            </span>
            <div className="flex items-center text-yellow-400">
              <Star size={16} className="mr-1 fill-current" />
              <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-250">
            <Link 
              to={`/movie/${movie.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              <Info size={16} />
              <span className="text-sm">Info</span>
            </Link>
            
            {onPlayTrailer && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onPlayTrailer(movie.id);
                }}
                className="flex items-center justify-center bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
              >
                <Play size={16} className="fill-current" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;