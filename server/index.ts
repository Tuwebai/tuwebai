import dotenv from 'dotenv';
dotenv.config();
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from 'express-session';
import MemoryStore from 'memorystore';
import path from 'path';
import { storage } from './storage';
import passport from 'passport';
import { fileURLToPath } from 'url';

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
app.use((req: Request, res: Response, next: NextFunction) => {
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

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error('Express error middleware:', err);
    
    // Si es un error de OAuth, manejar específicamente
    if (err.code === 'invalid_grant') {
      console.error('❌ Error de Google OAuth - invalid_grant:', err);
      console.error('📋 Detalles del error:', {
        message: err.message,
        status: err.status,
        uri: err.uri
      });
      
      if (!res.headersSent) {
        return res.status(400).json({
          success: false,
          message: "Error de autenticación con Google. El código de autorización ha expirado o es inválido. Por favor, intenta de nuevo.",
          error: 'oauth_invalid_grant',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
    }
    
    // Otros errores de OAuth
    if (err.code && err.code.startsWith('oauth_')) {
      console.error('❌ Error de OAuth:', err.code, err.message);
      if (!res.headersSent) {
        return res.status(400).json({
          success: false,
          message: "Error de autenticación con Google. Por favor, verifica tu configuración e intenta de nuevo.",
          error: err.code,
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
    }
    
    // Error genérico
    if (!res.headersSent) {
      res.status(status).json({ 
        success: false, 
        message,
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    // No hacer throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
