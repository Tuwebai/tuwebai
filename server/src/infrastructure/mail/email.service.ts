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
  from?: string;
  replyTo?: string;
}

interface NewsletterEmailTemplateOptions {
  preheader: string;
  eyebrow: string;
  title: string;
  intro: string;
  body: string[];
  actionLabel: string;
  actionUrl: string;
  actionHint: string;
  footerNote: string;
}

const getContactTo = (): string => env.CONTACT_TO_EMAIL?.trim() || env.SMTP_USER?.trim() || 'tuwebai@gmail.com';
const getDefaultFrom = (): string =>
  `"${env.SMTP_FROM_NAME.trim()}" <${env.SMTP_FROM_EMAIL?.trim() || env.SMTP_USER?.trim() || 'no-reply@tuweb-ai.com'}>`;
const getNewsletterFrom = (): string =>
  `"${env.SMTP_FROM_NAME.trim()} Newsletter" <${env.NEWSLETTER_FROM_EMAIL?.trim() || env.SMTP_FROM_EMAIL?.trim() || env.SMTP_USER?.trim() || 'news@tuweb-ai.com'}>`;
const EMAIL_BRAND_LOGO_URL = 'https://tuweb-ai.com/logo-tuwebai-email.png';
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
    from: getDefaultFrom(),
    to: getContactTo(),
    replyTo: email,
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
    from: data.from || getDefaultFrom(),
    to: data.to,
    replyTo: data.replyTo,
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

const buildNewsletterEmailShell = (options: NewsletterEmailTemplateOptions): string => {
  const bodyParagraphs = options.body
    .map(
      (paragraph) => `
            <p style="margin:0 0 14px;font-size:15px;line-height:27px;color:#c9d7f2;">
              ${paragraph}
            </p>`,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>${options.title}</title>
      </head>
      <body style="margin:0;padding:0;background:#060913;font-family:Inter,Segoe UI,Arial,sans-serif;">
        <div style="display:none;font-size:1px;color:#060913;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
          ${options.preheader}
        </div>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#060913;">
          <tr>
            <td align="center" style="padding:28px 14px 44px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="width:100%;max-width:640px;">
                <tr>
                  <td style="padding:0 0 14px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td valign="middle" style="padding:8px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td valign="middle" style="padding-right:12px;">
                                <img src="${EMAIL_BRAND_LOGO_URL}" width="42" height="42" alt="TuWeb.ai" style="width:42px;height:42px;border-radius:10px;" />
                              </td>
                              <td valign="middle">
                                <div style="font-family:Rajdhani,Arial,sans-serif;font-size:26px;line-height:1;color:#FFFFFF;font-weight:700;letter-spacing:-0.4px;">
                                  TuWeb<span style="color:#00CCFF;">.ai</span>
                                </div>
                                <div style="padding-top:6px;font-size:11px;line-height:1.4;color:#8DA1C7;letter-spacing:0.22em;text-transform:uppercase;">
                                  Newsletter de crecimiento digital
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid rgba(0,204,255,0.16);border-radius:28px;overflow:hidden;background:
                      radial-gradient(circle at top left, rgba(0,204,255,0.18), transparent 34%),
                      radial-gradient(circle at top right, rgba(153,51,255,0.20), transparent 36%),
                      linear-gradient(180deg, #101828 0%, #0B1020 100%);">
                      <tr>
                        <td style="padding:42px 40px 40px;">
                          <div style="display:inline-block;margin-bottom:18px;border:1px solid rgba(0,204,255,0.24);border-radius:999px;padding:8px 14px;background:rgba(0,204,255,0.08);font-size:11px;line-height:1;color:#8BE8FF;letter-spacing:0.24em;text-transform:uppercase;">
                            ${options.eyebrow}
                          </div>
                          <h1 style="margin:0 0 18px;font-family:Rajdhani,Arial,sans-serif;font-size:44px;line-height:46px;color:#FFFFFF;font-weight:700;letter-spacing:-0.04em;">
                            ${options.title}
                          </h1>
                          <p style="margin:0 0 28px;font-size:16px;line-height:28px;color:#C9D7F2;max-width:520px;">
                            ${options.intro}
                          </p>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="border-radius:999px;background:linear-gradient(90deg,#00CCFF 0%,#9933FF 100%);">
                                <a href="${options.actionUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:15px 26px;font-size:14px;font-weight:700;color:#FFFFFF;">
                                  ${options.actionLabel}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid rgba(255,255,255,0.08);border-radius:24px;background:#0D1220;">
                      <tr>
                        <td style="padding:36px 36px 34px;">
                          ${bodyParagraphs}
                          <p style="margin:10px 0 12px;font-size:14px;line-height:24px;color:#93a7c7;">
                            ${options.actionHint}
                          </p>
                          <p style="margin:0;font-size:13px;line-height:24px;word-break:break-all;color:#7dd3fc;">
                            ${options.actionUrl}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:24px;"></td></tr>
                <tr>
                  <td style="padding:0 2px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="height:1px;background:linear-gradient(90deg,rgba(0,204,255,0.1) 0%,rgba(153,51,255,0.45) 50%,rgba(0,204,255,0.1) 100%);"></td>
                      </tr>
                    </table>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-top:22px;">
                          <div style="font-family:Rajdhani,Arial,sans-serif;font-size:22px;line-height:1;color:#FFFFFF;font-weight:700;">
                            TuWeb<span style="color:#00CCFF;">.ai</span>
                          </div>
                          <div style="padding-top:8px;font-size:13px;line-height:22px;color:#8DA1C7;">
                            Desarrollo web profesional para negocios que necesitan confianza, claridad y conversion.
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:18px;">
                          <p style="margin:0;font-size:11px;line-height:20px;color:#7E90B6;">
                            ${options.footerNote}<br />
                            <a href="https://tuweb-ai.com/politica-privacidad" target="_blank" rel="noopener noreferrer" style="color:#B9C7E6;text-decoration:underline;">Politica de privacidad</a>
                            &nbsp;-&nbsp; Argentina
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
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
  const html = buildNewsletterEmailShell({
    preheader: 'Confirma tu email para activar el newsletter de TuWeb.ai.',
    eyebrow: 'Newsletter TuWeb.ai',
    title: 'Confirma tu suscripcion',
    intro: 'Recibimos tu solicitud para sumarte al newsletter. Falta un paso breve para activar las proximas ediciones.',
    body: [
      'Para completar el alta, confirma tu email desde el siguiente enlace.',
      'Si no solicitaste esta suscripcion, podes ignorar este mensaje sin hacer nada.',
    ],
    actionLabel: 'Confirmar suscripcion',
    actionUrl: confirmationUrl,
    actionHint: 'Si el boton no funciona, copia y pega esta URL en tu navegador:',
    footerNote: 'Recibis este email porque se solicito el alta al newsletter de TuWeb.ai desde tuweb-ai.com.',
  });

  return { subject, text, html };
};

const buildNewsletterUnsubscribeEmail = (unsubscribeUrl: string) => {
  const subject = 'Tu suscripcion al newsletter de TuWeb.ai fue cancelada';
  const text = [
    'Tu baja del newsletter de TuWeb.ai se proceso correctamente.',
    '',
    'Si fue un error o queres volver a suscribirte, podes hacerlo desde:',
    'https://tuweb-ai.com/blog',
    '',
    'Referencia de baja:',
    unsubscribeUrl,
  ].join('\n');

  const html = buildNewsletterEmailShell({
    preheader: 'Confirmacion de baja del newsletter de TuWeb.ai.',
    eyebrow: 'Preferencias del newsletter',
    title: 'Tu baja fue procesada',
    intro: 'La direccion quedo removida de las proximas ediciones del newsletter de TuWeb.ai.',
    body: [
      'No vas a recibir nuevas publicaciones desde esta suscripcion, salvo mensajes transaccionales necesarios para confirmar este cambio.',
      'Si queres volver a sumarte, podes hacerlo cuando quieras desde el blog o desde cualquiera de nuestros formularios editoriales.',
    ],
    actionLabel: 'Volver al blog',
    actionUrl: 'https://tuweb-ai.com/blog',
    actionHint: 'Guardamos este enlace como referencia de la baja procesada:',
    footerNote: `Este email confirma la baja solicitada desde el siguiente enlace: <a href="${unsubscribeUrl}" target="_blank" rel="noopener noreferrer" style="color:#B9C7E6;text-decoration:underline;">ver referencia</a>.`,
  });

  return { subject, text, html };
};

const buildNewsletterWelcomeEmail = () => {
  const subject = 'Bienvenido al newsletter de TuWeb.ai';
  const actionUrl = 'https://tuweb-ai.com/blog';
  const text = [
    'Tu suscripcion al newsletter de TuWeb.ai ya quedo activa.',
    '',
    'A partir de ahora vas a recibir recursos concretos sobre conversion web, landings, estructura comercial y decisiones tecnicas.',
    '',
    'Podes empezar por el blog:',
    actionUrl,
    '',
    'Si queres responder con tu caso o tu proyecto, podes hacerlo directamente sobre este email.',
  ].join('\n');

  const html = buildNewsletterEmailShell({
    preheader: 'Tu suscripcion ya esta activa. Empeza por el blog de TuWeb.ai.',
    eyebrow: 'Newsletter TuWeb.ai',
    title: 'Ya estas dentro',
    intro:
      'Tu suscripcion quedo activa. A partir de ahora vas a recibir criterios concretos sobre conversion web, landings y decisiones tecnicas para negocios que necesitan vender mejor online.',
    body: [
      'En TuWeb.ai usamos el newsletter para compartir diagnosticos, aprendizajes de implementacion y recursos accionables. La idea no es llenar tu inbox, sino darte material util para decidir mejor.',
      'Si queres empezar ahora, entra al blog. Ahi vas a encontrar articulos sobre auditoria web, conversion, ecommerce, landings y estructura comercial.',
    ],
    actionLabel: 'Ir al blog',
    actionUrl,
    actionHint: 'Tambien podes copiar esta URL en tu navegador:',
    footerNote: 'Recibis este email porque confirmaste tu suscripcion al newsletter de TuWeb.ai.',
  });

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
    from: getNewsletterFrom(),
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

export const queueNewsletterUnsubscribeEmail = (
  email: string,
  unsubscribeUrl: string,
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

  const emailPayload = buildNewsletterUnsubscribeEmail(unsubscribeUrl);

  void sendTransactionalEmail({
    to: email,
    subject: emailPayload.subject,
    html: emailPayload.html,
    text: emailPayload.text,
    from: getNewsletterFrom(),
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

export const queueNewsletterWelcomeEmail = (email: string, options: BackgroundEmailOptions): void => {
  if (isSmtpDeliveryDisabled()) {
    appLogger.info(`${options.event}.smtp_disabled`, options.meta || {});
    return;
  }

  if (!isMailerConfigured()) {
    appLogger.warn(`${options.event}.smtp_not_configured`, options.meta || {});
    return;
  }

  const emailPayload = buildNewsletterWelcomeEmail();

  void sendTransactionalEmail({
    to: email,
    subject: emailPayload.subject,
    html: emailPayload.html,
    text: emailPayload.text,
    from: getNewsletterFrom(),
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
