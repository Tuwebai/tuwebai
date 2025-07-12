import React, { useState, useEffect, useRef } from 'react';
import { runWhenIdle } from '@/lib/performance';

interface DeferredContentProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  delay?: number;
  waitForIdle?: boolean;
  loadOnVisible?: boolean;
  threshold?: number;
}

/**
 * Componente que permite cargar contenido de manera diferida para mejorar el rendimiento inicial
 * - Puede esperar a que el navegador esté inactivo (idle)
 * - Puede cargar cuando el componente es visible en pantalla
 * - Puede especificar un placeholder durante la carga
 */
export function DeferredContent({
  children,
  placeholder,
  delay = 0,
  waitForIdle = true,
  loadOnVisible = true,
  threshold = 0.1,
}: DeferredContentProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isLoaded) return;
    
    const loadContent = () => {
      // Si hay un delay, esperar antes de cargar
      if (delay > 0) {
        setTimeout(() => setIsLoaded(true), delay);
      } else {
        setIsLoaded(true);
      }
    };
    
    // Si debemos cargar cuando sea visible
    if (loadOnVisible && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          
          if (entry.isIntersecting) {
            if (waitForIdle) {
              runWhenIdle(loadContent);
            } else {
              loadContent();
            }
            
            // Una vez detectado, dejar de observar
            if (containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        },
        { threshold }
      );
      
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      
      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    } else if (waitForIdle) {
      // Si no esperamos visibilidad pero sí inactividad del navegador
      runWhenIdle(loadContent);
    } else {
      // Carga inmediata con delay opcional
      loadContent();
    }
  }, [delay, waitForIdle, loadOnVisible, threshold, isLoaded]);
  
  return (
    <div ref={containerRef} className="min-h-[20px]">
      {isLoaded ? children : placeholder || (
        <div className="w-full h-full min-h-[100px] bg-gray-100 animate-pulse rounded" />
      )}
    </div>
  );
}

export default DeferredContent;