const isDev = import.meta.env.DEV;
const GTAG_SCRIPT_ID = 'tuwebai-gtag-script';
const isLocalEnvironment = () =>
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);

const configuredMeasurementIds = new Set<string>();
let analyticsConsentGranted = false;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ensureGtagQueue = () => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };
  }
};

const applyAnalyticsConsent = () => {
  if (typeof window === 'undefined') return;
  ensureGtagQueue();
  window.gtag?.('consent', 'update', {
    analytics_storage: analyticsConsentGranted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
};

const loadAnalyticsScript = (measurementId: string) => {
  if (typeof document === 'undefined' || isLocalEnvironment()) return;
  if (document.getElementById(GTAG_SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = GTAG_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
};

export const setAnalyticsConsent = (enabled: boolean): void => {
  analyticsConsentGranted = enabled;

  if (typeof window === 'undefined') return;

  ensureGtagQueue();
  applyAnalyticsConsent();


};

export const isAnalyticsEnabled = (): boolean => analyticsConsentGranted;

export const initializeAnalytics = (measurementId: string): void => {
  if (typeof window === 'undefined' || !analyticsConsentGranted) return;
  ensureGtagQueue();
  loadAnalyticsScript(measurementId);

  if (!configuredMeasurementIds.has(measurementId)) {
    window.gtag?.('js', new Date());
    applyAnalyticsConsent();
    window.gtag?.('config', measurementId, {
      debug_mode: isDev,
      anonymize_ip: true,
    });
    configuredMeasurementIds.add(measurementId);
  }


};

export const trackPageView = (path: string, title?: string): void => {
  if (typeof window === 'undefined' || !analyticsConsentGranted) return;
  ensureGtagQueue();
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title,
  });

};

export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
): void => {
  if (typeof window === 'undefined' || !analyticsConsentGranted) return;
  ensureGtagQueue();
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value,
  });

};

export const trackException = (description: string, fatal: boolean = false): void => {
  trackEvent('Exception', description, fatal ? 'Fatal' : 'Non-Fatal');

};

export const setUser = (userId: string): void => {
  if (typeof window === 'undefined' || !analyticsConsentGranted) return;
  ensureGtagQueue();
  window.gtag?.('set', { user_id: userId });

};

export const trackWebVital = (metricName: string, value: number): void => {
  if (typeof window === 'undefined' || !analyticsConsentGranted) return;
  ensureGtagQueue();
  window.gtag?.('event', 'web_vitals', {
    event_category: 'Web Vitals',
    event_label: metricName,
    value: Math.round(value),
    non_interaction: true,
  });
};

export default {
  initialize: initializeAnalytics,
  isEnabled: isAnalyticsEnabled,
  setConsent: setAnalyticsConsent,
  pageview: trackPageView,
  event: trackEvent,
  exception: trackException,
  setUser,
  trackWebVital,
};
