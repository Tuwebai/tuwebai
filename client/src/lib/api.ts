const viteApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_URL =
  viteApiUrl && viteApiUrl.length > 0
    ? viteApiUrl
    : import.meta.env.DEV
      ? 'http://localhost:5000'
      : 'https://tuwebai-backend.onrender.com';
