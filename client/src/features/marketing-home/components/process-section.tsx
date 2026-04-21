import { useRef } from 'react';

import { useTrackSectionView } from '@/core/hooks/use-track-section-view';
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
      <div className="relative flex h-full flex-col rounded-[28px] border border-white/5 bg-[var(--bg-surface)] p-6">
        <span className="absolute right-5 top-4 text-5xl font-black text-white/[0.04]">{number}</span>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--signal-border)] bg-[var(--bg-surface)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--signal)] text-base font-black text-white">
              {number}
            </div>
          </div>
          <h3 className="text-lg font-black text-white sm:text-xl">{title}</h3>
        </div>
        <div className="leading-7 text-gray-300">
          {description}
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
  useTrackSectionView(sectionRef, 'process');

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
      className="landing-anchor-section relative flex items-center justify-center bg-transparent"
    >
      <div className="container z-10 mx-auto px-3 py-14 sm:px-4 sm:py-16">
        <RevealBlock className="mx-auto mb-14 max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-black sm:text-4xl md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              Cómo trabajamos cada proyecto
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
            Sin reuniones infinitas. Sin sorpresas al final. Un proceso claro de 4 pasos desde
            el día 1.
          </p>
        </RevealBlock>

        <div className="relative mx-auto max-w-6xl">
          <div className="absolute left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] top-14 hidden h-px bg-gradient-to-r from-transparent via-[var(--signal)]/40 to-transparent lg:block" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
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
      </div>
    </section>
  );
}
