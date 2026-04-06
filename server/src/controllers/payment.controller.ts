import { Request, Response } from 'express';
import { env } from '../config/env.config';
import { type PaymentPlan } from '../constants/payment-plans';
import {
  buildPaymentWebhookHeaders,
  processMercadoPagoWebhook,
} from '../modules/payments/application/payment-webhook.service';
import { createPaymentPreferenceForPlan } from '../modules/payments/application/payment-preference.service';
import { getPaymentStatusDetails } from '../modules/payments/application/payment-status.service';
import {
  sendError,
  sendSuccess,
  sendSuccessWithMessage,
} from '../core/contracts/api-response';
import { createUseCaseLogger } from '../core/observability/use-case-logger';
import {
  serializePaymentHealthResult,
  serializePaymentPreferenceResult,
  serializePaymentStatusResult,
} from '../modules/payments/presentation/payment.serializers';
import { getErrorMessage } from '../shared/utils/error-message';
import { writeLog } from '../utils/logger';
import { appLogger } from '../utils/app-logger';

export const handleCreatePreference = async (req: Request, res: Response) => {
  const logger = createUseCaseLogger({
    module: 'payments',
    requestId: res.locals.requestId as string | undefined,
    useCase: 'create_preference',
  });

  try {
    const { plan } = req.body as { plan: PaymentPlan };

    const mpRes = await createPaymentPreferenceForPlan(plan);
    logger.info('payment.preference_created', { plan });
    return sendSuccess(res, serializePaymentPreferenceResult(mpRes.init_point ?? ''));
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
  const startTime = Date.now();

  // ACK immediately to avoid retries due to timeout.
  void sendSuccessWithMessage(res, { received: true }, 'Webhook recibido.');

  try {
    const headers = buildPaymentWebhookHeaders(req);

    await processMercadoPagoWebhook({
      body: req.body,
      headers,
      ip: req.ip,
      logWriter: {
        audit: (payload) => writeLog(payload),
        elapsedMs: () => Date.now() - startTime,
        error: (event, payload) => appLogger.error(event, payload),
        info: (event, payload) => appLogger.info(event, payload),
        warn: (event, payload) => appLogger.warn(event, payload),
      },
      path: req.path,
      method: req.method,
    });
  } catch (error: unknown) {
    appLogger.error('payment.webhook_unhandled_error', {
      error: getErrorMessage(error, 'unknown_payment_webhook_error'),
      stack: error instanceof Error ? error.stack : undefined,
    });

    writeLog({
      event: 'webhook_unhandled_error',
      timestamp: new Date().toISOString(),
      error: getErrorMessage(error, 'unknown_payment_webhook_error'),
    });
  }
};
