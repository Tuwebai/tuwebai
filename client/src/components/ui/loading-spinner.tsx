import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  color = '#6d7bff' 
}) => {
  // Tamaños según la prop size
  const sizeMap = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeMap[size]} animate-spin rounded-full border-t-2 border-b-2 border-solid`} 
           style={{ borderTopColor: color, borderBottomColor: 'transparent' }}></div>
      <p className="text-lg font-medium text-gray-700">Cargando contenido...</p>
    </div>
  );
};

export default LoadingSpinner;