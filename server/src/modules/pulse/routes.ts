import { Router } from 'express';
import { handleGetPulseToken } from './controller';
import { apiLimiter } from '../../middlewares/rate-limit.middleware';
import { requireFirebaseAuth } from '../../middlewares/firebase-auth.middleware';

const router = Router();

router.get('/api/pulse-token', apiLimiter, requireFirebaseAuth, handleGetPulseToken);

export default router;
