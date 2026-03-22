import { backendApi } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';

export interface ChecklistWebGratisDownloadInput {
  name: string;
  email: string;
  source?: string;
}

export const requestChecklistWebGratis = (payload: ChecklistWebGratisDownloadInput) =>
  backendApi.requestChecklistWebGratis(payload);

export const getChecklistWebGratisErrorMessage = (error: unknown, fallback: string) =>
  getUiErrorMessage(error, fallback);
