import { backendApi } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';
import { invokeSupabaseEdge } from '@/lib/supabase-edge';
import type { PaymentPlan, PaymentStatusPayload } from '../types';

const CHECKOUT_TIMEOUT_MS = 9000;
const CHECKOUT_MAX_ATTEMPTS = 2;

export const createPaymentPreference = async (plan: PaymentPlan) => {
  try {
    return await invokeSupabaseEdge<{ init_point?: string }>('payment-preference', {
      body: { plan },
    });
  } catch {
    return backendApi.createPaymentPreference(plan);
  }
};

export const getPaymentStatus = async (paymentId: string): Promise<PaymentStatusPayload | null> => {
  try {
    const data = await invokeSupabaseEdge<{ data?: PaymentStatusPayload | null; success?: boolean }>('payment-status', {
      body: { paymentId },
    });
    if (!data?.success) {
      throw new Error('No se pudo validar el estado del pago');
    }
    return data.data ?? null;
  } catch {
    const data = await backendApi.getPaymentStatus(paymentId);
    if (!data?.success) {
      throw new Error('No se pudo validar el estado del pago');
    }
    return data.data ?? null;
  }
};

export const getPaymentsErrorMessage = (error: unknown, fallback: string) => getUiErrorMessage(error, fallback);

export const createPreferenceWithRetry = async (plan: PaymentPlan) => {
  for (let attempt = 1; attempt <= CHECKOUT_MAX_ATTEMPTS; attempt += 1) {
    try {
      return await Promise.race([
        createPaymentPreference(plan),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout al generar preferencia de pago')), CHECKOUT_TIMEOUT_MS)
        ),
      ]);
    } catch (error: unknown) {
      if (attempt >= CHECKOUT_MAX_ATTEMPTS) {
        throw error;
      }
    }
  }
  throw new Error('No se pudo generar preferencia de pago');
};
