import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { queueContactEmail } from '../../infrastructure/mail/email.service';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';
import {
  createTestimonialRecord,
  getTestimonialById as getTestimonialRecordById,
  getTestimonials,
  softDeleteTestimonial,
  updateTestimonial,
} from './supabase.repository';

export const handleTestimonialSubmission = async (req: Request, res: Response) => {
  try {
    const payload = {
      name: req.body.name,
      company: req.body.company || 'Cliente',
      testimonial: req.body.testimonial,
      status: 'pending_review',
      source: 'website',
      isApproved: false,
      isNew: true,
    };

    const created = await createTestimonialRecord(payload);
    queueContactEmail(
      {
        name: payload.name,
        email: 'no-reply@tuweb-ai.com',
        title: 'Nuevo testimonio pendiente de revision',
        message: `Nombre: ${payload.name}\nEmpresa: ${payload.company}\nEstado: ${payload.status}\n\n${payload.testimonial}`,
      },
      { event: 'public.testimonial', meta: { route: req.path, method: req.method } }
    );

    return res.status(201).json({
      success: true,
      id: created.id,
      message: 'Testimonio recibido y pendiente de revision.',
    });
  } catch (error: unknown) {
    appLogger.error('public.testimonial_submission_failed', {
      error: getErrorMessage(error, 'unknown_testimonial_submission_error'),
      route: req.path,
      method: req.method,
    });

    return res.status(500).json({
      success: false,
      message: 'No se pudo registrar el testimonio.',
      details: env.NODE_ENV === 'development' ? getErrorMessage(error, 'unknown_testimonial_submission_error') : undefined,
    });
  }
};

export const handleGetTestimonials = async (req: Request, res: Response) => {
  try {
    const limit = resolveOptionalLimit(req.query?.limit);
    const data = await getTestimonials(limit ?? undefined);
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_testimonials_failed', {
      error: getErrorMessage(error, 'unknown_get_testimonials_error'),
    });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener testimonios' });
  }
};

export const handleGetTestimonialById = async (req: Request, res: Response) => {
  try {
    const { testimonialId } = req.params;
    const data = await getTestimonialRecordById(testimonialId);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Testimonio no encontrado' });
    }
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_testimonial_by_id_failed', {
      error: getErrorMessage(error, 'unknown_get_testimonial_by_id_error'),
      testimonialId: req.params?.testimonialId,
    });
    return res.status(500).json({ success: false, message: 'No se pudo obtener el testimonio' });
  }
};

export const handleUpdateTestimonial = async (req: Request, res: Response) => {
  try {
    const { testimonialId } = req.params;
    const payload = (req.body ?? {}) as Record<string, unknown>;
    await updateTestimonial(testimonialId, {
      name: typeof payload.name === 'string' ? payload.name : undefined,
      company: typeof payload.company === 'string' ? payload.company : undefined,
      testimonial: typeof payload.testimonial === 'string' ? payload.testimonial : undefined,
      isNew: typeof payload.isNew === 'boolean' ? payload.isNew : undefined,
      isApproved: typeof payload.isApproved === 'boolean' ? payload.isApproved : undefined,
      status: typeof payload.status === 'string' ? payload.status : undefined,
      updatedAt: new Date().toISOString(),
    });
    return res.json({ success: true });
  } catch (error: unknown) {
    appLogger.error('public.update_testimonial_failed', {
      error: getErrorMessage(error, 'unknown_update_testimonial_error'),
      testimonialId: req.params?.testimonialId,
    });
    return res.status(500).json({ success: false, message: 'No se pudo actualizar el testimonio' });
  }
};

export const handleDeleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { testimonialId } = req.params;
    const deleted = await softDeleteTestimonial(testimonialId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Testimonio no encontrado' });
    }

    appLogger.info('public.delete_testimonial_soft_deleted', {
      testimonialId,
      requestId: res.locals.requestId,
    });

    return res.json({ success: true });
  } catch (error: unknown) {
    appLogger.error('public.delete_testimonial_failed', {
      error: getErrorMessage(error, 'unknown_delete_testimonial_error'),
      testimonialId: req.params?.testimonialId,
    });
    return res.status(500).json({ success: false, message: 'No se pudo eliminar el testimonio' });
  }
};
