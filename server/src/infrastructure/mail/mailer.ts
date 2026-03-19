import nodemailer from 'nodemailer';
import { env } from '../../config/env.config';

const smtpDeliveryDisabled = env.DISABLE_SMTP_DELIVERY === true;
const hasSmtpCredentials = !smtpDeliveryDisabled && env.SMTP_USER?.trim() && env.SMTP_PASS?.trim();
const normalizedSmtpUser = env.SMTP_USER?.trim();
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

export const isMailerConfigured = (): boolean => !!hasSmtpCredentials;
export const isSmtpDeliveryDisabled = (): boolean => smtpDeliveryDisabled;

export const getMailerRuntimeInfo = () => ({
  disabled: smtpDeliveryDisabled,
  configured: !!hasSmtpCredentials,
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE ?? true,
  smtpUserConfigured: !!normalizedSmtpUser,
  smtpFromConfigured: !!env.SMTP_FROM_EMAIL?.trim(),
  newsletterFromConfigured: !!env.NEWSLETTER_FROM_EMAIL?.trim(),
});

export const verifyMailerConnection = async (): Promise<void> => {
  if (!hasSmtpCredentials) {
    return;
  }

  await transporter.verify();
};
