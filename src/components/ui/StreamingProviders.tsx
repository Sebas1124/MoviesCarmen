import React from 'react';
import { ExternalLink, Tv, ShoppingCart, Clock } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface StreamingProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

interface StreamingProvidersProps {
  providers: {
    link?: string;
    flatrate?: StreamingProvider[];
    rent?: StreamingProvider[];
    buy?: StreamingProvider[];
  };
  country?: string;
}

const StreamingProviders: React.FC<StreamingProvidersProps> = ({ 
  providers, 
  country = 'ES' 
}) => {
  const { flatrate, rent, buy, link } = providers;

  if (!flatrate?.length && !rent?.length && !buy?.length) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Tv size={20} />
          Dónde ver
        </h3>
        <p className="text-gray-400">
          No hay información de streaming disponible para {country}
        </p>
      </div>
    );
  }

  const ProviderSection: React.FC<{ 
    title: string; 
    providers: StreamingProvider[]; 
    icon: React.ReactNode; 
    description: string;
  }> = ({ title, providers, icon, description }) => {
    if (!providers?.length) return null;

    return (
      <div className="mb-6 last:mb-0">
        <h4 className="text-md font-medium text-white mb-3 flex items-center gap-2">
          {icon}
          {title}
        </h4>
        <p className="text-sm text-gray-400 mb-3">{description}</p>
        <div className="flex flex-wrap gap-3">
          {providers
            .sort((a, b) => a.display_priority - b.display_priority)
            .map((provider) => (
            <div
              key={provider.provider_id}
              className="flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors group cursor-pointer"
              onClick={() => link && window.open(link, '_blank')}
            >
              <OptimizedImage
                src={provider.logo_path}
                alt={provider.provider_name}
                type="profile"
                size="small"
                className="w-8 h-8 rounded-md object-cover"
              />
              <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                {provider.provider_name}
              </span>
              {link && (
                <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Tv size={20} />
        Dónde ver en {country === 'ES' ? 'España' : country}
      </h3>

      <ProviderSection
        title="Streaming incluido"
        providers={flatrate || []}
        icon={<Tv size={16} className="text-green-500" />}
        description="Con suscripción a estos servicios"
      />

      <ProviderSection
        title="Alquilar"
        providers={rent || []}
        icon={<Clock size={16} className="text-yellow-500" />}
        description="Alquiler por tiempo limitado"
      />

      <ProviderSection
        title="Comprar"
        providers={buy || []}
        icon={<ShoppingCart size={16} className="text-blue-500" />}
        description="Compra digital permanente"
      />

      {link && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink size={14} />
            Ver más opciones en JustWatch
          </a>
        </div>
      )}
    </div>
  );
};

export default StreamingProviders;