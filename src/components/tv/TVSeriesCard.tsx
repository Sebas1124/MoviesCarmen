import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Info, Calendar, Tv } from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';
import { getYearFromDate } from '../../utils/helpers';
import type { TVSeries } from '../../types/movie.types';

interface TVSeriesCardProps {
  series: TVSeries;
  index?: number;
  variant?: 'default' | 'hero' | 'compact';
  onPlayTrailer?: (seriesId: number) => void;
}

const TVSeriesCard: React.FC<TVSeriesCardProps> = ({ 
  series, 
  variant = 'default',
  onPlayTrailer 
}) => {

  if (variant === 'compact') {
    return (
      <Link to={`/tv/${series.id}`}>
        <div className="group relative overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200">
          <OptimizedImage
            src={series.poster_path}
            alt={series.name}
            type="poster"
            size="medium"
            className="w-full aspect-[2/3]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-sm font-bold mb-1 line-clamp-2">{series.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">
                  {series.first_air_date ? getYearFromDate(series.first_air_date) : 'N/A'}
                </span>
                <div className="flex items-center text-yellow-400">
                  <Star size={12} className="mr-1 fill-current" />
                  <span className="text-xs">{series.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl bg-gray-900 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-fade-in">
      <div className="relative aspect-[2/3] overflow-hidden">
        <OptimizedImage
          src={series.poster_path}
          alt={series.name}
          type="poster"
          size="large"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Controles de hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-3">
            {onPlayTrailer && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPlayTrailer(series.id);
                }}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                aria-label="Ver trailer"
              >
                <Play size={20} className="ml-1" />
              </button>
            )}
            
            <Link
              to={`/tv/${series.id}`}
              className="bg-gray-800/90 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
              aria-label="Ver detalles"
            >
              <Info size={20} />
            </Link>
          </div>
        </div>

        {/* Badge de serie */}
        <div className="absolute top-3 left-3">
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Tv size={12} />
            SERIE
          </span>
        </div>
        
        {/* Rating */}
        <div className="absolute top-3 right-3">
          <div className="bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-current" />
            {series.vote_average.toFixed(1)}
          </div>
        </div>
      </div>
      
      {/* Información de la serie */}
      <div className="p-4">
        <Link to={`/tv/${series.id}`}>
          <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-200">
            {series.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{series.first_air_date ? getYearFromDate(series.first_air_date) : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-purple-400">{series.number_of_seasons} temporadas</span>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
          {series.overview || 'No hay descripción disponible.'}
        </p>
        
        {/* Géneros */}
        <div className="flex flex-wrap gap-1 mb-4">
          {series.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre.id}
              className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full"
            >
              {genre.name}
            </span>
          ))}
        </div>
        
        {/* Botón Ver Detalles */}
        <Link
          to={`/tv/${series.id}`}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Info size={16} />
          Ver Serie
        </Link>
      </div>
    </div>
  );
};

export default TVSeriesCard;