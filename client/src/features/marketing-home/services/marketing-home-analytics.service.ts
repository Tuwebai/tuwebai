import analytics from '@/lib/analytics';

export type VisitorPathId = 'sin-web' | 'no-convierte' | 'sistema';
export type CalculatorProjectType = 'corporativo' | 'ecommerce' | 'reservas' | 'sistema';

export const trackHeroConsultClick = () =>
  analytics.trackCtaClick('contar_mi_proyecto', 'hero', '/consulta');

export const trackHeroShowroomClick = () =>
  analytics.trackCtaClick('ver_proyectos_reales', 'hero', '#showroom');

export const trackHeroDiagnosticClick = () =>
  analytics.trackCtaClick('pedir_diagnostico_gratuito', 'hero', '/diagnostico-gratuito');

export const trackVisitorPathSelected = (pathId: VisitorPathId) =>
  analytics.event('home_funnel', 'home_path_selected', pathId);

export const trackVisitorPathCtaClick = (pathId: VisitorPathId, destination: string) =>
  analytics.trackCtaClick(`home_path_cta_${pathId}`, 'visitor_path_selector', destination);

export const trackVisitorPathComparisonClick = (pathId: VisitorPathId) =>
  analytics.trackCtaClick(`home_path_compare_${pathId}`, 'visitor_path_selector', '/comparar-opciones-web');

export const trackCalculatorProjectTypeSelected = (projectType: CalculatorProjectType) =>
  analytics.event('home_funnel', 'web_calculator_project_type_selected', projectType);

export const trackCalculatorPageRangeSelected = (pageRange: string) =>
  analytics.event('home_funnel', 'web_calculator_page_range_selected', pageRange);

export const trackCalculatorToggleChanged = (toggleName: string, enabled: boolean) =>
  analytics.event('home_funnel', 'web_calculator_toggle_changed', `${toggleName}:${enabled ? 'on' : 'off'}`);

export const trackCalculatorResultUnlocked = (projectType: CalculatorProjectType) =>
  analytics.event('home_funnel', 'web_calculator_result_unlocked', projectType);

export const trackCalculatorCtaClick = (ctaName: string, destination: string) =>
  analytics.trackCtaClick(`web_calculator_${ctaName}`, 'web_price_calculator', destination);

export const trackComparisonView = () =>
  analytics.event('home_funnel', 'web_comparison_viewed', 'comparar_opciones_web');

export const trackComparisonCtaClick = (ctaName: string, destination: string) =>
  analytics.trackCtaClick(`web_comparison_${ctaName}`, 'web_solution_comparison', destination);

export const trackExitIntentOpened = () =>
  analytics.event('home_funnel', 'home_exit_intent_opened', 'desktop');

export const trackExitIntentDismissed = () =>
  analytics.event('home_funnel', 'home_exit_intent_dismissed', 'desktop');

export const trackExitIntentConverted = () =>
  analytics.trackCtaClick('home_exit_intent_converted', 'exit_intent_modal', '/diagnostico-gratuito');
