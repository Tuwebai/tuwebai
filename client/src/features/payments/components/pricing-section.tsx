import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import PaymentErrorDialog from '@/features/payments/components/payment-error-dialog';
import PaymentModalFrame from '@/features/payments/components/payment-modal-frame';
import { createPreferenceWithRetry, getPaymentsErrorMessage } from '@/features/payments/services/payments.service';
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
    intro: 'Para negocios que necesitan una web clara para empezar a recibir consultas',
    price: '$420.000 ARS',
    includes: [
      'Sitio institucional optimizado para presentar tu negocio',
      'Diseño responsive (móvil + desktop)',
      'Formulario de contacto y CTA configurados',
      'Base SEO para aparecer en Google',
      'Entrega estimada: 7 días',
    ],
    cta: 'Crear mi web base →',
    plan: 'esencial',
    checkoutIncludes: [
      'Sitio institucional optimizado para presentar tu negocio',
      'Diseño responsive (móvil + desktop)',
      'Formulario de contacto y CTA configurados',
    ],
  },
  {
    id: 'plan-2',
    title: 'Web Comercial',
    intro: 'Web diseñada para vender y generar clientes',
    price: '$780.000 ARS',
    includes: [
      'Arquitectura web pensada para conversión',
      'Integración de formularios y automatizaciones',
      'SEO base + estructura optimizada',
      'Integración de analytics',
      'Hosting + dominio profesional por 1 año',
    ],
    delivery: '7–10 días',
    cta: 'Lanzar mi web comercial →',
    badge: '⭐ Más elegido por negocios',
    highlight: true,
    plan: 'avanzado',
    checkoutIncludes: [
      'web completa',
      'hosting + dominio',
      'SEO base',
    ],
  },
  {
    id: 'plan-3',
    title: 'Sistema a Medida',
    intro: 'Para proyectos con lógica o funcionalidades personalizadas',
    price: 'Desde $1.400.000',
    includes: [
      'Paneles o módulos personalizados',
      'Integraciones con sistemas externos',
      'Arquitectura escalable',
      'Desarrollo orientado a crecimiento',
    ],
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
    ? 'relative flex h-full flex-col rounded-[30px] border border-cyan-400/60 bg-[linear-gradient(180deg,rgba(18,22,34,0.98)_0%,rgba(26,20,40,0.98)_100%)] px-5 py-6 shadow-[0_0_0_1px_rgba(0,204,255,0.16),0_28px_80px_rgba(0,204,255,0.16)] sm:px-6 sm:py-7 lg:-translate-y-6 lg:scale-[1.04]'
    : 'relative flex h-full flex-col rounded-[30px] border border-gray-800 bg-[#121217]/96 px-5 py-5 sm:px-6 sm:py-6';

  const actionClasses = plan.highlight
    ? 'inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_45px_rgba(0,204,255,0.2)] transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70'
    : 'inline-flex w-full items-center justify-center rounded-xl border border-gray-700 bg-[#181a24] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-cyan-400/35 hover:bg-[#1d2030] disabled:cursor-wait disabled:opacity-70';

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.65, delay: delay * 0.12 }}
      className={wrapperClasses}
    >
      {plan.highlight && (
        <div className="absolute inset-x-6 -top-3 flex justify-center">
          <div className="rounded-full border border-cyan-400/40 bg-[linear-gradient(90deg,rgba(0,204,255,0.2)_0%,rgba(153,51,255,0.2)_100%)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
            {plan.badge}
          </div>
        </div>
      )}

      <div className="flex min-h-[180px] flex-col">
        <h3 className="font-rajdhani text-[1.65rem] font-bold leading-tight text-white sm:text-[1.9rem]">{plan.title}</h3>
        <p className="mt-3 text-sm leading-6 text-gray-300">{plan.intro}</p>
        <p className="mt-5 font-rajdhani text-[1.9rem] font-bold text-white sm:text-[2.15rem]">{plan.price}</p>
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
        <div className="mt-5 rounded-2xl border border-gray-800 bg-[#0d0e14] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Entrega estimada</p>
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
          <p>Pago seguro con MercadoPago</p>
          <p>Tarjeta o transferencia</p>
        </div>
      </div>
    </motion.article>
  );
}

interface PricingSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function PricingSection({ setRef }: PricingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: subtitleRef, hasIntersected: subtitleVisible } = useIntersectionObserver<HTMLDivElement>();
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
      setPaymentError(getPaymentsErrorMessage(error, 'No se pudo iniciar el pago online en este momento.'));
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
      className="landing-anchor-section relative flex items-center justify-center bg-gradient-1 py-20"
    >
      <div className="container relative z-10 mx-auto px-3 sm:px-4">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="font-rajdhani text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              Planes para lanzar o escalar tu presencia web
            </span>
          </h2>
        </motion.div>

        <motion.div
          ref={subtitleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={subtitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
            Elegí el nivel de desarrollo que necesita tu negocio.
            <br />
            Podés pagar online y comenzar hoy mismo.
          </p>
        </motion.div>

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
        title={checkoutSummary?.title ?? 'Estas contratando'}
        onClose={() => setCheckoutPlan(null)}
        size="wide"
      >
        {checkoutSummary && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-800 bg-[#0b0d14] p-4 text-sm text-gray-300">
              <p>
                Plan: <span className="font-semibold text-white">{checkoutSummary.plan}</span>
              </p>
              <p className="mt-2">
                Precio: <span className="font-semibold text-white">{checkoutSummary.price}</span>
              </p>
              {checkoutSummary.delivery && (
                <p className="mt-2">
                  Entrega estimada: <span className="font-semibold text-white">{checkoutSummary.delivery}</span>
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Incluye</p>
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
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3.5 font-medium text-white shadow-[0_16px_35px_rgba(0,204,255,0.2)]"
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

