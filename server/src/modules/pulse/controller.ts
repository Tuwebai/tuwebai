import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config';
import type { AuthUser } from '../../shared/types/auth-user';
import { appLogger } from '../../utils/app-logger';

const TOKEN_ISSUER = 'tuweb-ai.com';
const TOKEN_TTL_SECONDS = 60 * 5;

function buildRedirectUrl(token: string): string {
  const redirectUrl = new URL(env.PULSE_SSO_URL);
  redirectUrl.searchParams.set('token', token);
  return redirectUrl.toString();
}

export const handleGetPulseToken = async (_req: Request, res: Response) => {
  const authUser = res.locals.authUser as AuthUser | undefined;

  if (!authUser?.email?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'No pudimos resolver el email del usuario autenticado',
    });
  }

  const sharedSecret = env.TUWEBAI_WEBHOOK_SECRET;

  if (!sharedSecret) {
    appLogger.error('pulse.token_secret_missing', {
      requestId: res.locals.requestId,
      uid: authUser.uid,
    });
    return res.status(500).json({
      success: false,
      message: 'La integracion con Pulse no esta configurada',
    });
  }

  const email = authUser.email.trim().toLowerCase();

  const token = jwt.sign(
    {
      sub: email,
      iss: TOKEN_ISSUER,
    },
    sharedSecret,
    {
      algorithm: 'HS256',
      expiresIn: TOKEN_TTL_SECONDS,
    }
  );

  return res.json({
    success: true,
    data: {
      token,
      redirect_url: buildRedirectUrl(token),
    },
  });
};
