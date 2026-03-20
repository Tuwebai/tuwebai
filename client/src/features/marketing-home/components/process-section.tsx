import { useRef } from 'react';

import RevealBlock from '@/shared/ui/reveal-block';

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  delayMs: number;
}

function ProcessStep({ number, title, description, delayMs }: ProcessStepProps) {
  return (
    <RevealBlock className="h-full" delayMs={delayMs}>
      <div className="flex h-full items-start gap-4 rounded-xl border border-gray-800 bg-[#121217]/70 p-5 sm:gap-5 sm:p-6">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] font-rajdhani text-base font-bold text-white sm:h-11 sm:w-11 sm:text-lg">
            {number}
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-rajdhani text-lg font-bold text-white sm:text-xl">{title}</h3>
          <p className="leading-7 text-gray-300">{description}</p>
        </div>
      </div>
    </RevealBlock>
  );
}

interface ProcessSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ProcessSection({ setRef }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const processSteps: ProcessStepProps[] = [
    {
      number: 1,
      title: 'Entendemos el negocio y el objetivo real',
      description:
        'Primero ordenamos contexto, propuesta, prioridad comercial y alcance del proyecto para no construir una web desconectada de la operacion.',
      delayMs: 80,
    },
    {
      number: 2,
      title: 'Definimos la solucion correcta',
      description:
        'Traducimos esa necesidad a una estructura web clara: que secciones necesita, que recorridos debe resolver y que nivel tecnico conviene implementar.',
      delayMs: 160,
    },
    {
      number: 3,
      title: 'Disenamos y desarrollamos con criterio',
      description:
        'Trabajamos interfaz, contenido, rendimiento e implementacion como una sola pieza para que el proyecto se vea profesional y funcione bien desde el inicio.',
      delayMs: 240,
    },
    {
      number: 4,
      title: 'Lanzamos con una base lista para crecer',
      description:
        'La entrega no busca solo publicar una web. Buscamos dejar una plataforma clara, mantenible y preparada para seguir evolucionando con el negocio.',
      delayMs: 320,
    },
  ];

  return (
    <section
      id="process"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-gradient-2"
    >
      <div className="container z-10 mx-auto px-3 py-14 sm:px-4 sm:py-16">
        <RevealBlock className="mx-auto mb-14 max-w-4xl text-center">
          <h2 className="mb-6 font-rajdhani text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              Como trabajamos cada proyecto web
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
            No seguimos una receta generica. Cada entrega se construye con foco en claridad
            comercial, ejecucion tecnica seria y una base que pueda sostener el crecimiento del negocio.
          </p>
        </RevealBlock>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          {processSteps.map((step) => (
            <ProcessStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              delayMs={step.delayMs}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
