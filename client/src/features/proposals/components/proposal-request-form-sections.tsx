import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  LayoutDashboard,
  Mail,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { TUWEBAI_EMAIL, TUWEBAI_WHATSAPP_URL } from '@/shared/constants/contact';
import {
  BUDGET_RANGES,
  COUNTRIES,
  DEADLINES,
  type FormValues,
  LEAD_SOURCES,
  PROJECT_TYPES,
  TOTAL_STEPS,
} from './proposal-request-form.config';

const inputClassName =
  'h-12 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:border-[var(--signal-border)] focus-visible:ring-[var(--signal)]/30';

const textareaClassName =
  'min-h-[140px] rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:border-[var(--signal-border)] focus-visible:ring-[var(--signal)]/30';

const iconMap = {
  globe: Globe,
  'shopping-bag': ShoppingBag,
  'layout-dashboard': LayoutDashboard,
} as const;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-2 text-sm text-[var(--danger)]">{message}</p> : null;

const FieldLabel = ({ children }: { children: ReactNode }) => (
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

export const Step1Identidad = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Identidad</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Dejanos tus datos para responderte con una propuesta clara y a medida.
        </p>
      </div>

      <div>
        <FieldLabel>Nombre</FieldLabel>
        <Input {...register('nombre')} className={inputClassName} placeholder="Tu nombre o el de tu equipo" />
        <FieldError message={errors.nombre?.message} />
      </div>

      <div>
        <FieldLabel>Email</FieldLabel>
        <Input {...register('email')} className={inputClassName} placeholder="tu@empresa.com" type="email" />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <FieldLabel>País</FieldLabel>
        <select
          {...register('pais')}
          className={`${inputClassName} w-full px-3`}
          defaultValue=""
        >
          <option value="" disabled>
            Seleccioná tu país
          </option>
          {COUNTRIES.map((country) => (
            <option key={country.id} value={country.id}>
              {country.label}
            </option>
          ))}
        </select>
        <FieldError message={errors.pais?.message} />
      </div>
    </div>
  );
};

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
                <input
                  {...register('tipo_proyecto')}
                  className="sr-only"
                  type="radio"
                  value={projectType.id}
                />
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
                <input
                  {...register('presupuesto_rango')}
                  className="sr-only"
                  type="radio"
                  value={budgetRange.id}
                />
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

export const SuccessScreen = ({ whatsappHref }: { whatsappHref: string }) => (
  <div className="space-y-6 py-10 text-center">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--signal-glow)]">
      <CheckCircle2 className="h-9 w-9 text-[var(--signal)]" strokeWidth={1.5} />
    </div>
    <div className="space-y-3">
      <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Tu consulta llegó.</h2>
      <p className="mx-auto max-w-lg text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
        En menos de 48 horas te escribimos con una propuesta a medida. Si querés hablar antes, estamos en WhatsApp.
      </p>
    </div>
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <a
        className="inline-flex w-full items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 font-semibold text-white sm:w-auto"
        href={whatsappHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        Escribinos por WhatsApp
        <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
      </a>
      <Link
        className="text-sm font-medium text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--text-primary)] hover:underline"
        to="/"
      >
        Volver al inicio
      </Link>
    </div>
  </div>
);

export const AlternativeContactSection = () => (
  <div className="mt-10 border-t border-[var(--border-default)] pt-8">
    <div className="space-y-3 text-center">
      <h3 className="text-xl font-semibold text-[var(--text-primary)]">¿Preferís contactarnos directamente?</h3>
      <p className="mx-auto max-w-xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
        Si preferís avanzar por otro canal, podés escribirnos ahora mismo por WhatsApp o email.
      </p>
    </div>

    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <a
        className="rounded-[var(--radius-xl)] border border-[var(--success)] bg-[var(--success-dim)] p-5 transition-transform duration-200 hover:-translate-y-1"
        href={TUWEBAI_WHATSAPP_URL}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success)] text-white">
          <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <p className="font-semibold text-[var(--text-primary)]">WhatsApp</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Respuesta rápida para resolver dudas o avanzar.</p>
      </a>

      <a
        className="rounded-[var(--radius-xl)] border border-[var(--signal-border)] bg-[var(--signal-glow)] p-5 transition-transform duration-200 hover:-translate-y-1"
        href={`mailto:${TUWEBAI_EMAIL}`}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--signal)] text-white">
          <Mail className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <p className="font-semibold text-[var(--text-primary)]">Email</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{TUWEBAI_EMAIL}</p>
      </a>
    </div>
  </div>
);
