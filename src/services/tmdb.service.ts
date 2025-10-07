import { API_BASE_URL, API_KEY } from '../constants/api.constants';
import type { 
  MovieDetail, 
  MoviesResponse, 
  SearchParams, 
  TVSeriesResponse, 
  TVSeriesDetail, 
  SeasonDetail 
} from '../types/movie.types';

class TMDBService {
  private async fetchFromTMDB<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    url.searchParams.append('language', 'es-ES');
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Error al contactar con TMDB: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>('movie/popular', { page });
  }

  async getTopRatedMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>('movie/top_rated', { page });
  }

  async getUpcomingMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>('movie/upcoming', { page });
  }

  async getNowPlayingMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>('movie/now_playing', { page });
  }

  async getTrendingMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>('trending/movie/week', { page });
  }

  async searchMovies(params: SearchParams): Promise<MoviesResponse> {
    const { query, page = 1, year, genre } = params;
    const searchParams: Record<string, string | number> = { page };
    
    if (query) searchParams.query = query;
    if (year) searchParams.year = year;
    if (genre) searchParams.with_genres = genre;
    
    return this.fetchFromTMDB<MoviesResponse>('search/movie', searchParams);
  }

  async getMovieDetail(movieId: number): Promise<MovieDetail> {
    return this.fetchFromTMDB<MovieDetail>(
      `movie/${movieId}`,
      { append_to_response: 'credits,videos,images,recommendations,similar' }
    );
  }

  async getMovieVideos(movieId: number): Promise<any[]> {
    try {
      const response = await this.fetchFromTMDB(`movie/${movieId}/videos`) as any;
      return response.results || [];
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      return [];
    }
  }

  async getGenres() {
    return this.fetchFromTMDB('genre/movie/list');
  }

  // Get streaming providers
  async getStreamingProviders(id: number, type: 'movie' | 'tv' = 'movie'): Promise<any> {
    try {
      const response = await this.fetchFromTMDB(`${type}/${id}/watch/providers`) as any;
      return response.results || {};
    } catch (error) {
      console.error('Error fetching streaming providers:', error);
      return {};
    }
  }

  // TV Series Methods
  async getPopularTVSeries(page: number = 1): Promise<TVSeriesResponse> {
    return this.fetchFromTMDB<TVSeriesResponse>('tv/popular', { page });
  }

  async getTopRatedTVSeries(page: number = 1): Promise<TVSeriesResponse> {
    return this.fetchFromTMDB<TVSeriesResponse>('tv/top_rated', { page });
  }

  async getOnTheAirTVSeries(page: number = 1): Promise<TVSeriesResponse> {
    return this.fetchFromTMDB<TVSeriesResponse>('tv/on_the_air', { page });
  }

  async getAiringTodayTVSeries(page: number = 1): Promise<TVSeriesResponse> {
    return this.fetchFromTMDB<TVSeriesResponse>('tv/airing_today', { page });
  }

  async getTrendingTVSeries(page: number = 1): Promise<TVSeriesResponse> {
    return this.fetchFromTMDB<TVSeriesResponse>('trending/tv/week', { page });
  }

  async searchTVSeries(params: SearchParams): Promise<TVSeriesResponse> {
    const { query, page = 1, year, genre } = params;
    const searchParams: Record<string, string | number> = { page };
    
    if (query) searchParams.query = query;
    if (year) searchParams.first_air_date_year = year;
    if (genre) searchParams.with_genres = genre;
    
    return this.fetchFromTMDB<TVSeriesResponse>('search/tv', searchParams);
  }

  async getTVSeriesDetail(seriesId: number): Promise<TVSeriesDetail> {
    return this.fetchFromTMDB<TVSeriesDetail>(
      `tv/${seriesId}`,
      { append_to_response: 'credits,videos,images,recommendations,similar' }
    );
  }

  async getTVSeriesVideos(seriesId: number): Promise<any[]> {
    try {
      const response = await this.fetchFromTMDB(`tv/${seriesId}/videos`) as any;
      return response.results || [];
    } catch (error) {
      console.error('Error fetching TV series videos:', error);
      return [];
    }
  }

  async getSeasonDetail(seriesId: number, seasonNumber: number): Promise<SeasonDetail> {
    return this.fetchFromTMDB<SeasonDetail>(`tv/${seriesId}/season/${seasonNumber}`);
  }

  async getTVGenres() {
    return this.fetchFromTMDB('genre/tv/list');
  }

  // Combined search for both movies and TV series
  async searchMulti(params: SearchParams): Promise<any> {
    const { query, page = 1 } = params;
    const searchParams: Record<string, string | number> = { page };
    
    if (query) searchParams.query = query;
    
    return this.fetchFromTMDB('search/multi', searchParams);
  }
}

export const tmdbService = new TMDBService();