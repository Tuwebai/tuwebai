import dotenv from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno desde múltiples ubicaciones
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), 'config.env') });
dotenv.config({ path: resolve(process.cwd(), 'config.env.example') });

// Verificar que las variables críticas estén disponibles
console.log('🔧 Verificando variables de entorno...');
console.log('📁 Directorio actual:', process.cwd());
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔑 SESSION_SECRET:', process.env.SESSION_SECRET ? 'Configurado' : 'No configurado');
console.log('📊 SUPABASE_URL:', process.env.SUPABASE_URL ? 'Configurado' : 'No configurado');

import { Express, Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertConsultationSchema, 
  insertNewsletterSchema, 
  insertUserSchema,
  UserPreferences
} from "../shared/schema";
import crypto from 'crypto';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { Profile, VerifyCallback } from 'passport-google-oauth20';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import nodemailer from 'nodemailer';

const router = express.Router();

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || '';

const PLANES: Record<string, number> = {
  'Plan Básico': 299,
  'Plan Pro': 499
};

// Ruta /api/auth/me segura para debug
router.get('/api/auth/me', (req, res) => {
  try {
    if (req.session && req.session.userId) {
      return res.json({ success: true, userId: req.session.userId, userEmail: req.session.userEmail });
    }
    res.json({ success: false, user: null });
  } catch (err: any) {
    res.status(500).json({ error: 'Error interno', details: err.message });
  }
});

// Ruta /crear-preferencia robusta
router.post('/crear-preferencia', async (req, res) => {
  try {
    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Falta configuración de Mercado Pago' });
    }
    const { plan } = req.body as { plan: string };
    if (plan === 'Plan Enterprise' || plan === 'Plan Premium' || !PLANES[plan]) {
      return res.status(400).json({ error: 'Plan personalizado, consultar con ventas' });
    }
    const preference = {
      items: [
        {
          title: plan,
          unit_price: PLANES[plan],
          quantity: 1,
        },
      ],
      back_urls: {
        success: 'https://tuweb-ai.com/pago-exitoso',
        failure: 'https://tuweb-ai.com/pago-fallido',
        pending: 'https://tuweb-ai.com/pago-pendiente',
      },
      auto_return: 'approved',
    };
    const mpRes = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      preference,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.json({ init_point: mpRes.data.init_point });
  } catch (err: any) {
    res.status(500).json({ error: 'Error al crear preferencia', details: err.message });
  }
});

// Alias para /consulta (sin /api) para compatibilidad con el frontend
router.post('/consulta', async (req, res) => {
  try {
    const { nombre, email, empresa, telefono, tipoProyecto, urgente, detalleServicio, secciones, presupuesto, plazo, mensaje, comoNosEncontraste } = req.body;
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Configuración de nodemailer con SMTP desde variables de entorno
    const transporter = require('nodemailer').createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: parseInt(process.env.SMTP_PORT || '465') === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email HTML con branding de la plataforma
    const html = `
      <div style="background:#0a0a0f;padding:32px 0;font-family:Inter,Arial,sans-serif;min-height:100vh;">
        <div style="max-width:520px;margin:0 auto;background:#18181b;border-radius:16px;padding:32px 24px;box-shadow:0 4px 24px rgba(0,0,0,0.12);color:#fff;">
          <div style="text-align:center;margin-bottom:24px;">
            <img src='https://tuweb-ai.com/favicon.ico' alt='TuWeb.ai' style='width:48px;height:48px;border-radius:8px;margin-bottom:8px;' />
            <h2 style="font-size:2rem;font-weight:700;color:#00ccff;margin:0 0 8px 0;">Nueva consulta recibida</h2>
            <p style="color:#b3b3b3;font-size:1rem;margin:0;">Formulario de contacto desde tuweb-ai.com</p>
          </div>
          <div style="margin-bottom:24px;">
            <h3 style="color:#fff;font-size:1.1rem;margin-bottom:8px;">Datos del usuario</h3>
            <ul style="list-style:none;padding:0;margin:0;">
              <li><b>Nombre:</b> ${nombre}</li>
              <li><b>Email:</b> ${email}</li>
              ${empresa ? `<li><b>Empresa:</b> ${empresa}</li>` : ''}
              ${tipoProyecto ? `<li><b>Tipo de proyecto:</b> ${tipoProyecto}</li>` : ''}
              ${urgente ? `<li><b>Urgente:</b> Sí</li>` : ''}
              ${detalleServicio && detalleServicio.length ? `<li><b>Servicios:</b> ${detalleServicio.join(', ')}</li>` : ''}
              ${secciones && secciones.length ? `<li><b>Secciones:</b> ${secciones.join(', ')}</li>` : ''}
              ${presupuesto ? `<li><b>Presupuesto:</b> ${presupuesto}</li>` : ''}
              ${plazo ? `<li><b>Plazo:</b> ${plazo}</li>` : ''}
              ${comoNosEncontraste ? `<li><b>¿Cómo nos encontró?:</b> ${comoNosEncontraste}</li>` : ''}
            </ul>
          </div>
          <div style="margin-bottom:24px;">
            <h3 style="color:#fff;font-size:1.1rem;margin-bottom:8px;">Mensaje</h3>
            <div style="background:#23232b;padding:16px;border-radius:8px;color:#e0e0e0;white-space:pre-line;">${mensaje}</div>
          </div>
          <div style="text-align:center;color:#b3b3b3;font-size:0.95rem;margin-top:32px;">
            <hr style="border:none;border-top:1px solid #222;margin:24px 0;" />
            <p>Este mensaje fue generado automáticamente por <b>TuWeb.ai</b>.<br>Responde directamente a este correo para contactar al usuario.</p>
            <p style="margin-top:8px;">&copy; ${new Date().getFullYear()} TuWeb.ai</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `TuWeb.ai <${process.env.SMTP_USER}>`,
      to: 'admin@tuweb-ai.com',
      subject: 'Nueva consulta recibida en TuWeb.ai',
      html,
      replyTo: email
    });

    // Log para control interno
    console.log('Consulta enviada por email a admin@tuweb-ai.com:', { nombre, email });

    return res.json({ success: true, message: 'Consulta recibida y enviada por email' });
  } catch (err: any) {
    console.error('Error al enviar email de consulta:', err);
    return res.status(500).json({ error: 'Error al procesar la consulta', details: err.message });
  }
});

// Middleware de Autenticación
// Usuario especial de desarrollo - datos simulados
const SPECIAL_USER = {
  id: 99999,
  email: 'juanchilopezpachao7@gmail.com',
  first_name: 'Juan Esteban',
  last_name: 'López',
  role: 'user',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  lastLogin: new Date(),
  verificationToken: null,
  resetPasswordToken: null,
  image: null
};

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as any;
  if (!session || !session.userId) {
    return res.status(401).json({
      success: false,
      message: "No autenticado"
    });
  }

  try {
    // Verificar si es el usuario especial de desarrollo
    if (session.userId === 99999 && session.userEmail === 'juanchilopezpachao7@gmail.com') {
      console.log('🔐 Usuario especial detectado - usando datos simulados');
      (req as any).user = SPECIAL_USER;
      (req as any).isSpecialUser = true;
      return next();
    }

    // Para usuarios normales, buscar en la base de datos
    const user = await storage.getUser(session.userId);
    if (!user) {
      // Si el usuario no existe pero hay sesión, eliminamos la sesión
      req.session.destroy((err: any) => {
        if (err) console.error("Error al eliminar sesión de usuario no existente:", err);
      });
      
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
    
    // Si el usuario existe pero no está activo
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Cuenta no verificada. Por favor verifique su correo electrónico."
      });
    }
    
    // Añadimos el usuario a la request para uso posterior
    (req as any).user = user;
    (req as any).isSpecialUser = false;
    next();
  } catch (error) {
    console.error("Error en la autenticación:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor al verificar la autenticación"
    });
  }
};

// Middleware para roles de administrador
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const isSpecialUser = (req as any).isSpecialUser;
  
  // El usuario especial tiene acceso total (incluyendo admin)
  if (isSpecialUser) {
    console.log('🔧 Usuario especial - acceso admin permitido');
    return next();
  }
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Se requieren permisos de administrador."
    });
  }
  
  next();
};

// Middleware para registro de actividad y analíticas
const trackActivity = (eventType: string, eventCategory?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Capturar la respuesta original
    const originalSend = res.send;
    
    res.send = function(body): Response {
      // Restaurar la función original primero
      res.send = originalSend;
      
      // Procesar solo respuestas exitosas (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = (req.session as any)?.userId;
        const sessionId = req.sessionID;
        const path = req.originalUrl;
        const referrer = req.get('Referer') || '';
        const userAgent = req.get('User-Agent') || '';
        const ipAddress = req.ip || req.socket.remoteAddress || '';
        
        // Registrar evento de forma asíncrona (sin await para no bloquear)
        storage.trackEvent({
          eventType,
          eventCategory,
          eventAction: req.method,
          eventLabel: path,
          userId,
          sessionId,
          path,
          referrer,
          userAgent,
          ipAddress
        }).catch(err => console.error('Error tracking activity:', err));
      }
      
      // Continuar con la respuesta original
      return originalSend.call(this, body);
    };
    
    next();
  };
};

// Configurar Google OAuth solo si las variables están disponibles
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientId && googleClientSecret) {
  console.log('🔧 Configurando Google OAuth...');
  console.log('📋 Client ID configurado:', googleClientId ? 'Sí' : 'No');
  console.log('🔑 Client Secret configurado:', googleClientSecret ? 'Sí' : 'No');
  
  passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: process.env.NODE_ENV === 'production'
      ? 'https://tuwebai-backend.onrender.com/api/auth/google/callback'
      : 'http://localhost:5000/api/auth/google/callback',
    proxy: true, // Importante para manejar proxies correctamente
  }, async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => {
  try {
    console.log('🔐 Google OAuth callback iniciado');
    console.log('📧 Email del perfil:', profile.emails?.[0]?.value);
    console.log('👤 Nombre del perfil:', profile.displayName);
    console.log('🔧 DATABASE_URL configurado:', !!process.env.DATABASE_URL);
    
    // Buscar usuario por email
    const email = profile.emails?.[0]?.value;
    if (!email) {
      console.log('❌ No se pudo obtener el email de Google');
      return done(null, false, { message: 'No se pudo obtener el email de Google.' });
    }
    
    console.log('🔍 Buscando usuario por email:', email);
    let user = await storage.getUserByEmail(email);
    
    // Verificar si hubo error de conexión a la base de datos
    if (user === undefined) {
      console.error('❌ Error crítico de conexión a la base de datos durante OAuth');
      console.error('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'No configurado');
      console.error('🌍 NODE_ENV:', process.env.NODE_ENV);
      return done(null, false, { message: 'db_connection_error' });
    }
    
    if (!user) {
      console.log('👤 Usuario no encontrado, creando nuevo usuario');
      try {
        // Crear usuario nuevo (sin image)
        user = await storage.createUser({
          username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random()*10000),
          email,
          password: crypto.randomBytes(16).toString('hex'), // Contraseña aleatoria (no se usa)
          name: profile.displayName,
        });
        console.log('✅ Usuario creado exitosamente:', user.id);
        
        // Si hay imagen, actualizar
        if (profile.photos?.[0]?.value) {
          console.log('🖼️ Actualizando imagen de perfil');
          await storage.updateUser(user.id, { image: profile.photos[0].value });
          user = await storage.getUser(user.id);
        }
      } catch (createError: any) {
        console.error('❌ Error al crear usuario durante OAuth:', createError);
        if (createError.message === 'db_connection_error') {
          return done(null, false, { message: 'db_connection_error' });
        }
        return done(createError);
      }
      // Email de bienvenida para Google
      await sendWelcomeEmail({ email, name: profile.displayName });
    } else {
      console.log('👤 Usuario encontrado:', user.id);
      if (!user.isActive) {
        console.log('✅ Activando usuario inactivo');
        try {
          // Activar usuario si viene de Google
          await storage.updateUser(user.id, { isActive: true });
        } catch (updateError: any) {
          console.error('❌ Error al activar usuario durante OAuth:', updateError);
          if (updateError.message === 'db_connection_error') {
            return done(null, false, { message: 'db_connection_error' });
          }
          // Continuar con el usuario sin activar si hay error
        }
      }
    }
    
    console.log('🎉 Google OAuth completado exitosamente');
    return done(null, user);
  } catch (err: any) {
    console.error('❌ Error general en Google OAuth callback:', err);
    console.error('📋 Error type:', err?.constructor?.name);
    console.error('📋 Error message:', err?.message);
    console.error('📋 Error code:', err?.code);
    
    // Si es error de conexión a la base de datos
    if (err?.message === 'db_connection_error' || 
        err?.code === 'ECONNREFUSED' || 
        err?.code === 'ENOTFOUND' || 
        err?.code === 'ETIMEDOUT') {
      return done(null, false, { message: 'db_connection_error' });
    }
    
    return done(err);
  }
  }));
} else {
  console.log('⚠️ Google OAuth no configurado - faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET');
  console.log('📋 Variables de entorno disponibles:');
  console.log('   - GOOGLE_CLIENT_ID:', googleClientId ? 'Configurado' : 'No configurado');
  console.log('   - GOOGLE_CLIENT_SECRET:', googleClientSecret ? 'Configurado' : 'No configurado');
}

passport.serializeUser((user: any, done) => {
  done(null, { id: user.id, email: user.email });
});
passport.deserializeUser(async (obj: any, done) => {
  try {
    const user = await storage.getUser(obj.id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Función utilitaria para enviar email de bienvenida y verificación
async function sendWelcomeEmail({ email, name, verificationToken }: { email: string, name?: string, verificationToken?: string }) {
  const transporter = require('nodemailer').createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: parseInt(process.env.SMTP_PORT || '465') === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verifyUrl = verificationToken
    ? `${process.env.FRONTEND_URL || 'https://tuweb-ai.com'}/auth/verify/${verificationToken}`
    : null;

  const LOGO_URL = process.env.FRONTEND_URL
    ? `${process.env.FRONTEND_URL}/logo-tuwebai.png`
    : 'https://tuweb-ai.com/logo-tuwebai.png';

  const html = `
    <div style="background:#0a0a0f;padding:32px 0;font-family:Inter,Arial,sans-serif;min-height:100vh;">
      <div style="max-width:520px;margin:0 auto;background:#18181b;border-radius:16px;padding:32px 24px;box-shadow:0 4px 24px rgba(0,0,0,0.12);color:#fff;">
        <div style="text-align:center;margin-bottom:24px;">
          <img src='${LOGO_URL}' alt='TuWeb.ai' style='width:48px;height:48px;border-radius:8px;margin-bottom:8px;' />
          <h2 style="font-size:2rem;font-weight:700;color:#00ccff;margin:0 0 8px 0;">¡Bienvenido a TuWeb.ai!</h2>
          <p style="color:#b3b3b3;font-size:1rem;margin:0;">${name ? `Hola <b>${name}</b>,` : '¡Hola!'}<br>Tu cuenta ha sido creada exitosamente.</p>
        </div>
        <div style="margin-bottom:24px;">
          <h3 style="color:#fff;font-size:1.1rem;margin-bottom:8px;">¿Qué podés hacer ahora?</h3>
          <ul style="list-style:none;padding:0;margin:0;">
            <li>✔️ Acceder a cursos y recursos exclusivos</li>
            <li>✔️ Consultar a expertos y recibir soporte</li>
            <li>✔️ Gestionar tu perfil y preferencias</li>
          </ul>
        </div>
        ${verifyUrl ? `
        <div style="margin-bottom:24px;text-align:center;">
          <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(90deg,#00ccff,#9933ff);color:#fff;border-radius:8px;font-weight:600;text-decoration:none;font-size:1.1rem;">Verificar mi cuenta</a>
          <p style="color:#b3b3b3;font-size:0.95rem;margin-top:12px;">Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br><span style="color:#00ccff;word-break:break-all;">${verifyUrl}</span></p>
        </div>
        ` : ''}
        <div style="text-align:center;color:#b3b3b3;font-size:0.95rem;margin-top:32px;">
          <hr style="border:none;border-top:1px solid #222;margin:24px 0;" />
          <p>Este mensaje fue generado automáticamente por <b>TuWeb.ai</b>.<br>Si no creaste esta cuenta, ignorá este email.</p>
          <p style="margin-top:8px;">&copy; ${new Date().getFullYear()} TuWeb.ai</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `TuWeb.ai <${process.env.SMTP_USER}>`,
    to: email,
    subject: verifyUrl ? 'Verificá tu cuenta en TuWeb.ai' : '¡Bienvenido a TuWeb.ai!',
    html,
  });
}

// Configurar las rutas de la API
export async function registerRoutes(app: Express): Promise<Server> {
  // Servidor HTTP para la aplicación
  const server = createServer(app);

  // Eliminar toda la lógica de WebSocket y broadcastNotification

  // const emailService = new EmailService(); // This line is no longer needed

  // Rutas de Google OAuth (solo si están configuradas las credenciales)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log('🔧 Configurando rutas de Google OAuth');
    console.log('📋 Client ID configurado:', process.env.GOOGLE_CLIENT_ID ? 'Sí' : 'No');
    console.log('🔑 Client Secret configurado:', process.env.GOOGLE_CLIENT_SECRET ? 'Sí' : 'No');
    
    // Ruta para iniciar login con Google
    app.get('/api/auth/google', (req: Request, res: Response, next: NextFunction) => {
      console.log('🚀 Iniciando autenticación con Google');
      passport.authenticate('google', { 
        scope: ['profile', 'email'],
        accessType: 'offline',
        prompt: 'consent'
      })(req, res, next);
    });

    // Callback de Google con mejor manejo de errores
    app.get('/api/auth/google/callback', (req: Request, res: Response, next: NextFunction) => {
      console.log('🔄 Callback de Google recibido');
      console.log('📋 Query params:', req.query);
      console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
      console.log('🔧 DOMAIN:', process.env.DOMAIN);
      
      passport.authenticate('google', { 
        failureRedirect: process.env.NODE_ENV === 'production' 
          ? 'https://tuweb-ai.com/?error=google_auth_failed'
          : '/?error=google_auth_failed',
        failureFlash: true
      }, (err: any, user: any, info: any) => {
        if (err) {
          console.error('❌ Error en autenticación de Google:', err);
          console.error('📋 Error type:', err?.constructor?.name);
          console.error('📋 Error message:', err?.message);
          console.error('📋 Error code:', err?.code);
          
          const errorRedirect = process.env.NODE_ENV === 'production' 
            ? 'https://tuweb-ai.com/?error=google_auth_failed'
            : '/?error=google_auth_failed';
          
          return res.redirect(errorRedirect);
        }
        
        if (!user) {
          if (info && info.message === 'db_connection_error') {
            console.error('❌ Error crítico de conexión a la base de datos durante login con Google');
            console.error('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'No configurado');
            
            const errorRedirect = process.env.NODE_ENV === 'production' 
              ? 'https://tuweb-ai.com/?error=db_connection_error'
              : '/?error=db_connection_error';
            
            return res.redirect(errorRedirect);
          }
          console.log('❌ Usuario no autenticado en Google');
          const errorRedirect = process.env.NODE_ENV === 'production' 
            ? 'https://tuweb-ai.com/?error=google_auth_failed'
            : '/?error=google_auth_failed';
          
          return res.redirect(errorRedirect);
        }
        
        // Login exitoso
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            console.error('❌ Error al establecer sesión:', loginErr);
            const errorRedirect = process.env.NODE_ENV === 'production' 
              ? 'https://tuweb-ai.com/?error=google_auth_failed'
              : '/?error=google_auth_failed';
            
            return res.redirect(errorRedirect);
          }
          
          console.log('✅ Login con Google exitoso para usuario:', user.email);
          console.log('👤 User ID:', user.id);
          
          // Establecer sesión manualmente si es necesario
          if (req.session) {
            req.session.userId = user.id;
            req.session.userEmail = user.email;
            console.log('🍪 Sesión establecida - User ID:', req.session.userId);
          }
          
          // Redirigir SIEMPRE a la raíz con query param para refrescar el estado
          const successRedirect = process.env.NODE_ENV === 'production' 
            ? 'https://tuweb-ai.com/?google=1'
            : '/?google=1';
          
          console.log('🔄 Redirigiendo a:', successRedirect);
          res.redirect(successRedirect);
        });
      })(req, res, next);
    });
  } else {
    console.log('⚠️ Google OAuth no configurado - faltan credenciales');
  }

  /*
   * --------------------------------------------------------------------------
   * RUTAS PÚBLICAS (sin autenticación)
   * --------------------------------------------------------------------------
   */
  
  // API de Contacto
  app.post("/api/contact", trackActivity('FormSubmit', 'Contact'), async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);

      // Enviar email al admin
      // Eliminar importación de email-service y cualquier uso de sendEmail/emailTemplate
      // Eliminar envío de email de contacto

      // (Opcional) Enviar confirmación al usuario
      if (contact.email) {
        // Eliminar envío de email de confirmación de contacto
      }

      res.status(201).json({ 
        success: true, 
        message: "Mensaje enviado correctamente",
        contact: {
          id: contact.id,
          date: contact.createdAt
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Error de validación", errors: error.errors });
      }
      res.status(500).json({ success: false, message: "Error al procesar la solicitud" });
    }
  });

  // API de Consulta
  app.post("/api/consulta", trackActivity('FormSubmit', 'Consultation'), async (req: Request, res: Response) => {
    try {
      // Validar datos del formulario
      const validatedData = insertConsultationSchema.parse(req.body);
      
      // Extraer los detalles de servicio y secciones
      const { detalleServicio, secciones, ...consultaData } = req.body;
      
      // Guardar en la base de datos
      const consulta = await storage.createConsultation(
        consultaData,
        Array.isArray(detalleServicio) ? detalleServicio : undefined,
        Array.isArray(secciones) ? secciones : undefined
      );
      
      // Enviar notificación en tiempo real a administradores
      // Eliminar broadcastNotification
      
      // Responder con éxito
      res.status(201).json({ 
        success: true, 
        message: "Solicitud recibida correctamente",
        consulta: {
          id: consulta.id,
          date: consulta.createdAt
        }
      });
    } catch (error) {
      console.error("Error en formulario de consulta:", error);
      // Si es error de validación, enviar detalles
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Error de validación", 
          errors: error.errors 
        });
      }
      
      // Error genérico
      res.status(500).json({ 
        success: false, 
        message: "Error al procesar la solicitud"
      });
    }
  });

  // API de Newsletter
  app.post("/api/newsletter", trackActivity('Subscription', 'Newsletter'), async (req: Request, res: Response) => {
    try {
      // Validar datos del formulario
      const validatedData = insertNewsletterSchema.parse(req.body);
      
      // Guardar en la base de datos
      const subscription = await storage.subscribeToNewsletter(validatedData);
      
      // Responder con éxito
      res.status(201).json({ 
        success: true, 
        message: "Suscripción exitosa",
        subscription: {
          id: subscription.id,
          email: subscription.email,
          date: subscription.createdAt
        }
      });
    } catch (error) {
      console.error("Error en suscripción al newsletter:", error);
      // Si es error de validación, enviar detalles
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Email inválido", 
          errors: error.errors 
        });
      }
      
      // Error genérico
      res.status(500).json({ 
        success: false, 
        message: "Error al procesar la suscripción"
      });
    }
  });

  // Cancelar suscripción al newsletter (unsubscribe)
  app.get("/api/newsletter/unsubscribe/:email", async (req: Request, res: Response) => {
    try {
      const email = req.params.email;
      
      if (!email || !z.string().email().safeParse(email).success) {
        return res.status(400).json({
          success: false,
          message: "Email inválido"
        });
      }
      
      const success = await storage.unsubscribeFromNewsletter(email);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: "Te has dado de baja correctamente"
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Email no encontrado en nuestras listas"
        });
      }
    } catch (error) {
      console.error("Error al procesar la baja:", error);
      res.status(500).json({
        success: false,
        message: "Error al procesar la solicitud"
      });
    }
  });

  // Endpoint para recursos
  app.get("/api/resources", trackActivity('View', 'Resources'), async (_req: Request, res: Response) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      console.error("Error al obtener recursos:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener los recursos"
      });
    }
  });

  // Endpoint para registrar descargas de recursos
  app.get("/api/resources/:id/download", trackActivity('Download', 'Resources'), async (req: Request, res: Response) => {
    try {
      const resourceId = parseInt(req.params.id);
      
      if (isNaN(resourceId)) {
        return res.status(400).json({
          success: false,
          message: "ID de recurso inválido"
        });
      }
      
      const resource = await storage.getResourceById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Recurso no encontrado"
        });
      }
      
      // Incrementar contador de descargas
      await storage.incrementDownloadCount(resourceId);
      
      // Redireccionar a la URL real del recurso
      res.redirect(resource.url);
    } catch (error) {
      console.error("Error al descargar recurso:", error);
      res.status(500).json({
        success: false,
        message: "Error al procesar la descarga"
      });
    }
  });

  // Endpoint para tecnologías
  app.get("/api/technologies", trackActivity('View', 'Technologies'), async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const technologies = await storage.getTechnologies(category);
      res.json(technologies);
    } catch (error) {
      console.error("Error al obtener tecnologías:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener las tecnologías"
      });
    }
  });

  /*
   * --------------------------------------------------------------------------
   * AUTENTICACIÓN DE USUARIOS
   * --------------------------------------------------------------------------
   */
  
  // Registro de usuarios
  app.post("/api/auth/register", trackActivity('Auth', 'Register'), async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Verificar si el usuario ya existe por email
      const existingByEmail = await storage.getUserByEmail(userData.email);
      if (existingByEmail) {
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado"
        });
      }
      
      // Crear el usuario
      const user = await storage.createUser(userData);
      // Generar token de verificación
      const verificationToken = await storage.generateVerificationToken(user.id);
      // Enviar email de bienvenida y verificación
      await sendWelcomeEmail({ email: user.email, name: user.first_name + ' ' + user.last_name, verificationToken });
      
      // Responder con éxito (sin mostrar datos sensibles)
      res.status(201).json({
        success: true,
        message: "Usuario registrado correctamente. Por favor verifica tu email.",
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
      
      // Enviar email de verificación
      try {
        const verificationToken = await storage.generateVerificationToken(user.id);
        if (verificationToken) {
          // Eliminar envío de email de verificación
        } else {
          console.error(`No se pudo generar token de verificación para el usuario: ${user.id}`);
        }
      } catch (emailError) {
        console.error("Error al enviar email de verificación:", emailError);
        // No cortar el registro si falla el email
      }
    } catch (error) {
      console.error("Error en registro de usuario:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: error.errors
        });
      }
      // Si el error es de envío de email, devolver mensaje claro
      if (error instanceof Error && error.message && error.message.includes('Failed to create user')) {
        return res.status(500).json({
          success: false,
          message: "Error al crear el usuario en la base de datos"
        });
      }
      // Error genérico
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Error al procesar el registro"
      });
    }
  });

  // Verificación de cuenta
  app.get("/api/auth/verify/:token", async (req: Request, res: Response) => {
    try {
      const token = req.params.token;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Token de verificación no proporcionado"
        });
      }
      
      const verified = await storage.verifyUser(token);
      
      if (verified) {
        res.status(200).json({
          success: true,
          message: "Cuenta verificada correctamente. Ya puedes iniciar sesión."
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Token de verificación inválido o expirado"
        });
      }
    } catch (error) {
      console.error("Error en verificación de cuenta:", error);
      res.status(500).json({
        success: false,
        message: "Error al verificar la cuenta"
      });
    }
  });
  
  // Verificación manual para desarrollo
  app.get("/api/auth/dev-verify/:email", async (req: Request, res: Response) => {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({
        success: false,
        message: "Ruta no encontrada"
      });
    }
    
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email no proporcionado"
        });
      }
      
      // Buscar el usuario por email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        });
      }
      
      // Activar la cuenta directamente
      const updated = await storage.updateUser(user.id, { 
        isActive: true,
        verificationToken: null
      });
      
      if (updated) {
        return res.status(200).json({
          success: true,
          message: "Cuenta verificada manualmente con éxito (solo desarrollo)"
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Error al verificar la cuenta"
        });
      }
    } catch (error) {
      console.error("Error en verificación manual de cuenta:", error);
      res.status(500).json({
        success: false,
        message: "Error al verificar la cuenta"
      });
    }
  });

  // Inicio de sesión
  app.post("/api/auth/login", trackActivity('Auth', 'Login'), async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log(`Intento de login para: ${email}`);
      // Bypass especial para usuario de desarrollo
      if (email === 'juanchilopezpachao7@gmail.com' && password === 'Hola123@') {
        // Crear sesión real
        if (req.session) {
          req.session.userId = 99999;
          req.session.userEmail = 'juanchilopezpachao7@gmail.com';
        }
        return res.status(200).json({
          success: true,
          message: "Login especial de desarrollo",
          user: {
            id: 99999,
            first_name: 'Juan Esteban',
            last_name: 'López',
            email: 'juanchilopezpachao7@gmail.com',
            role: 'user',
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z', // ISO string para frontend
          }
        });
      }
      
      // Validaciones básicas
      if (!email || !password) {
        console.log('Error de login: Email o contraseña no proporcionados');
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son requeridos"
        });
      }
      
      // Buscar usuario por email
      const user = await storage.getUserByEmail(email);
      console.log(`Usuario encontrado: ${user ? 'Sí' : 'No'}`);
      
      if (!user) {
        console.log('Error de login: Usuario no encontrado');
        return res.status(401).json({
          success: false,
          message: "Credenciales incorrectas"
        });
      }
      
      // Verificar si la cuenta está activa
      console.log(`Cuenta activa: ${user.isActive ? 'Sí' : 'No'}`);
      
      // En modo desarrollo, permitimos login sin verificación
      if (!user.isActive && process.env.NODE_ENV === 'production') {
        console.log('Error de login: Cuenta no verificada');
        return res.status(403).json({
          success: false,
          message: "Cuenta no verificada. Por favor verifica tu correo electrónico."
        });
      } else if (!user.isActive) {
        console.log('Modo desarrollo: Permitiendo login sin verificación de correo');
      }
      
      // Verificar contraseña
      console.log('Comparando contraseñas...');
      let passwordMatch = false;
      
      // Si estamos en MemStorage, la contraseña está en texto plano
      // TEMP: Bypass de autenticación para desarrollo - admin@tuwebai.com / admin123
      if (email === 'admin@tuwebai.com' && password === 'admin123') {
        console.log('⚠️ MODO DESARROLLO: Bypass de autenticación para admin');
        passwordMatch = true;
      } 
      // Usar comparación directa en desarrollo
      else if (process.env.NODE_ENV === 'development' && user.password === password) {
        console.log('Modo desarrollo: Comparación directa de contraseñas');
        passwordMatch = true;
      } else {
        // Para entorno de producción o si la contraseña está hasheada
        try {
          passwordMatch = await bcrypt.compare(password, user.password);
        } catch (error) {
          console.log('Error al comparar contraseñas (posible formato incorrecto):', error);
          // Intento directo en caso de que la contraseña esté en texto plano
          passwordMatch = user.password === password;
        }
      }
      
      console.log(`Contraseña válida: ${passwordMatch ? 'Sí' : 'No'}`);
      
      if (!passwordMatch) {
        console.log('Error de login: Contraseña incorrecta');
        return res.status(401).json({
          success: false,
          message: "Credenciales incorrectas"
        });
      }
      
      // Actualizar última conexión
      await storage.updateLastLogin(user.id);
      
      // Establecer sesión
      if (req.session) {
        req.session.userId = user.id;
        req.session.userEmail = user.email;
      }
      
      // Responder con éxito (sin datos sensibles)
      res.status(200).json({
        success: true,
        message: "Login exitoso",
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        success: false,
        message: "Error al procesar el login"
      });
    }
  });
  
  // Cierre de sesión
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    // Destruir sesión
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error al cerrar sesión"
          });
        }
        
        res.status(200).json({
          success: true,
          message: "Sesión cerrada correctamente"
        });
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No hay sesión activa"
      });
    }
  });

  // Información del usuario actual
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    // Verificar si hay sesión
    const session = req.session as any;
    if (!session || !session.userId) {
      return res.status(401).json({
        success: false,
        message: "No autenticado"
      });
    }
    
    try {
      // Obtener información del usuario desde la base de datos
      const user = await storage.getUser(session.userId);
      
      if (!user) {
        // Si el usuario no existe pero hay sesión, eliminamos la sesión
        req.session.destroy((err: any) => {
          if (err) console.error("Error al eliminar sesión de usuario no existente:", err);
        });
        
        return res.status(401).json({
          success: false,
          message: "Usuario no encontrado"
        });
      }
      
      // Responder con los datos del usuario (sin datos sensibles)
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        }
      });
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener información del usuario"
      });
    }
  });

  // Solicitud de restablecimiento de contraseña
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email || !z.string().email().safeParse(email).success) {
        return res.status(400).json({
          success: false,
          message: "Email inválido"
        });
      }
      
      // Verificar si el usuario existe
      const user = await storage.getUserByEmail(email);
      
      // Por seguridad, siempre respondemos éxito aunque el usuario no exista
      if (!user) {
        return res.status(200).json({
          success: true,
          message: "Si tu email está registrado, recibirás instrucciones para restablecer tu contraseña."
        });
      }
      
      // Generar token de restablecimiento
      const resetToken = await storage.requestPasswordReset(email);
      
      if (!resetToken) {
        return res.status(500).json({
          success: false,
          message: "Error al generar el token de restablecimiento"
        });
      }
      
      // Enviar email con instrucciones y token para recuperación de contraseña
      try {
        // Eliminar envío de email de recuperación de contraseña
      } catch (emailError) {
        console.error("Error al enviar email de recuperación:", emailError);
        // Continuamos con la respuesta aunque falle el envío del email
      }
      
      res.status(200).json({
        success: true,
        message: "Si tu email está registrado, recibirás instrucciones para restablecer tu contraseña."
      });
    } catch (error) {
      console.error("Error en solicitud de restablecimiento:", error);
      res.status(500).json({
        success: false,
        message: "Error al procesar la solicitud"
      });
    }
  });

  // Restablecimiento de contraseña
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({
          success: false,
          message: "Token requerido"
        });
      }
      
      if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "La nueva contraseña debe tener al menos 8 caracteres"
        });
      }
      
      const resetSuccess = await storage.resetPassword(token, newPassword);
      
      if (resetSuccess) {
        res.status(200).json({
          success: true,
          message: "Contraseña restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña."
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Token inválido o expirado"
        });
      }
    } catch (error) {
      console.error("Error en restablecimiento de contraseña:", error);
      res.status(500).json({
        success: false,
        message: "Error al restablecer la contraseña"
      });
    }
  });

  /*
   * --------------------------------------------------------------------------
   * RUTAS PROTEGIDAS (requieren autenticación)
   * --------------------------------------------------------------------------
   */
  
  // Actualizar perfil de usuario
  app.put("/api/profile", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const isSpecialUser = (req as any).isSpecialUser;
      const { first_name, last_name, email } = req.body;
      
      // Para usuario especial, simular actualización en memoria
      if (isSpecialUser) {
        console.log('🔧 Usuario especial - simulando actualización de perfil');
        
        // Validar datos
        const updateData: any = {};
        
        if (first_name !== undefined) {
          updateData.first_name = first_name;
        }
        
        if (last_name !== undefined) {
          updateData.last_name = last_name;
        }
        
        if (email !== undefined && email !== user.email) {
          const existingUser = await storage.getUserByEmail(email);
          if (existingUser && existingUser.id !== user.id) {
            return res.status(400).json({
              success: false,
              message: "El email ya está registrado"
            });
          }
          updateData.email = email;
        }
        
        // Simular actualización
        const updatedUser = {
          ...user,
          ...updateData,
          updatedAt: new Date()
        };
        
        // Actualizar el usuario especial en memoria
        Object.assign(SPECIAL_USER, updatedUser);
        
        res.status(200).json({
          success: true,
          message: "Perfil actualizado correctamente",
          user: {
            id: updatedUser.id,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            role: updatedUser.role
          }
        });
        return;
      }
      
      // Para usuarios normales, usar la base de datos
      const updateData: any = {};
      
      if (first_name !== undefined) {
        updateData.first_name = first_name;
      }
      
      if (last_name !== undefined) {
        updateData.last_name = last_name;
      }
      
      if (email !== undefined && email !== user.email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== user.id) {
          return res.status(400).json({
            success: false,
            message: "El email ya está registrado"
          });
        }
        updateData.email = email;
      }
      
      // Si hay datos para actualizar
      if (Object.keys(updateData).length > 0) {
        const updatedUser = await storage.updateUser(user.id, updateData);
        
        if (!updatedUser) {
          return res.status(500).json({
            success: false,
            message: "Error al actualizar perfil"
          });
        }
        
        res.status(200).json({
          success: true,
          message: "Perfil actualizado correctamente",
          user: {
            id: updatedUser.id,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            role: updatedUser.role
          }
        });
      } else {
        res.status(200).json({
          success: true,
          message: "No hay cambios para actualizar",
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
          }
        });
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar perfil"
      });
    }
  });

  // Cambiar contraseña
  app.post("/api/profile/change-password", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const isSpecialUser = (req as any).isSpecialUser;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Contraseña actual y nueva son requeridas"
        });
      }
      
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "La nueva contraseña debe tener al menos 8 caracteres"
        });
      }
      
      // Para usuario especial, simular cambio de contraseña
      if (isSpecialUser) {
        console.log('🔧 Usuario especial - simulando cambio de contraseña');
        
        // Para el usuario especial, la contraseña actual siempre es 'Hola123@'
        if (currentPassword !== 'Hola123@') {
          return res.status(400).json({
            success: false,
            message: "Contraseña actual incorrecta"
          });
        }
        
        // Simular cambio exitoso
        res.status(200).json({
          success: true,
          message: "Contraseña cambiada correctamente (simulado para usuario especial)"
        });
        return;
      }
      
      // Para usuarios normales, verificar la contraseña actual
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          message: "Contraseña actual incorrecta"
        });
      }
      
      // Actualizar la contraseña
      const updatedUser = await storage.updateUser(user.id, {
        password: newPassword // La función updateUser ya hace el hash
      });
      
      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          message: "Error al cambiar la contraseña"
        });
      }
      
      // Registrar el cambio de contraseña
      try {
        await storage.recordPasswordChange(user.id);
      } catch (error) {
        console.error("Error al registrar cambio de contraseña:", error);
        // Continuamos aunque falle el registro, ya que la contraseña ya se cambió
      }
      
      res.status(200).json({
        success: true,
        message: "Contraseña cambiada correctamente"
      });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      res.status(500).json({
        success: false,
        message: "Error al cambiar la contraseña"
      });
    }
  });

  // Obtener preferencias de usuario
  app.get("/api/profile/preferences", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const isSpecialUser = (req as any).isSpecialUser;
      
      // Para usuario especial, usar preferencias simuladas
      if (isSpecialUser) {
        console.log('🔧 Usuario especial - usando preferencias simuladas');
        
        const preferences = {
          id: 99999,
          userId: user.id,
          emailNotifications: true,
          newsletter: true,
          darkMode: false,
          language: "es",
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        res.status(200).json({
          success: true,
          preferences
        });
        return;
      }
      
      // Para usuarios normales, buscar en la base de datos
      let preferences = await storage.getUserPreferences(user.id);
      
      // Si no existen, creamos las preferencias por defecto
      if (!preferences) {
        preferences = await storage.createUserPreferences({
          userId: user.id,
          emailNotifications: true,
          newsletter: true,
          darkMode: false,
          language: "es"
        });
      }
      
      res.status(200).json({
        success: true,
        preferences
      });
    } catch (error) {
      console.error("Error al obtener preferencias:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener preferencias"
      });
    }
  });

  // Actualizar preferencias de usuario
  app.put("/api/profile/preferences", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const isSpecialUser = (req as any).isSpecialUser;
      const { emailNotifications, newsletter, darkMode, language } = req.body;
      
      // Para usuario especial, simular actualización
      if (isSpecialUser) {
        console.log('🔧 Usuario especial - simulando actualización de preferencias');
        
        const preferences = {
          id: 99999,
          userId: user.id,
          emailNotifications: emailNotifications ?? true,
          newsletter: newsletter ?? true,
          darkMode: darkMode ?? false,
          language: language ?? "es",
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        res.status(200).json({
          success: true,
          message: "Preferencias actualizadas correctamente (simulado)",
          preferences
        });
        return;
      }
      
      // Para usuarios normales, usar la base de datos
      let preferences = await storage.getUserPreferences(user.id);
      
      // Si no existen, creamos las preferencias primero
      if (!preferences) {
        preferences = await storage.createUserPreferences({
          userId: user.id,
          emailNotifications: emailNotifications ?? true,
          newsletter: newsletter ?? true,
          darkMode: darkMode ?? false,
          language: language ?? "es"
        });
      } else {
        // Si existen, actualizamos solo los campos proporcionados
        const updateData: Partial<UserPreferences> = {};
        
        if (emailNotifications !== undefined) {
          updateData.emailNotifications = emailNotifications;
        }
        
        if (newsletter !== undefined) {
          updateData.newsletter = newsletter;
        }
        
        if (darkMode !== undefined) {
          updateData.darkMode = darkMode;
        }
        
        if (language !== undefined) {
          updateData.language = language;
        }
        
        preferences = await storage.updateUserPreferences(user.id, updateData);
      }
      
      if (!preferences) {
        return res.status(500).json({
          success: false,
          message: "Error al actualizar preferencias"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Preferencias actualizadas correctamente",
        preferences
      });
    } catch (error) {
      console.error("Error al actualizar preferencias:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar preferencias"
      });
    }
  });

  // Obtener información sobre el último cambio de contraseña
  app.get("/api/profile/password-info", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const isSpecialUser = (req as any).isSpecialUser;
      
      // Para usuario especial, simular información de contraseña
      if (isSpecialUser) {
        console.log('🔧 Usuario especial - simulando información de contraseña');
        
        const lastPasswordChange = {
          changedAt: new Date('2024-01-01'),
          daysSinceChange: Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24))
        };
        
        res.status(200).json({
          success: true,
          lastPasswordChange
        });
        return;
      }
      
      // Para usuarios normales, obtener de la base de datos
      const lastPasswordChange = await storage.getLastPasswordChange(user.id);
      
      res.status(200).json({
        success: true,
        lastPasswordChange: lastPasswordChange ? {
          changedAt: lastPasswordChange.changedAt,
          // Calcular días desde el último cambio
          daysSinceChange: Math.floor((Date.now() - lastPasswordChange.changedAt.getTime()) / (1000 * 60 * 60 * 24))
        } : null
      });
    } catch (error) {
      console.error("Error al obtener información de contraseña:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener información de contraseña"
      });
    }
  });

  // Subir imagen de perfil
  app.post("/api/profile/upload-image", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const isSpecialUser = (req as any).isSpecialUser;
      const { imageData } = req.body; // Base64 de la imagen
      
      if (!imageData) {
        return res.status(400).json({
          success: false,
          message: "No se proporcionó imagen"
        });
      }
      
      // Para usuario especial, simular subida
      if (isSpecialUser) {
        console.log('🔧 Usuario especial - simulando subida de imagen de perfil');
        
        // Simular URL de imagen (en producción sería una URL real)
        const imageUrl = imageData; // Usar directamente el base64 para desarrollo
        
        res.status(200).json({
          success: true,
          message: "Imagen de perfil actualizada correctamente",
          imageUrl
        });
        return;
      }
      
      // Para usuarios normales, guardar en la base de datos
      const updatedUser = await storage.updateUser(user.id, {
        image: imageData // En producción, esto sería una URL
      });
      
      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          message: "Error al actualizar imagen de perfil"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Imagen de perfil actualizada correctamente",
        imageUrl: updatedUser.image
      });
    } catch (error) {
      console.error("Error al subir imagen de perfil:", error);
      res.status(500).json({
        success: false,
        message: "Error al subir imagen de perfil"
      });
    }
  });

  /*
   * --------------------------------------------------------------------------
   * RUTAS DE ADMINISTRACIÓN (requieren rol de admin)
   * --------------------------------------------------------------------------
   */
  
  // Listado de contactos
  app.get("/api/admin/contacts", authenticateUser, requireAdmin, async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      // Obtener los contactos y el conteo total de forma paralela
      const [contacts, totalCount] = await Promise.all([
        storage.getContacts(page, limit),
        storage.getContactsCount()
      ]);
      
      res.status(200).json({
        success: true,
        contacts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      console.error("Error al obtener contactos:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener contactos"
      });
    }
  });

  // Marcar contacto como leído
  app.put("/api/admin/contacts/:id/read", authenticateUser, requireAdmin, async (req: Request, res: Response) => {
    try {
      const contactId = parseInt(req.params.id);
      
      if (isNaN(contactId)) {
        return res.status(400).json({
          success: false,
          message: "ID de contacto inválido"
        });
      }
      
      const success = await storage.markContactAsRead(contactId);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: "Contacto marcado como leído"
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Contacto no encontrado"
        });
      }
    } catch (error) {
      console.error("Error al marcar contacto como leído:", error);
      res.status(500).json({
        success: false,
        message: "Error al marcar contacto como leído"
      });
    }
  });

  // Listado de consultas
  app.get("/api/admin/consultations", authenticateUser, requireAdmin, async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      // Obtener las consultas y el conteo total de forma paralela
      const [consultations, totalCount] = await Promise.all([
        storage.getConsultations(page, limit),
        storage.getConsultationsCount()
      ]);
      
      res.status(200).json({
        success: true,
        consultations,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      console.error("Error al obtener consultas:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener consultas"
      });
    }
  });

  // Marcar consulta como procesada
  app.put("/api/admin/consultations/:id/processed", authenticateUser, requireAdmin, async (req: Request, res: Response) => {
    try {
      const consultationId = parseInt(req.params.id);
      
      if (isNaN(consultationId)) {
        return res.status(400).json({
          success: false,
          message: "ID de consulta inválido"
        });
      }
      
      const success = await storage.markConsultationAsProcessed(consultationId);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: "Consulta marcada como procesada"
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Consulta no encontrada"
        });
      }
    } catch (error) {
      console.error("Error al marcar consulta como procesada:", error);
      res.status(500).json({
        success: false,
        message: "Error al marcar consulta como procesada"
      });
    }
  });

  return server;
}

export { router };