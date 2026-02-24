import { Router } from 'express';
import { handleContact, handleConsulta, handleTestEmail } from '../controllers/contact.controller';
import { validatePayload } from '../middlewares/validate.middleware';
import { contactSchema, consultationSchema } from '../schemas/api.schemas';
import { strictApiLimiter, apiLimiter } from '../middlewares/rate-limit.middleware';
import { requireInternalApiKey } from '../middlewares/internal-auth.middleware';

const router = Router();

// Endpoint agresivamente protegido (Envío de Emails cuesta dinero/cuota)
router.post('/contact', strictApiLimiter, validatePayload(contactSchema), handleContact);
router.post('/consulta', strictApiLimiter, validatePayload(consultationSchema), handleConsulta);

// Test protegido de manera estandar
router.post('/test-email', apiLimiter, requireInternalApiKey, handleTestEmail);

export default router;
