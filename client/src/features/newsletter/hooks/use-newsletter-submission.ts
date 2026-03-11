import { subscribeToNewsletter } from '../services/newsletter.service';
import type { NewsletterSubscriptionInput } from '../types';

export const useNewsletterSubmission = () => {
  return {
    subscribeToNewsletter: (payload: NewsletterSubscriptionInput) => subscribeToNewsletter(payload),
  };
};
