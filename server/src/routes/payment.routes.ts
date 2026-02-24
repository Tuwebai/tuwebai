import { Router } from 'express';
import {
  handleCreatePreference,
  handleGetPaymentStatus,
  handleWebhook,
  handleWebhookHealth,
} from '../controllers/payment.controller';
import { validatePayload } from '../middlewares/validate.middleware';
import { paymentPreferenceSchema, paymentStatusParamsSchema } from '../schemas/api.schemas';
import { strictApiLimiter, apiLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();

// Preferencias de pago son críticas, protegemos fuertemente
router.post('/crear-preferencia', strictApiLimiter, validatePayload(paymentPreferenceSchema), handleCreatePreference);
router.get('/api/payments/status/:paymentId', apiLimiter, validatePayload(paymentStatusParamsSchema), handleGetPaymentStatus);

// Webhook de Mercado Pago, no validamos el body con nuestro Schema dado que es estructura de MP, 
// pero evitamos spam genérico
router.post('/webhook/mercadopago', apiLimiter, handleWebhook);
router.get('/webhook/mercadopago/health', apiLimiter, handleWebhookHealth);

export default router;
