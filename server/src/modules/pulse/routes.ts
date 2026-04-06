import { Router } from 'express';
import { handleGetPulseStatus, handleGetPulseToken } from './controller';
import { apiLimiter } from '../../middlewares/rate-limit.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/api/pulse-status', apiLimiter, requireAuth, handleGetPulseStatus);
router.get('/api/pulse-token', apiLimiter, requireAuth, handleGetPulseToken);

export default router;
