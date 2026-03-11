import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook transversal para detectar visibilidad en viewport.
 * Se conserva la misma implementación para no alterar comportamiento.
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
    if (triggerOnce && hasIntersected) return;
    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      setHasIntersected(true);
      return;
    }

    const cleanupObserver = () => {
      if (observerRef.current && ref.current) {
        observerRef.current.unobserve(ref.current);
        observerRef.current = null;
      }
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        setHasIntersected(true);

        if (triggerOnce && ref.current && observerRef.current) {
          observerRef.current.unobserve(ref.current);
        }
      } else if (!triggerOnce) {
        setHasIntersected(false);
      }
    };

    if (ref.current) {
      cleanupObserver();

      observerRef.current = new IntersectionObserver(handleIntersect, {
        threshold,
        rootMargin,
      });

      observerRef.current.observe(ref.current);
    }

    return cleanupObserver;
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return { ref, hasIntersected };
}

export default useIntersectionObserver;
