import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/movie/MovieCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { useSearchMovies } from '../hooks/useMovies';
import { debounce } from '../utils/helpers';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const currentQuery = searchParams.get('q') || '';
  
  const { data, isLoading, error } = useSearchMovies({ 
    query: currentQuery, 
    page: 1 
  });

  const debouncedSearch = debounce((searchQuery: string) => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white mb-8 text-center">
            Buscar Películas
          </h1>
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Buscar películas por título..."
              className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white text-lg placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Results */}
        {isLoading && (
          <LoadingSpinner size="large" className="h-64" />
        )}

        {error && (
          <ErrorDisplay message={error.message} />
        )}

        {data && data.results.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">
                Resultados para "{currentQuery}" ({data.total_results} películas)
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {data.results.map((movie, index) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  index={index}
                  variant="compact"
                />
              ))}
            </div>
          </>
        )}

        {data && data.results.length === 0 && currentQuery && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">
              No se encontraron resultados
            </h2>
            <p className="text-gray-400">
              Intenta con diferentes palabras clave o revisa la ortografía.
            </p>
          </div>
        )}

        {!currentQuery && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">
              ¿Qué película buscas?
            </h2>
            <p className="text-gray-400">
              Escribe el título de una película para comenzar tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;