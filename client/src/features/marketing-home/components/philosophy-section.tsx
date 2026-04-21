import { useRef } from 'react';
import { Link } from 'react-router-dom';

import AnimatedShape from '@/shared/ui/animated-shape';
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
      <AnimatedShape type={1} className="top-[30%] left-[-150px]" delay={5} />

      <div className="container z-10 mx-auto px-3 py-14 sm:px-4 sm:py-16">
        <div className="mb-10 max-w-4xl">
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

        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12">
          <RevealBlock
            hiddenClassName="opacity-0 -translate-x-8"
            visibleClassName="opacity-100 translate-x-0"
          >
            <p className="mb-4 text-gray-300">
              No trabajamos con templates ni con sitios que se ven bien en el portfolio pero no
              generan una sola consulta.
            </p>

            <p className="mb-6 text-gray-300">
              Cada proyecto empieza entendiendo qué necesita el negocio, no qué está de moda en
              diseño web.
            </p>

            <div className="mb-2 inline-flex items-center space-x-3">
              <div className="h-1 w-12 bg-[var(--signal)]" />
              <span className="text-sm font-black uppercase tracking-wider text-gray-400">
                Cómo trabajamos
              </span>
            </div>

            <ul className="mb-4 space-y-3">
              <li className="text-gray-300">- Entendemos el negocio antes de diseñar</li>
              <li className="text-gray-300">- Mobile-first desde el primer wireframe</li>
              <li className="text-gray-300">- Analytics configurado desde el día 1</li>
              <li className="text-gray-300">- Entrega en 2 a 4 semanas según el proyecto</li>
            </ul>
          </RevealBlock>

          <RevealBlock
            hiddenClassName="opacity-0 translate-x-8"
            visibleClassName="opacity-100 translate-x-0"
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
