import React, { useEffect } from 'react';

interface MemoryManagerProps {
  thresholdMB?: number;
  debug?: boolean;
}

/**
 * Componente que ayuda a gestionar el uso de memoria de la aplicación
 */
const MemoryManager: React.FC<MemoryManagerProps> = ({ 
  thresholdMB = 150,
  debug = false 
}) => {
  useEffect(() => {
    // Solo ejecutar en cliente, no en SSR
    if (typeof window === 'undefined') return;
    
    // Verificar si la API de medición de memoria está disponible
    const isMemoryAPIAvailable = 'performance' in window && 
      'memory' in (window.performance as any);
    
    if (!isMemoryAPIAvailable) {
      if (debug) console.warn('MemoryManager: La API de memoria no está disponible en este navegador');
      return;
    }
    
    // Función para comprobar el uso de memoria
    const checkMemory = () => {
      const memory = (window.performance as any).memory;
      const usedJSHeapSize = memory.usedJSHeapSize / (1024 * 1024); // MB
      
      if (debug) {
        console.log(`MemoryManager: Uso actual de memoria JS: ${usedJSHeapSize.toFixed(2)} MB`);
      }
      
      // Si el uso de memoria excede el umbral, intentar liberar memoria
      if (usedJSHeapSize > thresholdMB) {
        if (debug) console.warn(`MemoryManager: Uso de memoria excede ${thresholdMB} MB, ejecutando garbage collection`);
        
        // Intentar liberar memoria
        if (typeof window.gc === 'function') {
          try {
            window.gc();
            if (debug) console.log('MemoryManager: Garbage collection ejecutado explícitamente');
          } catch (e) {
            console.error('MemoryManager: Error al ejecutar garbage collection', e);
          }
        } else {
          // Alternativa si window.gc no está disponible (caso normal)
          if (debug) console.log('MemoryManager: Intentando liberar memoria indirectamente');
          
          // Este es un truco común para sugerir al navegador que ejecute GC
          // No garantizado, pero puede ayudar en algunos casos
          try {
            // Reservar y liberar un gran bloque de memoria
            let largeArray: any[] = [];
            for (let i = 0; i < 1000000; i++) {
              largeArray.push(i);
            }
            // Eliminar referencia al array grande
            largeArray = [];
            largeArray = null as any;
          } catch (e) {
            // Ignorar error de memoria si ocurre
          }
        }
      }
    };
    
    // Comprobar memoria periódicamente
    const intervalId = setInterval(checkMemory, 30000);
    
    // Limpiar al desmontar
    return () => clearInterval(intervalId);
  }, [thresholdMB, debug]);
  
  // Este componente no renderiza nada visible
  return null;
};

export default MemoryManager;