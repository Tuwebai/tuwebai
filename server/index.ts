import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { router } from './routes';
import { serveStatic, log } from "./vite";
import session from 'express-session';
import MemoryStore from 'memorystore';
import path from 'path';
import { storage } from './storage';
import passport from 'passport';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definición personalizada para extender Request con session
declare module 'express-session' {
  interface SessionData {
    userId: number;
    userEmail: string;
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

export default app;

// Configuración de la sesión
// Utilizamos MemoryStore para almacenar sesiones en memoria localmente
const Store = MemoryStore(session);
const sessionStore = new Store({
  checkPeriod: 86400000 // Limpiar sesiones expiradas cada 24 horas
});

log("Usando MemoryStore para almacenar sesiones localmente");

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'tuwebai-super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // SIEMPRE false en desarrollo
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
      sameSite: 'lax', // SIEMPRE lax en desarrollo
      httpOnly: true,
      domain: undefined, // Nunca poner dominio en desarrollo
    },
    store: sessionStore,
    name: 'tuwebai.sid',
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware de logging para debugging de sesiones
app.use((req: any, res: any, next: any) => {
  if (req.path.includes('/auth/')) {
    console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('🍪 Session ID:', req.sessionID);
    console.log('👤 User ID en sesión:', (req.session as any)?.userId);
    console.log('📧 User Email en sesión:', (req.session as any)?.userEmail);
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Servir favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/favicon.ico'));
});

// Servir recursos estáticos (por ejemplo, /public)
app.use(express.static(path.join(__dirname, '../public')));

const httpServer = createServer(app);

let setupVite: any;
if (process.env.NODE_ENV === 'development') {
  (async () => {
    const viteModule = await import('./vite');
    setupVite = viteModule.setupVite;
  })();
}

(async () => {
  if (process.env.NODE_ENV === 'development' && setupVite) {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  httpServer.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
