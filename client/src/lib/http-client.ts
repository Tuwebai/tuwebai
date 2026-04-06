import { API_URL } from '@/lib/api';
import { getCurrentAccessToken } from '@/core/auth/auth-client';
import type { ApiErrorResponse, ApiResponse } from '@/core/contracts/api-response';

type PrimitiveBody = string | FormData | URLSearchParams | Blob | ArrayBuffer | null | undefined;

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: PrimitiveBody | Record<string, unknown> | unknown[];
  timeoutMs?: number;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;
  requestId?: string;

  constructor(message: string, status: number, payload: unknown, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
    this.requestId = requestId;
  }
}

export const getUiErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError) {
    const base = error.message?.trim() ? error.message : fallback;
    return error.requestId ? `${base} (ID: ${error.requestId})` : base;
  }
  if (error instanceof Error && error.message?.trim()) {
    return error.message;
  }
  return fallback;
};

const isJsonSerializableBody = (value: unknown): value is Record<string, unknown> | unknown[] =>
  typeof value === 'object' && value !== null && !(value instanceof FormData) && !(value instanceof URLSearchParams) &&
  !(value instanceof Blob) && !(value instanceof ArrayBuffer);

const normalizePath = (path: string): string => (path.startsWith('/') ? path : `/${path}`);

const createRequestId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const resolveAuthBearerToken = async (): Promise<string | null> => getCurrentAccessToken().catch(() => null);

const parseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text().catch(() => '');
    return text || null;
  }
  return response.json().catch(() => null);
};

const extractErrorMessage = (payload: unknown, fallback: string): string => {
  if (payload && typeof payload === 'object') {
    const responsePayload = payload as Partial<ApiErrorResponse> & Record<string, unknown>;
    if (typeof responsePayload.message === 'string' && responsePayload.message.trim().length > 0) return responsePayload.message;
    if (typeof responsePayload.error === 'string' && responsePayload.error.trim().length > 0) return responsePayload.error;
  }
  return fallback;
};

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers, credentials, timeoutMs, signal, ...rest } = options;
  const requestHeaders = new Headers(headers || {});
  const requestId = requestHeaders.get('X-Request-Id') || requestHeaders.get('x-request-id') || createRequestId();
  requestHeaders.set('X-Request-Id', requestId);
  if (!requestHeaders.has('Authorization')) {
    const authToken = await resolveAuthBearerToken();
    if (authToken) {
      requestHeaders.set('Authorization', `Bearer ${authToken}`);
    }
  }

  let requestBody: BodyInit | undefined;

  if (body !== undefined && body !== null) {
    if (typeof body === 'string' || body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob) {
      requestBody = body;
    } else if (body instanceof ArrayBuffer) {
      requestBody = body as unknown as BodyInit;
    } else if (isJsonSerializableBody(body)) {
      requestHeaders.set('Content-Type', 'application/json');
      requestBody = JSON.stringify(body);
    }
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const requestSignal = signal ?? controller?.signal;
  const requestTimeoutMs = typeof timeoutMs === 'number' && Number.isFinite(timeoutMs) && timeoutMs > 0
    ? timeoutMs
    : undefined;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  if (!signal && controller && requestTimeoutMs) {
    timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${normalizePath(path)}`, {
      ...rest,
      headers: requestHeaders,
      body: requestBody,
      credentials: credentials ?? 'same-origin',
      signal: requestSignal,
    });
  } catch (error: unknown) {
    if (timeoutId) clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        'La solicitud tardo demasiado en responder. Intenta nuevamente en unos segundos.',
        408,
        null,
        requestId
      );
    }

    throw error;
  }

  if (timeoutId) clearTimeout(timeoutId);

  const payload = await parseBody(response);
  const responseRequestId = response.headers.get('x-request-id') || requestId;
  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(payload, `Request failed with status ${response.status}`),
      response.status,
      payload,
      responseRequestId
    );
  }

  return payload as ApiResponse<T> as T;
}
