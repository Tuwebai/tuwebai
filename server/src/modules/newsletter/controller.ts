import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import {
  queueContactEmail,
  queueChecklistWebGratisEmail,
  sendNewsletterConfirmationEmail,
  sendNewsletterUnsubscribeEmail,
  sendNewsletterWelcomeEmail,
} from '../../infrastructure/mail/email.service';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import {
  confirmNewsletterSubscription,
  applyNewsletterProviderEvent,
  reconcileNewsletterBrevoSync,
  registerNewsletterSubscription,
  unsubscribeNewsletterSubscription,
} from './service';
import { relayBrevoWebhookToEdge } from './brevo-webhook-edge.service';

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
  try {
    const { email, source } = req.body;
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

    return res.status(202).json({
      success: true,
      message: 'Suscripcion registrada. Procesaremos la confirmacion en breve.',
    });
  } catch (error: unknown) {
    appLogger.error('public.newsletter_failed', {
      error: getErrorMessage(error, 'unknown_newsletter_error'),
      route: req.path,
      method: req.method,
    });

    return res.status(500).json({
      success: false,
      message: 'No se pudo procesar la suscripcion en este momento.',
      details: env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_newsletter_error') : undefined,
    });
  }
};

export const handleChecklistWebGratisDownload = async (req: Request, res: Response) => {
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

    return res.status(202).json({
      success: true,
      message: 'Solicitud recibida. Te enviamos el checklist por email.',
    });
  } catch (error: unknown) {
    appLogger.error('public.checklist_web_gratis_failed', {
      error: getErrorMessage(error, 'unknown_checklist_web_gratis_error'),
      route: req.path,
      method: req.method,
    });

    return res.status(500).json({
      success: false,
      message: 'No se pudo enviar el checklist en este momento.',
      details:
        env.NODE_ENV === 'development'
          ? getErrorMessage(error, 'unknown_checklist_web_gratis_error')
          : undefined,
    });
  }
};

export const handleNewsletterConfirm = async (req: Request, res: Response) => {
  try {
    const result = await confirmNewsletterSubscription(req.params.token);

    if (result.success) {
      if (result.justConfirmed && result.subscriber?.email) {
        await sendNewsletterWelcomeEmail(result.subscriber.email, {
          event: 'public.newsletter_welcome',
          meta: { route: req.path, method: req.method },
        });
      }

      return res.status(200).json(result);
    }

    const isAvailabilityError = result.message.includes('en este momento');

    return res.status(isAvailabilityError ? 503 : 400).json(result);
  } catch (error: unknown) {
    appLogger.error('public.newsletter_confirm_failed', {
      error: getErrorMessage(error, 'unknown_newsletter_confirm_error'),
      route: req.path,
      method: req.method,
    });

    return res.status(500).json({
      success: false,
      message: 'No se pudo confirmar la suscripcion en este momento.',
      details: env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_newsletter_confirm_error') : undefined,
    });
  }
};

export const handleNewsletterUnsubscribe = async (req: Request, res: Response) => {
  try {
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

      return res.status(200).json(result);
    }

    const isAvailabilityError = result.message.includes('en este momento');

    return res.status(isAvailabilityError ? 503 : 400).json(result);
  } catch (error: unknown) {
    appLogger.error('public.newsletter_unsubscribe_failed', {
      error: getErrorMessage(error, 'unknown_newsletter_unsubscribe_error'),
      route: req.path,
      method: req.method,
    });

    return res.status(500).json({
      success: false,
      message: 'No se pudo procesar la baja en este momento.',
      details:
        env.NODE_ENV === 'development'
          ? getErrorMessage(error, 'unknown_newsletter_unsubscribe_error')
          : undefined,
    });
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
  try {
    const configuredToken = env.BREVO_WEBHOOK_TOKEN?.trim();
    const providedToken = typeof req.query.token === 'string' ? req.query.token.trim() : '';

    if (configuredToken && configuredToken !== providedToken) {
      appLogger.warn('newsletter.brevo_webhook.unauthorized', {
        route: req.path,
        method: req.method,
      });
      return res.status(401).json({ success: false, message: 'Webhook no autorizado.' });
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
      return res.status(202).json({ success: true, message: 'Evento ignorado.' });
    }

    const result = await applyNewsletterProviderEvent(req.body.email, mappedEvent);

    if (result.success) {
      return res.status(200).json(result);
    }

    const notFound = result.message.includes('No encontramos');
    return res.status(notFound ? 404 : 503).json(result);
  } catch (error: unknown) {
    appLogger.error('newsletter.brevo_webhook.failed', {
      error: getErrorMessage(error, 'unknown_brevo_webhook_error'),
      route: req.path,
      method: req.method,
    });

    return res.status(500).json({
      success: false,
      message: 'No se pudo procesar el webhook de Brevo.',
      details: env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_brevo_webhook_error') : undefined,
    });
  }
};

export const handleNewsletterBrevoReconcile = async (req: Request, res: Response) => {
  try {
    const result = await reconcileNewsletterBrevoSync(req.body.limit);
    return res.status(result.success ? 200 : 503).json(result);
  } catch (error: unknown) {
    appLogger.error('newsletter.brevo_reconcile.failed', {
      error: getErrorMessage(error, 'unknown_brevo_reconcile_error'),
      route: req.path,
      method: req.method,
    });

    return res.status(500).json({
      success: false,
      message: 'No se pudo reconciliar newsletter con Brevo.',
      details: env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_brevo_reconcile_error') : undefined,
    });
  }
};
