import { useEffect, useState } from 'react';

/**
 * Hook transversal para detectar viewport móvil.
 * Se mantiene la misma lógica para no alterar comportamiento.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}

export default useIsMobile;
