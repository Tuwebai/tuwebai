import { supabaseConfig } from '../../config/supabase';
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

const EDGE_FUNCTION_NAME = 'public-submission-intake';

const buildPublicSubmissionRow = (input: StorePublicSubmissionInput) => ({
  channel: input.channel,
  name: normalizeString(input.name),
  email: normalizeString(input.email)?.toLowerCase() ?? null,
  title: normalizeString(input.title),
  message: normalizeString(input.message),
  source: normalizeString(input.source) ?? 'website',
  status: 'received',
  payload: input.payload,
});

const buildEdgeFunctionUrl = (): string | null => {
  if (!supabaseConfig.url) {
    return null;
  }

  return `${supabaseConfig.url}/functions/v1/${EDGE_FUNCTION_NAME}`;
};

const storePublicSubmissionViaEdge = async (
  row: ReturnType<typeof buildPublicSubmissionRow>,
): Promise<boolean> => {
  const functionUrl = buildEdgeFunctionUrl();

  if (!functionUrl || !supabaseConfig.serviceRoleKey) {
    return false;
  }

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseConfig.serviceRoleKey}`,
    },
    body: JSON.stringify(row),
  });

  if (response.ok) {
    return true;
  }

  if (response.status === 404) {
    return false;
  }

  const errorText = await response.text().catch(() => 'edge_function_request_failed');
  throw new Error(`public_submission_edge_${response.status}:${errorText}`);
};

const storePublicSubmissionViaRest = async (
  row: ReturnType<typeof buildPublicSubmissionRow>,
): Promise<void> => {
  await supabaseAdminRestRequest('/public_submissions', {
    method: 'POST',
    body: JSON.stringify([row]),
  });
};

export const storePublicSubmission = async (
  input: StorePublicSubmissionInput,
): Promise<void> => {
  const row = buildPublicSubmissionRow(input);

  if (await storePublicSubmissionViaEdge(row)) {
    return;
  }

  await storePublicSubmissionViaRest(row);
};
