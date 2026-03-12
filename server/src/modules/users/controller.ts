import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { getFirestore as getAdminFirestore } from '../../infrastructure/firebase/firestore';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';

type UserPreferencesDocument = {
  emailNotifications?: boolean;
  newsletter?: boolean;
  darkMode?: boolean;
  language?: string;
  updatedAt?: string;
};

type UserDocument = {
  uid?: string;
  email?: string;
  username?: string;
  name?: string;
  image?: string;
  role?: string;
  isActive?: boolean;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
  preferences?: UserPreferencesDocument;
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
