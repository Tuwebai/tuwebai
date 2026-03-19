import { backendApi } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';
import type { NewsletterSubscriptionInput } from '../types';

export const subscribeToNewsletter = (payload: NewsletterSubscriptionInput) =>
  backendApi.subscribeNewsletter(payload);

export const confirmNewsletterSubscription = (token: string) =>
  backendApi.confirmNewsletter(token);

export const unsubscribeNewsletterSubscription = (token: string) =>
  backendApi.unsubscribeNewsletter(token);

export const getNewsletterErrorMessage = (error: unknown, fallback: string) =>
  getUiErrorMessage(error, fallback);
