import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Minus, Sparkles } from 'lucide-react';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';

interface ComparisonRow {
  label: string;
  generic: string;
  tuwebai: string;
}

interface ComparisonSectionProps {
  setRef?: (ref: HTMLElement | null) => void;
  showIntro?: boolean;
  sectionClassName?: string;
}

const comparisonRows: ComparisonRow[] = [
  {
    label: 'Punto de partida',
    generic: 'Se arma desde una plantilla o una lógica estándar.',
    tuwebai: 'Se define desde el negocio, el objetivo y el recorrido que debe resolver.',
  },
  {
    label: 'Enfoque de la web',
    generic: 'Prioriza verse bien, aunque no siempre ordene la operación o la venta.',
    tuwebai: 'Busca claridad comercial, confianza y una experiencia útil para el usuario final.',
  },
  {
    label: 'Implementación',
    generic: 'Suele depender de decisiones rápidas o paquetes cerrados.',
    tuwebai: 'Se diseña y desarrolla con criterio técnico según el alcance real del proyecto.',
  },
  {
    label: 'Base para crecer',
    generic: 'Puede quedar limitada cuando el negocio necesita evolucionar.',
    tuwebai: 'Se entrega una base más ordenada, mantenible y lista para escalar.',
  },
  {
    label: 'Acompañamiento',
    generic: 'El proyecto termina con la entrega del sitio.',
    tuwebai: 'Trabajamos para que la solución quede alineada a operación, soporte y próximos pasos.',
  },
];

function ColumnCard({
  title,
  description,
  accent,
}: {
  title: string;
  description: string;
  accent: 'muted' | 'highlight';
}) {
  const isHighlight = accent === 'highlight';

  return (
    <div
      className={
        isHighlight
          ? 'rounded-2xl border border-cyan-500/40 bg-[linear-gradient(180deg,rgba(18,18,23,0.96)_0%,rgba(22,22,34,0.96)_100%)] p-5 shadow-[0_0_0_1px_rgba(0,204,255,0.08),0_18px_45px_rgba(0,204,255,0.08)]'
          : 'rounded-2xl border border-gray-800 bg-[#121217]/85 p-5'
      }
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={
            isHighlight
              ? 'flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
              : 'flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1b24] text-gray-400'
          }
        >
          {isHighlight ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
        </div>
        <p className={isHighlight ? 'font-rajdhani text-xl font-bold text-white' : 'font-rajdhani text-xl font-bold text-gray-200'}>
          {title}
        </p>
      </div>
      <p className={isHighlight ? 'leading-7 text-white/90' : 'leading-7 text-gray-300'}>{description}</p>
    </div>
  );
}

export default function ComparisonSection({
  setRef,
  showIntro = true,
  sectionClassName = 'bg-[linear-gradient(180deg,#121217_0%,#0a0a0f_100%)]',
}: ComparisonSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: boardRef, hasIntersected: boardVisible } = useIntersectionObserver<HTMLDivElement>();

  if (setRef && sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const boardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.15 } },
  };

  return (
    <section
      id="comparison"
      ref={sectionRef}
      className={`landing-anchor-section relative flex items-center justify-center ${sectionClassName}`}
    >
      <div className="container relative z-10 mx-auto px-3 py-14 sm:px-4 sm:py-16">
        {showIntro ? (
        <motion.div
          ref={titleRef}
          className="mx-auto mb-12 max-w-4xl text-center"
          initial="hidden"
          animate={titleVisible ? 'visible' : 'hidden'}
          variants={titleVariants}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            Comparativa de criterio
          </div>

          <h2 className="mb-6 font-rajdhani text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              La diferencia no es solo visual
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
            Un proyecto web serio no se mide solo por diseño o velocidad de entrega. También importa cómo resuelve el negocio, cómo se mantiene y qué base deja para crecer.
          </p>
        </motion.div>
        ) : null}

        <motion.div
          ref={showIntro ? boardRef : undefined}
          className={`mx-auto max-w-6xl ${showIntro ? '' : 'pt-0'}`}
          initial="hidden"
          animate={showIntro ? (boardVisible ? 'visible' : 'hidden') : 'visible'}
          variants={boardVariants}
        >
          <div className="mb-6 hidden grid-cols-[0.85fr_1fr_1fr] gap-5 xl:grid">
            <div className="rounded-2xl border border-gray-800 bg-[#0f1016] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Criterio</p>
              <p className="mt-3 font-rajdhani text-2xl font-bold text-white">Qué cambia en la práctica</p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#121217]/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Solución genérica</p>
              <p className="mt-3 font-rajdhani text-2xl font-bold text-gray-200">Resuelve lo básico</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/35 bg-[linear-gradient(180deg,rgba(18,18,23,0.96)_0%,rgba(22,22,34,0.96)_100%)] p-5 shadow-[0_0_0_1px_rgba(0,204,255,0.08),0_18px_45px_rgba(0,204,255,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">TuWeb.ai</p>
              <p className="mt-3 font-rajdhani text-2xl font-bold text-white">Se diseña para sostener negocio</p>
            </div>
          </div>

          <div className="space-y-4 xl:hidden">
            {comparisonRows.map((row) => (
              <div key={row.label} className="rounded-2xl border border-gray-800 bg-[#0f1016]/95 p-4 sm:p-5">
                <p className="mb-4 font-rajdhani text-xl font-bold text-white sm:text-2xl">{row.label}</p>
                <div className="grid gap-4">
                  <ColumnCard title="Solución genérica" description={row.generic} accent="muted" />
                  <ColumnCard title="TuWeb.ai" description={row.tuwebai} accent="highlight" />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden space-y-4 xl:block">
            {comparisonRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[0.85fr_1fr_1fr] gap-5 rounded-3xl border border-gray-900/70 bg-[#0b0c12]/65 p-4"
              >
                <div className="rounded-2xl border border-gray-800 bg-[#0f1016] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#00CCFF]">Criterio</p>
                  <p className="mt-3 font-rajdhani text-2xl font-bold text-white">{row.label}</p>
                </div>

                <ColumnCard title="Solución genérica" description={row.generic} accent="muted" />
                <ColumnCard title="TuWeb.ai" description={row.tuwebai} accent="highlight" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="mb-6 text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
            Si estás evaluando opciones, la pregunta no es solo cuánto cuesta una web, sino qué tan bien va a sostener tu negocio cuando empiece a usarse de verdad.
          </p>

          <motion.a
            href="/consulta"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3.5 text-center font-medium text-white shadow-[0_16px_35px_rgba(0,204,255,0.12)] sm:w-auto sm:px-7"
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            Pedir propuesta personalizada
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
