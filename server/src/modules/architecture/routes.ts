import { Router } from 'express';
import { requireInternalApiKey } from '../../middlewares/internal-auth.middleware';
import { apiLimiter } from '../../middlewares/rate-limit.middleware';
import { handleGetExtractionCandidates } from './controller';

const router = Router();

router.get(
  '/api/internal/architecture/extraction-candidates',
  apiLimiter,
  requireInternalApiKey,
  handleGetExtractionCandidates,
);

export default router;
