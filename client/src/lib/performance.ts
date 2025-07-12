/**
 * Utilidades para optimizar el rendimiento de la aplicación
 */

/**
 * Detecta si el navegador es compatible con las APIs modernas de rendimiento
 * @returns Un objeto con la disponibilidad de diferentes APIs
 */
export function detectPerformanceFeatures(): {
  intersectionObserver: boolean;
  mutationObserver: boolean;
  resizeObserver: boolean;
  performanceAPI: boolean;
  requestIdleCallback: boolean;
} {
  const isClient = typeof window !== 'undefined';
  
  return {
    intersectionObserver: isClient && 'IntersectionObserver' in window,
    mutationObserver: isClient && 'MutationObserver' in window,
    resizeObserver: isClient && 'ResizeObserver' in window,
    performanceAPI: isClient && 'performance' in window,
    requestIdleCallback: isClient && 'requestIdleCallback' in window
  };
}

/**
 * Registra métricas de rendimiento Web Vitals
 * @param metricName Nombre de la métrica (LCP, FID, CLS, etc.)
 * @param value Valor de la métrica
 */
export function reportPerformanceMetric(metricName: string, value: number): void {
  // Solo ejecutar en el cliente
  if (typeof window === 'undefined') return;
  
  // Registrar métrica en la consola durante desarrollo
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Performance Metric] ${metricName}: ${value}`);
  }
  
  // Enviar métrica a Google Analytics si está disponible
  if (window.gtag) {
    window.gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metricName,
      value: Math.round(value),
      non_interaction: true,
    });
  }
}

/**
 * Ejecuta una función cuando el navegador esté inactivo
 * @param callback Función a ejecutar
 * @param timeout Tiempo máximo de espera en ms
 */
export function runWhenIdle(callback: () => void, timeout: number = 5000): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    // Usar requestIdleCallback si está disponible
    window.requestIdleCallback(callback, { timeout });
  } else {
    // Fallback a setTimeout con un pequeño delay
    setTimeout(callback, 1);
  }
}

/**
 * Mide el tiempo de ejecución de una función
 * @param fn Función a medir
 * @param label Etiqueta para identificar la medición
 * @returns El resultado de la función
 */
export function measureExecutionTime<T>(fn: () => T, label: string): T {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  
  console.log(`[Performance] ${label}: ${(endTime - startTime).toFixed(2)}ms`);
  
  return result;
}

// Declaración para TypeScript de la función gtag de Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}