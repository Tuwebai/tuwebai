import { backendApi } from '@/lib/backend-api';
import { invokeSupabaseEdge } from '@/lib/supabase-edge';

export const recordPasswordReset = async (payload: { email: string; passwordChangedAt: string }) => {
  try {
    return await invokeSupabaseEdge<{ success?: boolean; message?: string }>('password-reset-metadata', {
      body: payload,
    });
  } catch {
    return backendApi.recordPasswordReset(payload);
  }
};
