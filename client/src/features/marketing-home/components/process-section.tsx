import { useRef } from 'react';

import RevealBlock from '@/shared/ui/reveal-block';

interface ProcessStepProps {
  number: number;
  title: string;
  description: React.ReactNode;
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
          <div className="leading-7 text-gray-300">{description}</div>
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
      title: 'ENTENDEMOS TU NEGOCIO',
      description: (
        <>
          <p>Una llamada. Sin formularios largos.</p>
          <p>Entendemos qué vendés, quién te compra y qué tiene que resolver la web.</p>
        </>
      ),
      delayMs: 80,
    },
    {
      number: 2,
      title: 'DEFINIMOS EL ALCANCE',
      description: (
        <>
          <p>Te decimos exactamente qué vamos a construir, cuánto cuesta y cuándo lo tenés.</p>
          <p>Por escrito. Sin sorpresas.</p>
        </>
      ),
      delayMs: 160,
    },
    {
      number: 3,
      title: 'DISEÑAMOS Y DESARROLLAMOS',
      description: (
        <>
          <p>Código a medida. Sin templates.</p>
          <p>Con foco en conversión, velocidad y que se vea bien en cualquier celular.</p>
        </>
      ),
      delayMs: 240,
    },
    {
      number: 4,
      title: 'LANZAMOS Y TE DEJAMOS LAS LLAVES',
      description: (
        <>
          <p>Vos tenés el control total: hosting, dominio, código fuente.</p>
          <p>No dependés de nosotros para nada después del lanzamiento.</p>
        </>
      ),
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
              Cómo trabajamos cada proyecto
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
            Sin reuniones infinitas. Sin sorpresas al final. Un proceso claro de 4 pasos desde
            el día 1.
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
