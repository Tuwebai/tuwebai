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

// Configuración de Nodemailer con GoDaddy SMTP
const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: 'admin@tuweb-ai.com', // Tu email de GoDaddy
    pass: process.env.GODADDY_EMAIL_PASSWORD || 'tu_contraseña_normal_aqui' // Contraseña de tu email
  },
  tls: {
    rejectUnauthorized: false
  }
});

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

    // Enviar email con Nodemailer
    try {
      const mailOptions = {
        from: contactData.email, // El email del usuario como remitente
        to: 'admin@tuweb-ai.com', // Siempre recibir en admin@tuweb-ai.com
        subject: `Nuevo contacto: ${contactData.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
            <h2 style="text-align: center; margin-bottom: 30px;">Nuevo Mensaje de Contacto - TuWeb.ai</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #ffd700;">Información del Contacto</h3>
              <p><strong>Nombre:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> ${contactData.email}</p>
              <p><strong>Asunto:</strong> ${contactData.title}</p>
              <p><strong>Fecha:</strong> ${contactData.createdAt.toLocaleString('es-AR')}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #ffd700;">Mensaje</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${contactData.message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; opacity: 0.8;">
              <p>Este mensaje fue enviado desde el formulario de contacto de TuWeb.ai</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log('✅ Email enviado correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError);
      // Continuar aunque falle el email
    }

    res.status(201).json({ 
      success: true, 
      message: "Mensaje recibido correctamente. Te responderemos pronto.",
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

// API de Consulta Estratégica Gratuita
app.post("/api/consulta", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    
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
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "El mensaje es requerido y debe tener al menos 10 caracteres"
      });
    }

    const consultaData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      createdAt: new Date(),
      source: 'consulta_estrategica_gratuita'
    };

    console.log('📋 Nueva consulta estratégica recibida:', consultaData);

    // Enviar email con Nodemailer
    try {
      const mailOptions = {
        from: consultaData.email, // El email del usuario como remitente
        to: 'admin@tuweb-ai.com', // Siempre recibir en admin@tuweb-ai.com
        subject: `Nueva Consulta Estratégica: ${consultaData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
            <h2 style="text-align: center; margin-bottom: 30px;">Nueva Consulta Estratégica Gratuita - TuWeb.ai</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #ffd700;">Información del Cliente</h3>
              <p><strong>Nombre:</strong> ${consultaData.name}</p>
              <p><strong>Email:</strong> ${consultaData.email}</p>
              <p><strong>Fecha:</strong> ${consultaData.createdAt.toLocaleString('es-AR')}</p>
              <p><strong>Tipo:</strong> Consulta Estratégica Gratuita</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #ffd700;">Mensaje del Cliente</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${consultaData.message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; opacity: 0.8;">
              <p>Este mensaje fue enviado desde el formulario de consulta estratégica gratuita de TuWeb.ai</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log('✅ Email de consulta enviado correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando email de consulta:', emailError);
    }

    res.status(201).json({ 
      success: true, 
      message: "Consulta enviada correctamente. Te contactaremos pronto para agendar tu consulta gratuita.",
      consulta: {
        id: Date.now(),
        date: consultaData.createdAt
      }
    });
  } catch (error: unknown) {
    console.error("Error en formulario de consulta:", error);
    
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

// Endpoint para formulario de propuesta personalizada (Detalles finales)
app.post("/api/propuesta", async (req: Request, res: Response) => {
  try {
    console.log('📋 Datos recibidos en propuesta:', req.body);
    
    const { 
      tipo_proyecto, 
      servicios, 
      presupuesto, 
      plazo, 
      detalles,
      nombre,
      email 
    } = req.body;
    
    // Validación más flexible para este formulario
    if (!detalles || typeof detalles !== 'string' || detalles.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Los detalles del proyecto son requeridos y deben tener al menos 5 caracteres"
      });
    }

    const propuestaData = {
      nombre: nombre || 'No especificado',
      email: email || 'No especificado',
      tipo_proyecto: tipo_proyecto || 'No especificado',
      servicios: servicios || 'No especificado',
      presupuesto: presupuesto || 'No especificado',
      plazo: plazo || 'No especificado',
      detalles: detalles.trim(),
      createdAt: new Date(),
      source: 'propuesta_personalizada'
    };

    console.log('📋 Nueva propuesta personalizada recibida:', propuestaData);

    // Enviar email con Nodemailer
    try {
      const mailOptions = {
        from: propuestaData.email, // El email del usuario como remitente
        to: 'admin@tuweb-ai.com', // Siempre recibir en admin@tuweb-ai.com
        subject: `Nueva Propuesta Personalizada: ${propuestaData.tipo_proyecto}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
            <h2 style="text-align: center; margin-bottom: 30px;">Nueva Propuesta Personalizada - TuWeb.ai</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #ffd700;">Información del Cliente</h3>
              <p><strong>Nombre:</strong> ${propuestaData.nombre}</p>
              <p><strong>Email:</strong> ${propuestaData.email}</p>
              <p><strong>Fecha:</strong> ${propuestaData.createdAt.toLocaleString('es-AR')}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #ffd700;">Detalles del Proyecto</h3>
              <p><strong>Tipo de proyecto:</strong> ${propuestaData.tipo_proyecto}</p>
              <p><strong>Servicios:</strong> ${propuestaData.servicios}</p>
              <p><strong>Presupuesto:</strong> ${propuestaData.presupuesto}</p>
              <p><strong>Plazo:</strong> ${propuestaData.plazo}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #ffd700;">Detalles del Proyecto</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${propuestaData.detalles}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; opacity: 0.8;">
              <p>Este mensaje fue enviado desde el formulario de propuesta personalizada de TuWeb.ai</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log('✅ Email de propuesta enviado correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando email de propuesta:', emailError);
    }

    res.status(201).json({ 
      success: true, 
      message: "Propuesta enviada correctamente. Te enviaremos tu propuesta personalizada pronto.",
      propuesta: {
        id: Date.now(),
        date: propuestaData.createdAt
      }
    });
  } catch (error: unknown) {
    console.error("Error en formulario de propuesta:", error);
    
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

// Endpoint alternativo para /contact (por si acaso)
app.post("/contact", async (req: Request, res: Response) => {
  // Redirigir al endpoint de consulta
  return res.redirect(307, '/api/consulta');
});

// API de Presupuesto
app.post("/api/presupuesto", async (req: Request, res: Response) => {
  try {
    const { 
      nombre, 
      email, 
      empresa, 
      tipo_proyecto, 
      servicios, 
      presupuesto_estimado, 
      plazo_estimado, 
      descripcion_proyecto,
      telefono 
    } = req.body;
    
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
    if (!descripcion_proyecto || typeof descripcion_proyecto !== 'string' || descripcion_proyecto.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "La descripción del proyecto es requerida y debe tener al menos 10 caracteres"
      });
    }

    const presupuestoData = {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      empresa: empresa || 'No especificado',
      tipo_proyecto: tipo_proyecto || 'No especificado',
      servicios: servicios || 'No especificado',
      presupuesto_estimado: presupuesto_estimado || 'No especificado',
      plazo_estimado: plazo_estimado || 'No especificado',
      descripcion_proyecto: descripcion_proyecto.trim(),
      telefono: telefono || 'No especificado',
      createdAt: new Date(),
      source: 'solicitud_presupuesto'
    };

    console.log('💰 Nueva solicitud de presupuesto recibida:', presupuestoData);

    // Enviar email con Nodemailer
    try {
      const mailOptions = {
        from: presupuestoData.email, // El email del usuario como remitente
        to: 'admin@tuweb-ai.com', // Siempre recibir en admin@tuweb-ai.com
        subject: `Nueva Solicitud de Presupuesto: ${presupuestoData.tipo_proyecto}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
            <h2 style="text-align: center; margin-bottom: 30px;">💰 Nueva Solicitud de Presupuesto - TuWeb.ai</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #ffd700;">👤 Información del Cliente</h3>
              <p><strong>Nombre:</strong> ${presupuestoData.nombre}</p>
              <p><strong>Email:</strong> ${presupuestoData.email}</p>
              <p><strong>Empresa:</strong> ${presupuestoData.empresa}</p>
              <p><strong>Teléfono:</strong> ${presupuestoData.telefono}</p>
              <p><strong>Fecha:</strong> ${presupuestoData.createdAt.toLocaleString('es-AR')}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #ffd700;">📋 Detalles del Proyecto</h3>
              <p><strong>Tipo de proyecto:</strong> ${presupuestoData.tipo_proyecto}</p>
              <p><strong>Servicios requeridos:</strong> ${presupuestoData.servicios}</p>
              <p><strong>Presupuesto estimado:</strong> ${presupuestoData.presupuesto_estimado}</p>
              <p><strong>Plazo estimado:</strong> ${presupuestoData.plazo_estimado}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #ffd700;">📝 Descripción del Proyecto</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${presupuestoData.descripcion_proyecto}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; opacity: 0.8;">
              <p>Este mensaje fue enviado desde el formulario de solicitud de presupuesto de TuWeb.ai</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log('✅ Email de presupuesto enviado correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando email de presupuesto:', emailError);
    }

    res.status(201).json({ 
      success: true, 
      message: "Solicitud de presupuesto enviada correctamente. Te enviaremos tu presupuesto personalizado en 24-48 horas.",
      presupuesto: {
        id: Date.now(),
        date: presupuestoData.createdAt
      }
    });
  } catch (error: unknown) {
    console.error("Error en formulario de presupuesto:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error inesperado en el servidor. Intenta de nuevo más tarde."
    });
  }
});

// API de Newsletter
app.post("/api/newsletter", async (req: Request, res: Response) => {
  try {
    const { email, nombre, interes } = req.body;
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: "El email es requerido y debe ser válido"
      });
    }

    const newsletterData = {
      email: email.trim().toLowerCase(),
      nombre: nombre || 'Suscriptor',
      interes: interes || 'General',
      createdAt: new Date(),
      source: 'newsletter'
    };

    console.log('📧 Nueva suscripción al newsletter:', newsletterData);

    // Enviar email con Nodemailer
    try {
      const mailOptions = {
        from: newsletterData.email, // El email del usuario como remitente
        to: 'admin@tuweb-ai.com', // Siempre recibir en admin@tuweb-ai.com
        subject: `📧 Nueva Suscripción al Newsletter: ${newsletterData.email}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
            <h2 style="text-align: center; margin-bottom: 30px;">📧 Nueva Suscripción al Newsletter - TuWeb.ai</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #ffd700;">👤 Información del Suscriptor</h3>
              <p><strong>Nombre:</strong> ${newsletterData.nombre}</p>
              <p><strong>Email:</strong> ${newsletterData.email}</p>
              <p><strong>Área de interés:</strong> ${newsletterData.interes}</p>
              <p><strong>Fecha de suscripción:</strong> ${newsletterData.createdAt.toLocaleString('es-AR')}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #ffd700;">📊 Estadísticas</h3>
              <p>Total de suscriptores: [Contador automático]</p>
              <p>Última suscripción: ${newsletterData.createdAt.toLocaleString('es-AR')}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; opacity: 0.8;">
              <p>Este mensaje fue enviado desde el formulario de newsletter de TuWeb.ai</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log('✅ Email de newsletter enviado correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando email de newsletter:', emailError);
    }

    res.status(201).json({ 
      success: true, 
      message: "¡Gracias por suscribirte! Recibirás contenido exclusivo sobre desarrollo web y marketing digital.",
      newsletter: {
        id: Date.now(),
        date: newsletterData.createdAt
      }
    });
  } catch (error: unknown) {
    console.error("Error en formulario de newsletter:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error inesperado en el servidor. Intenta de nuevo más tarde."
    });
  }
});

// API de Solicitud de Demo
app.post("/api/demo", async (req: Request, res: Response) => {
  try {
    const { 
      nombre, 
      email, 
      empresa, 
      tipo_demo, 
      fecha_preferida, 
      horario_preferido,
      telefono,
      comentarios 
    } = req.body;
    
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

    const demoData = {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      empresa: empresa || 'No especificado',
      tipo_demo: tipo_demo || 'General',
      fecha_preferida: fecha_preferida || 'No especificado',
      horario_preferido: horario_preferido || 'No especificado',
      telefono: telefono || 'No especificado',
      comentarios: comentarios || 'Sin comentarios adicionales',
      createdAt: new Date(),
      source: 'solicitud_demo'
    };

    console.log('🎬 Nueva solicitud de demo recibida:', demoData);

    // Enviar email con Nodemailer
    try {
      const mailOptions = {
        from: demoData.email, // El email del usuario como remitente
        to: 'admin@tuweb-ai.com', // Siempre recibir en admin@tuweb-ai.com
        subject: `🎬 Nueva Solicitud de Demo: ${demoData.tipo_demo}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
            <h2 style="text-align: center; margin-bottom: 30px;">🎬 Nueva Solicitud de Demo - TuWeb.ai</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #ffd700;">👤 Información del Cliente</h3>
              <p><strong>Nombre:</strong> ${demoData.nombre}</p>
              <p><strong>Email:</strong> ${demoData.email}</p>
              <p><strong>Empresa:</strong> ${demoData.empresa}</p>
              <p><strong>Teléfono:</strong> ${demoData.telefono}</p>
              <p><strong>Fecha de solicitud:</strong> ${demoData.createdAt.toLocaleString('es-AR')}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #ffd700;">📅 Detalles de la Demo</h3>
              <p><strong>Tipo de demo:</strong> ${demoData.tipo_demo}</p>
              <p><strong>Fecha preferida:</strong> ${demoData.fecha_preferida}</p>
              <p><strong>Horario preferido:</strong> ${demoData.horario_preferido}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #ffd700;">💬 Comentarios Adicionales</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${demoData.comentarios}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; opacity: 0.8;">
              <p>Este mensaje fue enviado desde el formulario de solicitud de demo de TuWeb.ai</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log('✅ Email de demo enviado correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando email de demo:', emailError);
    }

    res.status(201).json({ 
      success: true, 
      message: "Solicitud de demo enviada correctamente. Te contactaremos pronto para coordinar la fecha y hora.",
      demo: {
        id: Date.now(),
        date: demoData.createdAt
      }
    });
  } catch (error: unknown) {
    console.error("Error en formulario de demo:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error inesperado en el servidor. Intenta de nuevo más tarde."
    });
  }
});

// API de Feedback/Testimonios
app.post("/api/feedback", async (req: Request, res: Response) => {
  try {
    const { 
      nombre, 
      email, 
      tipo_feedback, 
      rating, 
      comentario,
      proyecto,
      empresa 
    } = req.body;
    
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "El nombre es requerido y debe tener al menos 2 caracteres"
      });
    }
    if (!comentario || typeof comentario !== 'string' || comentario.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "El comentario es requerido y debe tener al menos 10 caracteres"
      });
    }

    const feedbackData = {
      nombre: nombre.trim(),
      email: email || 'No especificado',
      tipo_feedback: tipo_feedback || 'General',
      rating: rating || 'No especificado',
      comentario: comentario.trim(),
      proyecto: proyecto || 'No especificado',
      empresa: empresa || 'No especificado',
      createdAt: new Date(),
      source: 'feedback_testimonio'
    };

    console.log('⭐ Nuevo feedback/testimonio recibido:', feedbackData);

    // Enviar email con Nodemailer
    try {
      const mailOptions = {
        from: feedbackData.email, // El email del usuario como remitente
        to: 'admin@tuweb-ai.com', // Siempre recibir en admin@tuweb-ai.com
        subject: `⭐ Nuevo Feedback: ${feedbackData.nombre} - ${feedbackData.rating}/5`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
            <h2 style="text-align: center; margin-bottom: 30px;">⭐ Nuevo Feedback/Testimonio - TuWeb.ai</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #ffd700;">👤 Información del Cliente</h3>
              <p><strong>Nombre:</strong> ${feedbackData.nombre}</p>
              <p><strong>Email:</strong> ${feedbackData.email}</p>
              <p><strong>Empresa:</strong> ${feedbackData.empresa}</p>
              <p><strong>Proyecto:</strong> ${feedbackData.proyecto}</p>
              <p><strong>Fecha:</strong> ${feedbackData.createdAt.toLocaleString('es-AR')}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #ffd700;">📊 Evaluación</h3>
              <p><strong>Tipo de feedback:</strong> ${feedbackData.tipo_feedback}</p>
              <p><strong>Calificación:</strong> ${feedbackData.rating}/5 ⭐</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #ffd700;">💬 Comentario/Testimonio</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${feedbackData.comentario}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; opacity: 0.8;">
              <p>Este mensaje fue enviado desde el formulario de feedback/testimonios de TuWeb.ai</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log('✅ Email de feedback enviado correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando email de feedback:', emailError);
    }

    res.status(201).json({ 
      success: true, 
      message: "¡Gracias por tu feedback! Tu opinión es muy valiosa para nosotros.",
      feedback: {
        id: Date.now(),
        date: feedbackData.createdAt
      }
    });
  } catch (error: unknown) {
    console.error("Error en formulario de feedback:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error inesperado en el servidor. Intenta de nuevo más tarde."
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
