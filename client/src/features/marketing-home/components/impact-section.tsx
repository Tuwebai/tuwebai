import { useRef } from 'react';
import { Link } from 'react-router-dom';

import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';

interface TrustCardProps {
  eyebrow: string;
  title: string;
  description: string;
  delay: number;
}

function TrustCard({ eyebrow, title, description, delay }: TrustCardProps) {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)]/88 p-5 transition-all duration-500 sm:p-6 ${
        hasIntersected ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      style={{ transitionDelay: `${delay * 120}ms` }}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--signal)]">
        {eyebrow}
      </p>
      <h3 className="mb-3 font-rajdhani text-xl font-bold text-white sm:text-2xl">{title}</h3>
      <p className="text-sm leading-7 text-gray-300">{description}</p>
    </div>
  );
}

interface ImpactSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ImpactSection({ setRef }: ImpactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } =
    useIntersectionObserver<HTMLDivElement>();
  const { ref: textRef, hasIntersected: textVisible } =
    useIntersectionObserver<HTMLDivElement>();

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const trustCards: TrustCardProps[] = [
    {
      eyebrow: 'CÓDIGO 100% A MEDIDA',
      title: 'Ningún proyecto usa templates',
      description:
        'Ningún proyecto de TuWebAI usa templates, constructores de página ni código heredado. Lo que construimos es tuyo y solo tuyo.',
      delay: 1,
    },
    {
      eyebrow: 'VOS TENÉS EL CONTROL TOTAL',
      title: 'No quedás atado a nosotros',
      description:
        'Al cerrar el proyecto recibís el acceso completo: hosting, dominio y código fuente. No dependés de nosotros para nada después.',
      delay: 2,
    },
    {
      eyebrow: 'PRESUPUESTO CERRADO ANTES DE ARRANCAR',
      title: 'Sin extras al final',
      description:
        'Te decimos exactamente cuánto cuesta y cuánto tarda antes de que pagues un peso. Sin sorpresas. Sin "extras" al final.',
      delay: 3,
    },
    {
      eyebrow: 'SI EL DISEÑO INICIAL NO TE CONVENCE, LO REHACEMOS.',
      title: 'Una revisión completa incluida',
      description:
        'Una ronda de revisión completa incluida en todos los planes. Sin costo adicional. Sin discusión.',
      delay: 4,
    },
  ];

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-transparent"
    >
      <div className="container relative z-10 mx-auto px-3 py-14 sm:px-4 sm:py-16">
        <div
          ref={titleRef}
          className={`mx-auto mb-12 max-w-4xl text-center transition-all duration-700 ${
            titleVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="mb-6 font-rajdhani text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              Lo que nos diferencia.
              <br />
              Sin humo.
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
            No somos la agencia más grande ni la más barata. Somos los que te dicen la verdad
            antes de arrancar y la cumplen al entregar.
          </p>
        </div>

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

        <div
          ref={textRef}
          className={`mx-auto mt-12 max-w-3xl text-center transition-all duration-700 ${
            textVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            Estas no son promesas de marketing. Son las condiciones con las que trabajamos todos
            los proyectos, con todos los clientes.
          </p>

          <div className="mt-8 transition-transform duration-200 hover:scale-[1.03]">
            <Link
              to="/consulta"
              className="inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-8 py-4 font-medium text-white shadow-[var(--glow-signal)]"
            >
              Consultá sin cargo →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
