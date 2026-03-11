import { Router } from 'express';
import {
  handleDeleteTestimonial,
  handleGetTestimonialById,
  handleGetTestimonials,
  handleTestimonialSubmission,
  handleUpdateTestimonial,
} from './controller';
import { validatePayload } from '../../middlewares/validate.middleware';
import { apiLimiter, strictApiLimiter } from '../../middlewares/rate-limit.middleware';
import { requireInternalApiKey } from '../../middlewares/internal-auth.middleware';
import { testimonialIdParamsSchema, testimonialSubmissionSchema, testimonialUpdateSchema } from '../../schemas/api.schemas';

const router = Router();

router.post('/api/testimonials', strictApiLimiter, validatePayload(testimonialSubmissionSchema), handleTestimonialSubmission);
router.get('/api/testimonials', apiLimiter, handleGetTestimonials);
router.get('/api/testimonials/:testimonialId', apiLimiter, validatePayload(testimonialIdParamsSchema), handleGetTestimonialById);
router.put(
  '/api/testimonials/:testimonialId',
  strictApiLimiter,
  requireInternalApiKey,
  validatePayload(testimonialIdParamsSchema),
  validatePayload(testimonialUpdateSchema),
  handleUpdateTestimonial
);
router.delete(
  '/api/testimonials/:testimonialId',
  strictApiLimiter,
  requireInternalApiKey,
  validatePayload(testimonialIdParamsSchema),
  handleDeleteTestimonial
);

export default router;
