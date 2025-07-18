import dotenv from 'dotenv';
dotenv.config();
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import session from 'express-session';
import MemoryStore from 'memorystore';
import path from 'path';
import { storage } from './storage';
import passport from 'passport';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definición personalizada para extender Request con session
declare module 'express-session' {
  interface SessionData {
    userId: number;
    userEmail: string;
  }
}

// Función de logging simple
const log = (message: string, source = "express") => {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
};

// Función para servir archivos estáticos en producción
const serveStatic = (app: express.Express) => {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));
  // Solo servir index.html para rutas que NO sean de la API
  app.use("*", (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ 
        success: false, 
        message: "API endpoint not found" 
      });
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
};

const app = express();

// Configuración CORS definitiva y estricta para producción
const allowedOrigins = process.env.NODE_ENV === 'development' 
  ? ['https://tuweb-ai.com', 'https://www.tuweb-ai.com', 'http://localhost:3000', 'http://localhost:5173']
  : ['https://tuweb-ai.com', 'https://www.tuweb-ai.com'];

app.use(cors({
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Permitir requests sin origin (como mobile apps o Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('🚫 CORS bloqueado para origen:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));

// Configuración de headers de seguridad con CSP permisivo para Google OAuth
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://www.gstatic.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "https://accounts.google.com", "https://www.gstatic.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      connectSrc: ["*"],
      imgSrc: ["*", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameAncestors: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Headers adicionales para OAuth
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

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
      secure: process.env.NODE_ENV === 'production', // true en producción
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      httpOnly: true,
      domain: process.env.NODE_ENV === 'production' ? '.tuweb-ai.com' : undefined,
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

// Endpoint de prueba directo en index.ts
app.post('/api/test', (req, res) => {
  console.log('🧪 Endpoint de prueba llamado');
  res.json({ 
    success: true, 
    message: 'Endpoint de prueba funcionando',
    timestamp: new Date().toISOString()
  });
});

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

  // No usar serveStatic en producción - este es un backend puro
  // El frontend se sirve desde otro dominio

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
    console.log(`🌍 Orígenes permitidos CORS: ${allowedOrigins.join(', ')}`);
    console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔑 SESSION_SECRET: ${process.env.SESSION_SECRET ? 'Configurado' : 'No configurado'}`);
    console.log(`📊 DATABASE_URL: ${process.env.DATABASE_URL ? 'Configurado' : 'No configurado'}`);
    console.log(`🔐 GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? 'Configurado' : 'No configurado'}`);
  });
})();
