import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { queueContactEmail } from '../../infrastructure/mail/email.service';
import { appLogger } from '../../utils/app-logger';
import { storeSubmission } from '../../utils/submission-store';

export { handleContact, handleConsulta, handleTestEmail } from '../../controllers/contact.controller';

export const handlePropuesta = async (req: Request, res: Response) => {
  try {
    const { nombre, email, tipo_proyecto, servicios, presupuesto, plazo, detalles } = req.body;
    storeSubmission('propuesta', {
      nombre,
      email,
      tipo_proyecto,
      servicios,
      presupuesto,
      plazo,
      detalles,
      createdAt: new Date().toISOString(),
      source: 'website',
    });

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

    queueContactEmail(
      {
        name: nombre,
        email,
        title: 'Nueva solicitud de propuesta',
        message,
      },
      { event: 'public.propuesta', meta: { route: req.path, method: req.method } }
    );

    return res.status(202).json({
      success: true,
      message: 'Solicitud recibida. Procesaremos tu propuesta en breve.',
    });
  } catch (error: any) {
    appLogger.error('public.propuesta_failed', {
      error: error?.message,
      route: req.path,
      method: req.method,
    });

    return res.status(500).json({
      success: false,
      message: 'No se pudo procesar la solicitud en este momento.',
      details: env.NODE_ENV === 'development' ? error?.message : undefined,
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

    storeSubmission('applications', payload);
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
  } catch (error: any) {
    appLogger.error('public.application_submission_failed', {
      error: error?.message,
      route: req.path,
      method: req.method,
    });

    return res.status(500).json({
      success: false,
      message: 'No se pudo registrar la aplicacion.',
      details: env.NODE_ENV === 'development' ? error?.message : undefined,
    });
  }
};
