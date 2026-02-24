import { apiFetch } from '@/lib/http-client';
import type { User, UserPreferences } from '@/services/firestore';

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

  getUserPreferences: (uid: string) =>
    apiFetch<{ success: boolean; data?: UserPreferences | null }>(`/api/users/${encodeURIComponent(uid)}/preferences`),

  setUserPreferences: (uid: string, payload: Partial<UserPreferences>) =>
    apiFetch<{ success: boolean }>(`/api/users/${encodeURIComponent(uid)}/preferences`, {
      method: 'PUT',
      body: payload as Record<string, unknown>,
    }),

  getUserProject: (uid: string) =>
    apiFetch<{ success: boolean; data?: unknown | null }>(`/api/users/${encodeURIComponent(uid)}/project`),

  getUserPayments: (uid: string, limit?: number) =>
    apiFetch<{ success: boolean; data?: unknown[] }>(
      backendApi.withLimit(`/api/users/${encodeURIComponent(uid)}/payments`, limit)
    ),

  getUserTickets: (uid: string, limit?: number) =>
    apiFetch<{ success: boolean; data?: unknown[] }>(
      backendApi.withLimit(`/api/users/${encodeURIComponent(uid)}/tickets`, limit)
    ),

  getTicketById: (ticketId: string) =>
    apiFetch<{ success: boolean; data?: Record<string, unknown> }>(`/api/tickets/${encodeURIComponent(ticketId)}`),

  getAllProjects: (limit?: number) =>
    apiFetch<{ success: boolean; data?: unknown[] }>(backendApi.withLimit('/api/projects', limit)),

  getAllTickets: (limit?: number) =>
    apiFetch<{ success: boolean; data?: unknown[] }>(backendApi.withLimit('/api/tickets', limit)),

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

  createTicket: (
    uid: string,
    payload: {
      userId: string;
      subject: string;
      message: string;
      status?: 'open' | 'in-progress' | 'resolved';
      priority?: 'low' | 'medium' | 'high';
      responses?: unknown[];
    }
  ) =>
    apiFetch<{ success: boolean; id: string }>(`/api/users/${encodeURIComponent(uid)}/tickets`, {
      method: 'POST',
      body: payload as Record<string, unknown>,
    }),

  updateTicket: (
    uid: string,
    ticketId: string,
    payload: Record<string, unknown>
  ) =>
    apiFetch<{ success: boolean }>(
      `/api/users/${encodeURIComponent(uid)}/tickets/${encodeURIComponent(ticketId)}`,
      { method: 'PUT', body: payload }
    ),

  addTicketResponse: (
    uid: string,
    ticketId: string,
    payload: { message: string; author: string; authorType: 'client' | 'admin'; createdAt?: string }
  ) =>
    apiFetch<{ success: boolean }>(
      `/api/users/${encodeURIComponent(uid)}/tickets/${encodeURIComponent(ticketId)}/responses`,
      { method: 'POST', body: payload as Record<string, unknown> }
    ),

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

  submitProposal: (payload: {
    nombre: string;
    email: string;
    tipo_proyecto: string;
    servicios?: string;
    presupuesto?: string;
    plazo?: string;
    detalles: string;
  }) =>
    apiFetch<{ success?: boolean; message?: string }>('/api/propuesta', {
      method: 'POST',
      body: payload,
    }),

  subscribeNewsletter: (payload: { email: string; source?: string }) =>
    apiFetch<{ success?: boolean; message?: string }>('/newsletter', {
      method: 'POST',
      body: payload,
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

  verifyAuthToken: (token: string) =>
    apiFetch<{ success: boolean; message: string }>(`/api/auth/verify/${encodeURIComponent(token)}`),

  verifyAuthDevEmail: (email: string) =>
    apiFetch<{ success: boolean; message: string }>(`/api/auth/dev-verify/${encodeURIComponent(email)}`),
};
