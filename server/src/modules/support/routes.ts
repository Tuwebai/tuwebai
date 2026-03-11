import { Router } from 'express';
import {
  handleAddTicketResponse,
  handleCreateTicket,
  handleGetAllTickets,
  handleGetTicketById,
  handleGetUserTickets,
  handleUpdateTicket,
} from './controller';
import { validatePayload } from '../../middlewares/validate.middleware';
import { apiLimiter, strictApiLimiter } from '../../middlewares/rate-limit.middleware';
import { requireFirebaseAuth, requireFirebaseAuthForUidParam } from '../../middlewares/firebase-auth.middleware';
import { checkResourceOwnership, requireAdmin } from '../../middlewares/access-control.middleware';
import {
  ticketCreateSchema,
  ticketIdParamsSchema,
  ticketOnlyParamsSchema,
  ticketResponseSchema,
  ticketUpdateSchema,
  userUidParamsSchema,
} from '../../schemas/api.schemas';

const router = Router();

router.get('/api/users/:uid/tickets', apiLimiter, requireFirebaseAuthForUidParam, validatePayload(userUidParamsSchema), handleGetUserTickets);
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
router.get('/api/tickets', apiLimiter, requireFirebaseAuth, requireAdmin, handleGetAllTickets);

export default router;
