import React, { useEffect, useRef } from 'react';

interface MemoryManagerProps {
  thresholdMB?: number;
  debug?: boolean;
}

type BrowserMemoryInfo = {
  usedJSHeapSize: number;
};

type PerformanceWithMemory = Performance & {
  memory?: BrowserMemoryInfo;
};

const MemoryManager: React.FC<MemoryManagerProps> = ({
  thresholdMB = 150,
  debug = false,
}) => {
  const warnedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const performanceWithMemory = window.performance as PerformanceWithMemory;
    const isMemoryAPIAvailable = typeof performanceWithMemory.memory?.usedJSHeapSize === 'number';

    if (!isMemoryAPIAvailable) {
      if (debug) console.warn('MemoryManager: API de memoria no disponible en este navegador');
      return;
    }

    const checkMemory = () => {
      const memory = performanceWithMemory.memory;
      if (!memory) return;
      const usedJSHeapSize = memory.usedJSHeapSize / (1024 * 1024);

      if (debug) console.debug(`MemoryManager: uso JS heap ${usedJSHeapSize.toFixed(2)} MB`);

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
