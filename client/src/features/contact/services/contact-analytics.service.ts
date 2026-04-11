import {
  trackRuntimeCtaClick,
  trackRuntimeFormSubmit,
  trackRuntimeOutboundClick,
} from '@/lib/analytics-runtime';
import {
  TUWEBAI_EMAIL,
  TUWEBAI_WHATSAPP_DISPLAY,
  TUWEBAI_WHATSAPP_TEL,
  TUWEBAI_WHATSAPP_URL,
} from '@/shared/constants/contact';

export const trackContactFormSubmit = () =>
  trackRuntimeFormSubmit('contact_form', 'contact_section');

export const trackContactFormClick = () =>
  trackRuntimeCtaClick('enviar_consulta', 'contact_section', 'contact_form');

export const trackContactPhoneClick = () =>
  trackRuntimeOutboundClick(
    `tel:${TUWEBAI_WHATSAPP_TEL}`,
    'contact_section',
    TUWEBAI_WHATSAPP_DISPLAY,
    'phone',
  );

export const trackContactEmailClick = () =>
  trackRuntimeOutboundClick(
    `mailto:${TUWEBAI_EMAIL}`,
    'contact_section',
    TUWEBAI_EMAIL,
    'email',
  );

export const trackContactWhatsAppClick = () =>
  trackRuntimeOutboundClick(
    TUWEBAI_WHATSAPP_URL,
    'contact_section',
    'Escribinos por WhatsApp',
    'whatsapp',
  );

export const trackFreeDiagnosisHeroClick = () =>
  trackRuntimeCtaClick(
    'quiero_mi_diagnostico_gratuito',
    'diagnostico_hero',
    '#formulario-diagnostico',
  );

export const trackFreeDiagnosisFormSubmit = () =>
  trackRuntimeFormSubmit('diagnostico_gratuito', 'diagnostico_page');

export const trackFreeDiagnosisFormClick = () =>
  trackRuntimeCtaClick(
    'quiero_mi_diagnostico_gratuito',
    'diagnostico_form',
    'diagnostico_gratuito',
  );

export const trackFreeDiagnosisWhatsAppClick = (whatsappHref: string) => {
  trackRuntimeCtaClick('whatsapp_diagnostico', 'diagnostico_direct_cta', whatsappHref);
  trackRuntimeOutboundClick(
    whatsappHref,
    'diagnostico_direct_cta',
    'Escribinos por WhatsApp',
    'whatsapp',
  );
};
