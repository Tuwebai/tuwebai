/// <reference types="vite/client" />

declare const __GA_MEASUREMENT_ID__: string;

interface ImportMetaEnv {
  readonly GA_MEASUREMENT_ID: string
  readonly VITE_API_URL: string
  readonly VITE_AUTH_REDIRECT_BASE_URL?: string
  readonly VITE_PULSE_BASE_URL?: string
  readonly VITE_PULSE_FUNCTIONS_BASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_SUPABASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
