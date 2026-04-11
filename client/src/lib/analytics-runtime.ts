type AnalyticsModule = typeof import('./analytics').default;

let analyticsModulePromise: Promise<AnalyticsModule> | null = null;

const getAnalyticsModule = async (): Promise<AnalyticsModule> => {
  if (!analyticsModulePromise) {
    analyticsModulePromise = import('./analytics').then((module) => module.default);
  }

  return analyticsModulePromise;
};

export const withAnalytics = (callback: (analytics: AnalyticsModule) => void): void => {
  void getAnalyticsModule().then(callback);
};

export const trackRuntimeEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
): void => {
  withAnalytics((analytics) => {
    analytics.event(category, action, label, value);
  });
};

export const trackRuntimeSectionView = (sectionName: string): void => {
  withAnalytics((analytics) => {
    analytics.trackSectionView(sectionName);
  });
};

export const trackRuntimeCtaClick = (
  ctaName: string,
  location: string,
  destination?: string,
): void => {
  withAnalytics((analytics) => {
    analytics.trackCtaClick(ctaName, location, destination);
  });
};

export const trackRuntimeFormSubmit = (formName: string, location: string): void => {
  withAnalytics((analytics) => {
    analytics.trackFormSubmit(formName, location);
  });
};

export const trackRuntimeOutboundClick = (
  linkUrl: string,
  location: string,
  linkText?: string,
  linkType?: string,
): void => {
  withAnalytics((analytics) => {
    analytics.trackOutboundClick(linkUrl, location, linkText, linkType);
  });
};

export const trackRuntimeWebVital = (metricName: string, value: number): void => {
  withAnalytics((analytics) => {
    analytics.trackWebVital(metricName, value);
  });
};
