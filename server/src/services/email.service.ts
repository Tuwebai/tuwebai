import { env } from '../config/env.config';
import { transporter, isMailerConfigured } from '../config/mailer';
import { generateEmailTemplate } from '../templates/email.template';

export interface EmailData {
  name: string;
  email: string;
  title?: string;
  message: string;
  type?: 'contact' | 'test';
}

/** Dirección de destino para consultas/contacto (por defecto = SMTP_USER). */
const getContactTo = (): string => env.SMTP_USER?.trim() || 'tuwebai@gmail.com';

export const sendContactEmail = async (data: EmailData) => {
  if (!isMailerConfigured()) {
    throw new Error('SMTP no configurado: defina SMTP_USER y SMTP_PASS en el entorno.');
  }
  const { name, email, title, message, type = 'contact' } = data;
  const emailTitle = title || "Consulta desde formulario de contacto";

  const emailResult = await transporter.sendMail({
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
  });
  
  return emailResult;
};
