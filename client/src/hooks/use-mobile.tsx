import { useState, useEffect } from 'react';

/**
 * Hook personalizado que detecta si el dispositivo actual es móvil
 * basado en el ancho de la pantalla y/o User Agent
 * @returns boolean que indica si el dispositivo es móvil
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verificar solo en el cliente
    if (typeof window === 'undefined') return;

    // Función para comprobar si es móvil
    const checkMobile = () => {
      // Comprobación por ancho de pantalla (viewport)
      const mobileByWidth = window.innerWidth < 768;
      
      // Comprobación por user agent (opcional, puede ser menos fiable)
      const mobileByUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // Podemos usar ambos o solo el ancho de pantalla
      setIsMobile(mobileByWidth);
    };

    // Comprobar inmediatamente
    checkMobile();

    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkMobile);

    // Limpiar listener
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}

export default useIsMobile;