import { backendApi } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';
import { invokeSupabaseEdge } from '@/lib/supabase-edge';
import type { ProposalSubmissionInput } from '../types';

export const submitProposal = async (payload: ProposalSubmissionInput) => {
  try {
    return await invokeSupabaseEdge<{ success?: boolean; message?: string }>('proposal-intake', {
      body: { ...payload },
    });
  } catch {
    return backendApi.submitProposal(payload);
  }
};

export const getProposalErrorMessage = (error: unknown, fallback: string) => getUiErrorMessage(error, fallback);
