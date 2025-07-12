import React from 'react';
import { cn } from '@/lib/utils';

interface AccessibleImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string; // Hacemos que alt sea requerido
  decorative?: boolean; // Para imágenes puramente decorativas
  caption?: string; // Texto opcional de subtítulo/descripción
  fallback?: string; // URL de imagen alternativa en caso de error
}

/**
 * Componente de imagen mejorado para accesibilidad
 * - Requiere texto alternativo para lectores de pantalla
 * - Opción para marcar imágenes decorativas
 * - Soporte para subtítulos/descripciones
 * - Manejo de errores con imagen alternativa
 */
export function AccessibleImage({
  src,
  alt,
  decorative = false,
  caption,
  fallback,
  className,
  ...props
}: AccessibleImageProps) {
  const [error, setError] = React.useState(false);
  
  // Si la imagen principal falla, usamos la alternativa
  const imgSrc = error && fallback ? fallback : src;
  
  // Para imágenes decorativas, usamos alt="" para que los lectores
  // de pantalla las ignoren, pero mantenemos el atributo para validación
  const imgAlt = decorative ? "" : alt;
  
  return (
    <figure className={cn("relative", className)}>
      <img
        src={imgSrc}
        alt={imgAlt}
        onError={() => {
          if (fallback && !error) {
            setError(true);
          }
        }}
        {...props}
        // Agregar atributos para cumplir con WCAG 2.1
        aria-hidden={decorative}
      />
      
      {caption && (
        <figcaption className="text-sm text-gray-600 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default AccessibleImage;