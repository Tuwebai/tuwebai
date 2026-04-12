import { getUiErrorMessage } from '@/lib/http-client';
import { invokeSupabaseEdgePublic } from '@/lib/supabase-edge';
import type { ProposalSubmissionInput } from '../types';

export const submitProposal = async (payload: ProposalSubmissionInput) =>
  invokeSupabaseEdgePublic<{ success?: boolean; message?: string }>('proposal-intake', {
    body: { ...payload },
  });

export const getProposalErrorMessage = (error: unknown, fallback: string) => getUiErrorMessage(error, fallback);
