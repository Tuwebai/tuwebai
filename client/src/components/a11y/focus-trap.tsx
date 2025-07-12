import React, { useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  onEscape?: () => void;
}

/**
 * Componente que mantiene el foco dentro de un elemento cuando está activo
 * Útil para modales, diálogos y menús desplegables para mejorar la accesibilidad
 * con teclado y lectores de pantalla
 */
export function FocusTrap({ children, isActive, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Guardar el elemento con foco antes de activar el trap
  useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isActive]);
  
  // Manejar el ciclo de foco y la tecla Escape
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    // Obtener todos los elementos enfocables dentro del contenedor
    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Enfocar el primer elemento al activar
    firstElement.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }
      
      if (e.key === 'Tab') {
        // Si el usuario presiona Tab y está en el último elemento, volver al primero
        if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
        
        // Si el usuario presiona Shift+Tab y está en el primer elemento, ir al último
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onEscape]);
  
  // Restaurar el foco al elemento original cuando se desactiva
  useEffect(() => {
    if (!isActive && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isActive]);
  
  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}

export default FocusTrap;