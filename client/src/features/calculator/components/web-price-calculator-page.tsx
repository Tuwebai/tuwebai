import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  trackCalculatorCtaClick,
  trackCalculatorPageRangeSelected,
  trackCalculatorProjectTypeSelected,
  trackCalculatorResultUnlocked,
  trackCalculatorToggleChanged,
} from '@/features/marketing-home/services/marketing-home-analytics.service';
import { Input } from '@/shared/ui/input';
import MetaTags from '@/shared/ui/meta-tags';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';

type ProjectType = 'corporativo' | 'ecommerce' | 'reservas' | 'sistema';
type PageRange = '1-3' | '4-7' | '8-12' | '12+';

const PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/calculadora-precio-web`;
const EMAIL_REGEX = /\S+@\S+\.\S+/;

const projectTypeOptions: Array<{ value: ProjectType; label: string; base: number }> = [
  { value: 'corporativo', label: 'Sitio corporativo', base: 900 },
  { value: 'ecommerce', label: 'E-commerce', base: 1600 },
  { value: 'reservas', label: 'Web con reservas o turnos', base: 1800 },
  { value: 'sistema', label: 'Sistema web a medida', base: 2600 },
];

const pageRangeOptions: Array<{ value: PageRange; label: string; delta: number }> = [
  { value: '1-3', label: '1 a 3 páginas', delta: 0 },
  { value: '4-7', label: '4 a 7 páginas', delta: 350 },
  { value: '8-12', label: '8 a 12 páginas', delta: 700 },
  { value: '12+', label: 'Más de 12 páginas', delta: 1200 },
];

const addOns = {
  ecommerce: 900,
  reservations: 650,
  noDomainHosting: 180,
} as const;

function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function getRecommendation(projectType: ProjectType, highRange: number): string {
  if (projectType === 'sistema') {
    return 'Tu caso ya pide discovery y alcance fino. Acá conviene una conversación rápida antes de cotizar exacto.';
  }

  if (highRange >= 3000) {
    return 'Ya estás en una zona donde una solución genérica suele quedarse corta. Tiene sentido pensar estructura, conversión e integración desde el arranque.';
  }

  return 'Estás en una zona razonable para resolver rápido sin sobrecomplicar el proyecto, pero conviene definir bien qué tiene que hacer la web.';
}

export default function WebPriceCalculatorPage() {
  const [projectType, setProjectType] = useState<ProjectType>('corporativo');
  const [pageRange, setPageRange] = useState<PageRange>('1-3');
  const [needsEcommerce, setNeedsEcommerce] = useState(false);
  const [needsReservations, setNeedsReservations] = useState(false);
  const [hasDomainHosting, setHasDomainHosting] = useState(true);
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const estimate = useMemo(() => {
    const projectBase =
      projectTypeOptions.find((option) => option.value === projectType)?.base ?? 0;
    const pagesDelta = pageRangeOptions.find((option) => option.value === pageRange)?.delta ?? 0;

    const subtotal =
      projectBase +
      pagesDelta +
      (needsEcommerce ? addOns.ecommerce : 0) +
      (needsReservations ? addOns.reservations : 0) +
      (!hasDomainHosting ? addOns.noDomainHosting : 0);

    const low = Math.round(subtotal * 0.9);
    const high = Math.round(subtotal * 1.2);

    return {
      low,
      high,
      recommendation: getRecommendation(projectType, high),
    };
  }, [hasDomainHosting, needsEcommerce, needsReservations, pageRange, projectType]);

  const handleUnlock = () => {
    setEmailTouched(true);

    if (!EMAIL_REGEX.test(email.trim())) {
      return;
    }

    localStorage.setItem('userEmail', email.trim());
    trackCalculatorResultUnlocked(projectType);
    setIsUnlocked(true);
  };

  return (
    <>
      <MetaTags
        title="Calculadora de precio web"
        description="Calculá un rango estimado para tu web según tipo de proyecto, cantidad de páginas y funcionalidades. Resultado completo con email."
        keywords="calculadora precio web, cuanto cuesta una web, cotizador web argentina, precio sitio web"
        url={PAGE_URL}
        ogType="website"
        ogImage="/logo-tuwebai.png"
      />

      <div className="page-shell-surface min-h-screen text-white">
        <section className="px-4 pb-16 pt-28 sm:pb-20 sm:pt-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--signal)]">
                Calculadora de precio web
              </p>
              <h1 className="mt-5 font-rajdhani text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl">
                Tené una referencia rápida
                <br />
                <span className="gradient-text">antes de pedir una cotización exacta.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                Esta calculadora te da un rango estimado según el tipo de proyecto, el alcance y
                las funcionalidades que necesitás.
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
                Si primero querés entender cómo se arma ese precio, podés leer la guía completa.
                {' '}
                <Link to="/cuanto-cuesta-una-web" className="text-[var(--signal)] underline underline-offset-4">
                  Ver guía de precio web
                </Link>
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px]">
              <div className="editorial-surface-panel rounded-[32px] p-6 sm:p-8">
                <div className="space-y-8">
                  <div>
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Tipo de proyecto
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {projectTypeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setProjectType(option.value);
                            trackCalculatorProjectTypeSelected(option.value);
                          }}
                          className={`editorial-surface-card rounded-2xl px-4 py-4 text-left transition-colors ${
                            projectType === option.value
                              ? 'border-[var(--signal-border)] bg-[var(--signal)]/10 text-white'
                              : 'editorial-surface-card--interactive text-gray-300'
                          }`}
                        >
                          <p className="font-medium">{option.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Cantidad de páginas
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {pageRangeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setPageRange(option.value);
                            trackCalculatorPageRangeSelected(option.value);
                          }}
                          className={`editorial-surface-card rounded-2xl px-4 py-4 text-left transition-colors ${
                            pageRange === option.value
                              ? 'border-[var(--signal-border)] bg-[var(--signal)]/10 text-white'
                              : 'editorial-surface-card--interactive text-gray-300'
                          }`}
                        >
                          <p className="font-medium">{option.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Funcionalidades
                    </p>
                    <div className="grid gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setNeedsEcommerce((prev) => {
                            const next = !prev;
                            trackCalculatorToggleChanged('ecommerce', next);
                            return next;
                          })
                        }
                        className={`editorial-surface-card rounded-2xl px-4 py-4 text-left transition-colors ${
                          needsEcommerce
                            ? 'border-[var(--signal-border)] bg-[var(--signal)]/10 text-white'
                            : 'editorial-surface-card--interactive text-gray-300'
                        }`}
                      >
                        Necesito e-commerce
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setNeedsReservations((prev) => {
                            const next = !prev;
                            trackCalculatorToggleChanged('reservations', next);
                            return next;
                          })
                        }
                        className={`editorial-surface-card rounded-2xl px-4 py-4 text-left transition-colors ${
                          needsReservations
                            ? 'border-[var(--signal-border)] bg-[var(--signal)]/10 text-white'
                            : 'editorial-surface-card--interactive text-gray-300'
                        }`}
                      >
                        Necesito reservas o turnos
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setHasDomainHosting((prev) => {
                            const next = !prev;
                            trackCalculatorToggleChanged('domain_hosting_resolved', next);
                            return next;
                          })
                        }
                        className={`editorial-surface-card rounded-2xl px-4 py-4 text-left transition-colors ${
                          !hasDomainHosting
                            ? 'border-[var(--signal-border)] bg-[var(--signal)]/10 text-white'
                            : 'editorial-surface-card--interactive text-gray-300'
                        }`}
                      >
                        No tengo dominio ni hosting resueltos
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="editorial-surface-panel rounded-[32px] p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--signal)]">
                  Resultado estimado
                </p>

                {isUnlocked ? (
                  <>
                    <p className="mt-5 font-rajdhani text-4xl font-bold text-white">
                      {formatUsd(estimate.low)} a {formatUsd(estimate.high)}
                    </p>
                    <p className="mt-4 text-base leading-7 text-gray-300">
                      {estimate.recommendation}
                    </p>
                    <div className="editorial-surface-card mt-6 rounded-2xl p-4">
                      <p className="text-sm text-gray-300">
                        Esto es una referencia comercial. Para una cotización exacta revisamos
                        alcance, objetivos, integraciones y prioridad de negocio.
                      </p>
                    </div>
                    <div className="mt-8 flex flex-col gap-3">
                      <Link
                        to="/consulta"
                        onClick={() =>
                          trackCalculatorCtaClick('cotizacion_exacta', '/consulta')
                        }
                        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]"
                      >
                        Pedir cotización exacta
                      </Link>
                      <Link
                        to="/diagnostico-gratuito"
                        onClick={() =>
                          trackCalculatorCtaClick('diagnostico_gratis', '/diagnostico-gratuito')
                        }
                        className="editorial-secondary-button min-h-12 px-6 py-3 text-sm font-medium"
                      >
                        Diagnóstico gratis
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-5 text-base leading-7 text-gray-300">
                      Dejanos tu email y te mostramos el rango completo para tu proyecto.
                    </p>
                    <div className="mt-6">
                      <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        onBlur={() => setEmailTouched(true)}
                        placeholder="tu@email.com"
                        autoComplete="email"
                        className="h-12 rounded-full border-white/10 bg-white/5 px-4 text-white placeholder:text-gray-500"
                      />
                      {emailTouched && !EMAIL_REGEX.test(email.trim()) ? (
                        <p className="mt-2 text-sm text-red-300">Ingresá un email válido.</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={handleUnlock}
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]"
                    >
                      Ver rango estimado
                    </button>
                    <div className="editorial-surface-card mt-6 rounded-2xl border-dashed p-5">
                      <p className="font-rajdhani text-3xl font-bold text-white/25">
                        {formatUsd(estimate.low)} a {formatUsd(estimate.high)}
                      </p>
                      <p className="mt-3 text-sm text-gray-500">
                        Desbloqueás el resultado completo con una referencia clara para decidir si
                        te conviene avanzar.
                      </p>
                    </div>
                  </>
                )}
              </aside>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
