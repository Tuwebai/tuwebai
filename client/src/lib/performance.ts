/**
 * Utilidades para optimizar el rendimiento de la aplicación
 */
const isDev = import.meta.env.DEV;

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
  if (isDev) console.debug(`[Performance Metric] ${metricName}: ${value}`);
  
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
 * Habilita observadores RUM básicos para Web Vitals sin dependencias externas.
 * Nota: métricas estimadas por navegador; usar Lighthouse/WebPageTest para validación de laboratorio.
 */
export function startWebVitalsTracking(): void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  try {
    let lcpValue = 0;
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        lcpValue = lastEntry.startTime;
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    const flushLcp = () => {
      if (lcpValue > 0) {
        reportPerformanceMetric('LCP', lcpValue);
      }
      lcpObserver.disconnect();
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushLcp();
    });
    window.addEventListener('pagehide', flushLcp, { once: true });
  } catch {
    // Navegador sin soporte completo
  }

  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    const flushCls = () => {
      if (clsValue > 0) {
        reportPerformanceMetric('CLS', clsValue * 1000);
      }
      clsObserver.disconnect();
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushCls();
    });
    window.addEventListener('pagehide', flushCls, { once: true });
  } catch {
    // Navegador sin soporte completo
  }

  try {
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstInput = entries[0] as PerformanceEntry & { processingStart?: number; startTime: number };
      if (firstInput && typeof firstInput.processingStart === 'number') {
        const fid = firstInput.processingStart - firstInput.startTime;
        reportPerformanceMetric('FID', fid);
        fidObserver.disconnect();
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch {
    // Navegador sin soporte completo
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
  
  if (isDev) console.debug(`[Performance] ${label}: ${(endTime - startTime).toFixed(2)}ms`);
  
  return result;
}

// Fallback gtag management movido a gtag.ts
