import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  lazyLoad?: boolean;
  blurEffect?: boolean;
  loadingPriority?: 'high' | 'low' | 'auto';
}

/**
 * Componente de imagen optimizada que implementa:
 * - Carga lazy para imágenes fuera de pantalla
 * - Efecto de desenfoque durante la carga
 * - Priorización de carga para imágenes importantes
 * - Manejo de errores con imagen alternativa
 */
export function OptimizedImage({
  src,
  alt,
  placeholderSrc,
  lazyLoad = true,
  blurEffect = true,
  loadingPriority = 'auto',
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    // Si no necesitamos lazy loading o si la imagen tiene prioridad alta
    if (!lazyLoad || loadingPriority === 'high') {
      return;
    }

    // Configurar IntersectionObserver para cargar las imágenes cuando aparezcan en el viewport
    if (imgRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && imgRef.current) {
              // Cargar la imagen cuando sea visible
              imgRef.current.src = src;
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '200px 0px' } // Precargar cuando esté a 200px de aparecer
      );
      
      observer.observe(imgRef.current);
      
      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }
  }, [src, lazyLoad, loadingPriority]);
  
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  const handleError = () => {
    setError(true);
  };
  
  // Determinar qué src usar
  const actualSrc = error && placeholderSrc ? placeholderSrc : src;
  
  // Determinar si aplicar la carga lazy nativa del navegador
  const loadingAttr = lazyLoad && loadingPriority !== 'high' ? 'lazy' : undefined;
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {blurEffect && !isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ backdropFilter: 'blur(10px)' }}
        />
      )}
      
      <img
        ref={imgRef}
        src={lazyLoad && loadingPriority !== 'high' ? (placeholderSrc || '') : actualSrc}
        data-src={lazyLoad ? actualSrc : undefined}
        alt={alt}
        loading={loadingAttr}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          !isLoaded && blurEffect ? "opacity-0" : "opacity-100",
          className
        )}
        {...props}
      />
    </div>
  );
}

export default OptimizedImage;