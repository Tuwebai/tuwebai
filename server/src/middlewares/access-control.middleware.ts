import { type NextFunction, type Request, type Response } from 'express';
import { env } from '../config/env.config';
import { getFirestore as getAdminFirestore } from '../infrastructure/firebase/firestore';
import { appLogger } from '../utils/app-logger';
import {
  accessPolicy,
  type AccessAction,
  type AccessRole,
  type ResourceType,
} from '../security/access-policy';

type AuthUser = {
  uid: string;
  email?: string;
  admin?: boolean;
};

type ResourceDocument = {
  id: string;
  ownerUid?: string;
  data: Record<string, unknown>;
};

type ResourceAccessConfig = {
  resourceType: ResourceType;
  action: AccessAction;
  resourceIdParam: string;
};

const shouldEnforceFirebaseAuth = (): boolean => env.NODE_ENV === 'production' || env.ENFORCE_FIREBASE_AUTH;

const getAuthUser = (res: Response): AuthUser | null => {
  const authUser = res.locals.authUser;
  if (!authUser || typeof authUser !== 'object') return null;

  const candidate = authUser as Partial<AuthUser>;
  if (typeof candidate.uid !== 'string' || candidate.uid.length === 0) return null;

  return {
    uid: candidate.uid,
    email: typeof candidate.email === 'string' ? candidate.email : undefined,
    admin: candidate.admin === true,
  };
};

const logAccessRejected = (
  req: Request,
  res: Response,
  payload: {
    statusCode: 401 | 403 | 404 | 503;
    reason: string;
    resourceType?: ResourceType;
    resourceId?: string;
  }
) => {
  const authUser = getAuthUser(res);
  appLogger.warn('auth.access_rejected', {
    requestId: res.locals.requestId as string | undefined,
    statusCode: payload.statusCode,
    reason: payload.reason,
    method: req.method,
    path: req.path,
    resourceType: payload.resourceType,
    resourceId: payload.resourceId,
    userId: authUser?.uid,
    userEmail: authUser?.email,
  });
};

const hasRequiredRole = (requiredRoles: readonly AccessRole[], authUser: AuthUser): boolean => {
  if (requiredRoles.includes('admin') && authUser.admin) return true;
  if (requiredRoles.includes('owner')) return true;
  return false;
};

const getResourceConfig = (resourceType: ResourceType): { collectionName: string; ownerField: string } => {
  if (resourceType === 'tickets') {
    return { collectionName: 'support_tickets', ownerField: 'userId' };
  }

  return { collectionName: 'projects', ownerField: 'userId' };
};

const loadResourceDocument = async (
  resourceType: ResourceType,
  resourceId: string
): Promise<ResourceDocument | null> => {
  const db = getAdminFirestore();
  if (!db) return null;

  const { collectionName, ownerField } = getResourceConfig(resourceType);
  const snapshot = await db.collection(collectionName).doc(resourceId).get();
  if (!snapshot.exists) {
    return {
      id: resourceId,
      data: {},
    };
  }

  const data = (snapshot.data() || {}) as Record<string, unknown>;
  const ownerValue = data[ownerField];

  return {
    id: snapshot.id,
    ownerUid: typeof ownerValue === 'string' ? ownerValue : undefined,
    data,
  };
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!shouldEnforceFirebaseAuth()) {
    return next();
  }

  const authUser = getAuthUser(res);
  if (!authUser) {
    logAccessRejected(req, res, { statusCode: 401, reason: 'missing_auth_user' });
    return res.status(401).json({ success: false, message: 'Token de autenticacion requerido' });
  }

  if (!authUser.admin) {
    logAccessRejected(req, res, { statusCode: 403, reason: 'admin_required' });
    return res.status(403).json({ success: false, message: 'No autorizado para este recurso' });
  }

  return next();
};

export const checkResourceOwnership =
  ({ resourceType, action, resourceIdParam }: ResourceAccessConfig) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!shouldEnforceFirebaseAuth()) {
      return next();
    }

    const authUser = getAuthUser(res);
    if (!authUser) {
      logAccessRejected(req, res, {
        statusCode: 401,
        reason: 'missing_auth_user',
        resourceType,
      });
      return res.status(401).json({ success: false, message: 'Token de autenticacion requerido' });
    }

    const resourceId = req.params?.[resourceIdParam];
    if (!resourceId) {
      return res.status(400).json({ success: false, message: `${resourceIdParam} requerido` });
    }

    const requiredRoles = accessPolicy[resourceType][action];
    if (!hasRequiredRole(requiredRoles, authUser)) {
      logAccessRejected(req, res, {
        statusCode: 403,
        reason: 'role_not_allowed_by_policy',
        resourceType,
        resourceId,
      });
      return res.status(403).json({ success: false, message: 'No autorizado para este recurso' });
    }

    if (!getAdminFirestore()) {
      logAccessRejected(req, res, {
        statusCode: 503,
        reason: 'firestore_admin_unavailable',
        resourceType,
        resourceId,
      });
      return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
    }

    const resourceDocument = await loadResourceDocument(resourceType, resourceId);
    if (!resourceDocument) {
      logAccessRejected(req, res, {
        statusCode: 503,
        reason: 'resource_load_failed',
        resourceType,
        resourceId,
      });
      return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });
    }

    if (Object.keys(resourceDocument.data).length === 0) {
      logAccessRejected(req, res, {
        statusCode: 404,
        reason: 'resource_not_found',
        resourceType,
        resourceId,
      });
      return res.status(404).json({
        success: false,
        message: resourceType === 'tickets' ? 'Ticket no encontrado' : 'Proyecto no encontrado',
      });
    }

    if (authUser.admin) {
      res.locals.resourceDocument = resourceDocument;
      return next();
    }

    if (!requiredRoles.includes('owner')) {
      logAccessRejected(req, res, {
        statusCode: 403,
        reason: 'owner_access_not_allowed_by_policy',
        resourceType,
        resourceId,
      });
      return res.status(403).json({ success: false, message: 'No autorizado para este recurso' });
    }

    if (!resourceDocument.ownerUid || resourceDocument.ownerUid !== authUser.uid) {
      logAccessRejected(req, res, {
        statusCode: 403,
        reason: 'resource_owner_mismatch',
        resourceType,
        resourceId,
      });
      return res.status(403).json({ success: false, message: 'No autorizado para este recurso' });
    }

    res.locals.resourceDocument = resourceDocument;
    return next();
  };
