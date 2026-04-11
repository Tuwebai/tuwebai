import { trackRuntimeEvent } from '@/lib/analytics-runtime';

export const trackNewsletterSignup = (source: string) =>
  trackRuntimeEvent('engagement', 'newsletter_signup', source);
