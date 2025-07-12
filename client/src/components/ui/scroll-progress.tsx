import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScrollProgressProps {
  color?: string;
  height?: number;
}

export default function ScrollProgress({ 
  color = '#00CCFF', 
  height = 3 
}: ScrollProgressProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Usamos un enfoque alternativo basado en eventos de scroll
  useEffect(() => {
    const handleScroll = () => {
      // Calcular el progreso del scroll (0-1)
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const currentProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      
      // Actualizar visibilidad y progreso
      setIsVisible(window.scrollY > 100);
      setScrollProgress(currentProgress);
    };
    
    // Llamada inicial para establecer el estado correcto
    handleScroll();
    
    // Añadir event listener
    window.addEventListener('scroll', handleScroll);
    
    // Limpiar al desmontar
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{ 
        height,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      <div 
        style={{
          height: '100%',
          width: `${scrollProgress * 100}%`,
          backgroundColor: color,
          transition: 'width 0.1s ease-out'
        }}
      />
    </div>
  );
}