import { supabaseConfig } from '../../../config/supabase';

const SUPABASE_REST_TIMEOUT_MS = 8000;

const getRestBaseUrl = (): string | null => {
  if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
    return null;
  }

  return `${supabaseConfig.url}/rest/v1`;
};

const buildHeaders = (prefer?: string): Record<string, string> => ({
  apikey: supabaseConfig.serviceRoleKey!,
  Authorization: `Bearer ${supabaseConfig.serviceRoleKey!}`,
  'Content-Type': 'application/json',
  ...(prefer ? { Prefer: prefer } : {}),
});

export const isSupabaseAdminRestReady = (): boolean => !!getRestBaseUrl();

export const createSupabaseAdminRestUrl = (path: string): string => `${getRestBaseUrl()!}${path}`;

export const supabaseAdminRestRequest = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const baseUrl = getRestBaseUrl();
  if (!baseUrl) {
    throw new Error('supabase_admin_rest_unavailable');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_REST_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...buildHeaders(init.method === 'POST' ? 'return=representation,resolution=merge-duplicates' : undefined),
        ...(init.headers || {}),
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`supabase_admin_rest_${response.status}:${body}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
};
