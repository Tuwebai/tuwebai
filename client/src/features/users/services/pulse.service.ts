import { backendApi } from '@/lib/backend-api';
import type { PulsePreviewData, PulseTokenData } from '@/features/users/types/pulse';

const DEFAULT_PULSE_BASE_URL = import.meta.env.DEV ? 'http://localhost:8083' : 'https://pulse.tuweb-ai.com';
const PULSE_BASE_URL = (import.meta.env.VITE_PULSE_BASE_URL || DEFAULT_PULSE_BASE_URL).replace(/\/+$/, '');

function isPulsePreviewData(value: unknown): value is PulsePreviewData {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return typeof payload.hasData === 'boolean';
}

export function getPulseBaseUrl(): string {
  return PULSE_BASE_URL;
}

export async function getPulsePreview(email: string): Promise<PulsePreviewData> {
  const safeEmail = email.trim().toLowerCase();
  const response = await fetch(`${PULSE_BASE_URL}/functions/v1/pulse-preview?email=${encodeURIComponent(safeEmail)}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('No pudimos consultar el preview de Pulse.');
  }

  const data: unknown = await response.json();

  if (!isPulsePreviewData(data)) {
    throw new Error('El preview de Pulse vino incompleto.');
  }

  return data;
}

export async function getPulseToken(): Promise<PulseTokenData> {
  const response = await backendApi.getPulseToken();
  const data = response?.data;

  if (!data?.redirect_url || !data?.token) {
    throw new Error('No pudimos preparar el acceso a Pulse.');
  }

  return data;
}

export async function openPulseAccess(): Promise<void> {
  try {
    const response = await getPulseToken();
    window.location.assign(response.redirect_url);
  } catch {
    window.location.assign(`${getPulseBaseUrl()}/login`);
  }
}
