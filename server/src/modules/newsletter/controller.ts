import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { relayEdgeFunction } from '../../infrastructure/supabase/supabase-edge-relay';
import {
  sendError,
  sendSuccessWithMessage,
} from '../../core/contracts/api-response';
import { createUseCaseLogger } from '../../core/observability/use-case-logger';
import { getErrorMessage } from '../../shared/utils/error-message';
import {
  applyNewsletterProviderEvent,
  reconcileNewsletterBrevoSync,
} from './service';
import { relayBrevoWebhookToEdge } from './brevo-webhook-edge.service';
import {
  serializeNewsletterReconcileResult,
  serializeNewsletterWebhookResult,
} from './presentation/newsletter.serializers';

export const handleNewsletter = async (req: Request, res: Response) => {
  const logger = createUseCaseLogger({
    module: 'newsletter',
    requestId: res.locals.requestId as string | undefined,
    useCase: 'register_subscription',
  });

  try {
    const { email, source } = req.body;
    const edgeResult = await relayEdgeFunction<{ message?: string; success?: boolean }>('newsletter-subscribe', {
      body: { email, source: source || 'website' },
      requestId: res.locals.requestId as string | undefined,
    });

    if (edgeResult) {
      return res.status(edgeResult.status).json(edgeResult.body);
    }
    return sendError(res, 503, 'El newsletter no esta disponible en este momento.');
  } catch (error: unknown) {
    logger.error('public.newsletter_failed', {
      error: getErrorMessage(error, 'unknown_newsletter_error'),
      route: req.path,
      method: req.method,
    });

    return sendError(
      res,
      500,
      'No se pudo procesar la suscripcion en este momento.',
      env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_newsletter_error') : undefined,
    );
  }
};

export const handleChecklistWebGratisDownload = async (req: Request, res: Response) => {
  const logger = createUseCaseLogger({
    module: 'newsletter',
    requestId: res.locals.requestId as string | undefined,
    useCase: 'checklist_download_request',
  });

  try {
    const { name, email, lastWebsiteRefresh, source } = req.body;
    const edgeResult = await relayEdgeFunction<{ message?: string; success?: boolean }>('checklist-intake', {
      body: { name, email, lastWebsiteRefresh, source: source || 'website' },
      requestId: res.locals.requestId as string | undefined,
    });

    if (edgeResult) {
      return res.status(edgeResult.status).json(edgeResult.body);
    }

    return sendError(res, 503, 'El checklist no esta disponible en este momento.');
  } catch (error: unknown) {
    logger.error('public.checklist_web_gratis_failed', {
      error: getErrorMessage(error, 'unknown_checklist_web_gratis_error'),
      route: req.path,
      method: req.method,
    });

    return sendError(
      res,
      500,
      'No se pudo enviar el checklist en este momento.',
      env.NODE_ENV === 'development'
        ? getErrorMessage(error, 'unknown_checklist_web_gratis_error')
        : undefined,
    );
  }
};

export const handleNewsletterConfirm = async (req: Request, res: Response) => {
  const logger = createUseCaseLogger({
    module: 'newsletter',
    requestId: res.locals.requestId as string | undefined,
    useCase: 'confirm_subscription',
  });

  try {
    const edgeResult = await relayEdgeFunction<{
      justConfirmed?: boolean;
      message: string;
      success: boolean;
      unsubscribeToken?: string | null;
    }>('newsletter-confirm', {
      body: { token: req.params.token },
      requestId: res.locals.requestId as string | undefined,
    });

    if (edgeResult) {
      return res.status(edgeResult.status).json(edgeResult.body);
    }
    return sendError(res, 503, 'La confirmacion de newsletter no esta disponible en este momento.');
  } catch (error: unknown) {
    logger.error('public.newsletter_confirm_failed', {
      error: getErrorMessage(error, 'unknown_newsletter_confirm_error'),
      route: req.path,
      method: req.method,
    });

    return sendError(
      res,
      500,
      'No se pudo confirmar la suscripcion en este momento.',
      env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_newsletter_confirm_error') : undefined,
    );
  }
};

export const handleNewsletterUnsubscribe = async (req: Request, res: Response) => {
  const logger = createUseCaseLogger({
    module: 'newsletter',
    requestId: res.locals.requestId as string | undefined,
    useCase: 'unsubscribe_subscription',
  });

  try {
    const edgeResult = await relayEdgeFunction<{ message: string; success: boolean }>('newsletter-unsubscribe', {
      body: { token: req.params.token },
      requestId: res.locals.requestId as string | undefined,
    });

    if (edgeResult) {
      return res.status(edgeResult.status).json(edgeResult.body);
    }
    return sendError(res, 503, 'La baja de newsletter no esta disponible en este momento.');
  } catch (error: unknown) {
    logger.error('public.newsletter_unsubscribe_failed', {
      error: getErrorMessage(error, 'unknown_newsletter_unsubscribe_error'),
      route: req.path,
      method: req.method,
    });

    return sendError(
      res,
      500,
      'No se pudo procesar la baja en este momento.',
      env.NODE_ENV === 'development'
        ? getErrorMessage(error, 'unknown_newsletter_unsubscribe_error')
        : undefined,
    );
  }
};

const mapBrevoEvent = (event: string): 'hard_bounce' | 'soft_bounce' | 'complaint' | 'unsubscribe' | null => {
  const normalized = event.trim().toLowerCase();

  if (normalized.includes('hard') && normalized.includes('bounce')) return 'hard_bounce';
  if (normalized.includes('soft') && normalized.includes('bounce')) return 'soft_bounce';
  if (normalized.includes('spam') || normalized.includes('complaint')) return 'complaint';
  if (normalized.includes('unsubscribe')) return 'unsubscribe';

  return null;
};

export const handleBrevoWebhook = async (req: Request, res: Response) => {
  const logger = createUseCaseLogger({
    module: 'newsletter',
    requestId: res.locals.requestId as string | undefined,
    useCase: 'brevo_webhook',
  });

  try {
    const configuredToken = env.BREVO_WEBHOOK_TOKEN?.trim();
    const providedToken = typeof req.query.token === 'string' ? req.query.token.trim() : '';

    if (configuredToken && configuredToken !== providedToken) {
      logger.warn('newsletter.brevo_webhook.unauthorized', {
        route: req.path,
        method: req.method,
      });
      return sendError(res, 401, 'Webhook no autorizado.');
    }

    const edgeResult = await relayBrevoWebhookToEdge(req.body, {
      requestId: res.locals.requestId,
      webhookToken: providedToken,
    });

    if (edgeResult) {
      return res.status(edgeResult.status).json(edgeResult.body);
    }

    const mappedEvent = mapBrevoEvent(req.body.event);
    if (!mappedEvent) {
      logger.info('newsletter.brevo_webhook_ignored', {
        rawEvent: req.body?.event,
      });
      return sendSuccessWithMessage(res, { ignored: true }, 'Evento ignorado.', 202);
    }

    const result = await applyNewsletterProviderEvent(req.body.email, mappedEvent);

    if (result.success) {
      logger.info('newsletter.brevo_webhook_applied', {
        mappedEvent,
      });
      return sendSuccessWithMessage(
        res,
        serializeNewsletterWebhookResult(result),
        result.message,
      );
    }

    const notFound = result.message.includes('No encontramos');
    logger.warn('newsletter.brevo_webhook_rejected', {
      mappedEvent,
      notFound,
    });
    return sendError(res, notFound ? 404 : 503, result.message);
  } catch (error: unknown) {
    logger.error('newsletter.brevo_webhook.failed', {
      error: getErrorMessage(error, 'unknown_brevo_webhook_error'),
      route: req.path,
      method: req.method,
    });

    return sendError(
      res,
      500,
      'No se pudo procesar el webhook de Brevo.',
      env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_brevo_webhook_error') : undefined,
    );
  }
};

export const handleNewsletterBrevoReconcile = async (req: Request, res: Response) => {
  const logger = createUseCaseLogger({
    module: 'newsletter',
    requestId: res.locals.requestId as string | undefined,
    useCase: 'brevo_reconcile',
  });

  try {
    const result = await reconcileNewsletterBrevoSync(req.body.limit);
    if (result.success) {
      logger.info('newsletter.brevo_reconcile_scheduled', {
        scanned: result.scanned,
        scheduled: result.scheduled,
      });
      return sendSuccessWithMessage(
        res,
        serializeNewsletterReconcileResult(result),
        result.message,
      );
    }

    logger.warn('newsletter.brevo_reconcile_rejected', {
      scanned: result.scanned,
      scheduled: result.scheduled,
    });
    return sendError(res, 503, result.message);
  } catch (error: unknown) {
    logger.error('newsletter.brevo_reconcile.failed', {
      error: getErrorMessage(error, 'unknown_brevo_reconcile_error'),
      route: req.path,
      method: req.method,
    });

    return sendError(
      res,
      500,
      'No se pudo reconciliar newsletter con Brevo.',
      env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_brevo_reconcile_error') : undefined,
    );
  }
};
