import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import OptimizedModal from './OptimizedModal';

interface BackgroundTrailerProps {
  trailerKey?: string;
  title: string;
  autoPlay?: boolean;
  muted?: boolean;
  onClose?: () => void;
}

const BackgroundTrailer: React.FC<BackgroundTrailerProps> = ({ 
  trailerKey, 
  title, 
  autoPlay = true, 
  muted = true,
  onClose 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0); // Para forzar re-render del iframe

  // Actualizar estado del mute cuando cambie desde el padre
  React.useEffect(() => {
    if (muted !== isMuted) {
      setIsMuted(muted);
      setIframeKey(prev => prev + 1); // Forzar recarga del iframe
    }
  }, [muted]);

  // Detectar si es dispositivo móvil
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Parámetros simplificados para YouTube background
  const getBackgroundYouTubeUrl = (key: string, autoplay: boolean, muted: boolean) => {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      controls: '0',
      showinfo: '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      loop: '1',
      playlist: key,
      origin: window.location.origin,
    });

    return `https://www.youtube-nocookie.com/embed/${key}?${params.toString()}`;
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const openFullscreen = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  if (!trailerKey) {
    return (
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">No hay tráiler disponible</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Error cargando el tráiler</p>
        <button
          onClick={() => {
            setHasError(false);
            setIsLoading(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw size={16} />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Container del video de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Loading placeholder */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* YouTube iframe para background - fixed */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            key={iframeKey}
            src={getBackgroundYouTubeUrl(trailerKey, isPlaying, isMuted)}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{
              border: 'none',
              width: '177.78vh', // 16:9 aspect ratio
              height: '100vh',
              minWidth: '100vw',
              minHeight: '56.25vw',
            }}
          />
          
          {/* Overlay para móvil cuando no hay autoplay */}
          {isMobile && !isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <button
                onClick={() => setIsPlaying(true)}
                className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transform hover:scale-110 transition-all duration-200"
              >
                <Play size={32} className="fill-current ml-1" />
              </button>
            </div>
          )}
        </div>

        {/* Controls overlay - responsive */}
        <div className={`absolute inset-0 ${isMobile ? 'opacity-100' : 'opacity-0 hover:opacity-100'} transition-opacity duration-300 z-20`}>
          <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-6 flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 sm:p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
              title={isPlaying ? 'Pausar trailer' : 'Reproducir trailer'}
            >
              <Play size={16} className={`sm:w-5 sm:h-5 ${isPlaying ? 'opacity-50' : 'fill-current'}`} />
            </button>
            
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                setIframeKey(prev => prev + 1);
              }}
              className="p-2 sm:p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX size={16} className="sm:w-5 sm:h-5" /> : <Volume2 size={16} className="sm:w-5 sm:h-5" />}
            </button>

            {!isMobile && (
              <button
                onClick={openFullscreen}
                className="p-2 sm:p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
                title="Ver en pantalla completa"
              >
                <Maximize size={16} className="sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal para fullscreen */}
      <OptimizedModal isOpen={isModalOpen} onClose={closeModal} size="full">
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-4">
            Tráiler - {title}
          </h3>
          <div className="aspect-video w-full">
            <iframe
              src={getBackgroundYouTubeUrl(trailerKey, true, false)}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </OptimizedModal>
    </>
  );
};

export default BackgroundTrailer;