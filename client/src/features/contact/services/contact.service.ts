import { backendApi } from '@/lib/backend-api';
import { ApiError, getUiErrorMessage } from '@/lib/http-client';
import { invokeSupabaseEdge } from '@/lib/supabase-edge';
import type { ContactFieldErrors, ContactFormInput } from '../types';

export const submitContactForm = async (payload: ContactFormInput) => {
  try {
    return await invokeSupabaseEdge<{ success?: boolean; message?: string }>('contact-intake', {
      body: { ...payload },
    });
  } catch {
    return backendApi.submitContact(payload);
  }
};

export const getContactErrorMessage = (error: unknown, fallback: string) => getUiErrorMessage(error, fallback);

export const getContactFieldErrors = (error: unknown): ContactFieldErrors => {
  if (!(error instanceof ApiError)) {
    return {};
  }

  const payload = error.payload as { errors?: Array<{ path?: string; message?: string }> } | undefined;
  const issues = payload?.errors;
  if (!issues || !Array.isArray(issues)) {
    return {};
  }

  return issues.reduce<ContactFieldErrors>((acc, issue) => {
    if (issue.path && issue.message) {
      acc[issue.path] = issue.message;
    }
    return acc;
  }, {});
};
