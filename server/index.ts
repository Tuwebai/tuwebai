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
import { MercadoPagoConfig, Preference } from 'mercadopago';
import emailjs from '@emailjs/nodejs';

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

// Endpoint de prueba para verificar que el servidor funciona
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/favicon.ico'));
});
app.use(express.static(path.join(__dirname, '../public')));

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

// Configuración Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const preference = new Preference(client);

app.post('/crear-preferencia', async (req: Request, res: Response) => {
  try {
    const { plan } = req.body;
    if (!plan) return res.status(400).json({ error: 'Plan requerido' });
    // Definir precios según plan
    const precios: Record<string, number> = {
      'Plan Básico': 299000,
      'Plan Profesional': 499000,
      'Plan Enterprise': 999000,
    };
    if (!precios[plan]) return res.status(400).json({ error: 'Plan inválido' });
    const preferenceData = {
      items: [
        {
          id: plan.toLowerCase().replace(/\s+/g, '-'),
          title: plan,
          unit_price: precios[plan],
          quantity: 1,
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: 'https://tuweb-ai.com/pago-exitoso',
        failure: 'https://tuweb-ai.com/pago-fallido',
        pending: 'https://tuweb-ai.com/pago-pendiente',
      },
      auto_return: 'approved',
    };
    const mpRes = await preference.create({ body: preferenceData });
    return res.json({ init_point: mpRes.init_point });
  } catch (err) {
    console.error('Error Mercado Pago:', err);
    return res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
});

// Configuración de EmailJS - READY FOR PRODUCTION
const EMAILJS_SERVICE_ID = "service_9s9hqqn";
const EMAILJS_TEMPLATE_ID = "template_8pxfpyh";
const EMAILJS_PUBLIC_KEY = "bPdFsDkAPp5dXKALy";

// API de Contacto con EmailJS
app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, title, message } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
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
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "El asunto es requerido y debe tener al menos 3 caracteres"
      });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "El mensaje es requerido y debe tener al menos 10 caracteres"
      });
    }

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      title: title.trim(),
      message: message.trim(),
      createdAt: new Date(),
      source: req.body.source || 'sitio_web_principal'
    };

    console.log('📧 Nuevo contacto recibido:', contactData);

    // Enviar email con EmailJS
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        name: contactData.name,
        email: contactData.email,
        title: contactData.title,
        message: contactData.message,
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY
      }
    );

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
    
    // Log detallado del error
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Error inesperado en el servidor. Intenta de nuevo más tarde.",
      error: process.env.NODE_ENV === 'development' ? error : undefined
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
