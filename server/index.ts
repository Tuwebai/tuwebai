/**
 * Carga y valida variables de entorno al arranque (fail-fast).
 * Debe ser la primera importación para que ningún otro módulo use process.env sin validar.
 */
import { env } from './src/config/env.config';
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import path from "path";
import passport from "passport";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import contactRoutes from './src/routes/contact.routes';
import paymentRoutes from './src/routes/payment.routes';
import publicRoutes from './src/routes/public.routes';
import { globalErrorHandler } from './src/middlewares/error.middleware';
import { appLogger } from './src/utils/app-logger';
import { requireInternalApiKey } from './src/middlewares/internal-auth.middleware';
import { requestIdMiddleware } from './src/middlewares/request-id.middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const allowedOrigins = env.ALLOWED_ORIGINS;

app.use(requestIdMiddleware);

/**
 * Rutas que en producción pueden recibir peticiones sin cabecera Origin
 * (server-to-server: health checks, webhooks). Cualquier otra ruta sin Origin
 * en producción será rechazada con 403.
 * @see docs/ENTERPRISE_AUDITV2.md — Refactor 2 CORS
 */
const PATHS_ALLOWED_WITHOUT_ORIGIN = [
  '/api/health',
  '/webhook/mercadopago/health',
  '/webhook/mercadopago',
] as const;

function isPathAllowedWithoutOrigin(path: string): boolean {
  return PATHS_ALLOWED_WITHOUT_ORIGIN.some((p) => path === p || path.startsWith(p + '?'));
}

// En producción: rechazar requests sin Origin salvo en rutas de health/webhook
if (env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin !== undefined && origin !== '') return next();
    if (isPathAllowedWithoutOrigin(req.path)) return next();
    appLogger.warn('cors.rejected_missing_origin', { method: req.method, path: req.path });
    res.status(403).json({ error: 'Forbidden', message: 'Origin header required' });
  });
}

app.use(
  cors({
    origin(origin, callback) {
      // Sin Origin: permitir solo si pasó el middleware anterior (production) o en dev
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (env.NODE_ENV !== 'production') {
        appLogger.warn('cors.origin_not_allowed_dev', { origin });
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'X-Signature',
      'X-Request-Id',
    ],
    exposedHeaders: ['Set-Cookie'],
  })
);

app.options('*', cors());

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Store = MemoryStore(session);
const sessionStore = new Store({
  checkPeriod: 86400000
});

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
      httpOnly: true,
      domain: env.NODE_ENV === "production" ? ".tuweb-ai.com" : undefined
    },
    store: sessionStore,
    name: "tuwebai.sid"
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware de logging para rutas de autenticación
app.use((req, res, next) => {
  if (req.path.includes("/auth/")) {
    appLogger.info('auth.route_accessed', {
      requestId: res.locals.requestId,
      method: req.method,
      path: req.path,
      sessionId: req.sessionID,
      userId: (req.session as any)?.userId,
      userEmail: (req.session as any)?.userEmail,
    });
  }
  next();
});

// Middleware de logging para API
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: unknown;

  const summarizeResponse = (payload: unknown): unknown => {
    if (payload === null || payload === undefined) return payload;
    if (typeof payload !== 'object') return payload;

    if (Array.isArray(payload)) {
      return { type: 'array', length: payload.length };
    }

    const obj = payload as Record<string, unknown>;
    const previewKeys = Object.keys(obj).slice(0, 8);
    const summary: Record<string, unknown> = { keys: previewKeys };

    if (Array.isArray(obj.data)) {
      summary.dataType = 'array';
      summary.dataLength = obj.data.length;
    } else if (obj.data && typeof obj.data === 'object') {
      summary.dataType = 'object';
    } else if ('data' in obj) {
      summary.dataType = typeof obj.data;
    }

    if (typeof obj.success === 'boolean') summary.success = obj.success;
    if (typeof obj.message === 'string') summary.message = obj.message;

    return summary;
  };

  const originalResJson = res.json;
  res.json = function (bodyJson?: unknown) {
    capturedJsonResponse = bodyJson;
    return originalResJson.call(res, bodyJson);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      const responseSummary = summarizeResponse(capturedJsonResponse);
      if (responseSummary !== undefined) {
        logLine += ` :: ${JSON.stringify(responseSummary)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      appLogger.info('api.request', {
        requestId: res.locals.requestId,
        method: req.method,
        path,
        statusCode: res.statusCode,
        durationMs: duration,
        response: responseSummary,
        short: logLine,
      });
    }
  });
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    requestId: res.locals.requestId,
  });
});

// Test endpoint para verificar que el servidor responde
app.get("/test", requireInternalApiKey, (req, res) => {
  res.json({
    status: "OK",
    message: "Test endpoint funcionando",
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
    requestId: res.locals.requestId,
  });
});

// Test endpoint POST simple
app.post("/test", requireInternalApiKey, (req, res) => {
  appLogger.info('test.post_received', { body: req.body });
  res.json({
    status: "OK",
    message: "Test POST funcionando",
    receivedData: req.body,
    timestamp: new Date().toISOString(),
    requestId: res.locals.requestId,
  });
});



// Favicon
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/favicon.ico"));
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Rutas de la API (Clean Architecture)
app.use(contactRoutes);
app.use(paymentRoutes);
app.use(publicRoutes);

// Middleware de manejo de errores centralizado
app.use(globalErrorHandler);

app.listen(env.PORT, () => {
  appLogger.info('server.started', {
    port: env.PORT,
    allowedOrigins,
    nodeEnv: env.NODE_ENV,
    sessionSecretConfigured: true,
    mercadopagoAccessTokenConfigured: !!env.MERCADOPAGO_ACCESS_TOKEN,
    mercadopagoWebhookSecretConfigured: !!env.MERCADOPAGO_WEBHOOK_SECRET,
    smtpConfigured: !!env.SMTP_USER,
  });
});
