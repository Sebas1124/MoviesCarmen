import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { tmdbService } from '../services/tmdb.service';
import type { 
  MoviesResponse, 
  MovieDetail, 
  SearchParams, 
  TVSeriesResponse, 
  TVSeriesDetail, 
  SeasonDetail 
} from '../types/movie.types';

export const usePopularMovies = (page: number = 1): UseQueryResult<MoviesResponse> => {
  return useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => tmdbService.getPopularMovies(page),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes in cache
  });
};

export const useTopRatedMovies = (page: number = 1): UseQueryResult<MoviesResponse> => {
  return useQuery({
    queryKey: ['movies', 'topRated', page],
    queryFn: () => tmdbService.getTopRatedMovies(page),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useUpcomingMovies = (page: number = 1): UseQueryResult<MoviesResponse> => {
  return useQuery({
    queryKey: ['movies', 'upcoming', page],
    queryFn: () => tmdbService.getUpcomingMovies(page),
    staleTime: 1000 * 60 * 5,
  });
};

export const useNowPlayingMovies = (page: number = 1): UseQueryResult<MoviesResponse> => {
  return useQuery({
    queryKey: ['movies', 'nowPlaying', page],
    queryFn: () => tmdbService.getNowPlayingMovies(page),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTrendingMovies = (page: number = 1): UseQueryResult<MoviesResponse> => {
  return useQuery({
    queryKey: ['movies', 'trending', page],
    queryFn: () => tmdbService.getTrendingMovies(page),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useSearchMovies = (params: SearchParams): UseQueryResult<MoviesResponse> => {
  return useQuery({
    queryKey: ['movies', 'search', params],
    queryFn: () => tmdbService.searchMovies(params),
    enabled: !!params.query,
    staleTime: 1000 * 60 * 2, // 2 minutes for search results
  });
};

export const useMovieDetail = (movieId: number): UseQueryResult<MovieDetail> => {
  return useQuery({
    queryKey: ['movie', 'detail', movieId],
    queryFn: () => tmdbService.getMovieDetail(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 15, // 15 minutes for movie details
    gcTime: 1000 * 60 * 60, // 1 hour in cache
  });
};

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => tmdbService.getGenres(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours for genres
  });
};

// TV Series Hooks
export const usePopularTVSeries = (page: number = 1): UseQueryResult<TVSeriesResponse> => {
  return useQuery({
    queryKey: ['tv', 'popular', page],
    queryFn: () => tmdbService.getPopularTVSeries(page),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useTopRatedTVSeries = (page: number = 1): UseQueryResult<TVSeriesResponse> => {
  return useQuery({
    queryKey: ['tv', 'topRated', page],
    queryFn: () => tmdbService.getTopRatedTVSeries(page),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useOnTheAirTVSeries = (page: number = 1): UseQueryResult<TVSeriesResponse> => {
  return useQuery({
    queryKey: ['tv', 'onTheAir', page],
    queryFn: () => tmdbService.getOnTheAirTVSeries(page),
    staleTime: 1000 * 60 * 5,
  });
};

export const useAiringTodayTVSeries = (page: number = 1): UseQueryResult<TVSeriesResponse> => {
  return useQuery({
    queryKey: ['tv', 'airingToday', page],
    queryFn: () => tmdbService.getAiringTodayTVSeries(page),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTrendingTVSeries = (page: number = 1): UseQueryResult<TVSeriesResponse> => {
  return useQuery({
    queryKey: ['tv', 'trending', page],
    queryFn: () => tmdbService.getTrendingTVSeries(page),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export const useSearchTVSeries = (params: SearchParams): UseQueryResult<TVSeriesResponse> => {
  return useQuery({
    queryKey: ['tv', 'search', params],
    queryFn: () => tmdbService.searchTVSeries(params),
    enabled: !!params.query && params.query.length > 2,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTVSeriesDetail = (seriesId: number): UseQueryResult<TVSeriesDetail> => {
  return useQuery({
    queryKey: ['tv', 'detail', seriesId],
    queryFn: () => tmdbService.getTVSeriesDetail(seriesId),
    enabled: !!seriesId,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

export const useSeasonDetail = (seriesId: number, seasonNumber: number): UseQueryResult<SeasonDetail> => {
  return useQuery({
    queryKey: ['tv', 'season', seriesId, seasonNumber],
    queryFn: () => tmdbService.getSeasonDetail(seriesId, seasonNumber),
    enabled: !!seriesId && seasonNumber >= 0,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

export const useTVGenres = () => {
  return useQuery({
    queryKey: ['tv', 'genres'],
    queryFn: () => tmdbService.getTVGenres(),
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useSearchMulti = (params: SearchParams) => {
  return useQuery({
    queryKey: ['search', 'multi', params],
    queryFn: () => tmdbService.searchMulti(params),
    enabled: !!params.query && params.query.length > 2,
    staleTime: 1000 * 60 * 5,
  });
};