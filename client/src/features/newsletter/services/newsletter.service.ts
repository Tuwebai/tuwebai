import { backendApi } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';
import { invokeSupabaseEdge } from '@/lib/supabase-edge';
import type { NewsletterSubscriptionInput } from '../types';

const EMAIL_REGEX = /\S+@\S+\.\S+/;

export const subscribeToNewsletter = async (payload: NewsletterSubscriptionInput) => {
  try {
    return await invokeSupabaseEdge<{ success?: boolean; message?: string }>('newsletter-subscribe', {
      body: { ...payload },
    });
  } catch {
    return backendApi.subscribeNewsletter(payload);
  }
};

export const confirmNewsletterSubscription = (token: string) =>
  backendApi.confirmNewsletter(token);

export const unsubscribeNewsletterSubscription = (token: string) =>
  backendApi.unsubscribeNewsletter(token);

export const getNewsletterErrorMessage = (error: unknown, fallback: string) =>
  getUiErrorMessage(error, fallback);

export const validateNewsletterEmail = (email: string): string | null => {
  const normalizedEmail = email.trim();

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    return 'Por favor, introduci un email valido';
  }

  return null;
};
