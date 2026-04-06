import type { Request, Response } from 'express';
import type { AuthUser } from '../../shared/types/auth-user';
import { appLogger } from '../../utils/app-logger';

type SecurityAuditMeta = Record<string, unknown>;

const buildAuthSnapshot = (authUser?: AuthUser | null): SecurityAuditMeta => ({
  appUserId: authUser?.appUserId,
  authUserId: authUser?.authUserId,
  role: authUser?.role,
  uid: authUser?.uid,
  userEmail: authUser?.email,
});

export const auditSecurityEvent = (
  req: Pick<Request, 'method' | 'path'>,
  res: Pick<Response, 'locals'>,
  event: string,
  meta?: SecurityAuditMeta,
) => {
  const authUser = res.locals?.authUser as AuthUser | undefined;

  appLogger.info(event, {
    requestId: res.locals?.requestId as string | undefined,
    method: req.method,
    path: req.path,
    ...buildAuthSnapshot(authUser),
    ...(meta ?? {}),
  });
};
