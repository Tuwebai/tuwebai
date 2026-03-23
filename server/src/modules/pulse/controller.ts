import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config';
import type { AuthUser } from '../../shared/types/auth-user';
import { appLogger } from '../../utils/app-logger';

const TOKEN_ISSUER = 'tuweb-ai.com';
const TOKEN_TTL_SECONDS = 60 * 5;

type PulseAccessStatus = 'enabled' | 'pending_activation';

function buildRedirectUrl(token: string): string {
  const redirectUrl = new URL(env.PULSE_SSO_URL);
  redirectUrl.searchParams.set('token', token);
  return redirectUrl.toString();
}

function buildPulseVerifyUrl(): string {
  const pulseUrl = new URL(env.PULSE_SSO_URL);
  pulseUrl.pathname = '/functions/v1/verify-sso-token';
  pulseUrl.search = '';
  return pulseUrl.toString();
}

function getPulseSharedSecret(requestId: string | undefined, uid?: string): string | null {
  const sharedSecret = env.TUWEBAI_WEBHOOK_SECRET;

  if (!sharedSecret) {
    appLogger.error('pulse.token_secret_missing', {
      requestId,
      uid,
    });

    return null;
  }

  return sharedSecret;
}

function signPulseToken(email: string, sharedSecret: string): string {
  return jwt.sign(
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
}

async function resolvePulseAccessStatus(
  email: string,
  sharedSecret: string
): Promise<PulseAccessStatus> {
  const response = await fetch(buildPulseVerifyUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: signPulseToken(email, sharedSecret),
    }),
  });

  if (response.status === 404) {
    return 'pending_activation';
  }

  if (response.ok) {
    return 'enabled';
  }

  const payload = (await response.json().catch(() => null)) as { error?: string } | null;
  throw new Error(payload?.error || 'No pudimos validar el acceso a Pulse');
}

export const handleGetPulseToken = async (_req: Request, res: Response) => {
  const authUser = res.locals.authUser as AuthUser | undefined;

  if (!authUser?.email?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'No pudimos resolver el email del usuario autenticado',
    });
  }

  const sharedSecret = getPulseSharedSecret(res.locals.requestId, authUser.uid);
  if (!sharedSecret) {
    return res.status(500).json({
      success: false,
      message: 'La integracion con Pulse no esta configurada',
    });
  }

  const email = authUser.email.trim().toLowerCase();
  const token = signPulseToken(email, sharedSecret);

  return res.json({
    success: true,
    data: {
      token,
      redirect_url: buildRedirectUrl(token),
    },
  });
};

export const handleGetPulseStatus = async (_req: Request, res: Response) => {
  const authUser = res.locals.authUser as AuthUser | undefined;

  if (!authUser?.email?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'No pudimos resolver el email del usuario autenticado',
    });
  }

  const sharedSecret = getPulseSharedSecret(res.locals.requestId, authUser.uid);
  if (!sharedSecret) {
    return res.status(500).json({
      success: false,
      message: 'La integracion con Pulse no esta configurada',
    });
  }

  try {
    const email = authUser.email.trim().toLowerCase();
    const status = await resolvePulseAccessStatus(email, sharedSecret);

    return res.json({
      success: true,
      data: {
        status,
      },
    });
  } catch (error: unknown) {
    appLogger.warn('pulse.status_check_failed', {
      requestId: res.locals.requestId,
      uid: authUser.uid,
      error: error instanceof Error ? error.message : 'unknown_pulse_status_error',
    });

    return res.status(502).json({
      success: false,
      message: 'No pudimos verificar el estado de acceso a Pulse',
    });
  }
};
