import analytics from '@/lib/analytics';
import { API_URL } from '@/lib/api';

type LayoutShiftEntry = PerformanceEntry & {
  hadRecentInput?: boolean;
  value?: number;
};

type NavigationPerformanceBeaconPayload = {
  pathname: string;
  href: string;
  referrer: string;
  navigationType?: string;
  documentTimings?: {
    ttfbMs?: number;
    domInteractiveMs?: number;
    domContentLoadedMs?: number;
    loadEventEndMs?: number;
  };
  paintTimings?: {
    firstPaintMs?: number;
    firstContentfulPaintMs?: number;
    lcpMs?: number;
    cls?: number;
    fidMs?: number;
  };
  slowResources?: Array<{
    name: string;
    initiatorType?: string;
    durationMs?: number;
    transferSize?: number;
  }>;
};

const PERFORMANCE_BEACON_URL = `${API_URL}/api/performance/beacon`;
const PERFORMANCE_BEACON_SESSION_KEY = 'tuwebai:perf-beacon:sent';

let latestLcpValue = 0;
let latestClsValue = 0;
let latestFidValue = 0;

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
    requestIdleCallback: isClient && 'requestIdleCallback' in window,
  };
}

export function reportPerformanceMetric(metricName: string, value: number): void {
  if (typeof window === 'undefined') return;
  analytics.trackWebVital(metricName, value);
}

const roundMetric = (value: number | undefined): number | undefined => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Number(value.toFixed(2));
};

const sendPerformanceBeacon = (payload: NavigationPerformanceBeaconPayload): void => {
  if (typeof window === 'undefined') return;

  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon(PERFORMANCE_BEACON_URL, blob)) {
        return;
      }
    }
  } catch {
    // fallback a fetch keepalive
  }

  void fetch(PERFORMANCE_BEACON_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
    credentials: 'omit',
  }).catch(() => undefined);
};

export function startProductionNavigationDiagnostics(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined' || typeof performance === 'undefined') return;
  if (import.meta.env.DEV) return;

  try {
    if (sessionStorage.getItem(PERFORMANCE_BEACON_SESSION_KEY) === '1') return;
  } catch {
    // ignorar storage inaccesible
  }

  const flushBeacon = () => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (!navigationEntry) return;

    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find((entry) => entry.name === 'first-paint');
    const firstContentfulPaint = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
    const slowResources = performance
      .getEntriesByType('resource')
      .filter((entry) => entry.duration >= 500)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .map((entry) => ({
        name: entry.name,
        initiatorType: 'initiatorType' in entry ? String(entry.initiatorType || '') : undefined,
        durationMs: roundMetric(entry.duration),
        transferSize: 'transferSize' in entry ? Number(entry.transferSize || 0) : undefined,
      }));

    sendPerformanceBeacon({
      pathname: window.location.pathname,
      href: window.location.href,
      referrer: document.referrer,
      navigationType: navigationEntry.type,
      documentTimings: {
        ttfbMs: roundMetric(navigationEntry.responseStart),
        domInteractiveMs: roundMetric(navigationEntry.domInteractive),
        domContentLoadedMs: roundMetric(navigationEntry.domContentLoadedEventEnd),
        loadEventEndMs: roundMetric(navigationEntry.loadEventEnd || performance.now()),
      },
      paintTimings: {
        firstPaintMs: roundMetric(firstPaint?.startTime),
        firstContentfulPaintMs: roundMetric(firstContentfulPaint?.startTime),
        lcpMs: roundMetric(latestLcpValue || undefined),
        cls: roundMetric(latestClsValue || undefined),
        fidMs: roundMetric(latestFidValue || undefined),
      },
      slowResources,
    });

    try {
      sessionStorage.setItem(PERFORMANCE_BEACON_SESSION_KEY, '1');
    } catch {
      // ignorar storage inaccesible
    }
  };

  if (document.readyState === 'complete') {
    window.setTimeout(flushBeacon, 0);
    return;
  }

  window.addEventListener(
    'load',
    () => {
      window.setTimeout(flushBeacon, 0);
    },
    { once: true }
  );
}

export function startWebVitalsTracking(): void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  try {
    let lcpValue = 0;
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        lcpValue = lastEntry.startTime;
        latestLcpValue = lcpValue;
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
      entryList.getEntries().forEach((entry) => {
        const layoutShiftEntry = entry as LayoutShiftEntry;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value ?? 0;
          latestClsValue = clsValue * 1000;
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
        latestFidValue = fid;
        reportPerformanceMetric('FID', fid);
        fidObserver.disconnect();
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch {
    // Navegador sin soporte completo
  }
}

export function runWhenIdle(callback: () => void, timeout: number = 5000): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 1);
  }
}

export function measureExecutionTime<T>(fn: () => T, _label: string): T {
  return fn();
}
