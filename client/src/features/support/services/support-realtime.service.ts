import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';

import { supabaseBrowserClient } from '@/core/auth/supabase-browser-client';
import type { SupportTicket } from '../types';

type SupportTicketRow = {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: SupportTicket['status'];
  priority: SupportTicket['priority'];
  responses: SupportTicket['responses'] | null;
  created_at: string;
  updated_at: string;
};

type SupportTicketChangeHandler = (ticket: SupportTicket | null) => void;

type SupportRealtimeOptions = {
  onChange: SupportTicketChangeHandler;
  userId?: string;
};

const SUPPORT_TICKETS_CHANNEL = 'support-tickets';

const mapSupportTicketRow = (row: SupportTicketRow): SupportTicket => ({
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

const resolveChangedTicket = (
  payload: RealtimePostgresChangesPayload<SupportTicketRow>,
): SupportTicket | null => {
  if (payload.eventType === 'DELETE') {
    return null;
  }

  return mapSupportTicketRow(payload.new);
};

export const subscribeToSupportTickets = ({
  onChange,
  userId,
}: SupportRealtimeOptions): (() => void) => {
  const filter = userId ? `user_id=eq.${userId}` : undefined;
  const channelName = userId
    ? `${SUPPORT_TICKETS_CHANNEL}:${userId}`
    : `${SUPPORT_TICKETS_CHANNEL}:admin`;

  const channel: RealtimeChannel = supabaseBrowserClient
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        filter,
        schema: 'public',
        table: 'support_tickets',
      },
      (payload) => {
        onChange(resolveChangedTicket(payload as RealtimePostgresChangesPayload<SupportTicketRow>));
      },
    )
    .subscribe();

  return () => {
    void supabaseBrowserClient.removeChannel(channel);
  };
};
