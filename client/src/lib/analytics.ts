const isDev = import.meta.env.DEV;

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

export const initializeAnalytics = (measurementId: string): void => {
  if (typeof window === 'undefined') return;
  ensureGtagQueue();
  window.gtag?.('config', measurementId, { debug_mode: isDev });
  if (isDev) console.debug('Analytics queue initialized');
};

export const trackPageView = (path: string, title?: string): void => {
  if (typeof window === 'undefined') return;
  ensureGtagQueue();
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title,
  });
  if (isDev) console.debug(`Page view tracked: ${path}${title ? ` - ${title}` : ''}`);
};

export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
): void => {
  if (typeof window === 'undefined') return;
  ensureGtagQueue();
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
  if (isDev) console.debug(`Event tracked: ${category} - ${action}${label ? ` - ${label}` : ''}${value ? ` - ${value}` : ''}`);
};

export const trackException = (description: string, fatal: boolean = false): void => {
  trackEvent('Exception', description, fatal ? 'Fatal' : 'Non-Fatal');
  if (isDev) console.debug(`Exception tracked: ${description} (Fatal: ${fatal})`);
};

export const setUser = (userId: string): void => {
  if (typeof window === 'undefined') return;
  ensureGtagQueue();
  window.gtag?.('set', { user_id: userId });
  if (isDev) console.debug(`User set: ${userId}`);
};

export default {
  initialize: initializeAnalytics,
  pageview: trackPageView,
  event: trackEvent,
  exception: trackException,
  setUser,
};
