import { Request, Response } from 'express';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';
import {
  createSupportTicket,
  getAllSupportTickets,
  getSupportTicketById,
  getSupportTicketsByUserId,
  updateSupportTicket,
} from './supabase.repository';

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

const sanitizeTicketCreatePayload = (
  uid: string,
  payload: Partial<SupportTicketDocument>,
): {
  userId: string;
  subject: string;
  message: string;
  status: 'open';
  priority: 'low' | 'medium' | 'high';
  responses: TicketResponseDocument[];
} => ({
  userId: uid,
  subject: String(payload.subject || ''),
  message: String(payload.message || ''),
  status: 'open',
  priority: payload.priority ?? 'medium',
  responses: [],
});

const sanitizeTicketUpdatePayload = (payload: Partial<SupportTicketDocument>): Partial<SupportTicketDocument> => ({
  ...(typeof payload.subject === 'string' ? { subject: payload.subject } : {}),
  ...(typeof payload.message === 'string' ? { message: payload.message } : {}),
  ...(payload.status === 'open' || payload.status === 'in-progress' || payload.status === 'resolved'
    ? { status: payload.status }
    : {}),
  ...(payload.priority === 'low' || payload.priority === 'medium' || payload.priority === 'high'
    ? { priority: payload.priority }
    : {}),
});

export const handleCreateTicket = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const payload = sanitizeTicketCreatePayload(uid, (req.body ?? {}) as Partial<SupportTicketDocument>);
    const created = await createSupportTicket(payload);
    return res.status(201).json({ success: true, id: created.id });
  } catch (error: unknown) {
    appLogger.error('public.create_ticket_failed', {
      error: getErrorMessage(error, 'unknown_create_ticket_error'),
    });
    return res.status(500).json({ success: false, message: 'No se pudo crear el ticket' });
  }
};

export const handleUpdateTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const payload = sanitizeTicketUpdatePayload((req.body ?? {}) as Partial<SupportTicketDocument>);
    await updateSupportTicket(ticketId, {
      ...payload,
      updatedAt: new Date().toISOString(),
    });
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
  try {
    const { ticketId } = req.params;
    const preloadedResource = res.locals.resourceDocument as
      | { data?: SupportTicketDocument }
      | undefined;
    const currentData =
      preloadedResource?.data ||
      (() => {
        return null;
      })();

    const loadedTicket = currentData ?? (await getSupportTicketById(ticketId));
    if (!loadedTicket) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }

    const sourceData = loadedTicket;
    const currentResponses = sourceData.responses ?? [];
    const incomingResponse = (req.body ?? {}) as Omit<TicketResponseDocument, 'id'>;
    const newResponse: TicketResponseDocument = {
      id: Date.now().toString(),
      message: typeof incomingResponse.message === 'string' ? incomingResponse.message : undefined,
      author: typeof incomingResponse.author === 'string' ? incomingResponse.author : undefined,
      authorType: res.locals.authUser?.admin ? 'admin' : 'client',
      createdAt:
        typeof incomingResponse.createdAt === 'string'
          ? incomingResponse.createdAt
          : new Date().toISOString(),
    };

    await updateSupportTicket(ticketId, {
      responses: [...currentResponses, newResponse],
      updatedAt: new Date().toISOString(),
    });

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
  try {
    const { uid } = req.params;
    const limit = resolveOptionalLimit(req.query?.limit);
    const data = await getSupportTicketsByUserId(uid, limit ?? undefined);
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
  try {
    const { ticketId } = req.params;
    const ticket = await getSupportTicketById(ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    return res.json({ success: true, data: ticket });
  } catch (error: unknown) {
    appLogger.error('public.get_ticket_by_id_failed', {
      error: getErrorMessage(error, 'unknown_get_ticket_by_id_error'),
      ticketId: req.params?.ticketId,
    });
    return res.status(500).json({ success: false, message: 'No se pudo obtener el ticket' });
  }
};

export const handleGetAllTickets = async (req: Request, res: Response) => {
  try {
    const limit = resolveOptionalLimit(req.query?.limit);
    const data = await getAllSupportTickets(limit ?? undefined);
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_all_tickets_failed', {
      error: getErrorMessage(error, 'unknown_get_all_tickets_error'),
    });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener tickets' });
  }
};
