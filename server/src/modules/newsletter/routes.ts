import { Router } from 'express';
import { handleNewsletter, handleNewsletterConfirm } from './controller';
import { validatePayload } from '../../middlewares/validate.middleware';
import { apiLimiter } from '../../middlewares/rate-limit.middleware';
import { newsletterConfirmParamsSchema, newsletterSchema } from '../../schemas/api.schemas';

const router = Router();

router.post('/newsletter', apiLimiter, validatePayload(newsletterSchema), handleNewsletter);
router.get('/newsletter/confirm/:token', apiLimiter, validatePayload(newsletterConfirmParamsSchema), handleNewsletterConfirm);

export default router;
