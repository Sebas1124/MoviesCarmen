export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genres: Genre[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  cast_id: number;
  credit_id: string;
  order: number;
  gender: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string;
  credit_id: string;
  gender: number;
  known_for_department: string;
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  type: string;
  size: number;
  official: boolean;
  published_at: string;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface MovieVideos {
  id: number;
  results: Video[];
}

export interface MovieDetail extends Movie {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  credits?: MovieCredits;
  videos?: MovieVideos;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface SearchParams {
  query?: string;
  page?: number;
  year?: number;
  genre?: number;
}

// TV Series Types
export interface TVSeries {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  last_air_date?: string;
  genres: Genre[];
  popularity: number;
  adult: boolean;
  original_language: string;
  origin_country: string[];
  episode_run_time: number[];
  in_production: boolean;
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  type: string;
}

export interface Creator {
  id: number;
  name: string;
  profile_path: string;
  gender: number;
  credit_id: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  air_date: string;
  episode_number: number;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  crew: CrewMember[];
  guest_stars: CastMember[];
}

export interface SeasonDetail extends Season {
  episodes: Episode[];
}

export interface TVSeriesDetail extends TVSeries {
  created_by: Creator[];
  networks: Network[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  seasons: Season[];
  homepage: string;
  tagline: string;
  credits?: TVCredits;
  videos?: TVVideos;
}

export interface TVCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface TVVideos {
  id: number;
  results: Video[];
}

export interface TVSeriesResponse {
  page: number;
  results: TVSeries[];
  total_pages: number;
  total_results: number;
}