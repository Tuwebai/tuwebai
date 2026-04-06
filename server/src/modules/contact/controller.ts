import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { queueContactEmail } from '../../infrastructure/mail/email.service';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { dispatchPublicSubmission, handlePublicSubmissionError } from './submission-ops';
import { storePublicSubmission } from './submission-store.service';

export { handleContact, handleConsulta, handleTestEmail } from '../../controllers/contact.controller';

export const handlePropuesta = async (req: Request, res: Response) => {
  try {
    const { nombre, email, tipo_proyecto, servicios, presupuesto, plazo, detalles } = req.body;
    const message = [
      'Nueva solicitud de propuesta',
      `Nombre: ${nombre}`,
      `Email: ${email}`,
      `Tipo de proyecto: ${tipo_proyecto}`,
      `Servicios: ${servicios || 'No especificado'}`,
      `Presupuesto: ${presupuesto || 'No especificado'}`,
      `Plazo: ${plazo || 'No especificado'}`,
      '',
      'Detalles:',
      detalles,
    ].join('\n');

    return await dispatchPublicSubmission(res, {
      req,
      channel: 'propuesta',
      event: 'public.propuesta',
      storePayload: {
        name: nombre,
        email,
        nombre,
        tipo_proyecto,
        servicios,
        presupuesto,
        plazo,
        detalles,
      },
      emailPayload: {
        name: nombre,
        email,
        title: 'Nueva solicitud de propuesta',
        message,
      },
      successMessage: 'Solicitud recibida. Procesaremos tu propuesta en breve.',
    });
  } catch (error: unknown) {
    return handlePublicSubmissionError(res, {
      req,
      error,
      logEvent: 'public.propuesta_failed',
      fallbackError: 'unknown_propuesta_error',
      userMessage: 'No se pudo procesar la solicitud en este momento.',
    });
  }
};

export const handleApplicationSubmission = async (req: Request, res: Response) => {
  try {
    const payload = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      experience: req.body.experience || '',
      portfolio: req.body.portfolio || '',
      message: req.body.message || '',
      position: req.body.position,
      department: req.body.department,
      type: req.body.type,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      source: 'website',
    };

    await storePublicSubmission({
      channel: 'applications',
      name: payload.name,
      email: payload.email,
      title: `Aplicacion: ${payload.position}`,
      message: payload.message || '',
      source: payload.source,
      payload,
    });
    queueContactEmail(
      {
        name: payload.name,
        email: payload.email,
        title: `Nueva aplicacion: ${payload.position}`,
        message: [
          `Posicion: ${payload.position}`,
          `Departamento: ${payload.department}`,
          `Tipo: ${payload.type}`,
          `Nombre: ${payload.name}`,
          `Email: ${payload.email}`,
          `Telefono: ${payload.phone || 'No provisto'}`,
          `Experiencia: ${payload.experience || 'No provista'}`,
          `Portfolio: ${payload.portfolio || 'No provisto'}`,
          '',
          `Mensaje: ${payload.message || 'Sin mensaje adicional'}`,
        ].join('\n'),
      },
      { event: 'public.application', meta: { route: req.path, method: req.method } }
    );

    return res.status(201).json({
      success: true,
      message: 'Aplicacion recibida y pendiente de revision.',
    });
  } catch (error: unknown) {
    appLogger.error('public.application_submission_failed', {
      error: getErrorMessage(error, 'unknown_application_submission_error'),
      route: req.path,
      method: req.method,
    });

    return res.status(500).json({
      success: false,
      message: 'No se pudo registrar la aplicacion.',
      details: env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_application_submission_error') : undefined,
    });
  }
};
