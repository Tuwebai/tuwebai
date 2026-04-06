import { Request, Response } from 'express';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';
import {
  getChangedPrivacyFields,
  getUsersService,
} from './application/users.service';
import type {
  PaymentDocument,
  UserDocument,
  UserPreferencesDocument,
  UserPrivacyDocument,
} from './domain/users.repository';
const GOOGLE_AVATAR_TIMEOUT_MS = 8000;
const USERS_REPOSITORY_UNAVAILABLE_MESSAGE = 'Persistencia de usuarios no disponible';

const isAllowedAvatarHost = (host: string) =>
  host === 'lh3.googleusercontent.com' ||
  host.endsWith('.googleusercontent.com') ||
  host.endsWith('.ggpht.com');

const usersService = getUsersService();

export const handlePasswordResetMetadata = async (req: Request, res: Response) => {
  if (!usersService.isAvailable()) {
    return res.status(503).json({ success: false, message: USERS_REPOSITORY_UNAVAILABLE_MESSAGE });
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

    return res.json({ success: true });
  } catch (error: unknown) {
    appLogger.error('auth.password_reset_metadata_failed', {
      error: getErrorMessage(error, 'unknown_password_reset_metadata_error'),
      email: req.body?.email,
    });
    return res.status(500).json({ success: false, message: 'No se pudo registrar el cambio de contraseña' });
  }
};

export const handleAvatarProxy = async (req: Request, res: Response) => {
  const src = typeof req.query.src === 'string' ? req.query.src.trim() : '';

  if (!src) {
    return res.status(400).json({ success: false, message: 'src requerido' });
  }

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return res.status(400).json({ success: false, message: 'src invalido' });
  }

  if (url.protocol !== 'https:' || !isAllowedAvatarHost(url.hostname)) {
    return res.status(400).json({ success: false, message: 'src no permitido' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GOOGLE_AVATAR_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'User-Agent': 'TuWeb.ai Avatar Proxy/1.0',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!response.ok) {
      appLogger.warn('users.avatar_proxy_upstream_failed', {
        status: response.status,
        host: url.hostname,
      });
      return res.status(502).json({ success: false, message: 'No se pudo obtener el avatar remoto' });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const cacheControl = response.headers.get('cache-control');
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', cacheControl || 'public, max-age=3600, s-maxage=3600');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    return res.send(buffer);
  } catch (error: unknown) {
    appLogger.warn('users.avatar_proxy_failed', {
      error: getErrorMessage(error, 'unknown_avatar_proxy_error'),
      host: url.hostname,
    });
    return res.status(502).json({ success: false, message: 'No se pudo obtener el avatar remoto' });
  } finally {
    clearTimeout(timeout);
  }
};

export const handleGetUser = async (req: Request, res: Response) => {
  if (!usersService.isAvailable()) {
    return res.status(503).json({ success: false, message: USERS_REPOSITORY_UNAVAILABLE_MESSAGE });
  }

  try {
    const { uid } = req.params;
    const data = await usersService.getUserByUid(uid);
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_user_failed', {
      error: getErrorMessage(error, 'unknown_get_user_error'),
      uid: req.params?.uid,
    });
    return res.status(500).json({ success: false, message: 'No se pudo obtener el usuario' });
  }
};

export const handleUpsertUser = async (req: Request, res: Response) => {
  if (!usersService.isAvailable()) {
    return res.status(503).json({ success: false, message: USERS_REPOSITORY_UNAVAILABLE_MESSAGE });
  }

  try {
    const { uid } = req.params;
    const payload = (req.body ?? {}) as Partial<UserDocument>;
    await usersService.upsertUserByUid(uid, payload);
    return res.json({ success: true });
  } catch (error: unknown) {
    appLogger.error('public.upsert_user_failed', {
      error: getErrorMessage(error, 'unknown_upsert_user_error'),
      uid: req.params?.uid,
    });
    return res.status(500).json({ success: false, message: 'No se pudo actualizar el usuario' });
  }
};

export const handleGetUserPreferences = async (req: Request, res: Response) => {
  if (!usersService.isAvailable()) {
    return res.status(503).json({ success: false, message: USERS_REPOSITORY_UNAVAILABLE_MESSAGE });
  }

  try {
    const { uid } = req.params;
    const data = await usersService.getPreferencesByUid(uid);
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_user_preferences_failed', {
      error: getErrorMessage(error, 'unknown_get_user_preferences_error'),
      uid: req.params?.uid,
    });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener preferencias' });
  }
};

export const handleSetUserPreferences = async (req: Request, res: Response) => {
  if (!usersService.isAvailable()) {
    return res.status(503).json({ success: false, message: USERS_REPOSITORY_UNAVAILABLE_MESSAGE });
  }

  try {
    const { uid } = req.params;
    const incoming = (req.body ?? {}) as Partial<UserPreferencesDocument>;
    await usersService.setPreferencesByUid(uid, incoming);
    return res.json({ success: true });
  } catch (error: unknown) {
    appLogger.error('public.set_user_preferences_failed', {
      error: getErrorMessage(error, 'unknown_set_user_preferences_error'),
      uid: req.params?.uid,
    });
    return res.status(500).json({ success: false, message: 'No se pudieron actualizar preferencias' });
  }
};

export const handleGetUserPrivacy = async (req: Request, res: Response) => {
  if (!usersService.isAvailable()) {
    return res.status(503).json({ success: false, message: USERS_REPOSITORY_UNAVAILABLE_MESSAGE });
  }

  try {
    const { uid } = req.params;
    const data = await usersService.getPrivacyByUid(uid);
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_user_privacy_failed', {
      error: getErrorMessage(error, 'unknown_get_user_privacy_error'),
      uid: req.params?.uid,
    });
    return res.status(500).json({ success: false, message: 'No se pudo obtener la privacidad del usuario' });
  }
};

export const handleSetUserPrivacy = async (req: Request, res: Response) => {
  if (!usersService.isAvailable()) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
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

    return res.json({ success: true, data: nextPrivacy });
  } catch (error: unknown) {
    appLogger.error('public.set_user_privacy_failed', {
      error: getErrorMessage(error, 'unknown_set_user_privacy_error'),
      uid: req.params?.uid,
    });
    return res.status(500).json({ success: false, message: 'No se pudo actualizar la privacidad del usuario' });
  }
};

export const handleGetUserPayments = async (req: Request, res: Response) => {
  if (!usersService.isAvailable()) return res.status(503).json({ success: false, message: USERS_REPOSITORY_UNAVAILABLE_MESSAGE });

  try {
    const { uid } = req.params;
    const limit = resolveOptionalLimit(req.query?.limit);
    let data: PaymentDocument[] = await usersService.getPaymentsByUid(uid);
    data.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_user_payments_failed', {
      error: getErrorMessage(error, 'unknown_get_user_payments_error'),
      uid: req.params?.uid,
    });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener pagos' });
  }
};
