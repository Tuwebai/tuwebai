import { apiFetch } from '@/lib/http-client';
import type { User } from '@/features/users/types';
import type { UserPrivacySettings, UpdateUserPrivacyPayload } from '@/features/users/types/privacy';
import type { PulseStatusData, PulseTokenData } from '@/features/users/types/pulse';

export type PaymentPlan = 'esencial' | 'avanzado' | 'premium';

export interface PaymentStatusResponse {
  success: boolean;
  data?: {
    id?: string | number;
    status?: string;
    status_detail?: string;
    transaction_amount?: number;
    currency_id?: string;
    date_approved?: string;
    payment_method_id?: string;
  };
}

const withEmailQuery = (basePath: string, email?: string) => {
  if (!email?.trim()) {
    return basePath;
  }

  const separator = basePath.includes('?') ? '&' : '?';
  return `${basePath}${separator}email=${encodeURIComponent(email.trim().toLowerCase())}`;
};

export const backendApi = {
  withLimit: (basePath: string, limit?: number) =>
    typeof limit === 'number' && Number.isFinite(limit) && limit > 0
      ? `${basePath}?limit=${Math.floor(limit)}`
      : basePath,

  getUser: (uid: string) =>
    apiFetch<{ success: boolean; data?: User }>(`/api/users/${encodeURIComponent(uid)}`),

  upsertUser: (uid: string, payload: Partial<User>) =>
    apiFetch<{ success: boolean }>(`/api/users/${encodeURIComponent(uid)}`, {
      method: 'PUT',
      body: payload as Record<string, unknown>,
    }),

  uploadUserAvatar: (uid: string, dataUrl: string) =>
    apiFetch<{ success: boolean; data?: { image?: string } }>(`/api/users/${encodeURIComponent(uid)}/avatar`, {
      method: 'POST',
      body: { dataUrl },
      timeoutMs: 20000,
    }),

  getUserPrivacy: (uid: string) =>
    apiFetch<{ success: boolean; data?: UserPrivacySettings }>(`/api/users/${encodeURIComponent(uid)}/privacy`),

  setUserPrivacy: (uid: string, payload: UpdateUserPrivacyPayload) =>
    apiFetch<{ success: boolean; data?: UserPrivacySettings }>(`/api/users/${encodeURIComponent(uid)}/privacy`, {
      method: 'PUT',
      body: payload as Record<string, unknown>,
    }),

  getUserProject: (uid: string) =>
    apiFetch<{ success: boolean; data?: unknown | null }>(`/api/users/${encodeURIComponent(uid)}/project`),

  getPulseToken: (email?: string) =>
    apiFetch<{ success: boolean; data?: PulseTokenData }>(withEmailQuery('/api/pulse-token', email)),

  getPulseStatus: (email?: string) =>
    apiFetch<{ success: boolean; data?: PulseStatusData }>(withEmailQuery('/api/pulse-status', email)),

  getUserPayments: (uid: string, limit?: number) =>
    apiFetch<{ success: boolean; data?: unknown[] }>(
      backendApi.withLimit(`/api/users/${encodeURIComponent(uid)}/payments`, limit)
    ),

  getAllProjects: (limit?: number) =>
    apiFetch<{ success: boolean; data?: unknown[] }>(backendApi.withLimit('/api/projects', limit)),

  getTestimonials: (limit?: number) =>
    apiFetch<{ success: boolean; data?: unknown[] }>(backendApi.withLimit('/api/testimonials', limit)),

  getTestimonialById: (testimonialId: string) =>
    apiFetch<{ success: boolean; data?: Record<string, unknown> }>(
      `/api/testimonials/${encodeURIComponent(testimonialId)}`
    ),

  updateTestimonial: (testimonialId: string, payload: Record<string, unknown>) =>
    apiFetch<{ success: boolean }>(`/api/testimonials/${encodeURIComponent(testimonialId)}`, {
      method: 'PUT',
      body: payload,
    }),

  deleteTestimonial: (testimonialId: string) =>
    apiFetch<{ success: boolean }>(`/api/testimonials/${encodeURIComponent(testimonialId)}`, {
      method: 'DELETE',
    }),

  updateProject: (projectId: string, payload: Record<string, unknown>) =>
    apiFetch<{ success: boolean }>(`/api/projects/${encodeURIComponent(projectId)}`, {
      method: 'PUT',
      body: payload,
    }),

  createPaymentPreference: (plan: PaymentPlan) =>
    apiFetch<{ init_point?: string }>('/crear-preferencia', {
      method: 'POST',
      body: { plan },
    }),

  getPaymentStatus: (paymentId: string) =>
    apiFetch<PaymentStatusResponse>(`/api/payments/status/${encodeURIComponent(paymentId)}`),

  submitContact: (payload: { name: string; email: string; title?: string; message: string; source?: string }) =>
    apiFetch<{ success?: boolean; message?: string; errors?: unknown[] }>('/contact', {
      method: 'POST',
      body: payload,
    }),

  subscribeNewsletter: (payload: { email: string; source?: string }) =>
    apiFetch<{ success?: boolean; message?: string }>('/newsletter', {
      method: 'POST',
      body: payload,
      timeoutMs: 15000,
    }),

  requestChecklistWebGratis: (payload: { name: string; email: string; lastWebsiteRefresh: string; source?: string }) =>
    apiFetch<{ success?: boolean; message?: string }>('/newsletter/resources/checklist-web-gratis', {
      method: 'POST',
      body: payload,
      timeoutMs: 15000,
    }),

  confirmNewsletter: (token: string) =>
    apiFetch<{ success: boolean; message: string; unsubscribeToken?: string | null; justConfirmed?: boolean }>(
      `/newsletter/confirm/${encodeURIComponent(token)}`,
      { timeoutMs: 15000 }
    ),

  unsubscribeNewsletter: (token: string) =>
    apiFetch<{ success: boolean; message: string }>(`/newsletter/unsubscribe/${encodeURIComponent(token)}`, {
      timeoutMs: 15000,
    }),

  submitTestimonial: (payload: { name: string; company?: string; testimonial: string }) =>
    apiFetch<{ success?: boolean; id?: string; message?: string }>('/api/testimonials', {
      method: 'POST',
      body: payload,
    }),

  submitApplication: (payload: {
    name: string;
    email: string;
    phone?: string;
    experience?: string;
    portfolio?: string;
    message?: string;
    position: string;
    department: string;
    type: string;
  }) =>
    apiFetch<{ success?: boolean; id?: string; message?: string }>('/api/applications', {
      method: 'POST',
      body: payload,
    }),

  recordPasswordReset: (payload: { email: string; passwordChangedAt: string }) =>
    apiFetch<{ success: boolean }>('/api/auth/password-reset-metadata', {
      method: 'POST',
      body: payload,
    }),
};
