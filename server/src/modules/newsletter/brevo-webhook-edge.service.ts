import { supabaseConfig } from '../../config/supabase';

const EDGE_FUNCTION_NAME = 'brevo-webhook-intake';

interface BrevoWebhookRelayResult {
  body: unknown;
  status: number;
}

const buildEdgeFunctionUrl = (): string | null => {
  if (!supabaseConfig.url) {
    return null;
  }

  return `${supabaseConfig.url}/functions/v1/${EDGE_FUNCTION_NAME}`;
};

export const relayBrevoWebhookToEdge = async (
  payload: unknown,
  options: {
    requestId?: string;
    webhookToken?: string;
  },
): Promise<BrevoWebhookRelayResult | null> => {
  const functionUrl = buildEdgeFunctionUrl();

  if (!functionUrl || !supabaseConfig.serviceRoleKey) {
    return null;
  }

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseConfig.serviceRoleKey}`,
      'x-brevo-webhook-token': options.webhookToken ?? '',
      'x-request-id': options.requestId ?? '',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 404) {
    return null;
  }

  const body = (await response.json().catch(() => null)) as unknown;

  return {
    body,
    status: response.status,
  };
};
