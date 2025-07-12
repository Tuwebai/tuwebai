import { useState, useEffect, useRef } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook personalizado que utiliza IntersectionObserver para detectar 
 * cuando un elemento es visible en el viewport
 * 
 * @param options - Opciones de configuración
 * @returns Un objeto con {ref, hasIntersected}
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>({
  threshold = 0,
  rootMargin = '0px',
  triggerOnce = true,
}: UseIntersectionObserverProps = {}) {
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    // Si el elemento ya fue intersectado y solo queremos disparar una vez, no hacemos nada
    if (triggerOnce && hasIntersected) return;
    
    // No ejecutar en el servidor
    if (typeof window === 'undefined') return;
    
    // Verificar si el navegador soporta IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Fallback para navegadores que no soportan IntersectionObserver
      setHasIntersected(true);
      return;
    }
    
    // Cleanup function para detener observación anterior
    const cleanupObserver = () => {
      if (observerRef.current && ref.current) {
        observerRef.current.unobserve(ref.current);
        observerRef.current = null;
      }
    };
    
    // Función callback para el observer
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting) {
        setHasIntersected(true);
        
        // Si solo queremos disparar una vez, dejamos de observar
        if (triggerOnce && ref.current && observerRef.current) {
          observerRef.current.unobserve(ref.current);
        }
      } else if (!triggerOnce) {
        // Si no es triggerOnce, podemos volver a false
        setHasIntersected(false);
      }
    };
    
    // Crear observer solo si el elemento existe
    if (ref.current) {
      // Limpiar observer anterior si existe
      cleanupObserver();
      
      // Crear nuevo observer
      observerRef.current = new IntersectionObserver(handleIntersect, {
        threshold,
        rootMargin,
      });
      
      // Comenzar a observar el elemento
      observerRef.current.observe(ref.current);
    }
    
    // Limpiar el observer al desmontar
    return cleanupObserver;
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);
  
  return { ref, hasIntersected };
}

export default useIntersectionObserver;