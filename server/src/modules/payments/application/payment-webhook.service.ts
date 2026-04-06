import { env } from '../../../config/env.config';
import { verifyWebhookSignature, getPaymentDetails } from '../../../services/payment.service';
import {
  registerPaymentWebhookReceipt,
  syncMercadoPagoPaymentToSupabase,
} from '../../../services/payment-webhook-store.service';
import type { Request } from 'express';
import { type PaymentWebhookLogWriter } from '../domain/payment-webhook-log-writer';

interface ProcessPaymentWebhookInput {
  body: unknown;
  headers: {
    xRequestId?: string;
    xSignature?: string;
    userAgent?: string;
  };
  ip?: string;
  logWriter: PaymentWebhookLogWriter;
  path: string;
  method: string;
}

const readWebhookPayload = (
  payload: unknown,
): { data?: { id?: string | number }; type?: string } =>
  (typeof payload === 'object' && payload !== null ? payload : {}) as {
    data?: { id?: string | number };
    type?: string;
  };

export const processMercadoPagoWebhook = async (
  input: ProcessPaymentWebhookInput,
): Promise<void> => {
  input.logWriter.info('payment.webhook_received', {
    path: input.path,
    method: input.method,
    headers: input.headers,
    ip: input.ip,
  });

  input.logWriter.audit({
    event: 'webhook_received',
    timestamp: new Date().toISOString(),
    headers: input.headers,
    body: input.body,
    ip: input.ip,
  });

  const webhookSecret = env.MERCADOPAGO_WEBHOOK_SECRET;
  if (webhookSecret) {
    const payload = JSON.stringify(input.body);

    if (!input.headers.xSignature || !verifyWebhookSignature(payload, input.headers.xSignature, webhookSecret)) {
      input.logWriter.warn('payment.webhook_invalid_signature', {
        path: input.path,
        method: input.method,
        headers: input.headers,
      });

      input.logWriter.audit({
        event: 'webhook_invalid_signature',
        timestamp: new Date().toISOString(),
        headers: input.headers,
        body: input.body,
      });
      return;
    }
  }

  const { type, data } = readWebhookPayload(input.body);

  if (!data?.id || !type) {
    input.logWriter.warn('payment.webhook_invalid_payload', {
      body: input.body,
    });
    return;
  }

  if (type !== 'payment') {
    input.logWriter.info('payment.webhook_ignored_event', { type, paymentId: data.id });
    return;
  }

  const paymentId = data.id;

  if (!env.MERCADOPAGO_ACCESS_TOKEN) {
    input.logWriter.error('payment.access_token_missing', { paymentId });
    return;
  }

  try {
    const paymentDetails = await getPaymentDetails(paymentId);
    await syncMercadoPagoPaymentToSupabase(paymentDetails);

    const isNewReceipt = await registerPaymentWebhookReceipt({
      eventType: 'payment',
      paymentId,
      paymentStatus: paymentDetails.status,
      paymentStatusDetail: paymentDetails.status_detail,
      payload: readWebhookPayload(input.body) as Record<string, unknown>,
      requestId: input.headers.xRequestId,
    });

    if (!isNewReceipt) {
      input.logWriter.info('payment.webhook_duplicate_received', {
        paymentId,
        requestId: input.headers.xRequestId,
        status: paymentDetails.status,
      });
    }

    input.logWriter.info('payment.webhook_processed', {
      paymentId,
      status: paymentDetails.status,
    });

    input.logWriter.audit({
      event: 'webhook_processed',
      timestamp: new Date().toISOString(),
      payment_id: paymentId,
      status: paymentDetails.status,
      processing_time_ms: input.logWriter.elapsedMs(),
      orderData: {
        payment_id: paymentId,
        status: paymentDetails.status,
        amount: paymentDetails.transaction_amount,
        currency: paymentDetails.currency_id,
        payer_email: paymentDetails.payer?.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    input.logWriter.error('payment.webhook_mp_lookup_failed', {
      paymentId,
      error: error instanceof Error ? error.message : 'unknown_payment_webhook_lookup_error',
    });

    input.logWriter.audit({
      event: 'webhook_mp_lookup_failed',
      timestamp: new Date().toISOString(),
      payment_id: paymentId,
      error: error instanceof Error ? error.message : 'unknown_payment_webhook_lookup_error',
    });
  }
};

export const buildPaymentWebhookHeaders = (req: Request) => ({
  xSignature: req.headers['x-signature'] as string | undefined,
  xRequestId: req.headers['x-request-id'] as string | undefined,
  userAgent: req.headers['user-agent'] as string | undefined,
});
