import { supabaseBrowserClient } from '@/core/auth/supabase-browser-client';
import { getCurrentAccessToken } from '@/core/auth/auth-client';
import { supabasePublicConfig } from '@/core/supabase/supabase-public-config';

interface EdgeInvokeOptions {
  body?:
    | string
    | Blob
    | File
    | FormData
    | ArrayBuffer
    | ReadableStream<Uint8Array>
    | Record<string, unknown>
    | unknown[];
}

export class SupabaseEdgeInvokeError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'SupabaseEdgeInvokeError';
    this.status = status;
  }
}

const extractInvokeStatus = (error: unknown): number | undefined => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const payload = error as { context?: { status?: number } };
  return typeof payload.context?.status === 'number' ? payload.context.status : undefined;
};

export const invokeSupabaseEdge = async <T>(
  functionName: string,
  options: EdgeInvokeOptions = {},
): Promise<T> => {
  const accessToken = await getCurrentAccessToken().catch(() => null);
  const { data, error } = await supabaseBrowserClient.functions.invoke(functionName, {
    body: options.body,
    headers: {
      ...(supabasePublicConfig.anonKey ? { apikey: supabasePublicConfig.anonKey } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (error) {
    throw new SupabaseEdgeInvokeError(error.message, extractInvokeStatus(error));
  }

  const payload = data as { message?: string; success?: boolean } | null;

  if (payload && payload.success === false) {
    throw new SupabaseEdgeInvokeError(
      typeof payload.message === 'string' && payload.message.trim().length > 0
        ? payload.message
        : 'Edge function request failed',
      undefined,
    );
  }

  return data as T;
};
