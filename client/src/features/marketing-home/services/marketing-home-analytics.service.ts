import { trackRuntimeCtaClick, trackRuntimeEvent } from '@/lib/analytics-runtime';

export type VisitorPathId = 'sin-web' | 'no-convierte' | 'sistema';
export type CalculatorProjectType = 'corporativo' | 'ecommerce' | 'reservas' | 'sistema';

export const trackHeroConsultClick = () =>
  trackRuntimeCtaClick('contar_mi_proyecto', 'hero', '/consulta');

export const trackHeroShowroomClick = () =>
  trackRuntimeCtaClick('ver_proyectos_reales', 'hero', '#showroom');

export const trackHeroDiagnosticClick = () =>
  trackRuntimeCtaClick('pedir_diagnostico_gratuito', 'hero', '/diagnostico-gratuito');

export const trackVisitorPathSelected = (pathId: VisitorPathId) =>
  trackRuntimeEvent('home_funnel', 'home_path_selected', pathId);

export const trackVisitorPathCtaClick = (pathId: VisitorPathId, destination: string) =>
  trackRuntimeCtaClick(`home_path_cta_${pathId}`, 'visitor_path_selector', destination);

export const trackVisitorPathComparisonClick = (pathId: VisitorPathId) =>
  trackRuntimeCtaClick(`home_path_compare_${pathId}`, 'visitor_path_selector', '/comparar-opciones-web');

export const trackCalculatorProjectTypeSelected = (projectType: CalculatorProjectType) =>
  trackRuntimeEvent('home_funnel', 'web_calculator_project_type_selected', projectType);

export const trackCalculatorPageRangeSelected = (pageRange: string) =>
  trackRuntimeEvent('home_funnel', 'web_calculator_page_range_selected', pageRange);

export const trackCalculatorToggleChanged = (toggleName: string, enabled: boolean) =>
  trackRuntimeEvent('home_funnel', 'web_calculator_toggle_changed', `${toggleName}:${enabled ? 'on' : 'off'}`);

export const trackCalculatorResultUnlocked = (projectType: CalculatorProjectType) =>
  trackRuntimeEvent('home_funnel', 'web_calculator_result_unlocked', projectType);

export const trackCalculatorCtaClick = (ctaName: string, destination: string) =>
  trackRuntimeCtaClick(`web_calculator_${ctaName}`, 'web_price_calculator', destination);

export const trackComparisonView = () =>
  trackRuntimeEvent('home_funnel', 'web_comparison_viewed', 'comparar_opciones_web');

export const trackComparisonCtaClick = (ctaName: string, destination: string) =>
  trackRuntimeCtaClick(`web_comparison_${ctaName}`, 'web_solution_comparison', destination);

export const trackExitIntentOpened = () =>
  trackRuntimeEvent('home_funnel', 'home_exit_intent_opened', 'desktop');

export const trackExitIntentDismissed = () =>
  trackRuntimeEvent('home_funnel', 'home_exit_intent_dismissed', 'desktop');

export const trackExitIntentConverted = () =>
  trackRuntimeCtaClick('home_exit_intent_converted', 'exit_intent_modal', '/diagnostico-gratuito');
