import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '' 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`relative bg-gray-900 rounded-xl shadow-2xl max-w-4xl max-h-[90vh] overflow-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;