import { useRef } from 'react';

import { useTrackSectionView } from '@/core/hooks/use-track-section-view';
import analytics from '@/lib/analytics';
import RevealBlock from '@/shared/ui/reveal-block';

interface ServiceCardProps {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  delayMs: number;
}

function ServiceCard({ title, description, icon, delayMs }: ServiceCardProps) {
  return (
    <RevealBlock className="h-full" delayMs={delayMs}>
      <div className="h-full rounded-xl bg-[image:var(--gradient-subtle)] p-[1px]">
        <div className="flex h-full flex-col rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)]/88 p-5 transition-transform duration-300 hover:scale-[1.01] sm:p-6">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--gradient-brand)]">
            {icon}
          </div>

          <h3 className="mb-3 font-rajdhani text-xl font-bold text-white sm:text-[1.35rem]">
            {title}
          </h3>

          <div className="flex-grow text-gray-300">{description}</div>
        </div>
      </div>
    </RevealBlock>
  );
}

interface ServicesSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ServicesSection({ setRef }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useTrackSectionView(sectionRef, 'services');

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-transparent"
    >
      <div className="container z-10 mx-auto px-3 py-14 sm:px-4 sm:py-16">
        <RevealBlock className="mb-16 text-center">
          <h2 className="mb-6 font-rajdhani text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            <span className="gradient-text gradient-border mx-auto block max-w-4xl pb-2">
              Tres servicios. Un solo objetivo:
              <br />
              que tu negocio venda más online.
            </span>
          </h2>
        </RevealBlock>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-3">
          <ServiceCard
            title="Sitios corporativos"
            description={
              <>
                <p className="leading-7">
                  Para el negocio que necesita transmitir seriedad y generar consultas desde
                  Google.
                </p>
                <p className="mt-4 text-sm font-medium text-gray-200">
                  Diseño a medida · SEO técnico · Entrega en 2 semanas
                </p>
              </>
            }
            delayMs={80}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
          />

          <ServiceCard
            title="E-commerce"
            description={
              <>
                <p className="leading-7">
                  Para el negocio que quiere vender online con MercadoPago integrado y sin
                  depender de Mercado Libre.
                </p>
                <p className="mt-4 text-sm font-medium text-gray-200">
                  Carrito · Pagos · Panel de stock · Mobile-first
                </p>
              </>
            }
            delayMs={180}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
          />

          <ServiceCard
            title="Sistemas a medida"
            description={
              <>
                <p className="leading-7">
                  Para el negocio que necesita algo que no existe: paneles, flujos,
                  integraciones propias.
                </p>
                <p className="mt-4 text-sm font-medium text-gray-200">
                  Diagnóstico gratuito incluido antes de arrancar
                </p>
              </>
            }
            delayMs={280}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </div>

        <RevealBlock className="mt-16 text-center" delayMs={220}>
          <a
            href="/consulta"
            onClick={() => analytics.trackCtaClick('contar_mi_proyecto', 'services', '/consulta')}
            className="inline-flex w-full items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-4 text-center font-medium text-white shadow-[var(--glow-signal)] transition-transform duration-300 hover:scale-[1.02] sm:w-auto sm:px-8"
          >
            Contar mi proyecto
          </a>
        </RevealBlock>
      </div>
    </section>
  );
}
