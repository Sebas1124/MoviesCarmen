import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy loaded pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const MovieDetailPage = React.lazy(() => import('./pages/MovieDetailPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const TrendingPage = React.lazy(() => import('./pages/TrendingPage'));
const TopRatedPage = React.lazy(() => import('./pages/TopRatedPage'));
const UpcomingPage = React.lazy(() => import('./pages/UpcomingPage'));
const NowPlayingPage = React.lazy(() => import('./pages/NowPlayingPage'));
const MoviesPage = React.lazy(() => import('./pages/MoviesPage'));
const TVSeriesPage = React.lazy(() => import('./pages/TVSeriesPage'));
const TVSeriesDetailPage = React.lazy(() => import('./pages/TVSeriesDetailPage'));
const TVTrendingPage = React.lazy(() => import('./pages/TVTrendingPage'));
const TVTopRatedPage = React.lazy(() => import('./pages/TVTopRatedPage'));
const TVOnTheAirPage = React.lazy(() => import('./pages/TVOnTheAirPage'));

// Query Client Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

const AppContent: React.FC = () => {
  const handleSearch = (query: string) => {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onSearch={handleSearch} />
      
      <main className="min-h-screen">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner size="large" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv" element={<TVSeriesPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/tv/:id" element={<TVSeriesDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/top-rated" element={<TopRatedPage />} />
            <Route path="/upcoming" element={<UpcomingPage />} />
            <Route path="/now-playing" element={<NowPlayingPage />} />
            <Route path="/tv/trending" element={<TVTrendingPage />} />
            <Route path="/tv/top-rated" element={<TVTopRatedPage />} />
            <Route path="/tv/on-the-air" element={<TVOnTheAirPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
