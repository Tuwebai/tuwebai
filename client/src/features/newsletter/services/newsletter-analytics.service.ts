import analytics from '@/lib/analytics';

export const trackNewsletterSignup = (source: string) =>
  analytics.event('engagement', 'newsletter_signup', source);
