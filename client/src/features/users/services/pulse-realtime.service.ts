import type { RealtimeChannel } from '@supabase/supabase-js';

import { supabaseBrowserClient } from '@/core/auth/supabase-browser-client';
import {
  buildPulseAccessRealtimeChannel,
  isPulseAccessRealtimePayload,
  PULSE_ACCESS_REALTIME_EVENT,
  type PulseAccessRealtimePayload,
} from '@/features/users/services/pulse-realtime-contract';

interface PulseRealtimeOptions {
  onStatusChange: (payload: PulseAccessRealtimePayload) => void;
  userUid: string;
}

export function subscribeToPulseAccessStatus({
  onStatusChange,
  userUid,
}: PulseRealtimeOptions): () => void {
  const channel: RealtimeChannel = supabaseBrowserClient
    .channel(buildPulseAccessRealtimeChannel(userUid))
    .on('broadcast', { event: PULSE_ACCESS_REALTIME_EVENT }, ({ payload }) => {
      if (isPulseAccessRealtimePayload(payload)) {
        onStatusChange(payload);
      }
    })
    .subscribe();

  return () => {
    void supabaseBrowserClient.removeChannel(channel);
  };
}
