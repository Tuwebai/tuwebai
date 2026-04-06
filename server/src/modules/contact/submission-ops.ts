import type { Request, Response } from 'express';
import { env } from '../../config/env.config';
import { queueContactEmail, type EmailData } from '../../infrastructure/mail/email.service';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import {
  storePublicSubmission,
  type PublicSubmissionChannel,
} from './submission-store.service';

interface DispatchPublicSubmissionOptions {
  req: Pick<Request, 'path' | 'method'>;
  channel: PublicSubmissionChannel;
  event: string;
  storePayload: Record<string, unknown>;
  emailPayload: EmailData;
  successMessage: string;
}

interface HandlePublicSubmissionErrorOptions {
  req: Pick<Request, 'path' | 'method'>;
  error: unknown;
  logEvent: string;
  fallbackError: string;
  userMessage: string;
}

export const dispatchPublicSubmission = async (
  res: Response,
  options: DispatchPublicSubmissionOptions,
) => {
  await storePublicSubmission({
    channel: options.channel,
    name: typeof options.storePayload.name === 'string' ? options.storePayload.name : undefined,
    email: typeof options.storePayload.email === 'string' ? options.storePayload.email : undefined,
    title: typeof options.storePayload.title === 'string' ? options.storePayload.title : undefined,
    message: typeof options.storePayload.message === 'string' ? options.storePayload.message : undefined,
    source: 'website',
    payload: {
      ...options.storePayload,
      createdAt: new Date().toISOString(),
      source: 'website',
    },
  });

  queueContactEmail(options.emailPayload, {
    event: options.event,
    meta: { route: options.req.path, method: options.req.method, channel: options.channel },
  });

  appLogger.info(`${options.event}.accepted`, {
    route: options.req.path,
    method: options.req.method,
    channel: options.channel,
  });

  return res.status(202).json({
    success: true,
    message: options.successMessage,
  });
};

export const handlePublicSubmissionError = (
  res: Response,
  options: HandlePublicSubmissionErrorOptions,
) => {
  const details = getErrorMessage(options.error, options.fallbackError);

  appLogger.error(options.logEvent, {
    error: details,
    route: options.req.path,
    method: options.req.method,
  });

  return res.status(500).json({
    success: false,
    message: options.userMessage,
    details: env.NODE_ENV === 'development' ? details : undefined,
  });
};
