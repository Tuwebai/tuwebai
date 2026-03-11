import { Request, Response } from 'express';
import { getFirestore as getAdminFirestore } from '../../infrastructure/firebase/firestore';
import { appLogger } from '../../utils/app-logger';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';

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
    const preloadedResource = res.locals.resourceDocument as
      | { data?: Record<string, unknown> }
      | undefined;
    const currentData =
      preloadedResource?.data ||
      (() => {
        return null;
      })();

    const snapshot = currentData ? null : await ref.get();
    if (!currentData && !snapshot?.exists) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }

    const sourceData = currentData || ((snapshot?.data() || {}) as Record<string, unknown>);
    const currentResponses = (sourceData.responses || []) as Array<Record<string, unknown>>;
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

export const handleGetAllTickets = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const limit = resolveOptionalLimit(req.query?.limit);
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
