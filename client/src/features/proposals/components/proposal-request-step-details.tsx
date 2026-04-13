import { Globe, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/shared/ui/textarea';
import {
  BUDGET_RANGES,
  DEADLINES,
  type FormValues,
  LEAD_SOURCES,
  PROJECT_TYPES,
} from './proposal-request-form.config';
import { FieldError, FieldLabel, textareaClassName } from './proposal-request-form-primitives';

const iconMap = {
  globe: Globe,
  'shopping-bag': ShoppingBag,
  'layout-dashboard': LayoutDashboard,
} as const;

export const Step2Proyecto = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();
  const selectedProjectType = watch('tipo_proyecto');

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Proyecto</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Elegí la opción que más se acerca a lo que necesitás y contanos el contexto clave.
        </p>
      </div>

      <div>
        <FieldLabel>Tipo de proyecto</FieldLabel>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {PROJECT_TYPES.map((projectType) => {
            const Icon = iconMap[projectType.icon];
            const isActive = selectedProjectType === projectType.id;

            return (
              <label
                key={projectType.id}
                className={`cursor-pointer rounded-[var(--radius-lg)] border p-4 transition-colors ${
                  isActive
                    ? 'border-[var(--signal-border)] bg-[var(--bg-subtle)]'
                    : 'border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                }`}
              >
                <input {...register('tipo_proyecto')} className="sr-only" type="radio" value={projectType.id} />
                <div className="space-y-3">
                  <Icon className="h-6 w-6 text-[var(--signal)]" strokeWidth={1.5} />
                  <div className="space-y-1">
                    <p className="font-semibold text-[var(--text-primary)]">{projectType.label}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{projectType.description}</p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        <FieldError message={errors.tipo_proyecto?.message} />
      </div>

      <div>
        <FieldLabel>Descripción</FieldLabel>
        <Textarea
          {...register('descripcion')}
          className={textareaClassName}
          placeholder="Contame qué hace tu negocio, qué necesitás que haga la web y si tenés algún referente de estilo o funcionalidad en mente."
        />
        <FieldError message={errors.descripcion?.message} />
      </div>
    </div>
  );
};

export const Step3Contexto = () => {
  const { register, watch } = useFormContext<FormValues>();
  const selectedBudget = watch('presupuesto_rango');
  const selectedDeadline = watch('plazo');
  const selectedSource = watch('como_nos_encontraste');

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Contexto</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Esta parte es opcional, pero ayuda a prepararte una propuesta mejor enfocada.
        </p>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--signal-border)] bg-[var(--signal-glow)] p-4">
        <p className="text-sm font-medium text-[var(--text-primary)]">Expectativa de inversión</p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          El precio final depende del alcance real. Si querés, después te guiamos con la referencia completa de
          <Link className="ml-1 text-[var(--signal)] underline-offset-4 hover:underline" to="/precios">
            precios
          </Link>
          .
        </p>
      </div>

      <div>
        <FieldLabel>Presupuesto orientativo</FieldLabel>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {BUDGET_RANGES.map((budgetRange) => {
            const isActive = selectedBudget === budgetRange.id;
            return (
              <label
                key={budgetRange.id}
                className={`cursor-pointer rounded-[var(--radius-lg)] border p-4 transition-colors ${
                  isActive
                    ? 'border-[var(--signal-border)] bg-[var(--bg-subtle)]'
                    : 'border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                }`}
              >
                <input {...register('presupuesto_rango')} className="sr-only" type="radio" value={budgetRange.id} />
                <span className="text-sm font-medium text-[var(--text-primary)]">{budgetRange.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <FieldLabel>Plazo</FieldLabel>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {DEADLINES.map((deadline) => {
            const isActive = selectedDeadline === deadline.id;
            return (
              <label
                key={deadline.id}
                className={`cursor-pointer rounded-[var(--radius-lg)] border p-4 transition-colors ${
                  isActive
                    ? 'border-[var(--signal-border)] bg-[var(--bg-subtle)]'
                    : 'border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                }`}
              >
                <input {...register('plazo')} className="sr-only" type="radio" value={deadline.id} />
                <span className="text-sm font-medium text-[var(--text-primary)]">{deadline.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <FieldLabel>¿Cómo nos encontraste?</FieldLabel>
        <div className="space-y-3">
          {LEAD_SOURCES.map((source) => {
            const isActive = selectedSource === source.id;
            return (
              <label
                key={source.id}
                className={`flex cursor-pointer items-center justify-between rounded-[var(--radius-lg)] border px-4 py-3 transition-colors ${
                  isActive
                    ? 'border-[var(--signal-border)] bg-[var(--bg-subtle)]'
                    : 'border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                }`}
              >
                <span className="text-sm font-medium text-[var(--text-primary)]">{source.label}</span>
                <input
                  {...register('como_nos_encontraste')}
                  className="h-4 w-4 accent-[var(--signal)]"
                  type="radio"
                  value={source.id}
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
