import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getImageUrl } from '../../utils/helpers';

interface OptimizedImageProps {
  src: string | null;
  alt: string;
  type: 'backdrop' | 'poster' | 'profile';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  type,
  size = 'medium',
  className = '',
  aspectRatio,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imageUrl = getImageUrl(src, type, size);
  const placeholderUrl = getImageUrl(null, type, 'small');

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const containerStyle = aspectRatio 
    ? { aspectRatio } 
    : {};

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      <LazyLoadImage
        src={hasError ? placeholderUrl : imageUrl}
        alt={alt}
        effect="blur"
        threshold={100}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        placeholderSrc={placeholderUrl}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-800">
          <div className="w-full h-full bg-gray-700" />
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;