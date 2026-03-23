import { Router } from 'express';
import { handleGetPulseStatus, handleGetPulseToken } from './controller';
import { apiLimiter } from '../../middlewares/rate-limit.middleware';
import { requireFirebaseAuth } from '../../middlewares/firebase-auth.middleware';

const router = Router();

router.get('/api/pulse-status', apiLimiter, requireFirebaseAuth, handleGetPulseStatus);
router.get('/api/pulse-token', apiLimiter, requireFirebaseAuth, handleGetPulseToken);

export default router;
