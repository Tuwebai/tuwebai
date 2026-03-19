import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { queueContactEmail, queueNewsletterConfirmationEmail } from '../../infrastructure/mail/email.service';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { confirmNewsletterSubscription, registerNewsletterSubscription } from './service';

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
      queueNewsletterConfirmationEmail(
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

export const handleNewsletterConfirm = async (req: Request, res: Response) => {
  try {
    const result = await confirmNewsletterSubscription(req.params.token);

    if (result.success) {
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
