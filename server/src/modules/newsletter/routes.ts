import { Router } from 'express';
import {
  handleBrevoWebhook,
  handleNewsletter,
  handleNewsletterBrevoReconcile,
  handleNewsletterConfirm,
  handleNewsletterUnsubscribe,
} from './controller';
import { validatePayload } from '../../middlewares/validate.middleware';
import { apiLimiter } from '../../middlewares/rate-limit.middleware';
import { requireInternalApiKey } from '../../middlewares/internal-auth.middleware';
import {
  brevoWebhookSchema,
  newsletterConfirmParamsSchema,
  newsletterReconcileSchema,
  newsletterSchema,
  newsletterUnsubscribeParamsSchema,
} from '../../schemas/api.schemas';

const router = Router();

router.post('/newsletter', apiLimiter, validatePayload(newsletterSchema), handleNewsletter);
router.get('/newsletter/confirm/:token', apiLimiter, validatePayload(newsletterConfirmParamsSchema), handleNewsletterConfirm);
router.get(
  '/newsletter/unsubscribe/:token',
  apiLimiter,
  validatePayload(newsletterUnsubscribeParamsSchema),
  handleNewsletterUnsubscribe,
);
router.post('/webhooks/brevo', validatePayload(brevoWebhookSchema), handleBrevoWebhook);
router.post(
  '/newsletter/reconcile-brevo',
  apiLimiter,
  requireInternalApiKey,
  validatePayload(newsletterReconcileSchema),
  handleNewsletterBrevoReconcile,
);

export default router;
