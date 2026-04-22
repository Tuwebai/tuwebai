import { useRef } from 'react';
import { Link } from 'react-router-dom';

import RevealBlock from '@/shared/ui/reveal-block';

interface PhilosophySectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function PhilosophySection({ setRef }: PhilosophySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-transparent"
    >
      <div className="container z-10 mx-auto px-3 py-14 sm:px-4 sm:py-16">
        <div className="mb-10 max-w-4xl">
          <div className="mb-5 inline-flex rounded-full border border-[var(--signal-border)] bg-[var(--signal-glow)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#A78BFA]">
            El problema
          </div>
          <h2 className="mb-5 text-3xl font-black sm:text-4xl md:text-5xl">
            <span className="gradient-text gradient-border inline-block pb-2">
              Tu web debería traerte clientes.
              <br />
              Si no lo hace, algo está mal.
            </span>
          </h2>

          <p className="max-w-3xl text-base font-medium leading-7 text-gray-200 sm:text-lg md:text-xl">
            Construimos sitios web para negocios argentinos que quieren vender online, no solo
            existir. Código a medida, entrega en 2 a 4 semanas.
          </p>
        </div>

        <div className="max-w-5xl">
          <RevealBlock
            hiddenClassName="opacity-0 translate-y-8"
            visibleClassName="opacity-100 translate-y-0"
            delayMs={160}
          >
            <div className="editorial-surface-panel p-5 sm:p-8">
              <p className="mb-5 font-medium leading-7 text-gray-200">
                Lo que vemos en el 80% de los sitios que nos llegan:
              </p>
              <ul className="mb-4 space-y-3">
                <li className="text-gray-300">- Diseño bonito que no convierte nada</li>
                <li className="text-gray-300">- Sin CTA visible en el primer scroll</li>
                <li className="text-gray-300">- Carga en más de 4 segundos en celular</li>
                <li className="text-gray-300">- Sin analítica configurada</li>
              </ul>
              <div className="editorial-surface-card mt-6 rounded-2xl p-4">
                <p className="text-sm leading-relaxed text-gray-300">
                  El problema no es que tengas web. Es que tu web no está trabajando para vos.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gray-300">
                  Por eso trabajamos con una lógica simple: entender el problema primero,
                  construir la solución después.
                </p>
              </div>
            </div>
          </RevealBlock>
        </div>

        <div className="editorial-surface-card editorial-surface-card--accent mt-10 flex flex-col items-start gap-4 rounded-[28px] p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-black text-white sm:text-3xl">
            ¿Tu web tiene estos problemas?
          </p>
          <Link
            to="/consulta"
            className="inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)] transition-transform duration-200 hover:scale-[1.02]"
          >
            Diagnóstico gratuito →
          </Link>
        </div>
      </div>
    </section>
  );
}
