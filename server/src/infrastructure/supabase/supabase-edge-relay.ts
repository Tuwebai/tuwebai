import { supabaseConfig } from '../../config/supabase';

interface EdgeRelayOptions {
  body?: unknown;
  headers?: Record<string, string>;
  requestId?: string;
}

interface EdgeRelayResult<T> {
  body: T;
  status: number;
}

const buildEdgeFunctionUrl = (functionName: string): string | null => {
  if (!supabaseConfig.url) {
    return null;
  }

  return `${supabaseConfig.url}/functions/v1/${functionName}`;
};

export const relayEdgeFunction = async <T>(
  functionName: string,
  options: EdgeRelayOptions = {},
): Promise<EdgeRelayResult<T> | null> => {
  const functionUrl = buildEdgeFunctionUrl(functionName);

  if (!functionUrl || !supabaseConfig.serviceRoleKey) {
    return null;
  }

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseConfig.serviceRoleKey}`,
      ...(options.requestId ? { 'x-request-id': options.requestId } : {}),
      ...(options.headers ?? {}),
    },
    body: JSON.stringify(options.body ?? {}),
  });

  if (response.status === 404) {
    return null;
  }

  return {
    body: (await response.json().catch(() => null)) as T,
    status: response.status,
  };
};
