// server/index.ts
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
import emailjs from "@emailjs/nodejs";
import crypto from "crypto";
import fs from "fs";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var allowedOrigins = [
  "https://tuweb-ai.com",
  "https://www.tuweb-ai.com",
  "https://api.tuweb-ai.com",
  "http://localhost:3000",
  "http://localhost:5173"
];
app.use((req, res, next) => {
  console.log(`\u{1F310} [${(/* @__PURE__ */ new Date()).toISOString()}] ${req.method} ${req.path}`);
  console.log(`\u{1F4CD} Origin: ${req.headers.origin || "No origin"}`);
  console.log(`\u{1F517} Referer: ${req.headers.referer || "No referer"}`);
  next();
});
app.use(
  cors({
    origin: true,
    // Permitir TODOS los orígenes
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
var Store = MemoryStore(session);
var sessionStore = new Store({
  checkPeriod: 864e5
});
app.use(
  session({
    secret: process.env.SESSION_SECRET || "tuwebai-super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1e3 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      httpOnly: true,
      domain: process.env.NODE_ENV === "production" ? ".tuweb-ai.com" : void 0
    },
    store: sessionStore,
    name: "tuwebai.sid"
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  if (req.path.includes("/auth/")) {
    console.log(`\u{1F50D} [${(/* @__PURE__ */ new Date()).toISOString()}] ${req.method} ${req.path}`);
    console.log("\u{1F36A} Session ID:", req.sessionID);
    console.log("\u{1F464} User ID en sesi\xF3n:", req.session?.userId);
    console.log("\u{1F4E7} User Email en sesi\xF3n:", req.session?.userEmail);
  }
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      console.log(logLine);
    }
  });
  next();
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando correctamente",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/test", (req, res) => {
  res.json({
    status: "OK",
    message: "Test endpoint funcionando",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    env: process.env.NODE_ENV || "development"
  });
});
app.post("/test", (req, res) => {
  console.log("\u{1F9EA} POST /test recibido");
  console.log("\u{1F4CB} Body:", req.body);
  res.json({
    status: "OK",
    message: "Test POST funcionando",
    receivedData: req.body,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/favicon.ico"));
});
app.use(express.static(path.join(__dirname, "../public")));
var client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || ""
});
var preference = new Preference(client);
var payment = new Payment(client);
app.post("/crear-preferencia", async (req, res) => {
  try {
    const { plan } = req.body;
    if (!plan) return res.status(400).json({ error: "Plan requerido" });
    const precios = {
      "Plan B\xE1sico": 299e3,
      "Plan Profesional": 499e3,
      "Plan Enterprise": 999e3
    };
    if (!precios[plan]) {
      return res.status(400).json({ error: "Plan inv\xE1lido" });
    }
    const preferenceData = {
      items: [
        {
          id: plan.toLowerCase().replace(/\s+/g, "-"),
          title: plan,
          unit_price: precios[plan],
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
var EMAILJS_SERVICE_ID = "service_9s9hqqn";
var EMAILJS_TEMPLATE_ID = "template_8pxfpyh";
var EMAILJS_PUBLIC_KEY = "JwEzBkL2LmY4a6WRkkodX";
app.post("/contact", async (req, res) => {
  console.log("\u{1F4E7} POST /contact recibido");
  console.log("\u{1F4CB} Body recibido:", req.body);
  try {
    const { name, email, title, message } = req.body;
    console.log("\u{1F50D} Validando campos...");
    console.log("- name:", name);
    console.log("- email:", email);
    console.log("- title:", title);
    console.log("- message:", message);
    if (!name || !email || !message || message.trim().length < 10) {
      console.log("\u274C Validaci\xF3n fallida");
      return res.status(400).json({ error: "Datos inv\xE1lidos: nombre, email y mensaje son requeridos" });
    }
    const emailTitle = title || "Consulta desde formulario de contacto";
    console.log("\u{1F4DD} T\xEDtulo del email:", emailTitle);
    console.log("\u{1F4E4} Enviando email con EmailJS...");
    console.log("- Service ID:", EMAILJS_SERVICE_ID);
    console.log("- Template ID:", EMAILJS_TEMPLATE_ID);
    console.log("- Public Key:", EMAILJS_PUBLIC_KEY ? "Configurado" : "No configurado");
    const emailResult = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        name,
        email,
        title: emailTitle,
        message
      },
      { publicKey: EMAILJS_PUBLIC_KEY }
    );
    console.log("\u2705 Email enviado exitosamente:", emailResult);
    return res.json({ message: "Mensaje enviado correctamente" });
  } catch (err) {
    console.error("\u274C Error en endpoint /contact:", err);
    console.error("\u274C Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    return res.status(500).json({
      error: "Error en el servidor",
      details: process.env.NODE_ENV === "development" ? err.message : "Error interno del servidor"
    });
  }
});
app.post("/consulta", async (req, res) => {
  try {
    const { name, email, title, message } = req.body;
    if (!name || !email || !title || !message || message.trim().length < 10) {
      return res.status(400).json({ error: "Datos inv\xE1lidos" });
    }
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        name,
        email,
        title,
        message
      },
      { publicKey: EMAILJS_PUBLIC_KEY }
    );
    return res.json({ message: "Mensaje enviado correctamente" });
  } catch (err) {
    console.error("Error en consulta:", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});
function ensureLogDirectory() {
  const logDir = path.join(__dirname, "../logs/mercadopago");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return logDir;
}
function writeLog(data) {
  try {
    const logDir = ensureLogDirectory();
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const logFile = path.join(logDir, `${today}.log`);
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const logEntry = `[${timestamp}] ${JSON.stringify(data)}
`;
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error("Error escribiendo log:", error);
  }
}
function verifyWebhookSignature(payload, signature, secret) {
  try {
    const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch (error) {
    console.error("Error verificando firma:", error);
    return false;
  }
}
app.get("/webhook/mercadopago/health", (req, res) => {
  res.json({ ok: true });
});
app.post("/webhook/mercadopago", async (req, res) => {
  const startTime = Date.now();
  res.status(200).json({ received: true });
  try {
    const headers = {
      "x-signature": req.headers["x-signature"],
      "x-request-id": req.headers["x-request-id"],
      "user-agent": req.headers["user-agent"]
    };
    console.log("\u{1F514} Webhook recibido - Headers:", headers);
    const webhookData = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      headers,
      body: req.body,
      ip: req.ip
    };
    writeLog(webhookData);
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers["x-signature"];
      const payload = JSON.stringify(req.body);
      if (!signature || !verifyWebhookSignature(payload, signature, webhookSecret)) {
        console.error("\u274C Firma del webhook inv\xE1lida");
        writeLog({
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          error: "Firma inv\xE1lida",
          headers,
          body: req.body
        });
        return;
      }
    }
    const { type, data } = req.body;
    if (!data?.id || !type) {
      console.error("\u274C Webhook sin data.id o type");
      return;
    }
    if (type !== "payment") {
      console.log(`\u2139\uFE0F Evento ignorado: ${type}`);
      return;
    }
    const paymentId = data.id;
    console.log(`\u{1F4B3} Procesando pago ID: ${paymentId}`);
    const processedKey = `processed_${paymentId}`;
    if (global[processedKey]) {
      console.log(`\u{1F504} Pago ${paymentId} ya procesado, ignorando`);
      return;
    }
    global[processedKey] = true;
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("\u274C MERCADOPAGO_ACCESS_TOKEN no configurado");
      return;
    }
    try {
      const paymentDetails = await payment.get({ id: paymentId });
      console.log(`\u{1F4CA} Estado del pago ${paymentId}: ${paymentDetails.status}`);
      const orderData = {
        payment_id: paymentId,
        status: paymentDetails.status,
        amount: paymentDetails.transaction_amount,
        currency: paymentDetails.currency_id,
        payer_email: paymentDetails.payer?.email,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      console.log("\u{1F4BE} Actualizando pedido:", orderData);
      writeLog({
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        success: true,
        payment_id: paymentId,
        status: paymentDetails.status,
        processing_time: Date.now() - startTime
      });
    } catch (apiError) {
      console.error(`\u274C Error consultando API de MP para pago ${paymentId}:`, apiError);
      writeLog({
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        error: "Error consultando API de MP",
        payment_id: paymentId,
        api_error: apiError
      });
    }
  } catch (error) {
    console.error("\u274C Error procesando webhook:", error);
    writeLog({
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      error: "Error general procesando webhook",
      error_details: error
    });
  }
});
app.use((err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Express error middleware:", err);
  if (!res.headersSent) {
    res.status(status).json({
      success: false,
      message,
      details: process.env.NODE_ENV === "development" ? err.message : void 0
    });
  }
});
var port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
app.listen(port, () => {
  console.log(`\u{1F680} Servidor escuchando en puerto ${port}`);
  console.log(`\u{1F30D} Or\xEDgenes permitidos CORS: ${allowedOrigins.join(", ")}`);
  console.log(`\u2699\uFE0F NODE_ENV: ${process.env.NODE_ENV || "development"}`);
  console.log(`\u{1F510} SESSION_SECRET: ${process.env.SESSION_SECRET ? "Configurado" : "No configurado"}`);
  console.log(`\u{1F4B3} MERCADOPAGO_ACCESS_TOKEN: ${process.env.MERCADOPAGO_ACCESS_TOKEN ? "Configurado" : "No configurado"}`);
  console.log(`\u{1F512} MERCADOPAGO_WEBHOOK_SECRET: ${process.env.MERCADOPAGO_WEBHOOK_SECRET ? "Configurado" : "No configurado"}`);
  console.log(`\u{1F4E7} EMAILJS: ${EMAILJS_SERVICE_ID ? "Configurado" : "No configurado"}`);
  console.log(`\u{1F310} Webhook URL: https://tuwebai-backend.onrender.com/webhook/mercadopago`);
  console.log(`\u{1F3E5} Health Check: https://tuwebai-backend.onrender.com/webhook/mercadopago/health`);
});
