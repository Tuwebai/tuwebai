import { useRef } from 'react';

import RevealBlock from '@/shared/ui/reveal-block';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delayMs: number;
}

function ServiceCard({ title, description, icon, delayMs }: ServiceCardProps) {
  return (
    <RevealBlock className="h-full" delayMs={delayMs}>
      <div className="h-full rounded-xl bg-gradient-to-br from-[#00CCFF]/10 to-[#9933FF]/10 p-[1px]">
        <div className="flex h-full flex-col rounded-xl bg-[#121217] p-6 transition-transform duration-300 hover:scale-[1.01]">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF]">
            {icon}
          </div>

          <h3 className="mb-3 font-rajdhani text-xl font-bold text-white">{title}</h3>

          <p className="flex-grow text-gray-300">{description}</p>
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

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center bg-gradient-1"
    >
      <div className="container mx-auto px-4 py-16 z-10">
        <RevealBlock className="mb-16 text-center">
          <h2 className="mb-6 font-rajdhani text-3xl font-bold leading-tight md:text-5xl">
            <span className="gradient-text gradient-border mx-auto block max-w-4xl pb-2">
              Servicios web pensados para vender, operar y crecer
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            Nos enfocamos en tres tipos de soluciones: sitios corporativos, e-commerce
            y sistemas web para negocios que necesitan una presencia digital profesional.
          </p>
        </RevealBlock>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-3">
          <ServiceCard
            title="Sitios corporativos"
            description="Webs profesionales para empresas que necesitan transmitir confianza, presentar mejor su oferta y generar consultas con una imagen seria."
            delayMs={80}
            icon={(
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
          />

          <ServiceCard
            title="E-commerce"
            description="Tiendas online rapidas, claras y preparadas para convertir mejor, facilitar la compra y sostener crecimiento sin friccion tecnica."
            delayMs={180}
            icon={(
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
          />

          <ServiceCard
            title="Sistemas web para negocios"
            description="Plataformas, paneles y flujos web a medida para organizar procesos, conectar herramientas y operar con mas claridad."
            delayMs={280}
            icon={(
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
          />
        </div>

        <RevealBlock className="mt-16 text-center" delayMs={220}>
          <a
            href="/consulta"
            className="inline-block rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-8 py-4 font-medium text-white shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-[#00CCFF]/20"
          >
            Contar mi proyecto
          </a>
        </RevealBlock>
      </div>
    </section>
  );
}
