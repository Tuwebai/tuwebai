import { Request, Response } from 'express';
import { env } from '../config/env.config';
import { sendContactEmail } from '../services/email.service';
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

    try {
      const emailResult = await sendContactEmail({ name, email, title, message });

      return res.json({
        success: true,
        message: 'Mensaje enviado correctamente',
        messageId: emailResult.messageId,
      });
    } catch (mailError: any) {
      appLogger.warn('contact.smtp_failed_fallback', {
        error: mailError?.message,
        route: req.path,
        method: req.method,
      });
      return res.status(202).json({
        success: true,
        message: 'Mensaje recibido. Procesaremos el envio en breve.',
      });
    }
  } catch (error: any) {
    appLogger.error('contact.submit_failed', { error: error?.message, route: req.path, method: req.method });
    const status = error?.message?.includes('SMTP no configurado') ? 503 : 500;
    return res.status(status).json({
      success: false,
      message: 'No se pudo enviar el mensaje en este momento.',
      details: env.NODE_ENV === 'development' ? error?.message : undefined,
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

    try {
      const emailResult = await sendContactEmail({ name, email, title, message });

      return res.json({
        success: true,
        message: 'Consulta enviada correctamente',
        messageId: emailResult.messageId,
      });
    } catch (mailError: any) {
      appLogger.warn('consulta.smtp_failed_fallback', {
        error: mailError?.message,
        route: req.path,
        method: req.method,
      });
      return res.status(202).json({
        success: true,
        message: 'Consulta recibida. Procesaremos el envio en breve.',
      });
    }
  } catch (error: any) {
    appLogger.error('consultation.submit_failed', { error: error?.message, route: req.path, method: req.method });
    const status = error?.message?.includes('SMTP no configurado') ? 503 : 500;
    return res.status(status).json({
      success: false,
      message: 'No se pudo enviar la consulta en este momento.',
      details: env.NODE_ENV === 'development' ? error?.message : undefined,
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
  } catch (error: any) {
    appLogger.error('contact.test_email_failed', { error: error?.message, route: '/test-email', method: 'POST' });
    return res.status(500).json({
      success: false,
      message: 'Error enviando email de prueba',
      details: env.NODE_ENV === 'development' ? error?.message : undefined,
      timestamp: new Date().toISOString(),
    });
  }
};
