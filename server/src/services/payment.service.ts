import crypto from "crypto";
import { preference, payment } from '../config/mercadopago';
import { PAYMENT_PLAN_CONFIG, type PaymentPlan } from '../constants/payment-plans';
import { env } from '../config/env.config';
import { appLogger } from '../utils/app-logger';

const MP_TIMEOUT_MS = 8_000;
const MP_RETRY_ATTEMPTS = 2;
const MP_RETRY_DELAY_MS = 350;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${operation}_timeout_${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const withRetry = async <T>(operationName: string, operation: () => Promise<T>): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MP_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      appLogger.warn('payment.retryable_operation_failed', {
        operation: operationName,
        attempt,
        maxAttempts: MP_RETRY_ATTEMPTS,
        error: error instanceof Error ? error.message : String(error),
      });
      if (attempt < MP_RETRY_ATTEMPTS) {
        await wait(MP_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`${operationName}_failed`);
};

export const createPaymentPreference = async (plan: PaymentPlan) => {
  const selectedPlan = PAYMENT_PLAN_CONFIG[plan];

  if (!selectedPlan) {
    throw new Error('Plan invalido');
  }

  const frontendBaseUrl = env.FRONTEND_URL.replace(/\/+$/, '');
  const backendBaseUrl = (env.BACKEND_URL || '').replace(/\/+$/, '');

  const preferenceData = {
    items: [
      {
        id: plan,
        title: selectedPlan.title,
        unit_price: selectedPlan.unitPrice,
        quantity: 1,
        currency_id: 'ARS'
      }
    ],
    back_urls: {
      success: `${frontendBaseUrl}/pago-exitoso`,
      failure: `${frontendBaseUrl}/pago-fallido`,
      pending: `${frontendBaseUrl}/pago-pendiente`
    },
    auto_return: 'approved',
    ...(backendBaseUrl
      ? { notification_url: `${backendBaseUrl}/webhook/mercadopago` }
      : {}),
    external_reference: `tuwebai-${plan}-${Date.now()}`,
  };

  const mpRes = await withRetry('create_payment_preference', () =>
    withTimeout(preference.create({ body: preferenceData as any }), MP_TIMEOUT_MS, 'mercadopago_preference_create')
  );
  return mpRes;
};

export const verifyWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    appLogger.error('payment.signature_verification_failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
};

export const getPaymentDetails = async (paymentId: string | number) => {
  return await withRetry('get_payment_details', () =>
    withTimeout(payment.get({ id: paymentId }), MP_TIMEOUT_MS, 'mercadopago_payment_get')
  );
};
