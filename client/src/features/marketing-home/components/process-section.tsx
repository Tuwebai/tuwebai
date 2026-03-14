import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

function ProcessStep({ number, title, description, delay }: ProcessStepProps) {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>();

  const stepVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        delay: delay * 0.12,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="flex items-start gap-5 rounded-xl border border-gray-800 bg-[#121217]/70 p-6"
      initial="hidden"
      animate={hasIntersected ? 'visible' : 'hidden'}
      variants={stepVariants}
    >
      <div className="flex-shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] font-rajdhani text-lg font-bold text-white">
          {number}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-rajdhani text-xl font-bold text-white">{title}</h3>
        <p className="leading-7 text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
}

interface ProcessSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ProcessSection({ setRef }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const processSteps: ProcessStepProps[] = [
    {
      number: 1,
      title: 'Entendemos el negocio y el objetivo real',
      description:
        'Primero ordenamos contexto, propuesta, prioridad comercial y alcance del proyecto para no construir una web desconectada de la operación.',
      delay: 1,
    },
    {
      number: 2,
      title: 'Definimos la solución correcta',
      description:
        'Traducimos esa necesidad a una estructura web clara: qué secciones necesita, qué recorridos debe resolver y qué nivel técnico conviene implementar.',
      delay: 2,
    },
    {
      number: 3,
      title: 'Diseñamos y desarrollamos con criterio',
      description:
        'Trabajamos interfaz, contenido, rendimiento e implementación como una sola pieza para que el proyecto se vea profesional y funcione bien desde el inicio.',
      delay: 3,
    },
    {
      number: 4,
      title: 'Lanzamos con una base lista para crecer',
      description:
        'La entrega no busca solo publicar una web. Buscamos dejar una plataforma clara, mantenible y preparada para seguir evolucionando con el negocio.',
      delay: 4,
    },
  ];

  return (
    <section
      id="process"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-gradient-2"
    >
      <div className="container z-10 mx-auto px-4 py-16">
        <motion.div
          ref={titleRef}
          className="mx-auto mb-14 max-w-4xl text-center"
          initial="hidden"
          animate={titleVisible ? 'visible' : 'hidden'}
          variants={titleVariants}
        >
          <h2 className="mb-6 font-rajdhani text-3xl font-bold md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              Cómo trabajamos cada proyecto web
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            No seguimos una receta genérica. Cada entrega se construye con foco en claridad comercial, ejecución técnica seria y una base que pueda sostener el crecimiento del negocio.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          {processSteps.map((step) => (
            <ProcessStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={step.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
