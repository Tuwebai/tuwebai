import rateLimit from 'express-rate-limit';

// Standard API Rate Limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite: 100 requests x IP por windowMs
  standardHeaders: true, // Retorna RateLimit-* headers
  legacyHeaders: false, // Inhabilita X-RateLimit-* headers
  message: {
    error: 'Too many requests',
    message: 'Has sobrepasado el límite de peticiones de la API. Inténtalo más tarde.'
  }
});

// Stricter Rate Limiter for critical unauthenticated endpoints like /contact or Payment generation
export const strictApiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Max 10 solicitudes críticas por hora por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Límite severo alcanzado. Operación bloqueada temporalmente por seguridad.'
  }
});
