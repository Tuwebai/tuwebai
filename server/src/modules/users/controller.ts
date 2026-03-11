import { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { getFirestore as getAdminFirestore } from '../../infrastructure/firebase/firestore';
import { appLogger } from '../../utils/app-logger';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';

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
    return res.json({ success: true, data: snapshot.exists ? snapshot.data() : null });
  } catch (error: any) {
    appLogger.error('public.get_user_failed', { error: error?.message, uid: req.params?.uid });
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
    const payload = req.body || {};
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
  } catch (error: any) {
    appLogger.error('public.upsert_user_failed', { error: error?.message, uid: req.params?.uid });
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
    const data = snapshot.exists ? snapshot.data() : null;
    return res.json({ success: true, data: data?.preferences || null });
  } catch (error: any) {
    appLogger.error('public.get_user_preferences_failed', { error: error?.message, uid: req.params?.uid });
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
    const incoming = req.body || {};
    const ref = db.collection('users').doc(uid);
    const current = await ref.get();
    const currentPrefs = (current.data()?.preferences || {}) as Record<string, unknown>;

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
  } catch (error: any) {
    appLogger.error('public.set_user_preferences_failed', { error: error?.message, uid: req.params?.uid });
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
    let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    data.sort((a: any, b: any) => String(b.date || '').localeCompare(String(a.date || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: any) {
    appLogger.error('public.get_user_payments_failed', { error: error?.message, uid: req.params?.uid });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener pagos' });
  }
};
