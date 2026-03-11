import { backendApi } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';
import type { ProposalSubmissionInput } from '../types';

export const submitProposal = (payload: ProposalSubmissionInput) => backendApi.submitProposal(payload);

export const getProposalErrorMessage = (error: unknown, fallback: string) => getUiErrorMessage(error, fallback);
