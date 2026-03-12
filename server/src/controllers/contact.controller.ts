import { Request, Response } from 'express';
import { env } from '../config/env.config';
import { getErrorMessage } from '../shared/utils/error-message';
import { queueContactEmail, sendContactEmail } from '../services/email.service';
import { appLogger } from '../utils/app-logger';
import { storeSubmission } from '../utils/submission-store';

export const handleContact = async (req: Request, res: Response) => {
  try {
    const { name, email, title, message } = req.body;
    storeSubmission('contact', {
      name,
      email,
      title,
      message,
      createdAt: new Date().toISOString(),
      source: 'website',
    });

    queueContactEmail(
      { name, email, title, message },
      { event: 'contact', meta: { route: req.path, method: req.method } }
    );

    return res.status(202).json({
      success: true,
      message: 'Mensaje recibido. Procesaremos el envio en breve.',
    });
  } catch (error: unknown) {
    appLogger.error('contact.submit_failed', {
      error: getErrorMessage(error, 'unknown_contact_submit_error'),
      route: req.path,
      method: req.method,
    });
    return res.status(500).json({
      success: false,
      message: 'No se pudo enviar el mensaje en este momento.',
      details: env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_contact_submit_error') : undefined,
    });
  }
};

export const handleConsulta = async (req: Request, res: Response) => {
  try {
    const { name, email, title, message } = req.body;
    storeSubmission('consulta', {
      name,
      email,
      title,
      message,
      createdAt: new Date().toISOString(),
      source: 'website',
    });

    queueContactEmail(
      { name, email, title, message },
      { event: 'consulta', meta: { route: req.path, method: req.method } }
    );

    return res.status(202).json({
      success: true,
      message: 'Consulta recibida. Procesaremos el envio en breve.',
    });
  } catch (error: unknown) {
    appLogger.error('consultation.submit_failed', {
      error: getErrorMessage(error, 'unknown_consultation_submit_error'),
      route: req.path,
      method: req.method,
    });
    return res.status(500).json({
      success: false,
      message: 'No se pudo enviar la consulta en este momento.',
      details: env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_consultation_submit_error') : undefined,
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
      details: env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_test_email_error') : undefined,
      timestamp: new Date().toISOString(),
    });
  }
};
