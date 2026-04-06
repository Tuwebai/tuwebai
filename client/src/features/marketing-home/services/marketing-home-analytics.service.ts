import analytics from '@/lib/analytics';

export const trackHeroConsultClick = () =>
  analytics.trackCtaClick('contar_mi_proyecto', 'hero', '/consulta');

export const trackHeroShowroomClick = () =>
  analytics.trackCtaClick('ver_proyectos_reales', 'hero', '#showroom');

export const trackHeroDiagnosticClick = () =>
  analytics.trackCtaClick('pedir_diagnostico_gratuito', 'hero', '/diagnostico-gratuito');
