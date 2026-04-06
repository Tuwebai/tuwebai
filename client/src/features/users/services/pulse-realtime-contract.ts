import type { PulseAccessStatus } from '@/features/users/types/pulse';

export const PULSE_ACCESS_REALTIME_EVENT = 'pulse_access_status_changed';
export const PULSE_ACCESS_REALTIME_SOURCE = 'pulse';

export interface PulseAccessRealtimePayload {
  changedAt: string;
  source: typeof PULSE_ACCESS_REALTIME_SOURCE;
  status: PulseAccessStatus;
  userUid: string;
}

export function buildPulseAccessRealtimeChannel(userUid: string): string {
  return `pulse-access:${userUid}`;
}

export function isPulseAccessRealtimePayload(value: unknown): value is PulseAccessRealtimePayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.userUid === 'string' &&
    payload.userUid.length > 0 &&
    typeof payload.changedAt === 'string' &&
    payload.source === PULSE_ACCESS_REALTIME_SOURCE &&
    (payload.status === 'enabled' ||
      payload.status === 'pending_activation' ||
      payload.status === 'disabled')
  );
}
