"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contacto = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const corsLib = require("cors");
const emailjs_com_1 = require("emailjs-com");
admin.initializeApp();
const db = admin.firestore();
const cors = corsLib({ origin: ["https://tuweb-ai.com", "https://www.tuweb-ai.com"], credentials: true });
// Configuración de EmailJS
const EMAILJS_SERVICE_ID = "service_9s9hqqn";
const EMAILJS_TEMPLATE_ID = "template_8pxfpyh";
const EMAILJS_PRIVATE_KEY = "JwEzBkL2LmY4a6WRkkodX";
exports.contacto = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Método no permitido" });
        }
        const { name, email, title, message } = req.body;
        if (!name || !email || !title || !message || message.trim().length < 10) {
            return res.status(400).json({ message: "Datos inválidos" });
        }
        try {
            // Guardar en Firestore
            await db.collection("contactos").add({
                name,
                email,
                title,
                message,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            // Enviar email con EmailJS
            await emailjs_com_1.default.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                name,
                email,
                title,
                message,
            }, EMAILJS_PRIVATE_KEY);
            return res.status(200).json({ message: "Mensaje enviado correctamente" });
        }
        catch (err) {
            console.error("Error en contacto:", err);
            return res.status(500).json({ message: "Error en el servidor" });
        }
    });
});
//# sourceMappingURL=index.js.map