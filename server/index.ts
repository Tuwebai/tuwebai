import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import path from "path";
import passport from "passport";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import nodemailer from "nodemailer";
import crypto from "crypto";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
  "https://tuweb-ai.com",
  "https://www.tuweb-ai.com",
  "https://api.tuweb-ai.com",
  "http://localhost:3000",
  "http://localhost:5173"
];

// Agregar logging para debug de CORS
app.use((req, res, next) => {
  console.log(`🌐 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log(`📍 Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`🔗 Referer: ${req.headers.referer || 'No referer'}`);
  next();
});

app.use(
  cors({
    origin: true, // Permitir TODOS los orígenes
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "X-Signature",
      "X-Request-Id"
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
    secret: process.env.SESSION_SECRET || "tuwebai-super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      httpOnly: true,
      domain: process.env.NODE_ENV === "production" ? ".tuweb-ai.com" : undefined
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
    console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log("🍪 Session ID:", req.sessionID);
    console.log("👤 User ID en sesión:", (req.session as any)?.userId);
    console.log("📧 User Email en sesión:", (req.session as any)?.userEmail);
  }
  next();
});

// Middleware de logging para API
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any;

  const originalResJson = res.json;
  res.json = function (bodyJson: any, ...args: any[]) {
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

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

// Test endpoint para verificar que el servidor responde
app.get("/test", (req, res) => {
  res.json({
    status: "OK",
    message: "Test endpoint funcionando",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development"
  });
});

// Test endpoint POST simple
app.post("/test", (req, res) => {
  console.log("🧪 POST /test recibido");
  console.log("📋 Body:", req.body);
  res.json({
    status: "OK",
    message: "Test POST funcionando",
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint para probar Nodemailer
app.post("/test-email", async (req, res) => {
  try {
    console.log("📧 Test de Nodemailer iniciado...");
    
    const testResult = await transporter.sendMail({
      from: 'tuwebai@gmail.com',
      to: 'tuwebai@gmail.com',
      subject: 'Test de Nodemailer - ' + new Date().toISOString(),
      html: `
        <h2>Test de Nodemailer</h2>
        <p>Este es un email de prueba para verificar que Nodemailer funciona correctamente.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Servidor:</strong> tuwebai-backend.onrender.com</p>
      `
    });
    
    console.log("✅ Test de email exitoso:", testResult.messageId);
    res.json({
      status: "OK",
      message: "Email de prueba enviado correctamente",
      messageId: testResult.messageId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Error en test de email:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error enviando email de prueba",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Favicon
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/favicon.ico"));
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "" 
});
const preference = new Preference(client);
const payment = new Payment(client);

// Endpoint para crear preferencia de pago
app.post("/crear-preferencia", async (req, res) => {
  try {
    const { plan } = req.body;
    if (!plan) return res.status(400).json({ error: "Plan requerido" });

    const precios = {
      "Plan Básico": 299000,
      "Plan Profesional": 499000,
      "Plan Enterprise": 999000
    };

    if (!precios[plan as keyof typeof precios]) {
      return res.status(400).json({ error: "Plan inválido" });
    }

    const preferenceData = {
      items: [
        {
          id: plan.toLowerCase().replace(/\s+/g, "-"),
          title: plan,
          unit_price: precios[plan as keyof typeof precios],
          quantity: 1,
          currency_id: "ARS"
        }
      ],
      back_urls: {
        success: "https://tuweb-ai.com/pago-exitoso",
        failure: "https://tuweb-ai.com/pago-fallido",
        pending: "https://tuweb-ai.com/pago-pendiente"
      },
      auto_return: "approved"
    };

    const mpRes = await preference.create({ body: preferenceData });
    return res.json({ init_point: mpRes.init_point });
  } catch (err) {
    console.error("Error Mercado Pago:", err);
    return res.status(500).json({ error: "Error al crear preferencia de pago" });
  }
});

// Configuración de Nodemailer (SMTP Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tuwebai@gmail.com',
    pass: 'c z n h h w t e c r q m k u a a'
  }
});

// Endpoint de consulta (alias para compatibilidad)
app.post("/contact", async (req, res) => {
  console.log("📧 POST /contact recibido");
  console.log("📋 Body recibido:", req.body);
  
  try {
    const { name, email, title, message } = req.body;

    console.log("🔍 Validando campos...");
    console.log("- name:", name);
    console.log("- email:", email);
    console.log("- title:", title);
    console.log("- message:", message);

    // Validar campos requeridos
    if (!name || !email || !message || message.trim().length < 10) {
      console.log("❌ Validación fallida");
      return res.status(400).json({ error: "Datos inválidos: nombre, email y mensaje son requeridos" });
    }

    // Usar título por defecto si no se proporciona
    const emailTitle = title || "Consulta desde formulario de contacto";
    console.log("📝 Título del email:", emailTitle);

    console.log("📤 Enviando email con Nodemailer...");
    console.log("- From:", 'tuwebai@gmail.com');
    console.log("- To:", 'tuwebai@gmail.com');
    console.log("- Subject:", emailTitle);

    // Enviar email con Nodemailer
    const emailResult = await transporter.sendMail({
      from: 'tuwebai@gmail.com',
      to: 'tuwebai@gmail.com',
      subject: emailTitle,
      html: `
        <h2>Nueva consulta desde el sitio web</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `
    });

    console.log("✅ Email enviado exitosamente:", emailResult.messageId);
    return res.json({ message: "Mensaje enviado correctamente" });
  } catch (err) {
    console.error("❌ Error en endpoint /contact:", err);
    console.error("❌ Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    // Devolver error más específico
    return res.status(500).json({ 
      error: "Error en el servidor",
      details: process.env.NODE_ENV === "development" ? err.message : "Error interno del servidor"
    });
  }
});

// Endpoint de consulta (original)
app.post("/consulta", async (req, res) => {
  try {
    const { name, email, title, message } = req.body;

    if (!name || !email || !title || !message || message.trim().length < 10) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // Enviar email con Nodemailer
    await transporter.sendMail({
      from: 'tuwebai@gmail.com',
      to: 'tuwebai@gmail.com',
      subject: title,
      html: `
        <h2>Nueva consulta desde el sitio web</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `
    });

    return res.json({ message: "Mensaje enviado correctamente" });
  } catch (err) {
    console.error("Error en consulta:", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// Función para crear directorio de logs si no existe
function ensureLogDirectory() {
  const logDir = path.join(__dirname, "../logs/mercadopago");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return logDir;
}

// Función para escribir logs
function writeLog(data: any) {
  try {
    const logDir = ensureLogDirectory();
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(logDir, `${today}.log`);
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${JSON.stringify(data)}\n`;
    
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error("Error escribiendo log:", error);
  }
}

// Función para verificar firma del webhook
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error("Error verificando firma:", error);
    return false;
  }
}

// Endpoint de health check para webhook
app.get("/webhook/mercadopago/health", (req, res) => {
  res.json({ ok: true });
});

// Endpoint principal del webhook de Mercado Pago
app.post("/webhook/mercadopago", async (req, res) => {
  const startTime = Date.now();
  
  // Responder inmediatamente con 200 (ack)
  res.status(200).json({ received: true });
  
  try {
    // Log headers clave
    const headers = {
      'x-signature': req.headers['x-signature'],
      'x-request-id': req.headers['x-request-id'],
      'user-agent': req.headers['user-agent']
    };
    
    console.log("🔔 Webhook recibido - Headers:", headers);
    
    // Persistir el body recibido
    const webhookData = {
      timestamp: new Date().toISOString(),
      headers,
      body: req.body,
      ip: req.ip
    };
    
    writeLog(webhookData);
    
    // Verificar firma si existe MERCADOPAGO_WEBHOOK_SECRET
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers['x-signature'] as string;
      const payload = JSON.stringify(req.body);
      
      if (!signature || !verifyWebhookSignature(payload, signature, webhookSecret)) {
        console.error("❌ Firma del webhook inválida");
        writeLog({
          timestamp: new Date().toISOString(),
          error: "Firma inválida",
          headers,
          body: req.body
        });
        return; // Ya respondimos 200, solo logueamos el error
      }
    }
    
    // Parsear el evento
    const { type, data } = req.body;
    
    if (!data?.id || !type) {
      console.error("❌ Webhook sin data.id o type");
      return;
    }
    
    // Solo procesar eventos de pago
    if (type !== 'payment') {
      console.log(`ℹ️ Evento ignorado: ${type}`);
      return;
    }
    
    const paymentId = data.id;
    console.log(`💳 Procesando pago ID: ${paymentId}`);
    
    // Verificar idempotencia (implementación básica)
    const processedKey = `processed_${paymentId}`;
    if (global[processedKey as keyof typeof global]) {
      console.log(`🔄 Pago ${paymentId} ya procesado, ignorando`);
      return;
    }
    
    // Marcar como procesado
    (global as any)[processedKey] = true;
    
    // Consultar API de Mercado Pago para obtener detalles del pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("❌ MERCADOPAGO_ACCESS_TOKEN no configurado");
      return;
    }
    
    try {
      const paymentDetails = await payment.get({ id: paymentId });
      
      console.log(`📊 Estado del pago ${paymentId}: ${paymentDetails.status}`);
      
      // Actualizar pedido en DB (implementación básica)
      const orderData = {
        payment_id: paymentId,
        status: paymentDetails.status,
        amount: paymentDetails.transaction_amount,
        currency: paymentDetails.currency_id,
        payer_email: paymentDetails.payer?.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Aquí iría la lógica para actualizar la base de datos
      console.log("💾 Actualizando pedido:", orderData);
      
      // Log del procesamiento exitoso
      writeLog({
        timestamp: new Date().toISOString(),
        success: true,
        payment_id: paymentId,
        status: paymentDetails.status,
        processing_time: Date.now() - startTime
      });
      
    } catch (apiError) {
      console.error(`❌ Error consultando API de MP para pago ${paymentId}:`, apiError);
      writeLog({
        timestamp: new Date().toISOString(),
        error: "Error consultando API de MP",
        payment_id: paymentId,
        api_error: apiError
      });
    }
    
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    writeLog({
      timestamp: new Date().toISOString(),
      error: "Error general procesando webhook",
      error_details: error
    });
  }
});

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error("Express error middleware:", err);
  
  if (!res.headersSent) {
    res.status(status).json({
      success: false,
      message,
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en puerto ${port}`);
  console.log(`🌍 Orígenes permitidos CORS: ${allowedOrigins.join(", ")}`);
  console.log(`⚙️ NODE_ENV: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔐 SESSION_SECRET: ${process.env.SESSION_SECRET ? "Configurado" : "No configurado"}`);
  console.log(`💳 MERCADOPAGO_ACCESS_TOKEN: ${process.env.MERCADOPAGO_ACCESS_TOKEN ? "Configurado" : "No configurado"}`);
  console.log(`🔒 MERCADOPAGO_WEBHOOK_SECRET: ${process.env.MERCADOPAGO_WEBHOOK_SECRET ? "Configurado" : "No configurado"}`);
  console.log(`📧 NODEMAILER: ${transporter ? "Configurado" : "No configurado"}`);
  console.log(`🌐 Webhook URL: https://tuwebai-backend.onrender.com/webhook/mercadopago`);
  console.log(`🏥 Health Check: https://tuwebai-backend.onrender.com/webhook/mercadopago/health`);
});
