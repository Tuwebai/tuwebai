// API_URL dinámico según entorno
export const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://tuwebai-backend.onrender.com'; 