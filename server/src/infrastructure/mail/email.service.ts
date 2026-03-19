import { env } from '../../config/env.config';
import { transporter, isMailerConfigured, isSmtpDeliveryDisabled } from './mailer';
import { generateEmailTemplate } from './templates';
import { appLogger } from '../../utils/app-logger';

export interface EmailData {
  name: string;
  email: string;
  title?: string;
  message: string;
  type?: 'contact' | 'test';
}

interface TransactionalEmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
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

const sendTransactionalEmail = async (data: TransactionalEmailData) => {
  if (!isMailerConfigured()) {
    throw new Error('SMTP no configurado: defina SMTP_USER y SMTP_PASS en el entorno.');
  }

  const mailOptions = {
    from: env.SMTP_USER!,
    to: data.to,
    subject: data.subject,
    html: data.html,
    text: data.text,
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
  if (isSmtpDeliveryDisabled()) {
    appLogger.info(`${options.event}.smtp_disabled`, options.meta || {});
    return;
  }

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

const buildNewsletterConfirmationEmail = (confirmationUrl: string) => {
  const subject = 'Confirma tu suscripcion al newsletter de TuWeb.ai';
  const text = [
    'Recibimos tu solicitud para suscribirte al newsletter de TuWeb.ai.',
    '',
    'Confirma tu email desde este enlace:',
    confirmationUrl,
    '',
    'Si no solicitaste esta suscripcion, podes ignorar este mensaje.',
  ].join('\n');

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
      </head>
      <body style="margin:0;padding:24px;background:#080b14;color:#f3f7ff;font-family:Segoe UI,Tahoma,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:linear-gradient(180deg,#111827 0%,#0b1020 100%);border:1px solid rgba(0,204,255,.2);border-radius:20px;overflow:hidden;">
          <div style="padding:32px 32px 20px;background:radial-gradient(circle at top left,rgba(0,204,255,.18),transparent 45%),radial-gradient(circle at top right,rgba(153,51,255,.18),transparent 40%);">
            <p style="margin:0 0 12px;font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#7dd3fc;">Newsletter TuWeb.ai</p>
            <h1 style="margin:0;font-size:30px;line-height:1.2;color:#ffffff;">Confirma tu suscripcion</h1>
          </div>
          <div style="padding:0 32px 32px;">
            <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#dbe7ff;">
              Recibimos tu solicitud para sumarte al newsletter. Para activar la suscripcion, confirma tu email desde el siguiente enlace:
            </p>
            <p style="margin:0 0 24px;">
              <a href="${confirmationUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:linear-gradient(90deg,#00ccff 0%,#7c3aed 100%);color:#ffffff;text-decoration:none;font-weight:700;">
                Confirmar suscripcion
              </a>
            </p>
            <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#93a7c7;">
              Si el boton no funciona, copia y pega esta URL en tu navegador:
            </p>
            <p style="margin:0;font-size:13px;line-height:1.7;word-break:break-all;color:#7dd3fc;">
              ${confirmationUrl}
            </p>
            <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#93a7c7;">
              Si no solicitaste esta suscripcion, podes ignorar este mensaje.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return { subject, text, html };
};

export const queueNewsletterConfirmationEmail = (
  email: string,
  confirmationUrl: string,
  options: BackgroundEmailOptions,
): void => {
  if (isSmtpDeliveryDisabled()) {
    appLogger.info(`${options.event}.smtp_disabled`, options.meta || {});
    return;
  }

  if (!isMailerConfigured()) {
    appLogger.warn(`${options.event}.smtp_not_configured`, options.meta || {});
    return;
  }

  const emailPayload = buildNewsletterConfirmationEmail(confirmationUrl);

  void sendTransactionalEmail({
    to: email,
    subject: emailPayload.subject,
    html: emailPayload.html,
    text: emailPayload.text,
  })
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
