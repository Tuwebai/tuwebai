import type { Request, Response } from 'express';
import type { AuthUser } from '../../shared/types/auth-user';

export const handleGetCurrentAuthUser = (_req: Request, res: Response) => {
  const authUser = res.locals.authUser as AuthUser | undefined;

  if (!authUser?.uid) {
    return res.status(401).json({
      success: false,
      message: 'No se pudo resolver el usuario autenticado',
    });
  }

  return res.json({
    success: true,
    data: authUser,
  });
};
