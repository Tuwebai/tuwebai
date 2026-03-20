import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { getFirestore as getAdminFirestore } from '../../infrastructure/firebase/firestore';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';
const GOOGLE_AVATAR_TIMEOUT_MS = 8000;

const isAllowedAvatarHost = (host: string) =>
  host === 'lh3.googleusercontent.com' ||
  host.endsWith('.googleusercontent.com') ||
  host.endsWith('.ggpht.com');

type UserPreferencesDocument = {
  emailNotifications?: boolean;
  newsletter?: boolean;
  darkMode?: boolean;
  language?: string;
  updatedAt?: string;
};

type UserPrivacyDocument = {
  marketingConsent?: boolean;
  analyticsConsent?: boolean;
  profileEmailVisible?: boolean;
  profileStatusVisible?: boolean;
  updatedAt?: string;
  updatedBy?: 'self';
};

type UserPrivacyField =
  | 'marketingConsent'
  | 'analyticsConsent'
  | 'profileEmailVisible'
  | 'profileStatusVisible';

const DEFAULT_USER_PRIVACY_SETTINGS: Required<
  Pick<UserPrivacyDocument, 'marketingConsent' | 'analyticsConsent' | 'profileEmailVisible' | 'profileStatusVisible'>
> = {
  marketingConsent: false,
  analyticsConsent: false,
  profileEmailVisible: true,
  profileStatusVisible: true,
};

const PRIVACY_FIELDS: UserPrivacyField[] = [
  'marketingConsent',
  'analyticsConsent',
  'profileEmailVisible',
  'profileStatusVisible',
];

type UserDocument = {
  uid?: string;
  email?: string;
  username?: string;
  name?: string;
  image?: string;
  authProvider?: 'password' | 'google';
  passwordChangedAt?: string | null;
  role?: string;
  isActive?: boolean;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
  preferences?: UserPreferencesDocument;
  privacy?: UserPrivacyDocument;
};

type PaymentDocument = {
  id: string;
  date?: string;
} & Record<string, unknown>;

export const handleAuthVerify = (_req: Request, res: Response) => {
  return res.json({
    success: false,
    message: 'La verificacion de cuenta se gestiona con Firebase Auth.',
  });
};

export const handleAuthDevVerify = (req: Request, res: Response) => {
  if (env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'Este endpoint solo esta disponible en desarrollo.',
    });
  }

  const { email } = req.params;
  return res.json({
    success: true,
    message: `Verificacion de desarrollo simulada para ${email}.`,
  });
};

export const handlePasswordResetMetadata = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
  }

  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const passwordChangedAt = String(req.body?.passwordChangedAt || '').trim();

    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (!snapshot.empty) {
      const ref = snapshot.docs[0].ref;
      await ref.set(
        {
          authProvider: 'password',
          passwordChangedAt,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      appLogger.info('auth.password_reset_metadata_recorded', {
        uid: snapshot.docs[0].id,
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
  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
  }

  try {
    const { uid } = req.params;
    const snapshot = await db.collection('users').doc(uid).get();
    const data = snapshot.exists ? (snapshot.data() as UserDocument | undefined) ?? null : null;
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
  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
  }

  try {
    const { uid } = req.params;
    const payload = (req.body ?? {}) as Partial<UserDocument>;
    await db.collection('users').doc(uid).set(
      {
        ...payload,
        uid,
        updatedAt: new Date().toISOString(),
        createdAt: payload.createdAt || new Date().toISOString(),
      },
      { merge: true }
    );
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
  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
  }

  try {
    const { uid } = req.params;
    const snapshot = await db.collection('users').doc(uid).get();
    const data = snapshot.exists ? ((snapshot.data() as UserDocument | undefined) ?? null) : null;
    return res.json({ success: true, data: data?.preferences || null });
  } catch (error: unknown) {
    appLogger.error('public.get_user_preferences_failed', {
      error: getErrorMessage(error, 'unknown_get_user_preferences_error'),
      uid: req.params?.uid,
    });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener preferencias' });
  }
};

export const handleSetUserPreferences = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
  }

  try {
    const { uid } = req.params;
    const incoming = (req.body ?? {}) as Partial<UserPreferencesDocument>;
    const ref = db.collection('users').doc(uid);
    const current = await ref.get();
    const currentData = (current.data() as UserDocument | undefined) ?? null;
    const currentPrefs = currentData?.preferences ?? {};

    await ref.set(
      {
        uid,
        preferences: {
          ...currentPrefs,
          ...incoming,
          updatedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
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
  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
  }

  try {
    const { uid } = req.params;
    const snapshot = await db.collection('users').doc(uid).get();
    const data = snapshot.exists ? ((snapshot.data() as UserDocument | undefined) ?? null) : null;
    const privacy = data?.privacy ?? {};

    return res.json({
      success: true,
      data: {
        ...DEFAULT_USER_PRIVACY_SETTINGS,
        ...privacy,
      },
    });
  } catch (error: unknown) {
    appLogger.error('public.get_user_privacy_failed', {
      error: getErrorMessage(error, 'unknown_get_user_privacy_error'),
      uid: req.params?.uid,
    });
    return res.status(500).json({ success: false, message: 'No se pudo obtener la privacidad del usuario' });
  }
};

export const handleSetUserPrivacy = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
  }

  try {
    const { uid } = req.params;
    const incoming = (req.body ?? {}) as Partial<UserPrivacyDocument>;
    const ref = db.collection('users').doc(uid);
    const current = await ref.get();
    const currentData = (current.data() as UserDocument | undefined) ?? null;
    const currentPrivacy = currentData?.privacy ?? {};
    const changedFields = PRIVACY_FIELDS.filter((field) => incoming[field] !== undefined && incoming[field] !== currentPrivacy[field]);
    const nextPrivacy: UserPrivacyDocument = {
      ...DEFAULT_USER_PRIVACY_SETTINGS,
      ...currentPrivacy,
      ...incoming,
      updatedAt: new Date().toISOString(),
      updatedBy: 'self',
    };

    await ref.set(
      {
        uid,
        privacy: nextPrivacy,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

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
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { uid } = req.params;
    const limit = resolveOptionalLimit(req.query?.limit);
    const snap = await db.collection('payments').where('userId', '==', uid).get();
    let data: PaymentDocument[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));
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
