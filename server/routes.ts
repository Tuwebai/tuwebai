import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';

// API de Contacto
app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    // Validación manual robusta
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
    // Guardar en Firestore si corresponde (si no, solo logging)
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
    // Validar variables SMTP
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
    // Envío de email al admin
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
    } catch (err: Error) {
      console.error('❌ Error enviando email:', err);
      return res.status(500).json({
        success: false,
        message: 'No se pudo enviar el email de contacto. Intenta de nuevo más tarde.'
      });
    }
    // Responder con éxito
    res.status(201).json({ 
      success: true, 
      message: "Mensaje enviado correctamente. Te responderemos pronto.",
      contact: {
        id: Date.now(), // ID temporal
        date: contactData.createdAt
      }
    });
  } catch (error) {
    console.error("Error en formulario de contacto:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error inesperado en el servidor. Intenta de nuevo más tarde."
    });
  }
});

// Manejo de errores global (tipado correcto)
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