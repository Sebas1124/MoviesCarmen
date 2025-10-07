import { IMAGE_BASE_URL, IMAGE_SIZES } from '../constants/api.constants';

export const getImageUrl = (
  path: string | null,
  type: 'backdrop' | 'poster' | 'profile',
  size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium'
) => {
  if (!path) return getPlaceholderImage(type);
  
  const sizeMap = IMAGE_SIZES[type];
  const imageSize = sizeMap[size as keyof typeof sizeMap] || sizeMap.medium;
  
  return `${IMAGE_BASE_URL}${imageSize}${path}`;
};

export const getPlaceholderImage = (type: 'backdrop' | 'poster' | 'profile'): string => {
  const placeholders = {
    backdrop: 'https://placehold.co/1280x720/0f0f23/ffffff?text=Sin+Imagen',
    poster: 'https://placehold.co/500x750/0f0f23/ffffff?text=Sin+Poster',
    profile: 'https://placehold.co/185x278/0f0f23/ffffff?text=Sin+Foto'
  };
  
  return placeholders[type];
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) return `${remainingMinutes}min`;
  if (remainingMinutes === 0) return `${hours}h`;
  
  return `${hours}h ${remainingMinutes}min`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const getYearFromDate = (dateString: string): string => {
  return new Date(dateString).getFullYear().toString();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};