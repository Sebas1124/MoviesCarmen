import React, { useRef } from 'react';
import TVSeriesCard from './TVSeriesCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorDisplay from '../ui/ErrorDisplay';
import type { TVSeries } from '../../types/movie.types';

interface TVSeriesRowProps {
  title: string;
  series: TVSeries[];
  isLoading?: boolean;
  error?: Error | null;
  onPlayTrailer?: (seriesId: number) => void;
}

const TVSeriesRow: React.FC<TVSeriesRowProps> = ({
  title,
  series,
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

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          {title}
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="bg-gray-800/50 hover:bg-gray-700/50 text-white p-2 rounded-full transition-colors duration-200"
            aria-label="Desplazar a la izquierda"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="bg-gray-800/50 hover:bg-gray-700/50 text-white p-2 rounded-full transition-colors duration-200"
            aria-label="Desplazar a la derecha"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div
            ref={containerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            } as React.CSSProperties}
          >
            {series.length > 0 ? (
              series.map((tvSeries, index) => (
                <div key={tvSeries.id} className="flex-none w-72">
                  <TVSeriesCard
                    series={tvSeries}
                    index={index}
                    onPlayTrailer={onPlayTrailer}
                  />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-20">
                <p className="text-gray-400 text-lg">No hay series disponibles</p>
              </div>
            )}
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
};

export default TVSeriesRow;