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
  <div className="mb-8 space-y-3">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tu consulta</h2>
      <span className="text-sm text-[var(--text-secondary)]">
        Paso {currentStep} de {TOTAL_STEPS}
      </span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
      <div
        className="h-full bg-[image:var(--gradient-brand)] transition-[width] duration-300"
        style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
      />
    </div>
  </div>
);
