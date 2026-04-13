import { ArrowRight, CheckCircle2, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TUWEBAI_EMAIL, TUWEBAI_WHATSAPP_URL } from '@/shared/constants/contact';

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
