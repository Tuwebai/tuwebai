import React, { useEffect, useRef } from 'react';

interface MemoryManagerProps {
  thresholdMB?: number;
  debug?: boolean;
}

const MemoryManager: React.FC<MemoryManagerProps> = ({ 
  thresholdMB = 150,
  debug = false 
}) => {
  const warnedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMemoryAPIAvailable = 'performance' in window && 'memory' in (window.performance as any);

    if (!isMemoryAPIAvailable) {
      if (debug) console.warn('MemoryManager: API de memoria no disponible en este navegador');
      return;
    }

    const checkMemory = () => {
      const memory = (window.performance as any).memory;
      const usedJSHeapSize = memory.usedJSHeapSize / (1024 * 1024);

      if (debug) console.debug(`MemoryManager: uso JS heap ${usedJSHeapSize.toFixed(2)} MB`);

      // Observabilidad pasiva: reporta en debug una sola vez al superar el umbral.
      if (usedJSHeapSize > thresholdMB && !warnedRef.current) {
        warnedRef.current = true;
        if (debug) {
          console.warn(`MemoryManager: umbral superado (${usedJSHeapSize.toFixed(2)} MB > ${thresholdMB} MB)`);
        }
      }
    };

    const intervalId = setInterval(checkMemory, 30000);
    return () => clearInterval(intervalId);
  }, [thresholdMB, debug]);

  return null;
};

export default MemoryManager;
