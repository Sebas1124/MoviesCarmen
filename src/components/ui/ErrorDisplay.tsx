import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`text-center p-8 bg-red-900/20 border border-red-700/30 text-red-300 rounded-xl ${className}`}>
      <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
      <h3 className="text-xl font-bold mb-2">¡Ops! Algo salió mal</h3>
      <p className="text-gray-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;