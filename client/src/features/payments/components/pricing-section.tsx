import { useEffect, useMemo, useRef, useState } from 'react';

import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import PaymentErrorDialog from '@/features/payments/components/payment-error-dialog';
import PaymentModalFrame from '@/features/payments/components/payment-modal-frame';
import {
  createPreferenceWithRetry,
  getPaymentsErrorMessage,
} from '@/features/payments/services/payments.service';
import type { PaymentPlan } from '@/features/payments/types';

interface PricingPlan {
  id: 'plan-1' | 'plan-2' | 'plan-3';
  title: string;
  intro: string;
  price: string;
  includes: string[];
  delivery?: string;
  cta: string;
  badge?: string;
  highlight?: boolean;
  plan?: PaymentPlan;
  checkoutIncludes?: string[];
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'plan-1',
    title: 'Presencia Profesional',
    intro:
      'Para el negocio que necesita presencia profesional en Google y empezar a recibir consultas.',
    price: '$420.000 ARS',
    includes: [
      'Sitio institucional a medida',
      'Diseño responsive (mobile + desktop)',
      'Formulario de contacto + WhatsApp',
      'SEO base para aparecer en Google',
      'Analytics configurado desde el día 1',
    ],
    delivery: '2 a 3 semanas',
    cta: 'Quiero esta web →',
    plan: 'esencial',
    checkoutIncludes: [
      'Sitio institucional a medida',
      'Diseño responsive (mobile + desktop)',
      'Formulario de contacto + WhatsApp',
    ],
  },
  {
    id: 'plan-2',
    title: 'Web Comercial',
    intro:
      'Para el negocio que quiere que su web genere consultas de forma consistente.',
    price: '$780.000 ARS',
    includes: [
      'Arquitectura pensada para convertir',
      'Formularios + automatizaciones',
      'SEO técnico + estructura optimizada',
      'Analytics + seguimiento de conversiones',
      'Hosting + dominio profesional por 1 año',
    ],
    delivery: '3 a 4 semanas',
    cta: 'Lanzar mi web comercial →',
    badge: '⭐ Más elegido por negocios',
    highlight: true,
    plan: 'avanzado',
    checkoutIncludes: [
      'Arquitectura pensada para convertir',
      'Formularios + automatizaciones',
      'Hosting + dominio profesional por 1 año',
    ],
  },
  {
    id: 'plan-3',
    title: 'Sistema a Medida',
    intro:
      'Para el negocio que necesita algo que no existe todavía: paneles, flujos, integraciones propias.',
    price: 'Desde $1.400.000',
    includes: [
      'Paneles o módulos personalizados',
      'Integraciones con sistemas externos',
      'Arquitectura escalable',
      'Desarrollo orientado al crecimiento',
      'Diagnóstico técnico incluido antes de arrancar',
    ],
    delivery: 'Según alcance definido en la consulta inicial',
    cta: 'Solicitar propuesta →',
  },
];

interface PricingCardProps {
  plan: PricingPlan;
  delay: number;
  isProcessing: boolean;
  onCheckout: (plan: PricingPlan) => void;
  onProposal: () => void;
}

function PricingCard({ plan, delay, isProcessing, onCheckout, onProposal }: PricingCardProps) {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>();

  const wrapperClasses = plan.highlight
    ? 'editorial-surface-card editorial-surface-card--accent relative flex h-full flex-col rounded-[30px] px-5 py-6 shadow-[0_0_0_1px_rgba(0,204,255,0.16),0_28px_80px_rgba(0,204,255,0.16)] sm:px-6 sm:py-7 lg:-translate-y-6 lg:scale-[1.04]'
    : 'editorial-surface-card editorial-surface-card--interactive relative flex h-full flex-col rounded-[30px] px-5 py-5 sm:px-6 sm:py-6';

  const actionClasses = plan.highlight
    ? 'inline-flex w-full items-center justify-center rounded-xl bg-[image:var(--gradient-brand)] px-6 py-4 text-base font-semibold text-white shadow-[var(--glow-signal)] transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70'
    : 'editorial-secondary-button w-full rounded-xl px-6 py-3.5 text-sm font-semibold disabled:cursor-wait disabled:opacity-70';

  return (
    <article
      ref={ref}
      className={`${wrapperClasses} transition-all duration-700 ${
        hasIntersected ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'
      }`}
      style={{ transitionDelay: `${delay * 120}ms` }}
    >
      {plan.highlight && (
        <div className="absolute inset-x-6 -top-3 flex justify-center">
          <div className="editorial-pill editorial-pill--accent px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
            {plan.badge}
          </div>
        </div>
      )}

      <div className="flex min-h-[180px] flex-col">
        <h3 className="font-rajdhani text-[1.65rem] font-bold leading-tight text-white sm:text-[1.9rem]">
          {plan.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-gray-300">{plan.intro}</p>
        <p className="mt-5 font-rajdhani text-[1.9rem] font-bold text-white sm:text-[2.15rem]">
          {plan.price}
        </p>
      </div>

      <div className="mt-5 flex-1">
        <ul className="space-y-3 text-sm text-gray-300">
          {plan.includes.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-300" />
              <span className="leading-6">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {plan.delivery && (
        <div className="editorial-surface-card mt-5 rounded-2xl px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Entrega estimada
          </p>
          <p className="mt-2 text-sm text-white">{plan.delivery}</p>
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={() => (plan.plan ? onCheckout(plan) : onProposal())}
          disabled={isProcessing}
          className={actionClasses}
        >
          {isProcessing ? 'Preparando checkout...' : plan.cta}
        </button>
        <div className="mt-3 text-xs uppercase tracking-[0.18em] text-gray-400">
          <p>PAGO CON MERCADOPAGO</p>
          <p>TARJETA O TRANSFERENCIA</p>
        </div>
      </div>
    </article>
  );
}

interface PricingSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function PricingSection({ setRef }: PricingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } =
    useIntersectionObserver<HTMLDivElement>();
  const { ref: subtitleRef, hasIntersected: subtitleVisible } =
    useIntersectionObserver<HTMLDivElement>();
  const [processingPlan, setProcessingPlan] = useState<PaymentPlan | null>(null);
  const [retryPlan, setRetryPlan] = useState<PaymentPlan | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(null);

  useEffect(() => {
    if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
      setRef(sectionRef.current);
      sectionRef.current.setAttribute('data-ref-set', 'true');
    }
  }, [setRef]);

  const openCheckout = async (plan: PaymentPlan) => {
    setProcessingPlan(plan);
    setRetryPlan(plan);
    setPaymentError(null);

    try {
      const response = await createPreferenceWithRetry(plan);
      if (!response?.init_point) {
        throw new Error('No se pudo generar el checkout');
      }
      window.location.assign(response.init_point);
    } catch (error: unknown) {
      setPaymentError(
        getPaymentsErrorMessage(error, 'No se pudo iniciar el pago online en este momento.'),
      );
      setErrorOpen(true);
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleCheckoutRequest = (plan: PricingPlan) => {
    setCheckoutPlan(plan);
  };

  const handleProposal = () => {
    window.location.assign('/consulta');
  };

  const checkoutSummary = useMemo(() => {
    if (!checkoutPlan) return null;
    return {
      title: 'Estás contratando',
      plan: checkoutPlan.title,
      price: checkoutPlan.price,
      delivery: checkoutPlan.delivery ?? '',
      includes: checkoutPlan.checkoutIncludes ?? checkoutPlan.includes.slice(0, 3),
    };
  }, [checkoutPlan]);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-transparent py-20"
    >
      <div className="container relative z-10 mx-auto px-3 sm:px-4">
        <div
          ref={titleRef}
          className={`mx-auto max-w-4xl text-center transition-all duration-700 ${
            titleVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              Tres planes. Precios claros.
              <br />
              Sin sorpresas al final del proyecto.
            </span>
          </h2>
        </div>

        <div
          ref={subtitleRef}
          className={`mx-auto mb-14 max-w-3xl text-center transition-all duration-700 ${
            subtitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
          style={{ transitionDelay: '120ms' }}
        >
          <p className="text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
            Elegí el punto de partida para tu negocio.
            <br />
            La consulta inicial siempre es sin cargo.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              delay={index + 1}
              isProcessing={processingPlan === plan.plan}
              onCheckout={handleCheckoutRequest}
              onProposal={handleProposal}
            />
          ))}
        </div>
      </div>

      <PaymentModalFrame
        open={Boolean(checkoutPlan)}
        title={checkoutSummary?.title ?? 'Estás contratando'}
        onClose={() => setCheckoutPlan(null)}
        size="wide"
      >
        {checkoutSummary && (
          <div className="space-y-5">
            <div className="editorial-surface-card rounded-2xl p-4 text-sm text-gray-300">
              <p>
                Plan: <span className="font-semibold text-white">{checkoutSummary.plan}</span>
              </p>
              <p className="mt-2">
                Precio: <span className="font-semibold text-white">{checkoutSummary.price}</span>
              </p>
              {checkoutSummary.delivery && (
                <p className="mt-2">
                  Entrega estimada:{' '}
                  <span className="font-semibold text-white">{checkoutSummary.delivery}</span>
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Incluye
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {checkoutSummary.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                if (checkoutPlan?.plan) {
                  setCheckoutPlan(null);
                  void openCheckout(checkoutPlan.plan);
                }
              }}
              className="inline-flex w-full items-center justify-center rounded-xl bg-[image:var(--gradient-brand)] px-6 py-3.5 font-medium text-white shadow-[var(--glow-signal)]"
            >
              Continuar al pago seguro →
            </button>
          </div>
        )}
      </PaymentModalFrame>

      <PaymentErrorDialog
        open={errorOpen}
        message={paymentError}
        onClose={() => setErrorOpen(false)}
        onRetry={() => {
          setErrorOpen(false);
          if (retryPlan) {
            void openCheckout(retryPlan);
          }
        }}
      />
    </section>
  );
}
