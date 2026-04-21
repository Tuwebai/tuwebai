import { useRef } from 'react';
import { Globe, LayoutDashboard, ShoppingBag } from 'lucide-react';

import { useTrackSectionView } from '@/core/hooks/use-track-section-view';
import { trackRuntimeCtaClick } from '@/lib/analytics-runtime';
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
      <div className="card-hover flex h-full flex-col rounded-[28px] border border-white/5 bg-[var(--bg-base)] p-6">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--signal-border)] bg-[var(--signal-glow)]">
          {icon}
        </div>

        <h3 className="mb-3 text-xl font-black text-white sm:text-[1.35rem]">{title}</h3>

        <div className="flex-grow text-gray-300">{description}</div>
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
          <div className="mb-5 inline-flex rounded-full border border-[var(--signal-border)] bg-[var(--signal-glow)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#A78BFA]">
            Servicios
          </div>
          <h2 className="mb-6 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
            <span className="gradient-text gradient-border mx-auto block max-w-4xl pb-2">
              Tres servicios. Un solo objetivo:
              <br />
              que tu negocio venda más online.
            </span>
          </h2>
        </RevealBlock>

        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            title="Sitios corporativos"
            description={
              <>
                <p className="leading-7">
                  Para el negocio que necesita transmitir seriedad y generar consultas desde
                  Google.
                </p>
                <ul className="mt-4 space-y-2 text-sm font-medium text-gray-200">
                  {['Diseño a medida', 'SEO técnico', 'Entrega en 2 semanas'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            }
            delayMs={80}
            icon={<Globe className="h-6 w-6 text-white" />}
          />

          <ServiceCard
            title="E-commerce"
            description={
              <>
                <p className="leading-7">
                  Para el negocio que quiere vender online con MercadoPago integrado y sin
                  depender de Mercado Libre.
                </p>
                <ul className="mt-4 space-y-2 text-sm font-medium text-gray-200">
                  {['Carrito', 'Pagos', 'Panel de stock', 'Mobile-first'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            }
            delayMs={180}
            icon={<ShoppingBag className="h-6 w-6 text-white" />}
          />

          <ServiceCard
            title="Sistemas a medida"
            description={
              <>
                <p className="leading-7">
                  Para el negocio que necesita algo que no existe: paneles, flujos,
                  integraciones propias.
                </p>
                <ul className="mt-4 space-y-2 text-sm font-medium text-gray-200">
                  {['Paneles personalizados', 'Integraciones propias', 'Diagnóstico gratuito incluido'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            }
            delayMs={280}
            icon={<LayoutDashboard className="h-6 w-6 text-white" />}
          />
        </div>

        <RevealBlock className="mt-16 text-center" delayMs={220}>
          <a
            href="/consulta"
            onClick={() => trackRuntimeCtaClick('contar_mi_proyecto', 'services', '/consulta')}
            className="inline-flex w-full items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-4 text-center font-medium text-white shadow-[var(--glow-signal)] transition-transform duration-300 hover:scale-[1.02] sm:w-auto sm:px-8"
          >
            Contar mi proyecto
          </a>
        </RevealBlock>
      </div>
    </section>
  );
}
