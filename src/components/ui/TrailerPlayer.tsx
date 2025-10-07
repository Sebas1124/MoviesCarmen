import React, { useState, useRef } from 'react';
import { Play, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import OptimizedModal from './OptimizedModal';

interface TrailerPlayerProps {
  trailerKey?: string;
  title: string;
  autoPlay?: boolean;
  muted?: boolean;
  background?: boolean;
  onClose?: () => void;
}

const TrailerPlayer: React.FC<TrailerPlayerProps> = ({ 
  trailerKey, 
  title, 
  autoPlay = false, 
  muted = true,
  background = false,
  onClose 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Parámetros optimizados para YouTube para mejor rendimiento
  const getOptimizedYouTubeUrl = (key: string, autoplay: boolean, muted: boolean) => {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      controls: background ? '0' : '1',
      showinfo: '0',
      rel: '0',
      iv_load_policy: '3',
      modestbranding: '1',
      playsinline: '1',
      enablejsapi: '1',
      origin: window.location.origin,
      // Configuraciones para mejor rendimiento
      vq: 'hd720', // Calidad optimizada
      hl: 'es', // Idioma español
      cc_lang_pref: 'es', // Subtítulos en español preferidos
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
      <div className={`${background ? 'absolute inset-0' : 'w-full h-64'} bg-gray-800 ${background ? '' : 'rounded-lg'} flex items-center justify-center`}>
        <p className="text-gray-400">No hay tráiler disponible</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`${background ? 'absolute inset-0' : 'w-full h-64'} bg-gray-800 ${background ? '' : 'rounded-lg'} flex flex-col items-center justify-center gap-4`}>
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

  const TrailerContent = ({ fullscreen = false }) => (
    <div className={`relative ${
      fullscreen 
        ? 'w-full aspect-video' 
        : background 
          ? 'absolute inset-0' 
          : 'w-full aspect-video'
    } bg-black ${background ? '' : 'rounded-lg'} overflow-hidden group`}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* YouTube iframe optimizado */}
      <iframe
        ref={iframeRef}
        src={getOptimizedYouTubeUrl(trailerKey, isPlaying, isMuted)}
        className={`w-full h-full ${background ? 'absolute inset-0' : ''}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{
          border: 'none',
          // Optimización para hardware acceleration
          willChange: 'transform',
          transform: 'translateZ(0)',
          // Estilos específicos para modo background
          ...(background && {
            objectFit: 'cover',
            width: 'calc(100% + 40px)',
            height: 'calc(100% + 40px)',
            left: '-20px',
            top: '-20px',
          })
        }}
      />

      {/* Controls overlay para background mode */}
      {background && !fullscreen && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <Play size={16} fill={isPlaying ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
            
            <button
              onClick={openFullscreen}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <Maximize size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Play overlay para modo normal */}
      {!background && !isPlaying && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(true)}
            className="p-4 bg-red-600 hover:bg-red-700 rounded-full text-white transform hover:scale-110 transition-all duration-200"
          >
            <Play size={24} fill="currentColor" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <TrailerContent />
      
      {/* Modal para fullscreen */}
      <OptimizedModal isOpen={isModalOpen} onClose={closeModal} size="full">
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-4">
            Tráiler - {title}
          </h3>
          <TrailerContent fullscreen />
        </div>
      </OptimizedModal>
    </>
  );
};

export default TrailerPlayer;