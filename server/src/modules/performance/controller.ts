import { Request, Response } from 'express';
import { appLogger } from '../../utils/app-logger';

const SLOW_NAVIGATION_THRESHOLD_MS = 4000;
const SLOW_TTFB_THRESHOLD_MS = 2000;

export const handlePerformanceBeacon = async (req: Request, res: Response) => {
  const payload = req.body as {
    pathname: string;
    href?: string;
    referrer?: string;
    navigationType?: string;
    documentTimings?: {
      ttfbMs?: number;
      domInteractiveMs?: number;
      domContentLoadedMs?: number;
      loadEventEndMs?: number;
    };
    paintTimings?: {
      firstPaintMs?: number;
      firstContentfulPaintMs?: number;
      lcpMs?: number;
      cls?: number;
      fidMs?: number;
    };
    slowResources?: Array<{
      name: string;
      initiatorType?: string;
      durationMs?: number;
      transferSize?: number;
    }>;
  };

  const loadEventEndMs = payload.documentTimings?.loadEventEndMs ?? 0;
  const ttfbMs = payload.documentTimings?.ttfbMs ?? 0;
  const isSlow = loadEventEndMs >= SLOW_NAVIGATION_THRESHOLD_MS || ttfbMs >= SLOW_TTFB_THRESHOLD_MS;

  const logLevel = isSlow ? appLogger.warn : appLogger.info;

  logLevel(`frontend.navigation_${isSlow ? 'slow' : 'sample'}`, {
    requestId: res.locals.requestId,
    pathname: payload.pathname,
    href: payload.href,
    referrer: payload.referrer,
    navigationType: payload.navigationType,
    userAgent: req.get('user-agent'),
    documentTimings: payload.documentTimings,
    paintTimings: payload.paintTimings,
    slowResources: payload.slowResources,
  });

  return res.status(202).json({ success: true });
};
