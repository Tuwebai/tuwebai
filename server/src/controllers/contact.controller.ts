import { Request, Response } from 'express';
import { sendError } from '../core/contracts/api-response';
import { relayEdgeFunction } from '../infrastructure/supabase/supabase-edge-relay';
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
    return sendError(res, 503, 'El servicio de contacto no esta disponible en este momento.');
  } catch (error: unknown) {
    appLogger.error('contact.submit_failed', {
      error: getErrorMessage(error, 'unknown_contact_submit_error'),
      route: req.path,
      method: req.method,
    });
    return sendError(res, 500, 'No se pudo enviar el mensaje en este momento.');
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
    return sendError(res, 503, 'El servicio de consulta no esta disponible en este momento.');
  } catch (error: unknown) {
    appLogger.error('consultation.submit_failed', {
      error: getErrorMessage(error, 'unknown_consultation_submit_error'),
      route: req.path,
      method: req.method,
    });
    return sendError(res, 500, 'No se pudo enviar la consulta en este momento.');
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
