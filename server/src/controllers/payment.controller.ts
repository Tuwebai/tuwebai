import { Request, Response } from 'express';
import { env } from '../config/env.config';
import { sendError, sendSuccess, sendSuccessWithMessage } from '../core/contracts/api-response';
import { relayEdgeFunction } from '../infrastructure/supabase/supabase-edge-relay';
import { type PaymentPlan } from '../constants/payment-plans';
import { getPaymentStatusDetails } from '../modules/payments/application/payment-status.service';
import { createUseCaseLogger } from '../core/observability/use-case-logger';
import {
  serializePaymentHealthResult,
  serializePaymentStatusResult,
} from '../modules/payments/presentation/payment.serializers';
import { getErrorMessage } from '../shared/utils/error-message';
import { appLogger } from '../utils/app-logger';

export const handleCreatePreference = async (req: Request, res: Response) => {
  const logger = createUseCaseLogger({
    module: 'payments',
    requestId: res.locals.requestId as string | undefined,
    useCase: 'create_preference',
  });

  try {
    const { plan } = req.body as { plan: PaymentPlan };
    const edgeResult = await relayEdgeFunction<{ init_point?: string; success?: boolean }>('payment-preference', {
      body: { plan },
      requestId: res.locals.requestId as string | undefined,
    });

    if (edgeResult) {
      return res.status(edgeResult.status).json(edgeResult.body);
    }
    return sendError(res, 503, 'La preferencia de pago no esta disponible en este momento.');
  } catch (error: unknown) {
    logger.error('payment.preference_failed', {
      error: getErrorMessage(error, 'unknown_payment_preference_error'),
      route: req.path,
      method: req.method,
    });

    if (getErrorMessage(error, 'unknown_payment_preference_error') === 'Plan invalido') {
      return sendError(res, 400, 'Plan invalido');
    }
    return sendError(res, 500, 'Error al crear preferencia de pago');
  }
};

export const handleWebhookHealth = (_req: Request, res: Response) => {
  return sendSuccess(res, serializePaymentHealthResult());
};

export const handleGetPaymentStatus = async (req: Request, res: Response) => {
  const logger = createUseCaseLogger({
    module: 'payments',
    requestId: res.locals.requestId as string | undefined,
    useCase: 'get_status',
  });

  try {
    const { paymentId } = req.params as { paymentId: string };

    if (!env.MERCADOPAGO_ACCESS_TOKEN) {
      return sendError(res, 503, 'Mercado Pago no configurado');
    }

    const paymentDetails = await getPaymentStatusDetails(paymentId);

    logger.info('payment.status_lookup_succeeded', { paymentId });
    return sendSuccess(res, serializePaymentStatusResult(paymentDetails));
  } catch (error: unknown) {
    logger.warn('payment.status_lookup_failed', {
      paymentId: req.params?.paymentId,
      error: getErrorMessage(error, 'unknown_payment_status_lookup_error'),
    });

    return sendError(res, 404, 'No se pudo obtener el estado del pago');
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  // ACK immediately to avoid retries due to timeout.
  void sendSuccessWithMessage(res, { received: true }, 'Webhook recibido.');

  try {
    const edgeResult = await relayEdgeFunction<{ message?: string; success?: boolean }>('payment-webhook-intake', {
      body: req.body,
      headers: {
        ...(typeof req.headers['x-signature'] === 'string' ? { 'x-signature': req.headers['x-signature'] } : {}),
      },
      requestId: req.headers['x-request-id'] as string | undefined,
    });

    if (edgeResult) {
      return;
    }
    appLogger.warn('payment.webhook.edge_unavailable', {
      route: req.path,
      method: req.method,
    });
  } catch (error: unknown) {
    appLogger.error('payment.webhook_unhandled_error', {
      error: getErrorMessage(error, 'unknown_payment_webhook_error'),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
};
