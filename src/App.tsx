import React, { useState, useEffect, Suspense } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Star, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

// --- CONFIGURACIÓN DE LA API DE TMDB ---
// ¡IMPORTANTE! Reemplaza esto con tu propia API Key de TMDB.
// Puedes obtener una gratis en https://www.themoviedb.org/signup
const API_KEY = 'd846908a88c78972da6c46ced7731e4a'; 
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// --- TIPOS DE DATOS (TypeScript) ---
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface MovieDetailData extends Movie {
  credits: {
    cast: CastMember[];
  };
  videos: {
    results: Video[];
  };
}

// --- CLIENTE DE REACT QUERY ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de caché
      retry: 1,
    },
  },
});

// --- HOOKS PERSONALIZADOS PARA FETCHING DE DATOS ---
const fetchFromTMDB = async <T,>(endpoint: string): Promise<T> => {
  const url = `${API_BASE_URL}/${endpoint}?api_key=${API_KEY}&language=es-ES`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al contactar con TMDB: ${response.statusText}`);
  }
  return response.json();
};

const useMovies = (endpoint: string) => {
  return useQuery<{ results: Movie[] }>({
    queryKey: ['movies', endpoint],
    queryFn: () => fetchFromTMDB<{ results: Movie[] }>(endpoint),
  });
};

const useMovieDetail = (movieId: number) => {
  return useQuery<MovieDetailData>({
    queryKey: ['movieDetail', movieId],
    queryFn: () => fetchFromTMDB<MovieDetailData>(`movie/${movieId}&append_to_response=credits,videos`),
    enabled: !!movieId,
  });
};

// --- COMPONENTES DE LA UI ---

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center p-8 bg-red-900/50 text-red-300 rounded-lg">
    <h3 className="text-xl font-bold">¡Ups! Algo salió mal</h3>
    <p>{message}</p>
  </div>
);

const MovieCard: React.FC<{ movie: Movie; onSelectMovie: (id: number) => void }> = ({ movie, onSelectMovie }) => (
  <div 
    className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/30"
    onClick={() => onSelectMovie(movie.id)}
  >
    <img
      src={`${IMAGE_BASE_URL}w500${movie.poster_path}`}
      alt={movie.title}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:blur-sm"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
    <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h3 className="text-white text-lg font-bold">{movie.title}</h3>
      <div className="flex items-center text-sm text-yellow-400 mt-1">
        <Star size={16} className="mr-1 fill-current" />
        <span>{movie.vote_average.toFixed(1)} / 10</span>
      </div>
    </div>
  </div>
);

const MovieList: React.FC<{ title: string; endpoint: string; onSelectMovie: (id: number) => void }> = ({ title, endpoint, onSelectMovie }) => {
  const { data, isLoading, error } = useMovies(endpoint);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error.message} />;

  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-cyan-400 pl-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {data?.results.map(movie => (
          <MovieCard key={movie.id} movie={movie} onSelectMovie={onSelectMovie} />
        ))}
      </div>
    </section>
  );
};

const HeroCarousel: React.FC<{ movies: Movie[]; onSelectMovie: (id: number) => void }> = ({ movies, onSelectMovie }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? movies.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === movies.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  useEffect(() => {
    const timer = setTimeout(goToNext, 7000);
    return () => clearTimeout(timer);
  }, [currentIndex]);


  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full h-[80vh] text-white shadow-2xl">
      <div className="w-full h-full">
        <img
          src={`${IMAGE_BASE_URL}original${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          className="w-full h-full object-cover transition-opacity duration-1000"
          key={currentMovie.id}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
      </div>
      <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">{currentMovie.title}</h1>
        <p className="text-gray-300 mb-6 line-clamp-3 md:text-lg drop-shadow-md">{currentMovie.overview}</p>
        <button 
            onClick={() => onSelectMovie(currentMovie.id)}
            className="bg-cyan-500 text-gray-900 font-bold py-3 px-8 rounded-full text-lg transition-transform duration-300 hover:scale-110 hover:bg-cyan-400 shadow-lg shadow-cyan-500/30"
        >
          Ver Detalles
        </button>
      </div>
      <button onClick={goToPrevious} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-cyan-500/50 transition-colors">
        <ChevronLeft size={32} />
      </button>
      <button onClick={goToNext} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-cyan-500/50 transition-colors">
        <ChevronRight size={32} />
      </button>
       <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${currentIndex === index ? 'bg-cyan-400 w-8' : 'bg-gray-500'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};


const TrailerModal: React.FC<{ trailerKey: string; onClose: () => void }> = ({ trailerKey, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-gray-900 rounded-lg shadow-2xl">
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-cyan-500 text-gray-900 rounded-full p-2 z-10">
          <X size={24} />
        </button>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&language=es`}
            title="Tráiler de la película"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};


const MovieDetail: React.FC<{ movieId: number; onBack: () => void }> = ({ movieId, onBack }) => {
  const { data: movie, isLoading, error } = useMovieDetail(movieId);
  const [showTrailer, setShowTrailer] = useState(false);

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><LoadingSpinner /></div>;
  if (error) return <div className="min-h-screen flex justify-center items-center"><ErrorDisplay message={error.message} /></div>;
  if (!movie) return null;
  
  // Busca el tráiler oficial en español de España
  const trailer = movie.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube' && video.iso_639_1 === 'es' && video.iso_3166_1 === 'ES'
  ) || movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube'); // Fallback a cualquier trailer

  return (
    <>
      <div className="min-h-screen text-white animate-fade-in">
        <div className="relative h-[60vh] md:h-[70vh]">
            <img 
                src={`${IMAGE_BASE_URL}original${movie.backdrop_path}`}
                alt={`Póster de ${movie.title}`}
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
             <button onClick={onBack} className="absolute top-6 left-6 bg-black/50 p-2 rounded-full hover:bg-cyan-500/50 transition-colors z-10">
                <ChevronLeft size={32} />
             </button>
        </div>
        
        <div className="relative container mx-auto px-4 pb-16 -mt-48 md:-mt-64 z-10">
            <div className="md:flex gap-8">
                <div className="md:w-1/3 flex-shrink-0">
                    <img 
                        src={`${IMAGE_BASE_URL}w500${movie.poster_path}`}
                        alt={movie.title}
                        className="rounded-xl shadow-2xl w-full"
                    />
                </div>
                <div className="md:w-2/3 mt-8 md:mt-0 text-left">
                    <h1 className="text-4xl md:text-6xl font-black mb-2">{movie.title}</h1>
                    <div className="flex items-center gap-4 mb-4 text-gray-400">
                        {movie.release_date && <span>{movie.release_date.split('-')[0]}</span>}
                        <div className="flex items-center text-yellow-400">
                            <Star size={20} className="mr-1 fill-current" />
                            <span className="text-xl font-bold">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                        </div>
                    </div>
                    {movie.genres && movie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                          {movie.genres.map(genre => (
                              <span key={genre.id} className="bg-gray-800 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">{genre.name}</span>
                          ))}
                      </div>
                    )}
                    <h2 className="text-2xl font-bold mb-2 text-cyan-400">Sinopsis</h2>
                    <p className="text-gray-300 leading-relaxed mb-8">{movie.overview || 'Sinopsis no disponible.'}</p>

                    {trailer && (
                      <button 
                        onClick={() => setShowTrailer(true)}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full text-lg transition-transform duration-300 hover:scale-105 hover:bg-white/20 shadow-lg"
                      >
                        <Play size={24} className="fill-current" />
                        Ver Tráiler
                      </button>
                    )}
                </div>
            </div>

            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mt-16">
                  <h2 className="text-3xl font-bold mb-6 border-l-4 border-cyan-400 pl-4">Reparto Principal</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {movie.credits.cast.slice(0, 12).map(actor => (
                          <div key={actor.id} className="text-center">
                              <img 
                                  src={actor.profile_path ? `${IMAGE_BASE_URL}w185${actor.profile_path}` : 'https://placehold.co/185x278/1f2937/9ca3af?text=N/A'}
                                  alt={actor.name}
                                  className="rounded-lg shadow-md mb-2 w-full object-cover aspect-[2/3]"
                                  loading="lazy"
                              />
                              <p className="font-bold text-white">{actor.name}</p>
                              <p className="text-sm text-gray-400">{actor.character}</p>
                          </div>
                      ))}
                  </div>
              </div>
            )}
        </div>
      </div>
      {showTrailer && trailer && <TrailerModal trailerKey={trailer.key} onClose={() => setShowTrailer(false)} />}
    </>
  );
};


// --- COMPONENTE PRINCIPAL DE LA APP ---
const App: React.FC = () => {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const { data, isLoading, error } = useMovies('movie/popular');

  const handleSelectMovie = (id: number) => {
    setSelectedMovieId(id);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="bg-gray-900/80 backdrop-blur-md p-4 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black text-white">
            <span className="text-cyan-400">Movie</span>Verse
          </h1>
          {/* Aquí podría ir un campo de búsqueda en el futuro */}
        </div>
      </header>
      
      <main>
        {selectedMovieId ? (
          <Suspense fallback={<LoadingSpinner />}>
            <MovieDetail movieId={selectedMovieId} onBack={handleBack} />
          </Suspense>
        ) : (
          <>
            {isLoading && <div className="h-[80vh] flex justify-center items-center"><LoadingSpinner /></div>}
            {error && <div className="h-[80vh] flex justify-center items-center"><ErrorDisplay message={error.message} /></div>}
            {data && <HeroCarousel movies={data.results.slice(0, 10)} onSelectMovie={handleSelectMovie} />}
            <div className="container mx-auto px-4">
                <MovieList title="Tendencias" endpoint="trending/movie/week" onSelectMovie={handleSelectMovie} />
                <MovieList title="Mejor Valoradas" endpoint="movie/top_rated" onSelectMovie={handleSelectMovie} />
                <MovieList title="Próximos Estrenos" endpoint="movie/upcoming" onSelectMovie={handleSelectMovie} />
            </div>
          </>
        )}
      </main>

      <footer className="bg-gray-900 text-center py-6 border-t border-gray-800 mt-12">
        <p className="text-gray-500">Datos proporcionados por <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">TMDB</a></p>
      </footer>
    </div>
  );
};

// --- PUNTO DE ENTRADA DE LA APP ---
// --- PUNTO DE ENTRADA DE LA APP ---
const RootApp = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default RootApp;
