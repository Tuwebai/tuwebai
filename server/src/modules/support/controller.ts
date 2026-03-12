import { Request, Response } from 'express';
import { getFirestore as getAdminFirestore } from '../../infrastructure/firebase/firestore';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';

type TicketResponseDocument = {
  id: string;
  message?: string;
  author?: string;
  authorType?: 'client' | 'admin';
  createdAt?: string;
} & Record<string, unknown>;

type SupportTicketDocument = {
  id?: string;
  userId?: string;
  subject?: string;
  message?: string;
  status?: 'open' | 'in-progress' | 'resolved';
  priority?: 'low' | 'medium' | 'high';
  createdAt?: string;
  updatedAt?: string;
  responses?: TicketResponseDocument[];
} & Record<string, unknown>;

export const handleCreateTicket = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const payload = (req.body ?? {}) as Partial<SupportTicketDocument>;
    const ref = await db.collection('support_tickets').add({
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return res.status(201).json({ success: true, id: ref.id });
  } catch (error: unknown) {
    appLogger.error('public.create_ticket_failed', {
      error: getErrorMessage(error, 'unknown_create_ticket_error'),
    });
    return res.status(500).json({ success: false, message: 'No se pudo crear el ticket' });
  }
};

export const handleUpdateTicket = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { ticketId } = req.params;
    const payload = (req.body ?? {}) as Partial<SupportTicketDocument>;
    await db.collection('support_tickets').doc(ticketId).set(
      {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return res.json({ success: true });
  } catch (error: unknown) {
    appLogger.error('public.update_ticket_failed', {
      error: getErrorMessage(error, 'unknown_update_ticket_error'),
      ticketId: req.params?.ticketId,
    });
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
      | { data?: SupportTicketDocument }
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

    const sourceData = currentData || (((snapshot?.data() as SupportTicketDocument | undefined) ?? {}) as SupportTicketDocument);
    const currentResponses = sourceData.responses ?? [];
    const incomingResponse = (req.body ?? {}) as Omit<TicketResponseDocument, 'id'>;
    const newResponse = {
      id: Date.now().toString(),
      ...incomingResponse,
      createdAt: incomingResponse.createdAt || new Date().toISOString(),
    };

    await ref.set(
      {
        responses: [...currentResponses, newResponse],
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return res.json({ success: true });
  } catch (error: unknown) {
    appLogger.error('public.add_ticket_response_failed', {
      error: getErrorMessage(error, 'unknown_add_ticket_response_error'),
      ticketId: req.params?.ticketId,
    });
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
    let data: SupportTicketDocument[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));
    data.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_user_tickets_failed', {
      error: getErrorMessage(error, 'unknown_get_user_tickets_error'),
      uid: req.params?.uid,
    });
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
    return res.json({ success: true, data: { id: snap.id, ...(snap.data() as Record<string, unknown>) } });
  } catch (error: unknown) {
    appLogger.error('public.get_ticket_by_id_failed', {
      error: getErrorMessage(error, 'unknown_get_ticket_by_id_error'),
      ticketId: req.params?.ticketId,
    });
    return res.status(500).json({ success: false, message: 'No se pudo obtener el ticket' });
  }
};

export const handleGetAllTickets = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const limit = resolveOptionalLimit(req.query?.limit);
    const snap = await db.collection('support_tickets').get();
    let data: SupportTicketDocument[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));
    data.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_all_tickets_failed', {
      error: getErrorMessage(error, 'unknown_get_all_tickets_error'),
    });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener tickets' });
  }
};
