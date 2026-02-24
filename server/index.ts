/**
 * Carga y valida variables de entorno al arranque (fail-fast).
 * Debe ser la primera importación para que ningún otro módulo use process.env sin validar.
 */
import { env } from "./src/config/env.config";

import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import path from "path";
import passport from "passport";
import { fileURLToPath } from "url";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";

import contactRoutes from "./src/routes/contact.routes";
import paymentRoutes from "./src/routes/payment.routes";
import publicRoutes from "./src/routes/public.routes";

import { globalErrorHandler } from "./src/middlewares/error.middleware";
import { appLogger } from "./src/utils/app-logger";
import { requireInternalApiKey } from "./src/middlewares/internal-auth.middleware";
import { requestIdMiddleware } from "./src/middlewares/request-id.middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Render / proxies
app.set("trust proxy", 1);

app.use(requestIdMiddleware);

/**
 * Normaliza ALLOWED_ORIGINS venga como array o string (csv),
 * elimina espacios y trailing slashes para evitar falsos negativos.
 */
function normalizeOrigin(o: string): string {
  return o.trim().replace(/\/$/, "");
}

const allowedOrigins: string[] = Array.isArray(env.ALLOWED_ORIGINS)
  ? env.ALLOWED_ORIGINS.map(normalizeOrigin)
  : String(env.ALLOWED_ORIGINS)
      .split(",")
      .map(normalizeOrigin)
      .filter(Boolean);

/**
 * Rutas que en producción pueden recibir peticiones sin cabecera Origin
 * (server-to-server: health checks, webhooks).
 */
const PATHS_ALLOWED_WITHOUT_ORIGIN = [
  "/api/health",
  "/webhook/mercadopago/health",
  "/webhook/mercadopago",
] as const;

function isPathAllowedWithoutOrigin(p: string): boolean {
  return PATHS_ALLOWED_WITHOUT_ORIGIN.some((x) => p === x || p.startsWith(x + "/"));
}

// En producción: rechazar requests sin Origin salvo health/webhook
if (env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Si viene origin, seguir normal
    if (origin !== undefined && origin !== "") return next();

    // Sin origin: permitir solo rutas server-to-server
    if (isPathAllowedWithoutOrigin(req.path)) return next();

    // Para health checks comunes (Render a veces hace HEAD /)
    if (req.method === "HEAD" && req.path === "/") return res.sendStatus(204);

    appLogger.warn("cors.rejected_missing_origin", {
      requestId: res.locals.requestId,
      method: req.method,
      path: req.path,
    });
    return res.status(403).json({ error: "Forbidden", message: "Origin header required" });
  });
}

/**
 * CORS robusto:
 * - NO tira Error genérico (que tu handler convierte en 500)
 * - Devuelve 403 explícito en preflight/requests bloqueadas
 * - Responde preflight OPTIONS correctamente
 */
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Sin origin => ya fue manejado arriba en prod; en dev lo permitimos
    if (!origin) return callback(null, true);

    const normalized = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalized)) return callback(null, true);

    if (env.NODE_ENV !== "production") {
      appLogger.warn("cors.origin_not_allowed_dev", { origin: normalized });
      return callback(null, true);
    }

    // Importante: NO lanzar Error que termine en 500
    // Devolvemos "false" para que CORS no habilite y Express siga; luego respondemos 403 abajo.
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "X-Signature",
    "X-Request-Id",
  ],
  exposedHeaders: ["Set-Cookie"],
};

// Primero CORS
app.use(cors(corsOptions));

// Preflight: responder siempre
app.options("*", cors(corsOptions));

// Si CORS no autorizó (origin callback false), cortamos con 403 claro (no 500)
if (env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin) return next();

    const normalized = normalizeOrigin(origin);
    if (allowedOrigins.includes(normalized)) return next();

    appLogger.warn("cors.rejected_origin", {
      requestId: res.locals.requestId,
      origin: normalized,
      method: req.method,
      path: req.path,
    });
    return res.status(403).json({ error: "Forbidden", message: "Not allowed by CORS" });
  });
}

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Headers extra (ok)
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * ⚠️ SESIONES cross-site (frontend tuweb-ai.com -> backend onrender.com):
 * - sameSite debe ser "none" (si usás cookies)
 * - secure true en prod
 * - NO fijar domain a .tuweb-ai.com si el backend vive en onrender.com
 */
const Store = MemoryStore(session);
const sessionStore = new Store({ checkPeriod: 86_400_000 });

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: env.NODE_ENV === "production",
    cookie: {
      secure: env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      // domain: undefined (no seteamos domain para onrender.com)
    },
    store: sessionStore,
    name: "tuwebai.sid",
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Logging auth
app.use((req, res, next) => {
  if (req.path.includes("/auth/")) {
    appLogger.info("auth.route_accessed", {
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

// Logging API (tu código ok)
app.use((req, res, next) => {
  const start = Date.now();
  const p = req.path;
  let capturedJsonResponse: unknown;

  const summarizeResponse = (payload: unknown): unknown => {
    if (payload === null || payload === undefined) return payload;
    if (typeof payload !== "object") return payload;

    if (Array.isArray(payload)) {
      return { type: "array", length: payload.length };
    }

    const obj = payload as Record<string, unknown>;
    const previewKeys = Object.keys(obj).slice(0, 8);
    const summary: Record<string, unknown> = { keys: previewKeys };

    if (Array.isArray(obj.data)) {
      summary.dataType = "array";
      summary.dataLength = obj.data.length;
    } else if (obj.data && typeof obj.data === "object") {
      summary.dataType = "object";
    } else if ("data" in obj) {
      summary.dataType = typeof obj.data;
    }

    if (typeof obj.success === "boolean") summary.success = obj.success;
    if (typeof obj.message === "string") summary.message = obj.message;

    return summary;
  };

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson?: unknown) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (p.startsWith("/api")) {
      const responseSummary = summarizeResponse(capturedJsonResponse);
      appLogger.info("api.request", {
        requestId: res.locals.requestId,
        method: req.method,
        path: p,
        statusCode: res.statusCode,
        durationMs: duration,
        response: responseSummary,
      });
    }
  });

  next();
});

// Health
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    requestId: res.locals.requestId,
  });
});

// Test endpoints
app.get("/test", requireInternalApiKey, (req, res) => {
  res.json({
    status: "OK",
    message: "Test endpoint funcionando",
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
    requestId: res.locals.requestId,
  });
});

app.post("/test", requireInternalApiKey, (req, res) => {
  appLogger.info("test.post_received", { body: req.body });
  res.json({
    status: "OK",
    message: "Test POST funcionando",
    receivedData: req.body,
    timestamp: new Date().toISOString(),
    requestId: res.locals.requestId,
  });
});

// Favicon/static
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/favicon.ico"));
});
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.use(contactRoutes);
app.use(paymentRoutes);
app.use(publicRoutes);

// Error handler (al final)
app.use(globalErrorHandler);

app.listen(env.PORT, () => {
  appLogger.info("server.started", {
    port: env.PORT,
    allowedOrigins,
    nodeEnv: env.NODE_ENV,
    sessionSecretConfigured: true,
    mercadopagoAccessTokenConfigured: !!env.MERCADOPAGO_ACCESS_TOKEN,
    mercadopagoWebhookSecretConfigured: !!env.MERCADOPAGO_WEBHOOK_SECRET,
    smtpConfigured: !!env.SMTP_USER,
  });
});
