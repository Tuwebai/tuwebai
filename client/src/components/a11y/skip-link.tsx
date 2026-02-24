import { useState } from 'react';

/**
 * Componente que proporciona un enlace para saltar al contenido principal
 * Mejora la accesibilidad permitiendo a usuarios de lectores de pantalla 
 * evitar la navegación y saltar directamente al contenido principal
 */
export function SkipLink() {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <a
      href="#main-content"
      className={`
        fixed top-2 left-2 transform z-50 transition-transform duration-200
        bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isFocused ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'}
      `}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      Saltar al contenido principal
    </a>
  );
}

export default SkipLink;