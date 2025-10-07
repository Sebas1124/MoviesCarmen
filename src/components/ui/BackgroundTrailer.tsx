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

  // Parámetros optimizados para YouTube background
  const getBackgroundYouTubeUrl = (key: string, autoplay: boolean, muted: boolean) => {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      controls: '0',
      showinfo: '0',
      rel: '0',
      iv_load_policy: '3',
      modestbranding: '1',
      playsinline: '1',
      enablejsapi: '1',
      loop: '1',
      playlist: key, // Para loop
      origin: window.location.origin,
      vq: 'hd1080',
      hl: 'es',
      cc_lang_pref: 'es',
      start: '10', // Empezar 10 segundos después para evitar intros
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

        {/* YouTube iframe para background - técnica mejorada */}
        <div className="absolute inset-0" style={{
          width: '100vw',
          height: '100vh',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            minWidth: '100vw',
            minHeight: '100vh',
            position: 'relative',
          }}>
            <iframe
              key={iframeKey}
              src={getBackgroundYouTubeUrl(trailerKey, isPlaying, isMuted)}
              className="absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{
                border: 'none',
                width: '100%',
                height: '100%',
                minWidth: '177.77vh', // 16:9 aspect ratio
                minHeight: '56.25vw',  // 16:9 aspect ratio
                willChange: 'transform',
                transform: 'translateZ(0)',
              }}
            />
          </div>
        </div>

        {/* Controls overlay */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="absolute bottom-20 left-6 flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
              title={isPlaying ? 'Pausar trailer' : 'Reproducir trailer'}
            >
              <Play size={20} className={isPlaying ? 'opacity-50' : 'fill-current'} />
            </button>
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <button
              onClick={openFullscreen}
              className="p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
              title="Ver en pantalla completa"
            >
              <Maximize size={20} />
            </button>
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