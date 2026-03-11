import { Router } from 'express';
import {
  handleApplicationSubmission,
  handleAddTicketResponse,
  handleAuthDevVerify,
  handleAuthVerify,
  handleCreateTicket,
  handleGetAllProjects,
  handleGetAllTickets,
  handleGetTestimonialById,
  handleGetTestimonials,
  handleGetTicketById,
  handleGetUserPayments,
  handleGetUserProject,
  handleGetUserTickets,
  handleGetUser,
  handleGetUserPreferences,
  handleNewsletter,
  handlePropuesta,
  handleSetUserPreferences,
  handleUpdateTestimonial,
  handleTestimonialSubmission,
  handleDeleteTestimonial,
  handleUpdateProject,
  handleUpdateTicket,
  handleUpsertUser,
} from '../controllers/public.controller';
import { validatePayload } from '../middlewares/validate.middleware';
import { apiLimiter, strictApiLimiter } from '../middlewares/rate-limit.middleware';
import { requireInternalApiKey } from '../middlewares/internal-auth.middleware';
import { requireFirebaseAuth, requireFirebaseAuthForUidParam } from '../middlewares/firebase-auth.middleware';
import { checkResourceOwnership, requireAdmin } from '../middlewares/access-control.middleware';
import {
  authDevVerifyParamsSchema,
  authVerifyParamsSchema,
  applicationSubmissionSchema,
  newsletterSchema,
  projectIdParamsSchema,
  projectUpdateSchema,
  ticketCreateSchema,
  ticketIdParamsSchema,
  ticketOnlyParamsSchema,
  ticketResponseSchema,
  ticketUpdateSchema,
  userPreferencesUpdateSchema,
  userUidParamsSchema,
  userUpdateSchema,
  proposalSchema,
  testimonialSubmissionSchema,
  testimonialIdParamsSchema,
  testimonialUpdateSchema,
} from '../schemas/api.schemas';

const router = Router();

router.post('/api/propuesta', strictApiLimiter, validatePayload(proposalSchema), handlePropuesta);
router.post('/newsletter', apiLimiter, validatePayload(newsletterSchema), handleNewsletter);
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
router.post('/api/applications', strictApiLimiter, validatePayload(applicationSubmissionSchema), handleApplicationSubmission);
router.get('/api/auth/verify/:token', apiLimiter, validatePayload(authVerifyParamsSchema), handleAuthVerify);
router.get('/api/auth/dev-verify/:email', strictApiLimiter, validatePayload(authDevVerifyParamsSchema), handleAuthDevVerify);
router.get('/api/users/:uid', apiLimiter, requireFirebaseAuthForUidParam, validatePayload(userUidParamsSchema), handleGetUser);
router.get('/api/users/:uid/project', apiLimiter, requireFirebaseAuthForUidParam, validatePayload(userUidParamsSchema), handleGetUserProject);
router.get('/api/users/:uid/payments', apiLimiter, requireFirebaseAuthForUidParam, validatePayload(userUidParamsSchema), handleGetUserPayments);
router.get('/api/users/:uid/tickets', apiLimiter, requireFirebaseAuthForUidParam, validatePayload(userUidParamsSchema), handleGetUserTickets);
router.put(
  '/api/users/:uid',
  strictApiLimiter,
  requireFirebaseAuthForUidParam,
  validatePayload(userUidParamsSchema),
  validatePayload(userUpdateSchema),
  handleUpsertUser
);
router.get(
  '/api/users/:uid/preferences',
  apiLimiter,
  requireFirebaseAuthForUidParam,
  validatePayload(userUidParamsSchema),
  handleGetUserPreferences
);
router.put(
  '/api/users/:uid/preferences',
  strictApiLimiter,
  requireFirebaseAuthForUidParam,
  validatePayload(userUidParamsSchema),
  validatePayload(userPreferencesUpdateSchema),
  handleSetUserPreferences
);
router.post('/api/users/:uid/tickets', strictApiLimiter, requireFirebaseAuthForUidParam, validatePayload(userUidParamsSchema), validatePayload(ticketCreateSchema), handleCreateTicket);
router.get(
  '/api/tickets/:ticketId',
  apiLimiter,
  requireFirebaseAuth,
  validatePayload(ticketOnlyParamsSchema),
  checkResourceOwnership({ resourceType: 'tickets', action: 'read', resourceIdParam: 'ticketId' }),
  handleGetTicketById
);
router.put(
  '/api/users/:uid/tickets/:ticketId',
  strictApiLimiter,
  requireFirebaseAuthForUidParam,
  validatePayload(ticketIdParamsSchema),
  validatePayload(ticketUpdateSchema),
  checkResourceOwnership({ resourceType: 'tickets', action: 'update', resourceIdParam: 'ticketId' }),
  handleUpdateTicket
);
router.post(
  '/api/users/:uid/tickets/:ticketId/responses',
  strictApiLimiter,
  requireFirebaseAuthForUidParam,
  validatePayload(ticketIdParamsSchema),
  validatePayload(ticketResponseSchema),
  checkResourceOwnership({ resourceType: 'tickets', action: 'update', resourceIdParam: 'ticketId' }),
  handleAddTicketResponse
);
router.put(
  '/api/projects/:projectId',
  strictApiLimiter,
  requireFirebaseAuth,
  validatePayload(projectIdParamsSchema),
  validatePayload(projectUpdateSchema),
  checkResourceOwnership({ resourceType: 'projects', action: 'update', resourceIdParam: 'projectId' }),
  handleUpdateProject
);
router.get('/api/projects', apiLimiter, requireFirebaseAuth, requireAdmin, handleGetAllProjects);
router.get('/api/tickets', apiLimiter, requireFirebaseAuth, requireAdmin, handleGetAllTickets);

export default router;
