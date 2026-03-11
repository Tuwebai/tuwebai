import { env } from '../../config/env.config';
import { transporter, isMailerConfigured } from './mailer';
import { generateEmailTemplate } from './templates';
import { appLogger } from '../../utils/app-logger';

export interface EmailData {
  name: string;
  email: string;
  title?: string;
  message: string;
  type?: 'contact' | 'test';
}

const getContactTo = (): string => env.CONTACT_TO_EMAIL?.trim() || env.SMTP_USER?.trim() || 'tuwebai@gmail.com';
const SMTP_TIMEOUT_MS = 8000;
const SMTP_MAX_ATTEMPTS = 2;

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`SMTP timeout after ${timeoutMs}ms`)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const isRetryableError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('timeout') ||
    message.includes('econnreset') ||
    message.includes('etimedout') ||
    message.includes('eai_again')
  );
};

export const sendContactEmail = async (data: EmailData) => {
  if (!isMailerConfigured()) {
    throw new Error('SMTP no configurado: defina SMTP_USER y SMTP_PASS en el entorno.');
  }
  const { name, email, title, message, type = 'contact' } = data;
  const emailTitle = title || "Consulta desde formulario de contacto";
  const mailOptions = {
    from: env.SMTP_USER!,
    to: getContactTo(),
    subject: emailTitle,
    html: generateEmailTemplate({
      name,
      email,
      message,
      title: emailTitle,
      type
    })
  };

  for (let attempt = 1; attempt <= SMTP_MAX_ATTEMPTS; attempt += 1) {
    try {
      return await withTimeout(transporter.sendMail(mailOptions), SMTP_TIMEOUT_MS);
    } catch (error: unknown) {
      if (attempt >= SMTP_MAX_ATTEMPTS || !isRetryableError(error)) {
        throw error;
      }
    }
  }

  throw new Error('SMTP send failed after retries');
};

interface BackgroundEmailOptions {
  event: string;
  meta?: Record<string, unknown>;
}

export const queueContactEmail = (data: EmailData, options: BackgroundEmailOptions): void => {
  if (!isMailerConfigured()) {
    appLogger.warn(`${options.event}.smtp_not_configured`, options.meta || {});
    return;
  }

  void sendContactEmail(data)
    .then((result) => {
      appLogger.info(`${options.event}.smtp_sent`, {
        ...(options.meta || {}),
        messageId: result?.messageId,
      });
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown SMTP error';
      appLogger.warn(`${options.event}.smtp_failed`, {
        ...(options.meta || {}),
        error: message,
      });
    });
};
