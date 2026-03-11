import { backendApi } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';
import type { NewsletterSubscriptionInput } from '../types';

export const subscribeToNewsletter = (payload: NewsletterSubscriptionInput) =>
  backendApi.subscribeNewsletter(payload);

export const getNewsletterErrorMessage = (error: unknown, fallback: string) =>
  getUiErrorMessage(error, fallback);
