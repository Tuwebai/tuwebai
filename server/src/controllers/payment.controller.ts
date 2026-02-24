import { Request, Response } from 'express';
import { env } from '../config/env.config';
import { createPaymentPreference, verifyWebhookSignature, getPaymentDetails } from '../services/payment.service';
import { registerProcessedPayment } from '../services/webhook-idempotency.service';
import { type PaymentPlan } from '../constants/payment-plans';
import { writeLog } from '../utils/logger';
import { appLogger } from '../utils/app-logger';

export const handleCreatePreference = async (req: Request, res: Response) => {
  try {
    const { plan } = req.body as { plan: PaymentPlan };

    const mpRes = await createPaymentPreference(plan);
    return res.json({ init_point: mpRes.init_point });
  } catch (error: any) {
    appLogger.error('payment.preference_failed', {
      error: error?.message,
      route: req.path,
      method: req.method,
    });

    if (error?.message === 'Plan invalido') {
      return res.status(400).json({ error: 'Plan invalido' });
    }
    return res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
};

export const handleWebhookHealth = (_req: Request, res: Response) => {
  res.json({ ok: true });
};

export const handleGetPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params as { paymentId: string };

    if (!env.MERCADOPAGO_ACCESS_TOKEN) {
      return res.status(503).json({
        success: false,
        error: 'Mercado Pago no configurado',
      });
    }

    const paymentDetails = await getPaymentDetails(paymentId);

    return res.json({
      success: true,
      data: {
        id: paymentDetails.id,
        status: paymentDetails.status,
        status_detail: paymentDetails.status_detail,
        transaction_amount: paymentDetails.transaction_amount,
        currency_id: paymentDetails.currency_id,
        date_approved: paymentDetails.date_approved,
        payment_method_id: paymentDetails.payment_method_id,
      },
    });
  } catch (error: any) {
    appLogger.warn('payment.status_lookup_failed', {
      paymentId: req.params?.paymentId,
      error: error?.message,
    });

    return res.status(404).json({
      success: false,
      error: 'No se pudo obtener el estado del pago',
    });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const startTime = Date.now();

  // ACK immediately to avoid retries due to timeout.
  res.status(200).json({ received: true });

  try {
    const headers = {
      xSignature: req.headers['x-signature'],
      xRequestId: req.headers['x-request-id'],
      userAgent: req.headers['user-agent'],
    };

    appLogger.info('payment.webhook_received', {
      path: req.path,
      method: req.method,
      headers,
      ip: req.ip,
    });

    writeLog({
      event: 'webhook_received',
      timestamp: new Date().toISOString(),
      headers,
      body: req.body,
      ip: req.ip,
    });

    const webhookSecret = env.MERCADOPAGO_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers['x-signature'] as string | undefined;
      const payload = JSON.stringify(req.body);

      if (!signature || !verifyWebhookSignature(payload, signature, webhookSecret)) {
        appLogger.warn('payment.webhook_invalid_signature', {
          path: req.path,
          method: req.method,
          headers,
        });

        writeLog({
          event: 'webhook_invalid_signature',
          timestamp: new Date().toISOString(),
          headers,
          body: req.body,
        });
        return;
      }
    }

    const { type, data } = req.body as { type?: string; data?: { id?: string | number } };

    if (!data?.id || !type) {
      appLogger.warn('payment.webhook_invalid_payload', {
        body: req.body,
      });
      return;
    }

    if (type !== 'payment') {
      appLogger.info('payment.webhook_ignored_event', { type, paymentId: data.id });
      return;
    }

    const paymentId = data.id;

    const shouldProcess = await registerProcessedPayment(paymentId, {
      source: 'mercadopago-webhook',
      requestId: headers.xRequestId,
    });

    if (!shouldProcess) {
      appLogger.info('payment.webhook_duplicate_ignored', { paymentId });
      return;
    }

    if (!env.MERCADOPAGO_ACCESS_TOKEN) {
      appLogger.error('payment.access_token_missing', { paymentId });
      return;
    }

    try {
      const paymentDetails = await getPaymentDetails(paymentId);

      const orderData = {
        payment_id: paymentId,
        status: paymentDetails.status,
        amount: paymentDetails.transaction_amount,
        currency: paymentDetails.currency_id,
        payer_email: paymentDetails.payer?.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      appLogger.info('payment.webhook_processed', {
        paymentId,
        status: paymentDetails.status,
        processingTimeMs: Date.now() - startTime,
      });

      writeLog({
        event: 'webhook_processed',
        timestamp: new Date().toISOString(),
        payment_id: paymentId,
        status: paymentDetails.status,
        processing_time_ms: Date.now() - startTime,
        orderData,
      });
    } catch (apiError: any) {
      appLogger.error('payment.webhook_mp_lookup_failed', {
        paymentId,
        error: apiError?.message,
      });

      writeLog({
        event: 'webhook_mp_lookup_failed',
        timestamp: new Date().toISOString(),
        payment_id: paymentId,
        error: apiError?.message ?? String(apiError),
      });
    }
  } catch (error: any) {
    appLogger.error('payment.webhook_unhandled_error', {
      error: error?.message,
      stack: error?.stack,
    });

    writeLog({
      event: 'webhook_unhandled_error',
      timestamp: new Date().toISOString(),
      error: error?.message ?? String(error),
    });
  }
};
