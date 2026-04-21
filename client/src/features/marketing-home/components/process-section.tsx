import { type ReactNode, useRef } from 'react';
import { Code2, MessageSquare, Rocket, Waypoints } from 'lucide-react';

import { useTrackSectionView } from '@/core/hooks/use-track-section-view';
import RevealBlock from '@/shared/ui/reveal-block';

interface ProcessStepProps {
  number: number;
  title: string;
  description: ReactNode;
  icon: ReactNode;
  delayMs: number;
}

function ProcessStep({ number, title, description, icon, delayMs }: ProcessStepProps) {
  return (
    <RevealBlock className="h-full" delayMs={delayMs}>
      <article className="relative text-center lg:text-left">
        <div className="mb-5 flex flex-col items-center lg:items-start">
          <div className="relative">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--signal-border)] bg-[var(--bg-surface)] transition-all duration-300 hover:border-[var(--signal)] hover:bg-[var(--signal-glow)]">
              <span className="text-[var(--signal)]">{icon}</span>
            </div>
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--signal)] text-[10px] font-black text-white">
              {number}
            </span>
          </div>

          <span className="pointer-events-none -mt-1 text-5xl font-black leading-none text-white/[0.04]">
            {String(number).padStart(2, '0')}
          </span>
        </div>

        <div className="relative z-10">
          <h3 className="mb-3 text-xl font-black text-white">{title}</h3>
          <div className="max-w-[17rem] space-y-2 text-sm leading-relaxed text-gray-400">
            {description}
          </div>
        </div>
      </article>
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
      icon: <MessageSquare size={24} />,
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
      icon: <Waypoints size={24} />,
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
      icon: <Code2 size={24} />,
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
      icon: <Rocket size={24} />,
      delayMs: 320,
    },
  ];

  return (
    <section
      id="process"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center overflow-hidden bg-transparent"
    >
      <div className="container z-10 mx-auto px-3 py-14 sm:px-4 sm:py-16 lg:py-20">
        <RevealBlock className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-5 inline-flex rounded-full border border-[var(--signal-border)] bg-[var(--signal-glow)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A78BFA]">
            Proceso
          </div>
          <h2 className="mb-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Cómo trabajamos
          </h2>

          <p className="mx-auto max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
            Sin reuniones infinitas. Sin sorpresas al final. Un proceso claro de 4 pasos desde
            el día 1.
          </p>
        </RevealBlock>

        <div className="relative mx-auto max-w-6xl">
          <div className="absolute left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] top-14 hidden h-px lg:block">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-[var(--signal)]/40 to-transparent" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {processSteps.map((step) => (
              <ProcessStep
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                delayMs={step.delayMs}
              />
            ))}
          </div>
        </div>

        <RevealBlock className="mt-14 text-center" delayMs={380}>
          <p className="text-sm text-gray-400">
            Tiempo promedio de entrega: <span className="font-semibold text-white">7 a 21 días hábiles</span>{' '}
            según el proyecto
          </p>
          <a
            href="/consulta"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-[var(--signal-border)] hover:bg-white/5"
          >
            Empezar ahora
          </a>
        </RevealBlock>
      </div>
    </section>
  );
}
