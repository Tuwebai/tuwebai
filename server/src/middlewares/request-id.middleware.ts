import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

const REQUEST_ID_HEADER = 'x-request-id';

const sanitizeRequestId = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Prevent header abuse and log pollution.
  if (trimmed.length > 120) return null;
  if (!/^[a-zA-Z0-9._-]+$/.test(trimmed)) return null;
  return trimmed;
};

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const incomingHeader = req.headers[REQUEST_ID_HEADER];
  const incomingRaw = Array.isArray(incomingHeader) ? incomingHeader[0] : incomingHeader;
  const incoming = typeof incomingRaw === 'string' ? sanitizeRequestId(incomingRaw) : null;

  const requestId = incoming || randomUUID();
  res.locals.requestId = requestId;
  req.headers[REQUEST_ID_HEADER] = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};

