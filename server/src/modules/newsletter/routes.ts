import { Router } from 'express';
import { handleNewsletter } from './controller';
import { validatePayload } from '../../middlewares/validate.middleware';
import { apiLimiter } from '../../middlewares/rate-limit.middleware';
import { newsletterSchema } from '../../schemas/api.schemas';

const router = Router();

router.post('/newsletter', apiLimiter, validatePayload(newsletterSchema), handleNewsletter);

export default router;
