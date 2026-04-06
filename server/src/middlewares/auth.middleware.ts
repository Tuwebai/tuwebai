import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.config';
import { getServerAuthProvider } from '../core/auth/server-auth-provider';
import type { AuthUser } from '../shared/types/auth-user';
import { getErrorMessage } from '../shared/utils/error-message';
import { appLogger } from '../utils/app-logger';

const shouldEnforceServerAuth = (): boolean => env.NODE_ENV === 'production' || env.ENFORCE_FIREBASE_AUTH;

const logAuthRejected = (
  req: Request,
  res: Response,
  payload: {
    statusCode: 401 | 403 | 503;
    reason: string;
    userId?: string;
    userEmail?: string;
  }
) => {
  appLogger.warn('auth.access_rejected', {
    requestId: res.locals.requestId as string | undefined,
    statusCode: payload.statusCode,
    reason: payload.reason,
    method: req.method,
    path: req.path,
    userId: payload.userId,
    userEmail: payload.userEmail,
  });
};

const parseBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) return null;
  const [scheme, token] = authorizationHeader.split(' ');
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') return null;
  return token.trim();
};

const getDecodedToken = async (req: Request): Promise<AuthUser | null> => {
  if (!shouldEnforceServerAuth()) return null;

  const token = parseBearerToken(req.headers.authorization);
  if (!token) return null;

  return getServerAuthProvider().verifyAccessToken(token);
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!shouldEnforceServerAuth()) return next();

    const decoded = await getDecodedToken(req);
    if (!decoded) {
      logAuthRejected(req, res, {
        statusCode: 401,
        reason: 'missing_bearer_token',
      });
      return res.status(401).json({ success: false, message: 'Token de autenticacion requerido' });
    }

    res.locals.authUser = decoded;
    return next();
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'unknown_auth_error');
    if (errorMessage === 'auth_provider_unavailable') {
      logAuthRejected(req, res, {
        statusCode: 503,
        reason: 'auth_provider_unavailable',
      });
      return res.status(503).json({ success: false, message: 'Auth admin no disponible' });
    }
    appLogger.warn('auth.verify_failed', {
      path: req.path,
      method: req.method,
      error: errorMessage,
    });
    return res.status(401).json({ success: false, message: 'Token de autenticacion invalido' });
  }
};

export const requireAuthForUidParam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!shouldEnforceServerAuth()) return next();

    const decoded = await getDecodedToken(req);
    if (!decoded) {
      logAuthRejected(req, res, {
        statusCode: 401,
        reason: 'missing_bearer_token',
      });
      return res.status(401).json({ success: false, message: 'Token de autenticacion requerido' });
    }

    const uid = req.params?.uid;
    if (!uid) {
      return res.status(400).json({ success: false, message: 'uid requerido' });
    }

    if (decoded.uid !== uid && !decoded.admin) {
      logAuthRejected(req, res, {
        statusCode: 403,
        reason: 'uid_param_mismatch',
        userId: decoded.uid,
        userEmail: decoded.email,
      });
      return res.status(403).json({ success: false, message: 'No autorizado para este recurso' });
    }

    res.locals.authUser = decoded;
    return next();
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'unknown_auth_error');
    if (errorMessage === 'auth_provider_unavailable') {
      logAuthRejected(req, res, {
        statusCode: 503,
        reason: 'auth_provider_unavailable',
      });
      return res.status(503).json({ success: false, message: 'Auth admin no disponible' });
    }
    appLogger.warn('auth.verify_failed', {
      path: req.path,
      method: req.method,
      error: errorMessage,
    });
    return res.status(401).json({ success: false, message: 'Token de autenticacion invalido' });
  }
};
