import { Router } from 'express';
import { handleGetAllProjects, handleGetUserProject, handleUpdateProject } from './controller';
import { validatePayload } from '../../middlewares/validate.middleware';
import { apiLimiter, strictApiLimiter } from '../../middlewares/rate-limit.middleware';
import { requireAuth, requireAuthForUidParam } from '../../middlewares/auth.middleware';
import { checkResourceOwnership, requireAdmin } from '../../middlewares/access-control.middleware';
import { projectIdParamsSchema, projectUpdateSchema, userUidParamsSchema } from '../../schemas/api.schemas';

const router = Router();

router.get('/api/users/:uid/project', apiLimiter, requireAuthForUidParam, validatePayload(userUidParamsSchema), handleGetUserProject);
router.put(
  '/api/projects/:projectId',
  strictApiLimiter,
  requireAuth,
  validatePayload(projectIdParamsSchema),
  validatePayload(projectUpdateSchema),
  checkResourceOwnership({ resourceType: 'projects', action: 'update', resourceIdParam: 'projectId' }),
  handleUpdateProject
);
router.get('/api/projects', apiLimiter, requireAuth, requireAdmin, handleGetAllProjects);

export default router;
