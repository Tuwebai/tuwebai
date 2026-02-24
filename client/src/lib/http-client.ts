import { API_URL } from '@/lib/api';

type PrimitiveBody = string | FormData | URLSearchParams | Blob | ArrayBuffer | null | undefined;

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: PrimitiveBody | Record<string, unknown> | unknown[];
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

const resolveFirebaseBearerToken = async (): Promise<string | null> => {
  try {
    const { auth } = await import('@/lib/firebase');
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    const token = await currentUser.getIdToken();
    return token || null;
  } catch {
    return null;
  }
};

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
    const obj = payload as Record<string, unknown>;
    if (typeof obj.message === 'string' && obj.message.trim().length > 0) return obj.message;
    if (typeof obj.error === 'string' && obj.error.trim().length > 0) return obj.error;
  }
  return fallback;
};

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers, credentials, ...rest } = options;
  const requestHeaders = new Headers(headers || {});
  const requestId = requestHeaders.get('X-Request-Id') || requestHeaders.get('x-request-id') || createRequestId();
  requestHeaders.set('X-Request-Id', requestId);
  if (!requestHeaders.has('Authorization')) {
    const firebaseToken = await resolveFirebaseBearerToken();
    if (firebaseToken) {
      requestHeaders.set('Authorization', `Bearer ${firebaseToken}`);
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

  const response = await fetch(`${API_URL}${normalizePath(path)}`, {
    ...rest,
    headers: requestHeaders,
    body: requestBody,
    credentials: credentials || 'include',
  });

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

  return payload as T;
}
