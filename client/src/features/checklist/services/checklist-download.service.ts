import { backendApi } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';
import { invokeSupabaseEdge } from '@/lib/supabase-edge';

export interface ChecklistWebGratisDownloadInput {
  name: string;
  email: string;
  source?: string;
}

export const requestChecklistWebGratis = async (payload: ChecklistWebGratisDownloadInput) => {
  try {
    return await invokeSupabaseEdge<{ success?: boolean; message?: string }>('checklist-intake', {
      body: { ...payload },
    });
  } catch {
    return backendApi.requestChecklistWebGratis(payload);
  }
};

export const getChecklistWebGratisErrorMessage = (error: unknown, fallback: string) =>
  getUiErrorMessage(error, fallback);
