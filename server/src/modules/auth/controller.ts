import type { Request, Response } from 'express';
import { sendError, sendSuccess } from '../../core/contracts/api-response';
import type { AuthUser } from '../../shared/types/auth-user';
import { resolveAuthIdentityResponse } from './auth-identity.service';

export const handleGetCurrentAuthUser = (_req: Request, res: Response) => {
  const authUser = res.locals.authUser as AuthUser | undefined;

  if (!authUser?.uid) {
    return sendError(res, 401, 'No se pudo resolver el usuario autenticado');
  }

  return sendSuccess(res, resolveAuthIdentityResponse(authUser));
};
