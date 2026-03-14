import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';

interface TrustCardProps {
  eyebrow: string;
  title: string;
  description: string;
  delay: number;
}

function TrustCard({ eyebrow, title, description, delay }: TrustCardProps) {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>();

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay * 0.12,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={hasIntersected ? 'visible' : 'hidden'}
      variants={cardVariants}
      className="rounded-xl border border-gray-800 bg-[#121217] p-6"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#00CCFF]">
        {eyebrow}
      </p>
      <h3 className="mb-3 font-rajdhani text-2xl font-bold text-white">{title}</h3>
      <p className="text-sm leading-7 text-gray-300">{description}</p>
    </motion.div>
  );
}

interface ImpactSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ImpactSection({ setRef }: ImpactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: textRef, hasIntersected: textVisible } = useIntersectionObserver<HTMLDivElement>();

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } },
  };

  const trustCards: TrustCardProps[] = [
    {
      eyebrow: 'Claridad comercial',
      title: 'Webs pensadas para vender mejor',
      description:
        'Cada solución se organiza para que un negocio pueda presentar mejor su oferta, generar confianza y llevar al usuario hacia una acción concreta.',
      delay: 1,
    },
    {
      eyebrow: 'Operación más ordenada',
      title: 'Menos fricción en el día a día',
      description:
        'No trabajamos solo la parte visual. Priorizamos recorridos claros, integraciones útiles y una estructura que simplifique soporte, gestión y seguimiento.',
      delay: 2,
    },
    {
      eyebrow: 'Base técnica seria',
      title: 'Soluciones mantenibles y escalables',
      description:
        'La tecnología debe sostener el crecimiento, no convertirse en una carga. Por eso buscamos rendimiento, orden técnico y una base lista para evolucionar.',
      delay: 3,
    },
    {
      eyebrow: 'Acompañamiento real',
      title: 'Criterio profesional en cada etapa',
      description:
        'Desde el planteo inicial hasta la implementación, trabajamos con foco en decisiones útiles para negocio, no en humo ni en promesas infladas.',
      delay: 4,
    },
  ];

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-gradient-2"
    >
      <div className="container relative z-10 mx-auto px-4 py-16">
        <motion.div
          ref={titleRef}
          className="mx-auto mb-12 max-w-4xl text-center"
          initial="hidden"
          animate={titleVisible ? 'visible' : 'hidden'}
          variants={titleVariants}
        >
          <h2 className="mb-6 font-rajdhani text-3xl font-bold md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              Lo que sostiene una solución web profesional
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            Un proyecto serio no depende solo del diseño. Necesita claridad comercial, una experiencia cuidada y una base técnica preparada para crecer con el negocio.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {trustCards.map((card) => (
            <TrustCard
              key={card.title}
              eyebrow={card.eyebrow}
              title={card.title}
              description={card.description}
              delay={card.delay}
            />
          ))}
        </div>

        <motion.div
          ref={textRef}
          className="mx-auto mt-12 max-w-3xl text-center"
          initial="hidden"
          animate={textVisible ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          <p className="text-lg leading-8 text-gray-300">
            Los casos del showroom muestran cómo esto baja a proyectos reales. Este bloque existe para dejar claro que detrás de cada entrega hay criterio, estructura y una forma de trabajo pensada para sostener resultados.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
