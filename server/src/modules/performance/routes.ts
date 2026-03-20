import { Router } from 'express';
import { apiLimiter } from '../../middlewares/rate-limit.middleware';
import { validatePayload } from '../../middlewares/validate.middleware';
import { performanceBeaconSchema } from '../../schemas/api.schemas';
import { handlePerformanceBeacon } from './controller';

const router = Router();

router.post('/api/performance/beacon', apiLimiter, validatePayload(performanceBeaconSchema), handlePerformanceBeacon);

export default router;
