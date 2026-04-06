import { Router } from 'express';
import { apiLimiter } from '../../middlewares/rate-limit.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';
import { handleGetCurrentAuthUser } from './controller';

const router = Router();

router.get('/api/auth/me', apiLimiter, requireAuth, handleGetCurrentAuthUser);

export default router;
