const isDev = Boolean(import.meta.env?.DEV);
const GTAG_SCRIPT_ID = 'tuwebai-gtag-script';
const MEASUREMENT_ID = typeof __GA_MEASUREMENT_ID__ === 'string' ? __GA_MEASUREMENT_ID__.trim() : '';

const configuredMeasurementIds = new Set<string>();
const trackedSectionViews = new Set<string>();
let analyticsConsentGranted = false;

type AnalyticsValue = string | number | boolean | undefined;
type AnalyticsEventParams = Record<string, AnalyticsValue>;

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

const getMeasurementId = (measurementId?: string) => (measurementId?.trim() || MEASUREMENT_ID);

const sanitizeEventParams = (params: AnalyticsEventParams): Record<string, string | number | boolean> =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined)) as Record<
    string,
    string | number | boolean
  >;

const loadGtagScript = (measurementId: string) => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(GTAG_SCRIPT_ID)) return;

  ensureGtagQueue();
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

export const getAnalyticsMeasurementId = (): string => MEASUREMENT_ID;

export const isAnalyticsConfigured = (): boolean => Boolean(MEASUREMENT_ID);

const trackNamedEvent = (eventName: string, params: AnalyticsEventParams = {}): void => {
  if (typeof window === 'undefined' || !analyticsConsentGranted || !isAnalyticsConfigured()) return;
  ensureGtagQueue();
  window.gtag?.('event', eventName, sanitizeEventParams(params));
};

export const initializeAnalytics = (measurementId?: string): void => {
  const resolvedMeasurementId = getMeasurementId(measurementId);

  if (!resolvedMeasurementId) {
    return;
  }

  if (typeof window === 'undefined' || !analyticsConsentGranted) return;
  ensureGtagQueue();
  loadGtagScript(resolvedMeasurementId);

  if (!configuredMeasurementIds.has(resolvedMeasurementId)) {
    window.gtag?.('js', new Date());
    applyAnalyticsConsent();
    window.gtag?.('config', resolvedMeasurementId, {
      debug_mode: isDev,
      anonymize_ip: true,
      send_page_view: false,
    });
    configuredMeasurementIds.add(resolvedMeasurementId);
  }
};

export const trackPageView = (path: string, title?: string): void => {
  trackNamedEvent('page_view', {
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
  trackNamedEvent(action, {
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
  trackNamedEvent('web_vitals', {
    event_category: 'Web Vitals',
    event_label: metricName,
    value: Math.round(value),
    non_interaction: true,
  });
};

export const trackCtaClick = (
  ctaName: string,
  location: string,
  destination?: string,
): void => {
  trackNamedEvent('click_cta', {
    cta_name: ctaName,
    location,
    destination,
  });
};

export const trackFormSubmit = (formName: string, location: string): void => {
  trackNamedEvent('form_submit', {
    form_name: formName,
    location,
  });
};

export const trackSectionView = (sectionName: string, pagePath?: string): void => {
  const path =
    pagePath ??
    (typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '');
  const viewKey = `${path}::${sectionName}`;

  if (trackedSectionViews.has(viewKey)) {
    return;
  }

  trackedSectionViews.add(viewKey);
  trackNamedEvent('section_view', {
    section_name: sectionName,
    page_path: path,
  });
};

export const trackOutboundClick = (
  linkUrl: string,
  location: string,
  linkText?: string,
  linkType?: string,
): void => {
  trackNamedEvent('outbound_click', {
    link_url: linkUrl,
    location,
    link_text: linkText,
    link_type: linkType,
  });
};

export default {
  getMeasurementId: getAnalyticsMeasurementId,
  initialize: initializeAnalytics,
  isConfigured: isAnalyticsConfigured,
  isEnabled: isAnalyticsEnabled,
  setConsent: setAnalyticsConsent,
  pageview: trackPageView,
  event: trackEvent,
  exception: trackException,
  setUser,
  trackWebVital,
  trackCtaClick,
  trackFormSubmit,
  trackSectionView,
  trackOutboundClick,
};
