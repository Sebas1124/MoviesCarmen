import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface OptimizedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  blur?: boolean;
}

const OptimizedModal: React.FC<OptimizedModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  size = 'lg',
  blur = true 
}) => {
  // Optimizar el escape con useCallback para evitar re-renders
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll en el body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop optimizado con will-change para mejor rendimiento */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 will-change-transform ${
          blur ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/80'
        }`}
        onClick={onClose}
      />
      
      {/* Modal content con hardware acceleration */}
      <div className={`
        relative ${sizeClasses[size]} w-full mx-4 
        transform transition-all duration-300 ease-out will-change-transform
        scale-100 opacity-100
      `}>
        <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
          {/* Close button optimizado */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200"
          >
            <X size={20} />
          </button>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default OptimizedModal;