import { Router } from 'express';
import {
  handleAvatarProxy,
  handlePasswordResetMetadata,
  handleGetUser,
  handleGetUserPayments,
  handleGetUserPrivacy,
  handleGetUserPreferences,
  handleSetUserPrivacy,
  handleSetUserPreferences,
  handleUpsertUser,
} from './controller';
import { validatePayload } from '../../middlewares/validate.middleware';
import { apiLimiter, strictApiLimiter } from '../../middlewares/rate-limit.middleware';
import { requireAuthForUidParam } from '../../middlewares/auth.middleware';
import {
  authPasswordResetMetadataSchema,
  userPrivacyUpdateSchema,
  userPreferencesUpdateSchema,
  userUidParamsSchema,
  userUpdateSchema,
} from '../../schemas/api.schemas';

const router = Router();

router.post('/api/auth/password-reset-metadata', strictApiLimiter, validatePayload(authPasswordResetMetadataSchema), handlePasswordResetMetadata);
router.get('/api/users/avatar', apiLimiter, handleAvatarProxy);
router.get('/api/users/:uid', apiLimiter, requireAuthForUidParam, validatePayload(userUidParamsSchema), handleGetUser);
router.get('/api/users/:uid/payments', apiLimiter, requireAuthForUidParam, validatePayload(userUidParamsSchema), handleGetUserPayments);
router.put(
  '/api/users/:uid',
  strictApiLimiter,
  requireAuthForUidParam,
  validatePayload(userUidParamsSchema),
  validatePayload(userUpdateSchema),
  handleUpsertUser
);
router.get(
  '/api/users/:uid/privacy',
  apiLimiter,
  requireAuthForUidParam,
  validatePayload(userUidParamsSchema),
  handleGetUserPrivacy
);
router.put(
  '/api/users/:uid/privacy',
  strictApiLimiter,
  requireAuthForUidParam,
  validatePayload(userUidParamsSchema),
  validatePayload(userPrivacyUpdateSchema),
  handleSetUserPrivacy
);
router.get(
  '/api/users/:uid/preferences',
  apiLimiter,
  requireAuthForUidParam,
  validatePayload(userUidParamsSchema),
  handleGetUserPreferences
);
router.put(
  '/api/users/:uid/preferences',
  strictApiLimiter,
  requireAuthForUidParam,
  validatePayload(userUidParamsSchema),
  validatePayload(userPreferencesUpdateSchema),
  handleSetUserPreferences
);

export default router;
