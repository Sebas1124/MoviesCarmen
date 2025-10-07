export const API_KEY = 'd846908a88c78972da6c46ced7731e4a';
export const API_BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const IMAGE_SIZES = {
  backdrop: {
    small: 'w780',
    medium: 'w1280',
    large: 'original'
  },
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    xlarge: 'w780'
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632'
  }
} as const;

export const ENDPOINTS = {
  POPULAR: 'movie/popular',
  TOP_RATED: 'movie/top_rated',
  UPCOMING: 'movie/upcoming',
  NOW_PLAYING: 'movie/now_playing',
  TRENDING: 'trending/movie/week',
  SEARCH: 'search/movie',
  MOVIE_DETAIL: 'movie',
  GENRES: 'genre/movie/list'
} as const;

export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.3,
    medium: 0.6,
    slow: 1.2
  },
  ease: {
    power2: 'power2.out',
    power3: 'power3.out',
    elastic: 'elastic.out(1, 0.3)',
    back: 'back.out(1.7)'
  }
} as const;