import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { queueContactEmail } from '../../infrastructure/mail/email.service';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { storeSubmission } from '../../utils/submission-store';

export const handleNewsletter = async (req: Request, res: Response) => {
  try {
    const { email, source } = req.body;
    storeSubmission('newsletter', {
      email,
      source: source || 'website',
      createdAt: new Date().toISOString(),
    });

    queueContactEmail(
      {
        name: 'Newsletter',
        email,
        title: 'Nueva suscripcion a newsletter',
        message: `Email: ${email}\nSource: ${source || 'website'}\nTimestamp: ${new Date().toISOString()}`,
      },
      { event: 'public.newsletter', meta: { route: req.path, method: req.method } }
    );

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
