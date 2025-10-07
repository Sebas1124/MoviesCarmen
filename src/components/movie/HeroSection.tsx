import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';
import { truncateText } from '../../utils/helpers';
import type { Movie } from '../../types/movie.types';

interface HeroSectionProps {
  movies: Movie[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movies || movies.length === 0) {
    return (
      <div className="relative h-screen bg-gradient-to-r from-black to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">No hay películas disponibles</h2>
          <p className="text-gray-400">Inténtalo de nuevo más tarde</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={currentMovie.backdrop_path}
          alt={currentMovie.title}
          type="backdrop"
          size="large"
          className="w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
              {currentMovie.title}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              {truncateText(currentMovie.overview || 'No hay descripción disponible.', 200)}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link 
                to={`/movie/${currentMovie.id}`}
                className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
              >
                <Play size={24} className="fill-current" />
                Reproducir
              </Link>
              
              <Link
                to={`/movie/${currentMovie.id}`}
                className="flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/30 transition-all duration-200 border border-white/30"
              >
                <Info size={24} />
                Más información
              </Link>
            </div>

            {/* Movie indicators */}
            <div className="flex gap-2">
              {movies.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1 transition-all duration-300 ${
                    currentIndex === index 
                      ? 'w-8 bg-white' 
                      : 'w-6 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default HeroSection;