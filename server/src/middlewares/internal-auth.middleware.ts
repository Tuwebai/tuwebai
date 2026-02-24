import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.config';
import { appLogger } from '../utils/app-logger';

const extractApiKey = (req: Request): string | null => {
  const xApiKey = req.header('x-api-key')?.trim();
  if (xApiKey) return xApiKey;

  const auth = req.header('authorization')?.trim();
  if (!auth) return null;
  const bearerPrefix = 'bearer ';
  if (auth.toLowerCase().startsWith(bearerPrefix)) {
    return auth.slice(bearerPrefix.length).trim();
  }
  return null;
};

export const requireInternalApiKey = (req: Request, res: Response, next: NextFunction) => {
  // In development/test, keep DX simple.
  if (env.NODE_ENV !== 'production') return next();

  const expected = process.env.API_KEY?.trim();
  if (!expected) {
    appLogger.warn('internal_auth.missing_expected_api_key', {
      route: req.path,
      method: req.method,
    });
    return res.status(503).json({
      success: false,
      message: 'Servicio temporalmente no disponible.',
    });
  }

  const provided = extractApiKey(req);
  if (!provided || provided !== expected) {
    appLogger.warn('internal_auth.unauthorized', {
      route: req.path,
      method: req.method,
      hasProvidedKey: !!provided,
    });
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  return next();
};
