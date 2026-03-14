import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import PaymentErrorDialog from '@/features/payments/components/payment-error-dialog';
import { createPreferenceWithRetry, getPaymentsErrorMessage } from '@/features/payments/services/payments.service';
import type { PaymentPlan } from '@/features/payments/types';

interface PricingCardData {
  title: string;
  price: string;
  signal: string;
  audience: string;
  deliverables: string[];
  ctaLabel: string;
  note: string;
  plan?: PaymentPlan;
  highlight?: boolean;
  badge?: string;
  benefit?: string;
}

interface PricingCardProps {
  card: PricingCardData;
  delay: number;
  isProcessing: boolean;
  onPrimaryAction: (card: PricingCardData) => void;
}

const pricingCards: PricingCardData[] = [
  {
    title: 'Base web',
    price: 'ARS 199.000',
    signal: 'Presencia profesional',
    audience: 'Ideal para negocios que necesitan salir bien presentados y empezar a recibir consultas.',
    deliverables: [
      'Sitio institucional con estructura comercial clara',
      'Diseño responsive y base técnica lista para lanzar',
      'Formulario, CTA y contacto ya configurados',
      'Carga inicial y ajustes básicos de salida',
    ],
    ctaLabel: 'Pagar online esta base',
    note: 'Pago directo con Mercado Pago para alcances base, sin pasar por otro formulario.',
    plan: 'esencial',
  },
  {
    title: 'Proyecto comercial',
    price: 'ARS 349.000',
    signal: 'Más elegida',
    audience: 'Ideal para negocios que ya venden o quieren una web más sólida para convertir y operar mejor.',
    deliverables: [
      'Arquitectura orientada a conversión y recorrido comercial',
      'Integraciones o módulos base según el alcance',
      'Mejor base para vender, medir y sostener crecimiento',
      'Implementación inicial acompañada y ordenada',
    ],
    ctaLabel: 'Pagar online esta propuesta',
    note: 'Si tu proyecto entra en este alcance, podés resolverlo online y avanzar más rápido.',
    benefit: 'Incluye hosting + dominio profesional por 1 año',
    badge: 'Recomendada',
    plan: 'avanzado',
    highlight: true,
  },
  {
    title: 'Solución a medida',
    price: 'A cotizar',
    signal: 'Operación propia',
    audience: 'Ideal para equipos que necesitan flujos, paneles, integraciones o una lógica más específica.',
    deliverables: [
      'Alcance funcional y técnico definido según contexto real',
      'Módulos, paneles o integraciones diseñados a medida',
      'Base escalable, mantenible y preparada por etapas',
      'Propuesta personalizada según complejidad y operación',
    ],
    ctaLabel: 'Quiero una propuesta',
    note: 'Cuando el proyecto supera un alcance base, conviene definirlo bien antes de pagar.',
  },
];

function PricingCard({ card, delay, isProcessing, onPrimaryAction }: PricingCardProps) {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>();

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.65, delay: delay * 0.12 }}
      className={
        card.highlight
          ? 'relative flex h-full flex-col rounded-[30px] border border-cyan-400/55 bg-[linear-gradient(180deg,rgba(14,18,28,0.98)_0%,rgba(20,16,34,0.98)_100%)] px-6 py-6 shadow-[0_0_0_1px_rgba(0,204,255,0.12),0_26px_70px_rgba(0,204,255,0.12)] lg:-translate-y-4 lg:px-7 lg:py-7'
          : 'relative flex h-full flex-col rounded-[30px] border border-gray-800 bg-[#121217]/96 px-6 py-6 lg:px-7 lg:py-7'
      }
    >
      {card.highlight && (
        <>
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
          <div className="absolute inset-x-6 -top-3 flex justify-center">
            <div className="rounded-full border border-cyan-400/35 bg-[linear-gradient(90deg,rgba(0,204,255,0.18)_0%,rgba(153,51,255,0.18)_100%)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
              {card.badge}
            </div>
          </div>
        </>
      )}

      <div className="flex min-h-[190px] flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">{card.signal}</p>
        <h3 className="mt-3 font-rajdhani text-[1.95rem] font-bold leading-none text-white">{card.title}</h3>
        <p className="mt-4 font-rajdhani text-[2.2rem] font-bold leading-none text-white">{card.price}</p>
        <p className="mt-4 text-sm leading-6 text-gray-300">{card.audience}</p>
      </div>

      <div
        className={
          card.highlight
            ? 'mt-5 rounded-2xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-3.5'
            : 'mt-5 rounded-2xl border border-gray-800 bg-[#0d0e14] px-4 py-3.5'
        }
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
          {card.highlight ? 'Beneficio incluido' : 'Referencia'}
        </p>
        <p className="mt-2 text-sm leading-6 text-white/90">{card.benefit ?? card.note}</p>
      </div>

      <div className="mt-6 flex-1">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Qué incluye</p>
        <ul className="space-y-3">
          {card.deliverables.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan-400/14 text-cyan-300">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm leading-6 text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7 border-t border-white/8 pt-5">
        <button
          type="button"
          onClick={() => onPrimaryAction(card)}
          disabled={isProcessing}
          className={
            card.highlight
              ? 'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3.5 font-medium text-white shadow-[0_16px_35px_rgba(0,204,255,0.16)] transition-transform hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70'
              : 'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-[#181a24] px-6 py-3.5 font-medium text-white transition-colors hover:border-cyan-400/35 hover:bg-[#1d2030] disabled:cursor-wait disabled:opacity-70'
          }
        >
          {isProcessing ? 'Preparando checkout...' : card.ctaLabel}
          {!isProcessing && <ArrowRight className="h-4 w-4" />}
        </button>
        <p className="mt-3 text-sm leading-6 text-gray-400">{card.note}</p>
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

  const handleCardAction = (card: PricingCardData) => {
    if (card.plan) {
      void openCheckout(card.plan);
      return;
    }

    window.location.assign('/consulta');
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-gradient-1 py-20"
    >
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Planes base para empezar</p>
          <h2 className="mb-4 font-rajdhani text-3xl font-bold md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">Elegí el punto de partida correcto</span>
          </h2>
        </motion.div>

        <motion.div
          ref={subtitleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={subtitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="text-xl leading-8 text-gray-300">
            Si tu proyecto encaja en un alcance base, podés avanzar directo con checkout online. Si necesitás algo más específico, te armamos la propuesta a medida.
          </p>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            Los pagos online se procesan en pesos argentinos con Mercado Pago. Para proyectos fuera de Argentina, la moneda se define al confirmar alcance y forma de trabajo.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-3">
          {pricingCards.map((card, index) => (
            <PricingCard
              key={card.title}
              card={card}
              delay={index + 1}
              isProcessing={processingPlan === card.plan}
              onPrimaryAction={handleCardAction}
            />
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-gray-800 bg-[#101119]/95 p-6 lg:p-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Cómo leer estos planes</p>
            <p className="text-lg leading-8 text-gray-300">
              Los dos primeros resuelven alcances base con pago online directo. El tercero existe para cuando ya necesitás una solución más pensada alrededor de tu operación real.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-800 bg-[#0d0e14] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Base</p>
                <p className="mt-2 text-sm leading-6 text-gray-300">Web clara, profesional y lista para salir.</p>
              </div>
              <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/7 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Comercial</p>
                <p className="mt-2 text-sm leading-6 text-gray-300">Más alcance, mejor conversión y una base más completa.</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-[#0d0e14] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">A medida</p>
                <p className="mt-2 text-sm leading-6 text-gray-300">Para flujos propios, integraciones y mayor complejidad.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-cyan-500/25 bg-[linear-gradient(180deg,rgba(14,18,28,0.96)_0%,rgba(19,18,31,0.96)_100%)] p-6 shadow-[0_18px_45px_rgba(0,204,255,0.08)] lg:p-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Si no encaja en un plan base</p>
            <h3 className="font-rajdhani text-3xl font-bold text-white">Bajamos una propuesta realista</h3>
            <p className="mt-4 text-gray-300">
              Cuando tu proyecto necesita otra lógica, lo correcto no es forzarlo a un checkout cerrado. Ahí sí conviene definir alcance, prioridades y próximos pasos con más precisión.
            </p>

            <motion.a
              href="/consulta"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-7 py-3.5 font-medium text-white shadow-[0_16px_35px_rgba(0,204,255,0.12)]"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            >
              Pedir propuesta a medida
              <ArrowRight className="h-4 w-4" />
            </motion.a>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Úsalo solo si realmente necesitás algo fuera de estos alcances base.
            </p>
          </div>
        </div>
      </div>

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
