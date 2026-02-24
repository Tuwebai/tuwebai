import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.config';
import { getAdminAuth } from '../config/firebase-admin';
import { appLogger } from '../utils/app-logger';

type DecodedToken = {
  uid: string;
  email?: string;
  admin?: boolean;
};

const parseBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) return null;
  const [scheme, token] = authorizationHeader.split(' ');
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') return null;
  return token.trim();
};

const getDecodedToken = async (req: Request): Promise<DecodedToken | null> => {
  if (!env.ENFORCE_FIREBASE_AUTH) return null;

  const token = parseBearerToken(req.headers.authorization);
  if (!token) return null;

  const auth = getAdminAuth();
  if (!auth) {
    throw new Error('firebase_admin_auth_unavailable');
  }

  const decoded = await auth.verifyIdToken(token);
  return {
    uid: decoded.uid,
    email: decoded.email,
    admin: Boolean((decoded as any).admin),
  };
};

export const requireFirebaseAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!env.ENFORCE_FIREBASE_AUTH) return next();

    const decoded = await getDecodedToken(req);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Token de autenticacion requerido' });
    }

    (res.locals as any).authUser = decoded;
    return next();
  } catch (error: any) {
    if (error?.message === 'firebase_admin_auth_unavailable') {
      return res.status(503).json({ success: false, message: 'Auth admin no disponible' });
    }
    appLogger.warn('auth.firebase_verify_failed', {
      path: req.path,
      method: req.method,
      error: error?.message,
    });
    return res.status(401).json({ success: false, message: 'Token de autenticacion invalido' });
  }
};

export const requireFirebaseAuthForUidParam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!env.ENFORCE_FIREBASE_AUTH) return next();

    const decoded = await getDecodedToken(req);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Token de autenticacion requerido' });
    }

    const uid = req.params?.uid;
    if (!uid) {
      return res.status(400).json({ success: false, message: 'uid requerido' });
    }

    if (decoded.uid !== uid && !decoded.admin) {
      return res.status(403).json({ success: false, message: 'No autorizado para este recurso' });
    }

    (res.locals as any).authUser = decoded;
    return next();
  } catch (error: any) {
    if (error?.message === 'firebase_admin_auth_unavailable') {
      return res.status(503).json({ success: false, message: 'Auth admin no disponible' });
    }
    appLogger.warn('auth.firebase_verify_failed', {
      path: req.path,
      method: req.method,
      error: error?.message,
    });
    return res.status(401).json({ success: false, message: 'Token de autenticacion invalido' });
  }
};

