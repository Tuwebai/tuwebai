import { useEffect } from 'react';

import { subscribeToSupportTickets } from '../services/support-realtime.service';
import type { SupportTicket } from '../types';

type UseSupportTicketsRealtimeOptions = {
  enabled?: boolean;
  onChange: (ticket: SupportTicket | null) => void;
  userId?: string;
};

export const useSupportTicketsRealtime = ({
  enabled = true,
  onChange,
  userId,
}: UseSupportTicketsRealtimeOptions) => {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    return subscribeToSupportTickets({
      onChange,
      userId,
    });
  }, [enabled, onChange, userId]);
};
