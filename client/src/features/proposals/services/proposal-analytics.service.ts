import { trackRuntimeEvent } from '@/lib/analytics-runtime';

export const trackProposalStepCompleted = (step: number) =>
  trackRuntimeEvent('Propuesta', 'Step Completado', `step_${step}`);

export const trackProposalSubmitted = (projectType: string) =>
  trackRuntimeEvent('Propuesta', 'Formulario Enviado', projectType);

export const trackProposalError = (reason: string) =>
  trackRuntimeEvent('Propuesta', 'Error Submit', reason);
