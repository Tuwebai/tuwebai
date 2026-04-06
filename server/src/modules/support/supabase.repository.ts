import { supabaseAdminRestRequest } from '../../infrastructure/database/supabase/supabase-admin-rest';

export interface TicketResponseRecord {
  id: string;
  message?: string;
  author?: string;
  authorType?: 'client' | 'admin';
  createdAt?: string;
}

export interface SupportTicketRecord {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  responses: TicketResponseRecord[];
}

interface SupportTicketRow {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  responses: TicketResponseRecord[] | null;
  created_at: string;
  updated_at: string;
}

const SUPPORT_TICKETS_SELECT =
  'id,user_id,subject,message,status,priority,responses,created_at,updated_at';

const mapTicketRow = (row: SupportTicketRow): SupportTicketRecord => ({
  id: row.id,
  userId: row.user_id,
  subject: row.subject,
  message: row.message,
  status: row.status,
  priority: row.priority,
  responses: Array.isArray(row.responses) ? row.responses : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const createSupportTicket = async (
  payload: Omit<SupportTicketRecord, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<SupportTicketRecord> => {
  const rows = await supabaseAdminRestRequest<SupportTicketRow[]>('/support_tickets', {
    method: 'POST',
    body: JSON.stringify([
      {
        user_id: payload.userId,
        subject: payload.subject,
        message: payload.message,
        status: payload.status,
        priority: payload.priority,
        responses: payload.responses,
      },
    ]),
  });

  return mapTicketRow(rows[0]);
};

export const getSupportTicketById = async (ticketId: string): Promise<SupportTicketRecord | null> => {
  const rows = await supabaseAdminRestRequest<SupportTicketRow[]>(
    `/support_tickets?select=${SUPPORT_TICKETS_SELECT}&id=eq.${encodeURIComponent(ticketId)}&limit=1`,
  );

  return rows[0] ? mapTicketRow(rows[0]) : null;
};

export const getSupportTicketsByUserId = async (
  userId: string,
  limit?: number,
): Promise<SupportTicketRecord[]> => {
  const rows = await supabaseAdminRestRequest<SupportTicketRow[]>(
    `/support_tickets?select=${SUPPORT_TICKETS_SELECT}&user_id=eq.${encodeURIComponent(
      userId,
    )}&order=created_at.desc${typeof limit === 'number' ? `&limit=${Math.max(1, Math.floor(limit))}` : ''}`,
  );

  return rows.map(mapTicketRow);
};

export const getSupportTicketsByOwnerIds = async (
  ownerIds: string[],
  limit?: number,
): Promise<SupportTicketRecord[]> => {
  const ticketsById = new Map<string, SupportTicketRecord>();

  for (const ownerId of ownerIds) {
    const rows = await getSupportTicketsByUserId(ownerId, limit);
    for (const row of rows) {
      ticketsById.set(row.id, row);
    }
  }

  return Array.from(ticketsById.values()).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
};

export const getAllSupportTickets = async (limit?: number): Promise<SupportTicketRecord[]> => {
  const rows = await supabaseAdminRestRequest<SupportTicketRow[]>(
    `/support_tickets?select=${SUPPORT_TICKETS_SELECT}&order=created_at.desc${
      typeof limit === 'number' ? `&limit=${Math.max(1, Math.floor(limit))}` : ''
    }`,
  );

  return rows.map(mapTicketRow);
};

export const updateSupportTicket = async (
  ticketId: string,
  payload: Partial<SupportTicketRecord>,
): Promise<void> => {
  await supabaseAdminRestRequest(`/support_tickets?id=eq.${encodeURIComponent(ticketId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...(typeof payload.userId === 'string' ? { user_id: payload.userId } : {}),
      ...(typeof payload.subject === 'string' ? { subject: payload.subject } : {}),
      ...(typeof payload.message === 'string' ? { message: payload.message } : {}),
      ...(typeof payload.status === 'string' ? { status: payload.status } : {}),
      ...(typeof payload.priority === 'string' ? { priority: payload.priority } : {}),
      ...(Array.isArray(payload.responses) ? { responses: payload.responses } : {}),
      updated_at: payload.updatedAt ?? new Date().toISOString(),
    }),
  });
};
