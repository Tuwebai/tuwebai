import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Componente que oculta contenido visualmente pero lo mantiene accesible para lectores de pantalla
 * Útil para proporcionar contexto adicional a usuarios de tecnologías asistivas
 * sin afectar el diseño visual
 */
export function VisuallyHidden({ 
  children, 
  as: Component = 'span' 
}: VisuallyHiddenProps) {
  return (
    <Component
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
      style={{
        clip: 'rect(0, 0, 0, 0)',
        clipPath: 'inset(50%)',
      }}
    >
      {children}
    </Component>
  );
}

export default VisuallyHidden;