import { supabaseBrowserClient } from '@/core/auth/supabase-browser-client';

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

export const invokeSupabaseEdge = async <T>(
  functionName: string,
  options: EdgeInvokeOptions = {},
): Promise<T> => {
  const { data, error } = await supabaseBrowserClient.functions.invoke(functionName, {
    body: options.body,
  });

  if (error) {
    throw new SupabaseEdgeInvokeError(error.message);
  }

  const payload = data as { message?: string; success?: boolean } | null;

  if (payload && payload.success === false) {
    throw new SupabaseEdgeInvokeError(
      typeof payload.message === 'string' && payload.message.trim().length > 0
        ? payload.message
        : 'Edge function request failed',
    );
  }

  return data as T;
};
