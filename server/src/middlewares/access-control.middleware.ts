import { type NextFunction, type Request, type Response } from 'express';
import { env } from '../config/env.config';
import { sendError } from '../core/contracts/api-response';
import { auditSecurityEvent } from '../core/observability/security-audit';
import type { AuthUser } from '../shared/types/auth-user';
import { appLogger } from '../utils/app-logger';
import {
  accessPolicy,
  type AccessAction,
  type AccessRole,
  type ResourceType,
} from '../security/access-policy';
import { getProjectById } from '../modules/projects/supabase.repository';

type ResourceDocument = {
  id: string;
  ownerUserId?: string;
  data: Record<string, unknown>;
};

type ResourceAccessConfig = {
  resourceType: ResourceType;
  action: AccessAction;
  resourceIdParam: string;
};

const shouldEnforceServerAuth = (): boolean => env.NODE_ENV === 'production' || env.ENFORCE_SERVER_AUTH;

const getAuthUser = (res: Response): AuthUser | null => {
  const authUser = res.locals.authUser;
  if (!authUser || typeof authUser !== 'object') return null;

  const candidate = authUser as Partial<AuthUser>;
  if (typeof candidate.uid !== 'string' || candidate.uid.length === 0) return null;

  return {
    appUserId: typeof candidate.appUserId === 'string' ? candidate.appUserId : undefined,
    authUserId: typeof candidate.authUserId === 'string' ? candidate.authUserId : undefined,
    uid: candidate.uid,
    email: typeof candidate.email === 'string' ? candidate.email : undefined,
    admin: candidate.admin === true,
    role: candidate.role === 'admin' ? 'admin' : 'user',
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
    appUserId: authUser?.appUserId,
    authUserId: authUser?.authUserId,
    userEmail: authUser?.email,
  });
};

const hasRequiredRole = (requiredRoles: readonly AccessRole[], authUser: AuthUser): boolean => {
  if (requiredRoles.includes('admin') && authUser.admin) return true;
  if (requiredRoles.includes('owner')) return true;
  return false;
};

const loadResourceDocument = async (
  _resourceType: ResourceType,
  resourceId: string
): Promise<ResourceDocument | null> => {
  const resource = await getProjectById(resourceId);

  if (!resource) {
    return {
      id: resourceId,
      data: {},
    };
  }

  return {
    id: resource.id,
    ownerUserId: typeof resource.userId === 'string' ? resource.userId : undefined,
    data: resource as unknown as Record<string, unknown>,
  };
};

const isResourceOwner = (authUser: AuthUser, resourceDocument: ResourceDocument): boolean => {
  if (!resourceDocument.ownerUserId) {
    return false;
  }

  return resourceDocument.ownerUserId === authUser.uid || resourceDocument.ownerUserId === authUser.appUserId;
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!shouldEnforceServerAuth()) {
    return next();
  }

  const authUser = getAuthUser(res);
  if (!authUser) {
    logAccessRejected(req, res, { statusCode: 401, reason: 'missing_auth_user' });
    return sendError(res, 401, 'Token de autenticacion requerido');
  }

  if (!authUser.admin) {
    logAccessRejected(req, res, { statusCode: 403, reason: 'admin_required' });
    auditSecurityEvent(req, res, 'auth.admin_access_rejected');
    return sendError(res, 403, 'No autorizado para este recurso');
  }

  auditSecurityEvent(req, res, 'auth.admin_access_granted');
  return next();
};

export const checkResourceOwnership =
  ({ resourceType, action, resourceIdParam }: ResourceAccessConfig) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!shouldEnforceServerAuth()) {
      return next();
    }

    const authUser = getAuthUser(res);
    if (!authUser) {
      logAccessRejected(req, res, {
        statusCode: 401,
        reason: 'missing_auth_user',
        resourceType,
      });
      return sendError(res, 401, 'Token de autenticacion requerido');
    }

    const resourceId = req.params?.[resourceIdParam];
    if (!resourceId) {
      return sendError(res, 400, `${resourceIdParam} requerido`);
    }

    const requiredRoles = accessPolicy[resourceType][action];
    if (!hasRequiredRole(requiredRoles, authUser)) {
      logAccessRejected(req, res, {
        statusCode: 403,
        reason: 'role_not_allowed_by_policy',
        resourceType,
        resourceId,
      });
      auditSecurityEvent(req, res, 'auth.resource_policy_rejected', {
        action,
        resourceId,
        resourceType,
      });
      return sendError(res, 403, 'No autorizado para este recurso');
    }

    const resourceDocument = await loadResourceDocument(resourceType, resourceId);
    if (!resourceDocument) {
      logAccessRejected(req, res, {
        statusCode: 503,
        reason: 'resource_load_failed',
        resourceType,
        resourceId,
      });
      return sendError(res, 503, 'Persistencia no disponible');
    }

    if (Object.keys(resourceDocument.data).length === 0) {
      logAccessRejected(req, res, {
        statusCode: 404,
        reason: 'resource_not_found',
        resourceType,
        resourceId,
      });
      return sendError(res, 404, 'Proyecto no encontrado');
    }

    if (authUser.admin) {
      auditSecurityEvent(req, res, 'auth.resource_access_granted', {
        action,
        resourceId,
        resourceType,
        via: 'admin',
      });
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
      return sendError(res, 403, 'No autorizado para este recurso');
    }

    if (!isResourceOwner(authUser, resourceDocument)) {
      logAccessRejected(req, res, {
        statusCode: 403,
        reason: 'resource_owner_mismatch',
        resourceType,
        resourceId,
      });
      auditSecurityEvent(req, res, 'auth.resource_access_rejected', {
        action,
        resourceId,
        resourceType,
        via: 'owner',
      });
      return sendError(res, 403, 'No autorizado para este recurso');
    }

    auditSecurityEvent(req, res, 'auth.resource_access_granted', {
      action,
      resourceId,
      resourceType,
      via: 'owner',
    });
    res.locals.resourceDocument = resourceDocument;
    return next();
  };
