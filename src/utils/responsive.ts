// Utility functions for responsive design

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getViewportWidth = (): number => {
  if (typeof window === 'undefined') return 1024;
  return window.innerWidth;
};

export const getViewportHeight = (): number => {
  if (typeof window === 'undefined') return 768;
  return window.innerHeight;
};

export const isSmallScreen = (): boolean => {
  return getViewportWidth() < 640;
};

export const isMediumScreen = (): boolean => {
  const width = getViewportWidth();
  return width >= 640 && width < 1024;
};

export const isLargeScreen = (): boolean => {
  return getViewportWidth() >= 1024;
};

export const getResponsiveTextLength = (baseLength: number): number => {
  const width = getViewportWidth();
  if (width < 640) return Math.floor(baseLength * 0.6); // 60% for mobile
  if (width < 1024) return Math.floor(baseLength * 0.8); // 80% for tablet
  return baseLength; // Full length for desktop
};

export const getResponsiveCardWidth = (): string => {
  const width = getViewportWidth();
  if (width < 640) return 'w-36'; // Mobile
  if (width < 768) return 'w-48'; // Tablet
  return 'w-64'; // Desktop
};

export const supportsAutoplay = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // iOS doesn't support autoplay without user interaction
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) return false;
  
  // Android Chrome supports autoplay if muted
  const isAndroid = /Android/.test(navigator.userAgent);
  if (isAndroid) return true;
  
  // Desktop browsers generally support autoplay if muted
  return !isMobileDevice();
};

export const getOptimalVideoQuality = (): 'hd1080' | 'hd720' | 'medium' => {
  const width = getViewportWidth();
  const isMobile = isMobileDevice();
  
  if (isMobile || width < 640) return 'medium';
  if (width < 1280) return 'hd720';
  return 'hd1080';
};

export const shouldShowVideoControls = (): boolean => {
  return isMobileDevice();
};

export const getResponsiveButtonSize = (): { padding: string; fontSize: string } => {
  const width = getViewportWidth();
  
  if (width < 640) {
    return {
      padding: 'px-4 py-3',
      fontSize: 'text-sm'
    };
  }
  
  if (width < 1024) {
    return {
      padding: 'px-6 py-3',
      fontSize: 'text-base'
    };
  }
  
  return {
    padding: 'px-8 py-4',
    fontSize: 'text-lg'
  };
};

// Hook-like function for responsive behavior
export const useResponsiveConfig = () => {
  const isMobile = isMobileDevice();
  const isSmall = isSmallScreen();
  const width = getViewportWidth();
  
  return {
    isMobile,
    isSmall,
    width,
    cardWidth: getResponsiveCardWidth(),
    textLength: (baseLength: number) => getResponsiveTextLength(baseLength),
    videoQuality: getOptimalVideoQuality(),
    showControls: shouldShowVideoControls(),
    supportsAutoplay: supportsAutoplay(),
    buttonConfig: getResponsiveButtonSize()
  };
};