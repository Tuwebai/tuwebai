import nodemailer from 'nodemailer';
import { env } from './env.config';

/**
 * Transporter SMTP configurado exclusivamente con variables de entorno.
 * En producción, SMTP_USER y SMTP_PASS son obligatorios (validados en env.config).
 * En desarrollo, si no están definidos, el envío fallará en el primer uso.
 */
const hasSmtpCredentials = env.SMTP_USER?.trim() && env.SMTP_PASS?.trim();
const normalizedSmtpUser = env.SMTP_USER?.trim();
// Gmail app passwords are often copied with spaces; normalize to avoid auth failures.
const normalizedSmtpPass = env.SMTP_PASS?.replace(/\s+/g, '');

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE ?? true,
  connectionTimeout: 8_000,
  greetingTimeout: 8_000,
  socketTimeout: 10_000,
  auth: hasSmtpCredentials
    ? {
        user: normalizedSmtpUser!,
        pass: normalizedSmtpPass!,
      }
    : undefined,
});

/**
 * Indica si el transporter está listo para enviar (credenciales configuradas).
 * Útil para deshabilitar envíos o mostrar avisos en desarrollo.
 */
export const isMailerConfigured = (): boolean => !!hasSmtpCredentials;
