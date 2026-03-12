import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as corsLib from "cors";
import emailjs from "emailjs-com";
import { Request, Response } from "express";

admin.initializeApp();
const db = admin.firestore();
const cors = corsLib({ origin: ["https://tuweb-ai.com", "https://www.tuweb-ai.com"], credentials: true });

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID?.trim() || "";
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID?.trim() || "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY?.trim() || "";

const isEmailJsConfigured = (): boolean =>
  Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PRIVATE_KEY);

export const contacto = functions.https.onRequest((req: Request, res: Response) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }
    const { name, email, title, message } = req.body;
    if (!name || !email || !title || !message || message.trim().length < 10) {
      return res.status(400).json({ message: "Datos inválidos" });
    }
    try {
      if (!isEmailJsConfigured()) {
        console.error("EmailJS no configurado en firebase-functions-contacto");
        return res.status(500).json({ message: "EmailJS no configurado" });
      }

      // Guardar en Firestore
      await db.collection("contactos").add({
        name,
        email,
        title,
        message,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Enviar email con EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name,
          email,
          title,
          message,
        },
        EMAILJS_PRIVATE_KEY
      );

      return res.status(200).json({ message: "Mensaje enviado correctamente" });
    } catch (err) {
      console.error("Error en contacto:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }
  });
}); 
