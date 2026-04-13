import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  trackVisitorPathComparisonClick,
  trackVisitorPathCtaClick,
  trackVisitorPathSelected,
  type VisitorPathId,
} from '@/features/marketing-home/services/marketing-home-analytics.service';

type PathContent = {
  id: VisitorPathId;
  title: string;
  description: string;
  outcome: string;
  ctaLabel: string;
  ctaHref: string;
};

const visitorPaths: PathContent[] = [
  {
    id: 'sin-web',
    title: 'No tengo web todavía',
    description:
      'Necesitás salir bien parado desde el principio, con una web clara, profesional y lista para empezar a captar consultas.',
    outcome:
      'Te conviene resolver estructura, mensaje y CTA antes de perder tiempo en herramientas o templates que después quedan chicos.',
    ctaLabel: 'Ver rango para mi web',
    ctaHref: '/calculadora-precio-web',
  },
  {
    id: 'no-convierte',
    title: 'Tengo web pero no me trae clientes',
    description:
      'El problema suele estar en el mensaje, la fricción del recorrido o la falta de medición para entender qué está fallando.',
    outcome:
      'Acá conviene diagnosticar primero qué parte del sitio está frenando la conversión antes de rehacer por intuición.',
    ctaLabel: 'Pedir diagnóstico gratuito',
    ctaHref: '/diagnostico-gratuito',
  },
  {
    id: 'sistema',
    title: 'Necesito un sistema más complejo',
    description:
      'Ya no alcanza con una web básica. Necesitás lógica de negocio, procesos, accesos, integraciones o flujos a medida.',
    outcome:
      'Lo importante es definir alcance y operación real para construir algo que no te limite en seis meses.',
    ctaLabel: 'Contar mi proyecto',
    ctaHref: '/consulta',
  },
];

export default function VisitorPathSelector() {
  const [activePath, setActivePath] = useState<VisitorPathId>('sin-web');

  const currentPath = useMemo(
    () => visitorPaths.find((path) => path.id === activePath) ?? visitorPaths[0],
    [activePath],
  );

  return (
    <section className="relative bg-transparent py-8 sm:py-10">
      <div className="container mx-auto px-4">
        <div className="editorial-surface-panel mx-auto max-w-5xl p-6 sm:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--signal)]">
              ¿Esto es para vos?
            </p>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white sm:text-4xl">
              Elegí tu situación y te mostramos por dónde conviene empezar.
            </h2>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {visitorPaths.map((path) => (
              <button
                key={path.id}
                type="button"
                onClick={() => {
                  setActivePath(path.id);
                  trackVisitorPathSelected(path.id);
                }}
                className={`editorial-surface-card rounded-2xl px-4 py-5 text-left transition-colors ${
                  activePath === path.id
                    ? 'editorial-surface-card--accent text-white'
                    : 'editorial-surface-card--interactive text-gray-300'
                }`}
              >
                <p className="font-medium">{path.title}</p>
              </button>
            ))}
          </div>

          <div className="editorial-surface-card editorial-surface-card--accent mt-8 grid gap-6 rounded-[28px] p-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
            <div>
              <p className="font-rajdhani text-2xl font-bold text-white">{currentPath.title}</p>
              <p className="mt-4 text-base leading-7 text-gray-300">{currentPath.description}</p>
              <p className="mt-4 text-base leading-7 text-gray-300">{currentPath.outcome}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to={currentPath.ctaHref}
                onClick={() => trackVisitorPathCtaClick(currentPath.id, currentPath.ctaHref)}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]"
              >
                {currentPath.ctaLabel}
              </Link>
              <Link
                to="/comparar-opciones-web"
                onClick={() => trackVisitorPathComparisonClick(currentPath.id)}
                className="editorial-secondary-button min-h-12 px-6 py-3 text-sm font-medium"
              >
                Comparar opciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
