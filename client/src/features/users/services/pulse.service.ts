import { backendApi } from '@/lib/backend-api';
import type { PulsePreviewData, PulseStatusData, PulseTokenData } from '@/features/users/types/pulse';

const DEFAULT_PULSE_BASE_URL = import.meta.env.DEV ? 'http://localhost:8083' : 'https://pulse.tuweb-ai.com';
const RAW_PULSE_BASE_URL = (import.meta.env.VITE_PULSE_BASE_URL || DEFAULT_PULSE_BASE_URL).replace(/\/+$/, '');
const RAW_PULSE_FUNCTIONS_BASE_URL = import.meta.env.VITE_PULSE_FUNCTIONS_BASE_URL?.trim() || '';
const PULSE_FUNCTIONS_BASE_URL = RAW_PULSE_FUNCTIONS_BASE_URL.replace(/\/+$/, '');

function resolvePulseBaseUrl(): string {
  if (
    import.meta.env.DEV &&
    RAW_PULSE_BASE_URL.includes('localhost') &&
    PULSE_FUNCTIONS_BASE_URL.length > 0 &&
    !PULSE_FUNCTIONS_BASE_URL.includes('localhost')
  ) {
    return 'https://pulse.tuweb-ai.com';
  }

  return RAW_PULSE_BASE_URL;
}

const PULSE_BASE_URL = resolvePulseBaseUrl();

function shouldSkipLocalPulsePreview(): boolean {
  return import.meta.env.DEV && PULSE_FUNCTIONS_BASE_URL.length === 0;
}

function isPulsePreviewData(value: unknown): value is PulsePreviewData {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return typeof payload.hasData === 'boolean';
}

function isPulseStatusData(value: unknown): value is PulseStatusData {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    payload.status === 'enabled' ||
    payload.status === 'pending_activation' ||
    payload.status === 'disabled'
  );
}

export function getPulseBaseUrl(): string {
  return PULSE_BASE_URL;
}

export async function getPulsePreview(email: string): Promise<PulsePreviewData> {
  if (shouldSkipLocalPulsePreview()) {
    return { hasData: false };
  }

  const safeEmail = email.trim().toLowerCase();
  const response = await fetch(`${PULSE_FUNCTIONS_BASE_URL}/pulse-preview?email=${encodeURIComponent(safeEmail)}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { hasData: false };
    }

    throw new Error('No pudimos consultar el preview de Pulse.');
  }

  const data: unknown = await response.json();

  if (!isPulsePreviewData(data)) {
    throw new Error('El preview de Pulse vino incompleto.');
  }

  return data;
}

export async function getPulseToken(email?: string): Promise<PulseTokenData> {
  const response = await backendApi.getPulseToken(email);
  const data = response?.data;

  if (!data?.redirect_url || !data?.token) {
    throw new Error('No pudimos preparar el acceso a Pulse.');
  }

  return data;
}

export async function getPulseStatus(email?: string): Promise<PulseStatusData> {
  const response = await backendApi.getPulseStatus(email);
  const data = response?.data;

  if (!isPulseStatusData(data)) {
    throw new Error('No pudimos validar el estado de acceso a Pulse.');
  }

  return data;
}

export async function openPulseAccess(email?: string): Promise<void> {
  const response = await getPulseToken(email);
  window.location.assign(response.redirect_url);
}
