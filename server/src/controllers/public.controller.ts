import { Request, Response } from 'express';
import { env } from '../config/env.config';
import { sendContactEmail } from '../services/email.service';
import { appLogger } from '../utils/app-logger';
import { storeSubmission } from '../utils/submission-store';
import { getAdminFirestore } from '../config/firebase-admin';

const MAX_LIST_LIMIT = 100;

const resolveOptionalLimit = (value: unknown): number | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.min(parsed, MAX_LIST_LIMIT);
};

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

    try {
      await sendContactEmail({
        name: nombre,
        email,
        title: 'Nueva solicitud de propuesta',
        message,
      });
      return res.json({
        success: true,
        message: 'Solicitud recibida. Te enviaremos una propuesta en menos de 48 horas.',
      });
    } catch (mailError: any) {
      appLogger.warn('public.propuesta_smtp_failed_fallback', {
        error: mailError?.message,
        route: req.path,
        method: req.method,
      });
      return res.status(202).json({
        success: true,
        message: 'Solicitud recibida. Procesaremos tu propuesta en breve.',
      });
    }
  } catch (error: any) {
    appLogger.error('public.propuesta_failed', {
      error: error?.message,
      route: req.path,
      method: req.method,
    });

    const status = error?.message?.includes('SMTP no configurado') ? 503 : 500;
    return res.status(status).json({
      success: false,
      message: 'No se pudo procesar la solicitud en este momento.',
      details: env.NODE_ENV === 'development' ? error?.message : undefined,
    });
  }
};

export const handleNewsletter = async (req: Request, res: Response) => {
  try {
    const { email, source } = req.body;
    storeSubmission('newsletter', {
      email,
      source: source || 'website',
      createdAt: new Date().toISOString(),
    });

    try {
      await sendContactEmail({
        name: 'Newsletter',
        email,
        title: 'Nueva suscripcion a newsletter',
        message: `Email: ${email}\nSource: ${source || 'website'}\nTimestamp: ${new Date().toISOString()}`,
      });
      return res.json({
        success: true,
        message: 'Suscripcion registrada correctamente.',
      });
    } catch (mailError: any) {
      appLogger.warn('public.newsletter_smtp_failed_fallback', {
        error: mailError?.message,
        route: req.path,
        method: req.method,
      });
      return res.status(202).json({
        success: true,
        message: 'Suscripcion registrada. Procesaremos la confirmacion en breve.',
      });
    }
  } catch (error: any) {
    appLogger.error('public.newsletter_failed', {
      error: error?.message,
      route: req.path,
      method: req.method,
    });

    const status = error?.message?.includes('SMTP no configurado') ? 503 : 500;
    return res.status(status).json({
      success: false,
      message: 'No se pudo procesar la suscripcion en este momento.',
      details: env.NODE_ENV === 'development' ? error?.message : undefined,
    });
  }
};

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
    try {
      await sendContactEmail({
        name: payload.name,
        email: 'no-reply@tuweb-ai.com',
        title: 'Nuevo testimonio pendiente de revision',
        message: `Nombre: ${payload.name}\nEmpresa: ${payload.company}\nEstado: ${payload.status}\n\n${payload.testimonial}`,
      });
      return res.status(201).json({
        success: true,
        message: 'Testimonio recibido y enviado para revision.',
      });
    } catch (mailError: any) {
      appLogger.warn('public.testimonial_smtp_failed_fallback', {
        error: mailError?.message,
        route: req.path,
        method: req.method,
      });
      return res.status(201).json({
        success: true,
        message: 'Testimonio recibido y pendiente de revision.',
      });
    }
  } catch (error: any) {
    appLogger.error('public.testimonial_submission_failed', {
      error: error?.message,
      route: req.path,
      method: req.method,
    });

    return res.status(500).json({
      success: false,
      message: 'No se pudo registrar el testimonio.',
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
    try {
      await sendContactEmail({
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
      });
      return res.status(201).json({
        success: true,
        message: 'Aplicacion recibida correctamente.',
      });
    } catch (mailError: any) {
      appLogger.warn('public.application_smtp_failed_fallback', {
        error: mailError?.message,
        route: req.path,
        method: req.method,
      });
      return res.status(201).json({
        success: true,
        message: 'Aplicacion recibida y pendiente de revision.',
      });
    }
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

export const handleAuthVerify = (_req: Request, res: Response) => {
  return res.json({
    success: false,
    message: 'La verificacion de cuenta se gestiona con Firebase Auth.',
  });
};

export const handleAuthDevVerify = (req: Request, res: Response) => {
  if (env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'Este endpoint solo esta disponible en desarrollo.',
    });
  }

  const { email } = req.params;
  return res.json({
    success: true,
    message: `Verificacion de desarrollo simulada para ${email}.`,
  });
};

export const handleGetUser = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
  }

  try {
    const { uid } = req.params;
    const snapshot = await db.collection('users').doc(uid).get();
    return res.json({ success: true, data: snapshot.exists ? snapshot.data() : null });
  } catch (error: any) {
    appLogger.error('public.get_user_failed', { error: error?.message, uid: req.params?.uid });
    return res.status(500).json({ success: false, message: 'No se pudo obtener el usuario' });
  }
};

export const handleUpsertUser = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
  }

  try {
    const { uid } = req.params;
    const payload = req.body || {};
    await db.collection('users').doc(uid).set(
      {
        ...payload,
        uid,
        updatedAt: new Date().toISOString(),
        createdAt: payload.createdAt || new Date().toISOString(),
      },
      { merge: true }
    );
    return res.json({ success: true });
  } catch (error: any) {
    appLogger.error('public.upsert_user_failed', { error: error?.message, uid: req.params?.uid });
    return res.status(500).json({ success: false, message: 'No se pudo actualizar el usuario' });
  }
};

export const handleGetUserPreferences = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
  }

  try {
    const { uid } = req.params;
    const snapshot = await db.collection('users').doc(uid).get();
    const data = snapshot.exists ? snapshot.data() : null;
    return res.json({ success: true, data: data?.preferences || null });
  } catch (error: any) {
    appLogger.error('public.get_user_preferences_failed', { error: error?.message, uid: req.params?.uid });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener preferencias' });
  }
};

export const handleSetUserPreferences = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
  }

  try {
    const { uid } = req.params;
    const incoming = req.body || {};
    const ref = db.collection('users').doc(uid);
    const current = await ref.get();
    const currentPrefs = (current.data()?.preferences || {}) as Record<string, unknown>;

    await ref.set(
      {
        uid,
        preferences: {
          ...currentPrefs,
          ...incoming,
          updatedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return res.json({ success: true });
  } catch (error: any) {
    appLogger.error('public.set_user_preferences_failed', { error: error?.message, uid: req.params?.uid });
    return res.status(500).json({ success: false, message: 'No se pudieron actualizar preferencias' });
  }
};

export const handleCreateTicket = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const payload = req.body || {};
    const ref = await db.collection('support_tickets').add({
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return res.status(201).json({ success: true, id: ref.id });
  } catch (error: any) {
    appLogger.error('public.create_ticket_failed', { error: error?.message });
    return res.status(500).json({ success: false, message: 'No se pudo crear el ticket' });
  }
};

export const handleUpdateTicket = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { ticketId } = req.params;
    await db.collection('support_tickets').doc(ticketId).set(
      {
        ...req.body,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return res.json({ success: true });
  } catch (error: any) {
    appLogger.error('public.update_ticket_failed', { error: error?.message, ticketId: req.params?.ticketId });
    return res.status(500).json({ success: false, message: 'No se pudo actualizar el ticket' });
  }
};

export const handleAddTicketResponse = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { ticketId } = req.params;
    const ref = db.collection('support_tickets').doc(ticketId);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }

    const currentResponses = (snapshot.data()?.responses || []) as Array<Record<string, unknown>>;
    const newResponse = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: req.body?.createdAt || new Date().toISOString(),
    };

    await ref.set(
      {
        responses: [...currentResponses, newResponse],
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return res.json({ success: true });
  } catch (error: any) {
    appLogger.error('public.add_ticket_response_failed', { error: error?.message, ticketId: req.params?.ticketId });
    return res.status(500).json({ success: false, message: 'No se pudo agregar respuesta al ticket' });
  }
};

export const handleUpdateProject = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { projectId } = req.params;
    await db.collection('projects').doc(projectId).set(
      {
        ...req.body,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return res.json({ success: true });
  } catch (error: any) {
    appLogger.error('public.update_project_failed', { error: error?.message, projectId: req.params?.projectId });
    return res.status(500).json({ success: false, message: 'No se pudo actualizar el proyecto' });
  }
};

export const handleGetUserProject = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { uid } = req.params;
    const snap = await db.collection('projects').where('userId', '==', uid).limit(1).get();
    if (snap.empty) return res.json({ success: true, data: null });
    const doc = snap.docs[0];
    return res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error: any) {
    appLogger.error('public.get_user_project_failed', { error: error?.message, uid: req.params?.uid });
    return res.status(500).json({ success: false, message: 'No se pudo obtener el proyecto' });
  }
};

export const handleGetUserPayments = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { uid } = req.params;
    const limit = resolveOptionalLimit(req.query?.limit);
    const snap = await db.collection('payments').where('userId', '==', uid).get();
    let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    data.sort((a: any, b: any) => String(b.date || '').localeCompare(String(a.date || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: any) {
    appLogger.error('public.get_user_payments_failed', { error: error?.message, uid: req.params?.uid });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener pagos' });
  }
};

export const handleGetUserTickets = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { uid } = req.params;
    const limit = resolveOptionalLimit(req.query?.limit);
    const snap = await db.collection('support_tickets').where('userId', '==', uid).get();
    let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    data.sort((a: any, b: any) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: any) {
    appLogger.error('public.get_user_tickets_failed', { error: error?.message, uid: req.params?.uid });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener tickets' });
  }
};

export const handleGetTicketById = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { ticketId } = req.params;
    const snap = await db.collection('support_tickets').doc(ticketId).get();
    if (!snap.exists) return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (error: any) {
    appLogger.error('public.get_ticket_by_id_failed', { error: error?.message, ticketId: req.params?.ticketId });
    return res.status(500).json({ success: false, message: 'No se pudo obtener el ticket' });
  }
};

export const handleGetAllProjects = async (_req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const limit = resolveOptionalLimit(_req.query?.limit);
    const snap = await db.collection('projects').get();
    let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    data.sort((a: any, b: any) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: any) {
    appLogger.error('public.get_all_projects_failed', { error: error?.message });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener proyectos' });
  }
};

export const handleGetAllTickets = async (_req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const limit = resolveOptionalLimit(_req.query?.limit);
    const snap = await db.collection('support_tickets').get();
    let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    data.sort((a: any, b: any) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: any) {
    appLogger.error('public.get_all_tickets_failed', { error: error?.message });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener tickets' });
  }
};

export const handleGetTestimonials = async (_req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const limit = resolveOptionalLimit(_req.query?.limit);
    const snap = await db.collection('testimonials').get();
    let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    data.sort((a: any, b: any) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: any) {
    appLogger.error('public.get_testimonials_failed', { error: error?.message });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener testimonios' });
  }
};

export const handleGetTestimonialById = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { testimonialId } = req.params;
    const snap = await db.collection('testimonials').doc(testimonialId).get();
    if (!snap.exists) return res.status(404).json({ success: false, message: 'Testimonio no encontrado' });
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (error: any) {
    appLogger.error('public.get_testimonial_by_id_failed', {
      error: error?.message,
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
    await db.collection('testimonials').doc(testimonialId).set(
      {
        ...req.body,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return res.json({ success: true });
  } catch (error: any) {
    appLogger.error('public.update_testimonial_failed', {
      error: error?.message,
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
    await db.collection('testimonials').doc(testimonialId).delete();
    return res.json({ success: true });
  } catch (error: any) {
    appLogger.error('public.delete_testimonial_failed', {
      error: error?.message,
      testimonialId: req.params?.testimonialId,
    });
    return res.status(500).json({ success: false, message: 'No se pudo eliminar el testimonio' });
  }
};
