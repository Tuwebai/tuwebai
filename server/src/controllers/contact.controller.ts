import { Request, Response } from 'express';
import { relayEdgeFunction } from '../infrastructure/supabase/supabase-edge-relay';
import { dispatchPublicSubmission, handlePublicSubmissionError } from '../modules/contact/submission-ops';
import { getErrorMessage } from '../shared/utils/error-message';
import { sendContactEmail } from '../services/email.service';
import { appLogger } from '../utils/app-logger';

export const handleContact = async (req: Request, res: Response) => {
  try {
    const { name, email, title, message } = req.body;
    const edgeResult = await relayEdgeFunction<{ message?: string; success?: boolean }>('contact-intake', {
      body: { name, email, title, message },
      requestId: res.locals.requestId as string | undefined,
    });

    if (edgeResult) {
      return res.status(edgeResult.status).json(edgeResult.body);
    }

    return await dispatchPublicSubmission(res, {
      req,
      channel: 'contact',
      event: 'contact',
      storePayload: {
        name,
        email,
        title,
        message,
      },
      emailPayload: { name, email, title, message },
      successMessage: 'Mensaje recibido. Procesaremos el envio en breve.',
    });
  } catch (error: unknown) {
    return handlePublicSubmissionError(res, {
      req,
      error,
      logEvent: 'contact.submit_failed',
      fallbackError: 'unknown_contact_submit_error',
      userMessage: 'No se pudo enviar el mensaje en este momento.',
    });
  }
};

export const handleConsulta = async (req: Request, res: Response) => {
  try {
    const { name, email, title, message } = req.body;
    const edgeResult = await relayEdgeFunction<{ message?: string; success?: boolean }>('contact-intake', {
      body: { name, email, title, message },
      requestId: res.locals.requestId as string | undefined,
    });

    if (edgeResult) {
      return res.status(edgeResult.status).json(edgeResult.body);
    }

    return await dispatchPublicSubmission(res, {
      req,
      channel: 'consulta',
      event: 'consulta',
      storePayload: {
        name,
        email,
        title,
        message,
      },
      emailPayload: { name, email, title, message },
      successMessage: 'Consulta recibida. Procesaremos el envio en breve.',
    });
  } catch (error: unknown) {
    return handlePublicSubmissionError(res, {
      req,
      error,
      logEvent: 'consultation.submit_failed',
      fallbackError: 'unknown_consultation_submit_error',
      userMessage: 'No se pudo enviar la consulta en este momento.',
    });
  }
};

export const handleTestEmail = async (_req: Request, res: Response) => {
  try {
    const testResult = await sendContactEmail({
      name: 'Sistema de Prueba',
      email: 'test@tuweb-ai.com',
      message: 'Test SMTP y plantilla.',
      type: 'test',
    });

    return res.json({
      success: true,
      message: 'Email de prueba enviado correctamente',
      messageId: testResult.messageId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    appLogger.error('contact.test_email_failed', {
      error: getErrorMessage(error, 'unknown_test_email_error'),
      route: '/test-email',
      method: 'POST',
    });
    return res.status(500).json({
      success: false,
      message: 'Error enviando email de prueba',
      details: process.env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_test_email_error') : undefined,
      timestamp: new Date().toISOString(),
    });
  }
};
