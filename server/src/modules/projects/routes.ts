import { Router } from 'express';
import { handleGetAllProjects, handleGetUserProject, handleUpdateProject } from './controller';
import { validatePayload } from '../../middlewares/validate.middleware';
import { apiLimiter, strictApiLimiter } from '../../middlewares/rate-limit.middleware';
import { requireFirebaseAuth, requireFirebaseAuthForUidParam } from '../../middlewares/firebase-auth.middleware';
import { checkResourceOwnership, requireAdmin } from '../../middlewares/access-control.middleware';
import { projectIdParamsSchema, projectUpdateSchema, userUidParamsSchema } from '../../schemas/api.schemas';

const router = Router();

router.get('/api/users/:uid/project', apiLimiter, requireFirebaseAuthForUidParam, validatePayload(userUidParamsSchema), handleGetUserProject);
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

export default router;
