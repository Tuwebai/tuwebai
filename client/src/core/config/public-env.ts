const normalizeOptional = (value: string | undefined): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const publicEnv = {
  apiUrl: normalizeOptional(import.meta.env.VITE_API_URL),
  authRedirectBaseUrl: normalizeOptional(import.meta.env.VITE_AUTH_REDIRECT_BASE_URL),
  pulseBaseUrl: normalizeOptional(import.meta.env.VITE_PULSE_BASE_URL),
  pulseFunctionsBaseUrl: normalizeOptional(import.meta.env.VITE_PULSE_FUNCTIONS_BASE_URL),
  supabaseAnonKey: normalizeOptional(import.meta.env.VITE_SUPABASE_ANON_KEY),
  supabaseUrl: normalizeOptional(import.meta.env.VITE_SUPABASE_URL),
};
