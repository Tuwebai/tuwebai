import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { getFirestore as getAdminFirestore } from '../../infrastructure/firebase/firestore';
import { queueContactEmail } from '../../infrastructure/mail/email.service';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { storeSubmission } from '../../utils/submission-store';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';

type TestimonialDocument = {
  id?: string;
  name?: string;
  company?: string;
  testimonial?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  deletedBy?: string;
  isDeleted?: boolean;
  status?: string;
  source?: string;
} & Record<string, unknown>;

const isSoftDeleted = (data: Record<string, unknown> | undefined): boolean =>
  Boolean(data?.deletedAt || data?.isDeleted === true || data?.status === 'deleted');

export const handleTestimonialSubmission = async (req: Request, res: Response) => {
  try {
    const payload = {
      name: req.body.name,
      company: req.body.company,
      testimonial: req.body.testimonial,
      createdAt: new Date().toISOString(),
      status: 'pending_review',
      source: 'website',
    };

    storeSubmission('testimonials', payload);
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
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const limit = resolveOptionalLimit(req.query?.limit);
    const snap = await db.collection('testimonials').get();
    let data: TestimonialDocument[] = snap.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }))
      .filter((testimonial) => !isSoftDeleted(testimonial));
    data.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_testimonials_failed', {
      error: getErrorMessage(error, 'unknown_get_testimonials_error'),
    });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener testimonios' });
  }
};

export const handleGetTestimonialById = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { testimonialId } = req.params;
    const snap = await db.collection('testimonials').doc(testimonialId).get();
    const data = snap.data() as Record<string, unknown> | undefined;
    if (!snap.exists || isSoftDeleted(data)) {
      return res.status(404).json({ success: false, message: 'Testimonio no encontrado' });
    }
    return res.json({ success: true, data: { id: snap.id, ...data } });
  } catch (error: unknown) {
    appLogger.error('public.get_testimonial_by_id_failed', {
      error: getErrorMessage(error, 'unknown_get_testimonial_by_id_error'),
      testimonialId: req.params?.testimonialId,
    });
    return res.status(500).json({ success: false, message: 'No se pudo obtener el testimonio' });
  }
};

export const handleUpdateTestimonial = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { testimonialId } = req.params;
    const payload = (req.body ?? {}) as Partial<TestimonialDocument>;
    await db.collection('testimonials').doc(testimonialId).set(
      {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
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
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { testimonialId } = req.params;
    const testimonialRef = db.collection('testimonials').doc(testimonialId);
    const snapshot = await testimonialRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({ success: false, message: 'Testimonio no encontrado' });
    }

    await testimonialRef.set(
      {
        deletedAt: new Date().toISOString(),
        deletedBy: 'internal_api',
        isDeleted: true,
        status: 'deleted',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

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
