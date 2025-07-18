import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import session from 'express-session';
import MemoryStore from 'memorystore';
import path from 'path';
import passport from 'passport';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
  "https://tuweb-ai.com",
  "https://www.tuweb-ai.com",
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept"
    ],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.options("*", cors());

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
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
    secret: process.env.SESSION_SECRET || 'tuwebai-super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
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
      console.log(logLine);
    }
  });
  next();
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/favicon.ico'));
});
app.use(express.static(path.join(__dirname, '../public')));

// API de Contacto
app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    const { nombre, email, asunto, mensaje } = req.body;
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "El nombre es requerido y debe tener al menos 2 caracteres"
      });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: "El email es requerido y debe ser válido"
      });
    }
    if (!asunto || typeof asunto !== 'string' || asunto.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "El asunto es requerido y debe tener al menos 3 caracteres"
      });
    }
    if (!mensaje || typeof mensaje !== 'string' || mensaje.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "El mensaje es requerido y debe tener al menos 10 caracteres"
      });
    }
    const contactData = {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      asunto: asunto.trim(),
      mensaje: mensaje.trim(),
      createdAt: new Date(),
      source: req.body.source || 'sitio_web_principal'
    };
    console.log('📧 Nuevo contacto recibido:', contactData);
    // --- Si tenés lógica de Firestore, dejarla aquí ---
    // await firestore.collection('contacts').add(contactData);
    // -----------------------------------------------
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('❌ Faltan variables SMTP:', { smtpHost, smtpUser, smtpPass });
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor: faltan variables SMTP. Contactá al administrador.'
      });
    }
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true' || parseInt(process.env.SMTP_PORT || '465') === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    const adminMailHtml = `
      <div style="background:#0a0a0f;padding:32px 0;font-family:Inter,Arial,sans-serif;min-height:100vh;">
        <div style="max-width:520px;margin:0 auto;background:#18181b;border-radius:16px;padding:32px 24px;box-shadow:0 4px 24px rgba(0,0,0,0.12);color:#fff;">
          <h2 style="color:#00ccff;font-size:1.5rem;margin-bottom:16px;">Nuevo mensaje de contacto desde TuWeb.ai</h2>
          <ul style="color:#fff;font-size:1rem;line-height:1.7;">
            <li><b>Nombre:</b> ${contactData.nombre}</li>
            <li><b>Email:</b> ${contactData.email}</li>
            <li><b>Asunto:</b> ${contactData.asunto}</li>
            <li><b>Mensaje:</b> ${contactData.mensaje}</li>
            <li><b>Origen:</b> ${contactData.source}</li>
          </ul>
          <p style="color:#b3b3b3;font-size:0.95rem;margin-top:32px;">Mensaje recibido el ${new Date().toLocaleString('es-AR')}</p>
        </div>
      </div>
    `;
    try {
      await transporter.sendMail({
        from: `TuWeb.ai <${smtpUser}>`,
        to: 'admin@tuweb-ai.com',
        subject: `Nuevo contacto: ${contactData.asunto}`,
        html: adminMailHtml,
      });
    } catch (err: unknown) {
      console.error('❌ Error enviando email:', err);
      return res.status(500).json({
        success: false,
        message: 'No se pudo enviar el email de contacto. Intenta de nuevo más tarde.'
      });
    }
    res.status(201).json({ 
      success: true, 
      message: "Mensaje enviado correctamente. Te responderemos pronto.",
      contact: {
        id: Date.now(),
        date: contactData.createdAt
      }
    });
  } catch (error: unknown) {
    console.error("Error en formulario de contacto:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error inesperado en el servidor. Intenta de nuevo más tarde."
    });
  }
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const status = (err as any).status || (err as any).statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error('Express error middleware:', err);
  if (!res.headersSent) {
    res.status(status).json({ 
      success: false, 
      message,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en puerto ${port}`);
  console.log(`🌍 Orígenes permitidos CORS: ${allowedOrigins.join(', ')}`);
  console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 SESSION_SECRET: ${process.env.SESSION_SECRET ? 'Configurado' : 'No configurado'}`);
  console.log(`📊 DATABASE_URL: ${process.env.DATABASE_URL ? 'Configurado' : 'No configurado'}`);
  console.log(`🔐 GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? 'Configurado' : 'No configurado'}`);
});
