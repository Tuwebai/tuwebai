import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';

interface ComparisonRow {
  label: string;
  generic: string;
  tuwebai: string;
}

interface ComparisonSectionProps {
  setRef: (ref: HTMLElement | null) => void;
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

export default function ComparisonSection({ setRef }: ComparisonSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: tableRef, hasIntersected: tableVisible } = useIntersectionObserver<HTMLDivElement>();

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, delay: 0.15 } },
  };

  return (
    <section
      id="comparison"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-[linear-gradient(180deg,#121217_0%,#0a0a0f_100%)]"
    >
      <div className="container relative z-10 mx-auto px-4 py-16">
        <motion.div
          ref={titleRef}
          className="mx-auto mb-10 max-w-4xl text-center"
          initial="hidden"
          animate={titleVisible ? 'visible' : 'hidden'}
          variants={titleVariants}
        >
          <h2 className="mb-6 font-rajdhani text-3xl font-bold md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              La diferencia no es solo visual
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            Un proyecto web serio no se mide solo por diseño o velocidad de entrega. También importa cómo resuelve el negocio, cómo se mantiene y qué base deja para crecer.
          </p>
        </motion.div>

        <motion.div
          ref={tableRef}
          className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-800 bg-[#0f1016]/95"
          initial="hidden"
          animate={tableVisible ? 'visible' : 'hidden'}
          variants={tableVariants}
        >
          <div className="hidden grid-cols-[1.1fr_1fr_1fr] border-b border-gray-800 bg-[#121217] md:grid">
            <div className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
              Criterio
            </div>
            <div className="px-6 py-5 text-center text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
              Solución genérica
            </div>
            <div className="px-6 py-5 text-center text-xs font-semibold uppercase tracking-[0.24em] text-[#00CCFF]">
              TuWeb.ai
            </div>
          </div>

          <div className="divide-y divide-gray-800">
            {comparisonRows.map((row) => (
              <div key={row.label} className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr_1fr]">
                <div className="border-b border-gray-800 bg-[#121217]/80 px-6 py-5 md:border-b-0 md:border-r">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#00CCFF] md:hidden">
                    Criterio
                  </p>
                  <p className="font-rajdhani text-xl font-bold text-white">{row.label}</p>
                </div>

                <div className="border-b border-gray-800 px-6 py-5 md:border-b-0 md:border-r">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 md:hidden">
                    Solución genérica
                  </p>
                  <p className="leading-7 text-gray-300">{row.generic}</p>
                </div>

                <div className="bg-[#121217]/60 px-6 py-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#00CCFF] md:hidden">
                    TuWeb.ai
                  </p>
                  <p className="leading-7 text-white">{row.tuwebai}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-8 max-w-3xl text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="mb-6 text-gray-400">
            Si estás evaluando opciones, la pregunta no es solo cuánto cuesta una web, sino qué tan bien va a sostener tu negocio cuando empiece a usarse de verdad.
          </p>

          <motion.a
            href="/consulta"
            className="inline-block rounded-lg bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 font-medium text-white"
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
