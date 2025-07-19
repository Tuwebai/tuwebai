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
import { MercadoPagoConfig, Preference } from "mercadopago";
import emailjs from "@emailjs/nodejs";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var allowedOrigins = [
  "https://tuweb-ai.com",
  "https://www.tuweb-ai.com",
  "http://localhost:3000",
  "http://localhost:5173"
];
app.use(
  cors({
    origin: function(origin, callback) {
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
  let capturedJsonResponse = void 0;
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
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/favicon.ico"));
});
app.use(express.static(path.join(__dirname, "../public")));
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
var client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });
var preference = new Preference(client);
app.post("/crear-preferencia", async (req, res) => {
  try {
    const { plan } = req.body;
    if (!plan) return res.status(400).json({ error: "Plan requerido" });
    const precios = {
      "Plan B\xE1sico": 299e3,
      "Plan Profesional": 499e3,
      "Plan Enterprise": 999e3
    };
    if (!precios[plan]) return res.status(400).json({ error: "Plan inv\xE1lido" });
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
var EMAILJS_PUBLIC_KEY = "bPdFsDkAPp5dXKALy";
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, title, message } = req.body;
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "El nombre es requerido y debe tener al menos 2 caracteres"
      });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "El email es requerido y debe ser v\xE1lido"
      });
    }
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "El asunto es requerido y debe tener al menos 3 caracteres"
      });
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
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
      createdAt: /* @__PURE__ */ new Date(),
      source: req.body.source || "sitio_web_principal"
    };
    console.log("\u{1F4E7} Nuevo contacto recibido:", contactData);
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        name: contactData.name,
        email: contactData.email,
        title: contactData.title,
        message: contactData.message
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
  } catch (error) {
    console.error("Error en formulario de contacto:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    res.status(500).json({
      success: false,
      message: "Error inesperado en el servidor. Intenta de nuevo m\xE1s tarde.",
      error: process.env.NODE_ENV === "development" ? error : void 0
    });
  }
});
var port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
app.listen(port, () => {
  console.log(`\u{1F680} Servidor escuchando en puerto ${port}`);
  console.log(`\u{1F30D} Or\xEDgenes permitidos CORS: ${allowedOrigins.join(", ")}`);
  console.log(`\u{1F527} NODE_ENV: ${process.env.NODE_ENV || "development"}`);
  console.log(`\u{1F511} SESSION_SECRET: ${process.env.SESSION_SECRET ? "Configurado" : "No configurado"}`);
  console.log(`\u{1F4CA} DATABASE_URL: ${process.env.DATABASE_URL ? "Configurado" : "No configurado"}`);
  console.log(`\u{1F510} GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? "Configurado" : "No configurado"}`);
});
