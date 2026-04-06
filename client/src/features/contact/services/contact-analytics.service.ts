import analytics from '@/lib/analytics';
import {
  TUWEBAI_EMAIL,
  TUWEBAI_WHATSAPP_DISPLAY,
  TUWEBAI_WHATSAPP_TEL,
  TUWEBAI_WHATSAPP_URL,
} from '@/shared/constants/contact';

export const trackContactFormSubmit = () =>
  analytics.trackFormSubmit('contact_form', 'contact_section');

export const trackContactFormClick = () =>
  analytics.trackCtaClick('enviar_consulta', 'contact_section', 'contact_form');

export const trackContactPhoneClick = () =>
  analytics.trackOutboundClick(
    `tel:${TUWEBAI_WHATSAPP_TEL}`,
    'contact_section',
    TUWEBAI_WHATSAPP_DISPLAY,
    'phone',
  );

export const trackContactEmailClick = () =>
  analytics.trackOutboundClick(
    `mailto:${TUWEBAI_EMAIL}`,
    'contact_section',
    TUWEBAI_EMAIL,
    'email',
  );

export const trackContactWhatsAppClick = () =>
  analytics.trackOutboundClick(
    TUWEBAI_WHATSAPP_URL,
    'contact_section',
    'Escribinos por WhatsApp',
    'whatsapp',
  );
