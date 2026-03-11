import { Router } from 'express';
import {
  handleApplicationSubmission,
  handleConsulta,
  handleContact,
  handlePropuesta,
  handleTestEmail,
} from './controller';
import { validatePayload } from '../../middlewares/validate.middleware';
import { apiLimiter, strictApiLimiter } from '../../middlewares/rate-limit.middleware';
import { requireInternalApiKey } from '../../middlewares/internal-auth.middleware';
import { applicationSubmissionSchema, contactSchema, consultationSchema, proposalSchema } from '../../schemas/api.schemas';

const router = Router();

router.post('/contact', strictApiLimiter, validatePayload(contactSchema), handleContact);
router.post('/consulta', strictApiLimiter, validatePayload(consultationSchema), handleConsulta);
router.post('/test-email', apiLimiter, requireInternalApiKey, handleTestEmail);
router.post('/api/propuesta', strictApiLimiter, validatePayload(proposalSchema), handlePropuesta);
router.post('/api/applications', strictApiLimiter, validatePayload(applicationSubmissionSchema), handleApplicationSubmission);

export default router;
