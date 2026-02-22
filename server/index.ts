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
    origin: function (origin, callback) {
      console.log(`🔍 CORS check - Origin: ${origin}`);
      
      // Permitir todos los orígenes para desarrollo
      if (!origin) {
        console.log(`✅ CORS permitido (no origin)`);
        return callback(null, true);
      }
      
      // Lista de orígenes permitidos
      const allowedOrigins = [
        "https://tuweb-ai.com",
        "https://www.tuweb-ai.com",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173"
      ];
      
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS permitido para: ${origin}`);
        callback(null, true);
      } else {
        console.log(`❌ CORS bloqueado para: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
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
  res.json = function (bodyJson?: any) {
    capturedJsonResponse = bodyJson;
    return originalResJson.call(res, bodyJson);
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
    
    const testData = {
      name: 'Sistema de Prueba',
      email: 'test@tuweb-ai.com',
      message: 'Este es un email de prueba para verificar que Nodemailer funciona correctamente con la nueva plantilla profesional.',
      type: 'test' as const
    };
    
    const testResult = await transporter.sendMail({
      from: 'tuwebai@gmail.com',
      to: 'tuwebai@gmail.com',
      subject: 'Test de Nodemailer - ' + new Date().toISOString(),
      html: generateEmailTemplate(testData)
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
      error: error instanceof Error ? error.message : String(error),
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
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'tuwebai@gmail.com',
    pass: 'c z n h h w t e c r q m k u a a'
  }
});

// Función para generar plantilla de email profesional
function generateEmailTemplate(data: {
  name: string;
  email: string;
  message: string;
  title?: string;
  type: 'contact' | 'test';
}) {
  const { name, email, message, title, type } = data;
  
  const emailTitle = title || "Consulta desde formulario de contacto";
  const isTest = type === 'test';
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${emailTitle}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f8f9fa;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
                 .logo-container {
           display: flex;
           align-items: center;
           justify-content: center;
           margin-bottom: 15px;
           width: 100%;
           gap: 15px;
         }
         .logo-image {
           width: 50px;
           height: 50px;
           border-radius: 8px;
           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
         }
         .logo-text {
           font-size: 36px;
           font-weight: bold;
           text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
           text-align: center;
           letter-spacing: 2px;
         }
        .subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }
        .content {
          padding: 40px 30px;
        }
        .title {
          color: #2d3748;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 30px;
          text-align: center;
        }
        .info-section {
          background-color: #f7fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
          border-left: 4px solid #667eea;
        }
        .info-item {
          margin-bottom: 15px;
        }
        .info-label {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 5px;
        }
        .info-value {
          color: #2d3748;
          font-size: 16px;
        }
        .message-section {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }
        .message-label {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .message-content {
          color: #2d3748;
          font-size: 16px;
          line-height: 1.7;
          white-space: pre-wrap;
        }
        .footer {
          background-color: #2d3748;
          color: white;
          text-align: center;
          padding: 20px;
          font-size: 14px;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        .timestamp {
          color: #718096;
          font-size: 12px;
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 8px;
          }
          .content {
            padding: 20px 15px;
          }
          .header {
            padding: 20px 15px;
          }
                     .logo-container {
             flex-direction: column;
             gap: 10px;
           }
           .logo-image {
             width: 40px;
             height: 40px;
           }
           .logo-text {
             font-size: 30px;
             letter-spacing: 1px;
           }
        }
      </style>
    </head>
    <body>
      <div class="container">
                 <div class="header">
           <div class="logo-container">
             <img src="https://tuweb-ai.com/logo.png" alt="TuWebAI Logo" class="logo-image" onerror="this.style.display='none'">
             <div class="logo-text">TuWebAI</div>
           </div>
           <p class="subtitle">Agencia Digital de Desarrollo Web</p>
         </div>
        
        <div class="content">
          <h1 class="title">${isTest ? 'Test de Nodemailer' : emailTitle}</h1>
          
          <div class="info-section">
            <div class="info-item">
              <div class="info-label">👤 Nombre:</div>
              <div class="info-value">${name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">📧 Email:</div>
              <div class="info-value">${email}</div>
            </div>
            ${isTest ? `
            <div class="info-item">
              <div class="info-label">🖥️ Servidor:</div>
              <div class="info-value">tuwebai-backend.onrender.com</div>
            </div>
            ` : ''}
          </div>
          
          <div class="message-section">
            <div class="message-label">💬 Mensaje:</div>
            <div class="message-content">${message}</div>
          </div>
          
          <div class="timestamp">
            📅 Enviado el: ${new Date().toLocaleString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/Argentina/Buenos_Aires'
            })}
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 TuWebAI. Todos los derechos reservados.</p>
          <p>Visita nuestro sitio: <a href="https://tuweb-ai.com">tuweb-ai.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

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

    // Enviar email con Nodemailer usando plantilla profesional
    const emailResult = await transporter.sendMail({
      from: 'tuwebai@gmail.com',
      to: 'tuwebai@gmail.com',
      subject: emailTitle,
      html: generateEmailTemplate({
        name,
        email,
        message,
        title: emailTitle,
        type: 'contact'
      })
    });

    console.log("✅ Email enviado exitosamente:", emailResult.messageId);
    return res.json({ message: "Mensaje enviado correctamente" });
  } catch (err: any) {
    console.error("❌ Error en endpoint /contact:", err);
    console.error("❌ Error details:", {
      message: err?.message,
      stack: err?.stack,
      name: err?.name
    });
    
    // Devolver error más específico
    return res.status(500).json({ 
      error: "Error en el servidor",
      details: process.env.NODE_ENV === "development" ? err?.message : "Error interno del servidor"
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

    // Enviar email con Nodemailer usando plantilla profesional
    await transporter.sendMail({
      from: 'tuwebai@gmail.com',
      to: 'tuwebai@gmail.com',
      subject: title,
      html: generateEmailTemplate({
        name,
        email,
        message,
        title,
        type: 'contact'
      })
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
