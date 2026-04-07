import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { relayEdgeFunction } from '../../infrastructure/supabase/supabase-edge-relay';
import {
  sendError,
  sendSuccessWithMessage,
} from '../../core/contracts/api-response';
import { createUseCaseLogger } from '../../core/observability/use-case-logger';
import {
  queueContactEmail,
  queueChecklistWebGratisEmail,
  sendNewsletterConfirmationEmail,
  sendNewsletterUnsubscribeEmail,
  sendNewsletterWelcomeEmail,
} from '../../infrastructure/mail/email.service';
import { getErrorMessage } from '../../shared/utils/error-message';
import {
  confirmNewsletterSubscription,
  applyNewsletterProviderEvent,
  reconcileNewsletterBrevoSync,
  registerNewsletterSubscription,
  unsubscribeNewsletterSubscription,
} from './service';
import { relayBrevoWebhookToEdge } from './brevo-webhook-edge.service';
import {
  serializeNewsletterActionResult,
  serializeNewsletterReconcileResult,
  serializeNewsletterSubscriptionResult,
  serializeNewsletterWebhookResult,
} from './presentation/newsletter.serializers';

const resolveIpAddress = (req: Request): string | null => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0]?.trim() || null;
  }

  if (Array.isArray(forwardedFor) && forwardedFor[0]) {
    return forwardedFor[0];
  }

  return req.ip || null;
};

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

    const result = await registerNewsletterSubscription({
      email,
      source: source || 'website',
      ipAddress: resolveIpAddress(req),
      userAgent: req.get('user-agent') || null,
    });
    const frontendBaseUrl = env.FRONTEND_URL.replace(/\/+$/, '');

    if (result.confirmationToken && result.subscriber.status === 'pending_confirmation') {
      await sendNewsletterConfirmationEmail(
        result.subscriber.email,
        `${frontendBaseUrl}/newsletter/confirm/${encodeURIComponent(result.confirmationToken)}`,
        {
          event: 'public.newsletter_confirmation',
          meta: {
            route: req.path,
            method: req.method,
            persistedIn: result.persistedIn,
            isExistingSubscriber: result.isExistingSubscriber,
          },
        },
      );
    }

    if (!result.isExistingSubscriber) {
      queueContactEmail(
        {
          name: 'Newsletter',
          email,
          title: 'Nueva suscripcion a newsletter',
          message: `Email: ${result.subscriber.email}\nSource: ${result.subscriber.lastSource}\nTimestamp: ${result.subscriber.createdAt}\nPersistencia: ${result.persistedIn}`,
        },
        { event: 'public.newsletter', meta: { route: req.path, method: req.method } }
      );
    }

    logger.info('newsletter.subscription_registered', {
      email,
      isExistingSubscriber: result.isExistingSubscriber,
      persistedIn: result.persistedIn,
    });

    return sendSuccessWithMessage(
      res,
      serializeNewsletterSubscriptionResult(result),
      'Suscripcion registrada. Procesaremos la confirmacion en breve.',
      202,
    );
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
    const { name, email, source } = req.body;

    queueChecklistWebGratisEmail(name, email, {
      event: 'public.checklist_web_gratis',
      meta: { route: req.path, method: req.method, source: source || 'website' },
    });

    queueContactEmail(
      {
        name,
        email,
        title: 'Nueva solicitud de checklist web gratis',
        message: `Nombre: ${name}\nEmail: ${email}\nSource: ${source || 'website'}`,
      },
      {
        event: 'public.checklist_web_gratis_lead',
        meta: { route: req.path, method: req.method, source: source || 'website' },
      },
    );

    logger.info('newsletter.checklist_request_accepted', {
      email,
      source: source || 'website',
    });

    return sendSuccessWithMessage(
      res,
      {
        email,
        source: source || 'website',
      },
      'Solicitud recibida. Te enviamos el checklist por email.',
      202,
    );
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

    const result = await confirmNewsletterSubscription(req.params.token);

    if (result.success) {
      if (result.justConfirmed && result.subscriber?.email) {
        await sendNewsletterWelcomeEmail(result.subscriber.email, {
          event: 'public.newsletter_welcome',
          meta: { route: req.path, method: req.method },
        });
      }

      logger.info('newsletter.confirmation_processed', {
        justConfirmed: result.justConfirmed,
        tokenProvided: true,
      });

      return sendSuccessWithMessage(
        res,
        serializeNewsletterActionResult(result),
        result.message,
      );
    }

    const isAvailabilityError = result.message.includes('en este momento');

    logger.warn('newsletter.confirmation_rejected', {
      isAvailabilityError,
      tokenProvided: true,
    });

    return sendError(res, isAvailabilityError ? 503 : 400, result.message);
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

    const result = await unsubscribeNewsletterSubscription(req.params.token);
    const frontendBaseUrl = env.FRONTEND_URL.replace(/\/+$/, '');

    if (result.success) {
      if (result.subscriber?.email) {
        await sendNewsletterUnsubscribeEmail(
          result.subscriber.email,
          `${frontendBaseUrl}/newsletter/unsubscribe/${encodeURIComponent(req.params.token)}`,
          {
            event: 'public.newsletter_unsubscribe',
            meta: { route: req.path, method: req.method },
          },
        );
      }

      logger.info('newsletter.unsubscribe_processed', {
        tokenProvided: true,
      });

      return sendSuccessWithMessage(
        res,
        serializeNewsletterActionResult(result),
        result.message,
      );
    }

    const isAvailabilityError = result.message.includes('en este momento');

    logger.warn('newsletter.unsubscribe_rejected', {
      isAvailabilityError,
      tokenProvided: true,
    });

    return sendError(res, isAvailabilityError ? 503 : 400, result.message);
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
