const viteApiUrl = import.meta.env.VITE_API_URL?.trim();

const normalizeApiBaseUrl = (rawUrl: string): string => {
  const trimmed = rawUrl.trim().replace(/\/+$/, '');
  // Defensa para configuraciones comunes que rompen endpoints (/api + paths ya versionadas)
  return trimmed.replace(/\/api$/i, '');
};

const defaultApiBase = import.meta.env.DEV
  ? 'http://localhost:5000'
  : 'https://tuwebai-backend.onrender.com';

const configuredApiBase = viteApiUrl && viteApiUrl.length > 0 ? viteApiUrl : defaultApiBase;
const hadApiSuffix = /\/api\/?$/i.test(configuredApiBase.trim());

export const API_URL = normalizeApiBaseUrl(configuredApiBase);

if (import.meta.env.DEV && hadApiSuffix) {
  console.warn(
    `[api] VITE_API_URL tenia sufijo /api y fue normalizado a "${API_URL}". ` +
    `Configura el origen base sin /api para evitar /api/api en requests.`
  );
}
