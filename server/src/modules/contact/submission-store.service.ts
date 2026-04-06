import { supabaseAdminRestRequest } from '../../infrastructure/database/supabase/supabase-admin-rest';

export type PublicSubmissionChannel = 'contact' | 'consulta' | 'propuesta' | 'applications';

interface StorePublicSubmissionInput {
  channel: PublicSubmissionChannel;
  name?: string;
  email?: string;
  title?: string;
  message?: string;
  source?: string;
  payload: Record<string, unknown>;
}

const normalizeString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

export const storePublicSubmission = async (
  input: StorePublicSubmissionInput,
): Promise<void> => {
  await supabaseAdminRestRequest('/public_submissions', {
    method: 'POST',
    body: JSON.stringify([
      {
        channel: input.channel,
        name: normalizeString(input.name),
        email: normalizeString(input.email)?.toLowerCase() ?? null,
        title: normalizeString(input.title),
        message: normalizeString(input.message),
        source: normalizeString(input.source) ?? 'website',
        status: 'received',
        payload: input.payload,
      },
    ]),
  });
};
