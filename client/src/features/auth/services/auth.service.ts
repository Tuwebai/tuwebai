import { backendApi } from '@/lib/backend-api';

export const recordPasswordReset = (payload: { email: string; passwordChangedAt: string }) =>
  backendApi.recordPasswordReset(payload);
