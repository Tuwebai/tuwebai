import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';

interface PricingCardProps {
  title: string;
  price: string;
  cadence: string;
  summary: string;
  fit: string;
  signal: string;
  deliverables: string[];
  highlight?: boolean;
  delay: number;
}

function PricingCard({
  title,
  price,
  cadence,
  summary,
  fit,
  signal,
  deliverables,
  highlight = false,
  delay,
}: PricingCardProps) {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>();

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: delay * 0.14,
      },
    },
  };

  return (
    <motion.article
      ref={ref}
      initial="hidden"
      animate={hasIntersected ? 'visible' : 'hidden'}
      variants={cardVariants}
      className={
        highlight
          ? 'relative rounded-[28px] border border-cyan-500/35 bg-[linear-gradient(180deg,rgba(18,18,23,0.97)_0%,rgba(22,22,34,0.97)_100%)] p-6 shadow-[0_0_0_1px_rgba(0,204,255,0.08),0_18px_45px_rgba(0,204,255,0.08)] lg:p-7'
          : 'relative rounded-[28px] border border-gray-800 bg-[#121217]/95 p-6 lg:p-7'
      }
    >
      {highlight && (
        <div className="mb-5 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Recomendado
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">{signal}</p>
          <h3 className="font-rajdhani text-2xl font-bold text-white lg:text-[2rem]">{title}</h3>
        </div>

        <div className="sm:text-right">
          <p className="font-rajdhani text-3xl font-bold text-white lg:text-4xl">{price}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-gray-400">{cadence}</p>
        </div>
      </div>

      <p className="mb-6 text-gray-300">{summary}</p>

      <div className="mb-6 rounded-2xl border border-gray-800 bg-[#0d0e14] p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#00CCFF]">Mejor encaje</p>
        <p className="leading-7 text-gray-300">{fit}</p>
      </div>

      <ul className="space-y-3">
        {deliverables.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#00CCFF]/15 text-[#00CCFF]">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

interface PricingSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

const pricingCards: PricingCardProps[] = [
  {
    title: 'Base web corporativa',
    price: 'Desde USD 900',
    cadence: 'Proyecto inicial',
    signal: 'Presencia clara',
    summary: 'Una base profesional para presentar mejor tu negocio, ordenar el mensaje y generar consultas con una web seria.',
    fit: 'Empresas o marcas que necesitan ordenar su presencia online sin entrar todavía en desarrollos complejos.',
    deliverables: [
      'Sitio institucional con estructura profesional',
      'Jerarquía de contenido y recorridos claros',
      'Diseño responsive y base técnica sólida',
      'Formulario, CTA y soporte para lanzamiento',
    ],
    delay: 1,
  },
  {
    title: 'Proyecto comercial completo',
    price: 'Desde USD 1.800',
    cadence: 'Mayor alcance',
    signal: 'Más conversión',
    summary: 'Pensado para operaciones que necesitan vender mejor, integrar procesos clave y sostener una experiencia digital más sólida.',
    fit: 'E-commerce, negocios con catálogo, servicios con varios flujos o proyectos que ya requieren más alcance funcional.',
    deliverables: [
      'Arquitectura de contenido y experiencia orientada a negocio',
      'Integraciones, paneles o módulos según alcance',
      'Mejor base para crecimiento, mantenimiento y soporte',
      'Acompañamiento inicial para ordenar la implementación',
    ],
    highlight: true,
    delay: 2,
  },
  {
    title: 'Solución a medida',
    price: 'Alcance personalizado',
    cadence: 'Proyecto estratégico',
    signal: 'Operación propia',
    summary: 'Cuando una web estándar ya no alcanza y hace falta diseñar una solución alrededor de la operación real del negocio.',
    fit: 'Equipos o empresas que necesitan una plataforma más específica, con lógica propia y mayor complejidad operativa.',
    deliverables: [
      'Definición técnica y funcional según contexto',
      'Desarrollo por módulos o etapas de implementación',
      'Escalabilidad, trazabilidad y estructura mantenible',
      'Propuesta adaptada al nivel real del proyecto',
    ],
    delay: 3,
  },
];

export default function PricingSection({ setRef }: PricingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: subtitleRef, hasIntersected: subtitleVisible } = useIntersectionObserver<HTMLDivElement>();

  useEffect(() => {
    if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
      setRef(sectionRef.current);
      sectionRef.current.setAttribute('data-ref-set', 'true');
    }
  }, [setRef]);

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
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
          className="mx-auto max-w-4xl text-center"
          initial="hidden"
          animate={titleVisible ? 'visible' : 'hidden'}
          variants={titleVariants}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Inversión orientativa</p>
          <h2 className="mb-4 font-rajdhani text-3xl font-bold md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">Cómo dimensionar la inversión</span>
          </h2>
        </motion.div>

        <motion.div
          ref={subtitleRef}
          className="mx-auto mb-14 max-w-3xl text-center"
          initial="hidden"
          animate={subtitleVisible ? 'visible' : 'hidden'}
          variants={subtitleVariants}
        >
          <p className="text-xl leading-8 text-gray-300">
            Esta sección no busca empujarte a un checkout. Sirve para ubicar el nivel de proyecto que más se parece a tu necesidad y orientar la conversación comercial con más claridad.
          </p>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            Las referencias en USD funcionan como guía de alcance. Para proyectos en Argentina, la propuesta final se cotiza y se cobra en pesos argentinos.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1.15fr_0.9fr]">
          {pricingCards.map((card) => (
            <PricingCard key={card.title} {...card} />
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="rounded-[28px] border border-gray-800 bg-[#101119]/95 p-6 lg:p-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Qué define la propuesta final</p>
            <p className="text-lg leading-8 text-gray-300">
              En proyectos serios, el valor final se ajusta según prioridad comercial, alcance funcional, integraciones, tiempos y nivel real de desarrollo.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-800 bg-[#0d0e14] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Alcance</p>
                <p className="mt-2 text-sm leading-6 text-gray-300">Cantidad de secciones, módulos y recorridos.</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-[#0d0e14] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Operación</p>
                <p className="mt-2 text-sm leading-6 text-gray-300">Integraciones, paneles y lógica del negocio.</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-[#0d0e14] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Soporte</p>
                <p className="mt-2 text-sm leading-6 text-gray-300">Prioridades, tiempos y acompañamiento inicial.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-cyan-500/25 bg-[linear-gradient(180deg,rgba(14,18,28,0.96)_0%,rgba(19,18,31,0.96)_100%)] p-6 shadow-[0_18px_45px_rgba(0,204,255,0.08)] lg:p-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Siguiente paso</p>
            <h3 className="font-rajdhani text-3xl font-bold text-white">Definimos la propuesta correcta</h3>
            <p className="mt-4 text-gray-300">
              Si ya tenés una idea general del tipo de proyecto, el paso lógico es conversar alcance, prioridad y contexto real para bajar una propuesta sólida.
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Si tu operación está en Argentina, vas a recibir la propuesta final en ARS. Para proyectos fuera de Argentina, la moneda se define al confirmar alcance y forma de trabajo.
            </p>

            <motion.a
              href="/consulta"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-7 py-3.5 font-medium text-white shadow-[0_16px_35px_rgba(0,204,255,0.12)]"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            >
              Solicitar propuesta inicial
              <ArrowRight className="h-4 w-4" />
            </motion.a>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Sin checkout inmediato, sin presión y sin venderte un plan cerrado que no encaje con tu negocio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
