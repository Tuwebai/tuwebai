import { Router } from 'express';
import {
  handleAvatarProxy,
  handleAuthDevVerify,
  handlePasswordResetMetadata,
  handleAuthVerify,
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
import { requireFirebaseAuthForUidParam } from '../../middlewares/firebase-auth.middleware';
import {
  authDevVerifyParamsSchema,
  authPasswordResetMetadataSchema,
  authVerifyParamsSchema,
  userPrivacyUpdateSchema,
  userPreferencesUpdateSchema,
  userUidParamsSchema,
  userUpdateSchema,
} from '../../schemas/api.schemas';

const router = Router();

router.get('/api/auth/verify/:token', apiLimiter, validatePayload(authVerifyParamsSchema), handleAuthVerify);
router.get('/api/auth/dev-verify/:email', strictApiLimiter, validatePayload(authDevVerifyParamsSchema), handleAuthDevVerify);
router.post('/api/auth/password-reset-metadata', strictApiLimiter, validatePayload(authPasswordResetMetadataSchema), handlePasswordResetMetadata);
router.get('/api/users/avatar', apiLimiter, handleAvatarProxy);
router.get('/api/users/:uid', apiLimiter, requireFirebaseAuthForUidParam, validatePayload(userUidParamsSchema), handleGetUser);
router.get('/api/users/:uid/payments', apiLimiter, requireFirebaseAuthForUidParam, validatePayload(userUidParamsSchema), handleGetUserPayments);
router.put(
  '/api/users/:uid',
  strictApiLimiter,
  requireFirebaseAuthForUidParam,
  validatePayload(userUidParamsSchema),
  validatePayload(userUpdateSchema),
  handleUpsertUser
);
router.get(
  '/api/users/:uid/privacy',
  apiLimiter,
  requireFirebaseAuthForUidParam,
  validatePayload(userUidParamsSchema),
  handleGetUserPrivacy
);
router.put(
  '/api/users/:uid/privacy',
  strictApiLimiter,
  requireFirebaseAuthForUidParam,
  validatePayload(userUidParamsSchema),
  validatePayload(userPrivacyUpdateSchema),
  handleSetUserPrivacy
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

export default router;
