import type { ReactNode } from 'react';
import { TOTAL_STEPS } from './proposal-request-form.config';

export const inputClassName =
  'h-12 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:border-[var(--signal-border)] focus-visible:ring-[var(--signal)]/30';

export const textareaClassName =
  'min-h-[140px] rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:border-[var(--signal-border)] focus-visible:ring-[var(--signal)]/30';

export const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-2 text-sm text-[var(--danger)]">{message}</p> : null;

export const FieldLabel = ({ children }: { children: ReactNode }) => (
  <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">{children}</label>
);

export const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="mb-8 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9BE7FF]">
          Tu consulta
        </span>
        <h2 className="font-rajdhani text-2xl font-bold text-white">Paso a paso</h2>
      </div>
      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-gray-300">
        Paso {currentStep} de {TOTAL_STEPS}
      </span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full bg-[image:var(--gradient-brand)] transition-[width] duration-300"
        style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
      />
    </div>
  </div>
);
