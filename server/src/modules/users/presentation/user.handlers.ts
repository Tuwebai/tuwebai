import type { Request, Response } from 'express';
import { sendError, sendSuccess, sendSuccessWithoutData } from '../../../core/contracts/api-response';
import { resolveOptionalLimit } from '../../../shared/utils/list-limit';
import { getErrorMessage } from '../../../shared/utils/error-message';
import { appLogger } from '../../../utils/app-logger';
import {
  getChangedPrivacyFields,
} from '../application/users.service';
import type {
  PaymentDocument,
  UserDocument,
  UserPreferencesDocument,
  UserPrivacyDocument,
} from '../domain/users.repository';
import { ensureUsersServiceAvailable, usersService } from './shared';

const sanitizeUserSelfUpdate = (payload: Partial<UserDocument>): Partial<UserDocument> => ({
  ...(typeof payload.email === 'string' ? { email: payload.email } : {}),
  ...(typeof payload.username === 'string' ? { username: payload.username } : {}),
  ...(typeof payload.name === 'string' ? { name: payload.name } : {}),
  ...(typeof payload.image === 'string' ? { image: payload.image } : {}),
});

export const handlePasswordResetMetadata = async (req: Request, res: Response) => {
  if (!ensureUsersServiceAvailable(res)) {
    return;
  }

  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const passwordChangedAt = String(req.body?.passwordChangedAt || '').trim();

    const result = await usersService.savePasswordResetMetadata(email, passwordChangedAt);
    if (result.found) {
      appLogger.info('auth.password_reset_metadata_recorded', {
        uid: result.uid,
        email,
        passwordChangedAt,
      });
    } else {
      appLogger.warn('auth.password_reset_metadata_user_not_found', {
        email,
      });
    }

    return sendSuccessWithoutData(res);
  } catch (error: unknown) {
    appLogger.error('auth.password_reset_metadata_failed', {
      error: getErrorMessage(error, 'unknown_password_reset_metadata_error'),
      email: req.body?.email,
    });
    return sendError(res, 500, 'No se pudo registrar el cambio de contraseña');
  }
};

export const handleGetUser = async (req: Request, res: Response) => {
  if (!ensureUsersServiceAvailable(res)) {
    return;
  }

  try {
    const { uid } = req.params;
    const data = await usersService.getUserByUid(uid);
    return sendSuccess(res, data);
  } catch (error: unknown) {
    appLogger.error('public.get_user_failed', {
      error: getErrorMessage(error, 'unknown_get_user_error'),
      uid: req.params?.uid,
    });
    return sendError(res, 500, 'No se pudo obtener el usuario');
  }
};

export const handleUpsertUser = async (req: Request, res: Response) => {
  if (!ensureUsersServiceAvailable(res)) {
    return;
  }

  try {
    const { uid } = req.params;
    const payload = sanitizeUserSelfUpdate((req.body ?? {}) as Partial<UserDocument>);
    await usersService.upsertUserByUid(uid, payload);
    return sendSuccessWithoutData(res);
  } catch (error: unknown) {
    appLogger.error('public.upsert_user_failed', {
      error: getErrorMessage(error, 'unknown_upsert_user_error'),
      uid: req.params?.uid,
    });
    return sendError(res, 500, 'No se pudo actualizar el usuario');
  }
};

export const handleGetUserPreferences = async (req: Request, res: Response) => {
  if (!ensureUsersServiceAvailable(res)) {
    return;
  }

  try {
    const { uid } = req.params;
    const data = await usersService.getPreferencesByUid(uid);
    return sendSuccess(res, data);
  } catch (error: unknown) {
    appLogger.error('public.get_user_preferences_failed', {
      error: getErrorMessage(error, 'unknown_get_user_preferences_error'),
      uid: req.params?.uid,
    });
    return sendError(res, 500, 'No se pudieron obtener preferencias');
  }
};

export const handleSetUserPreferences = async (req: Request, res: Response) => {
  if (!ensureUsersServiceAvailable(res)) {
    return;
  }

  try {
    const { uid } = req.params;
    const incoming = (req.body ?? {}) as Partial<UserPreferencesDocument>;
    await usersService.setPreferencesByUid(uid, incoming);
    return sendSuccessWithoutData(res);
  } catch (error: unknown) {
    appLogger.error('public.set_user_preferences_failed', {
      error: getErrorMessage(error, 'unknown_set_user_preferences_error'),
      uid: req.params?.uid,
    });
    return sendError(res, 500, 'No se pudieron actualizar preferencias');
  }
};

export const handleGetUserPrivacy = async (req: Request, res: Response) => {
  if (!ensureUsersServiceAvailable(res)) {
    return;
  }

  try {
    const { uid } = req.params;
    const data = await usersService.getPrivacyByUid(uid);
    return sendSuccess(res, data);
  } catch (error: unknown) {
    appLogger.error('public.get_user_privacy_failed', {
      error: getErrorMessage(error, 'unknown_get_user_privacy_error'),
      uid: req.params?.uid,
    });
    return sendError(res, 500, 'No se pudo obtener la privacidad del usuario');
  }
};

export const handleSetUserPrivacy = async (req: Request, res: Response) => {
  if (!ensureUsersServiceAvailable(res)) {
    return;
  }

  try {
    const { uid } = req.params;
    const incoming = (req.body ?? {}) as Partial<UserPrivacyDocument>;
    const currentData = await usersService.getUserByUid(uid);
    const currentPrivacy = currentData?.privacy ?? {};
    const changedFields = getChangedPrivacyFields(currentPrivacy, incoming);
    const nextPrivacy = await usersService.setPrivacyByUid(uid, incoming);

    if (changedFields.length > 0) {
      appLogger.info('users.privacy_updated', {
        uid,
        changedFields,
        updatedAt: nextPrivacy.updatedAt,
        updatedBy: nextPrivacy.updatedBy,
      });
    }

    return sendSuccess(res, nextPrivacy);
  } catch (error: unknown) {
    appLogger.error('public.set_user_privacy_failed', {
      error: getErrorMessage(error, 'unknown_set_user_privacy_error'),
      uid: req.params?.uid,
    });
    return sendError(res, 500, 'No se pudo actualizar la privacidad del usuario');
  }
};

export const handleGetUserPayments = async (req: Request, res: Response) => {
  if (!ensureUsersServiceAvailable(res)) {
    return;
  }

  try {
    const { uid } = req.params;
    const limit = resolveOptionalLimit(req.query?.limit);
    let data: PaymentDocument[] = await usersService.getPaymentsByUid(uid);
    data.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return sendSuccess(res, data);
  } catch (error: unknown) {
    appLogger.error('public.get_user_payments_failed', {
      error: getErrorMessage(error, 'unknown_get_user_payments_error'),
      uid: req.params?.uid,
    });
    return sendError(res, 500, 'No se pudieron obtener pagos');
  }
};
