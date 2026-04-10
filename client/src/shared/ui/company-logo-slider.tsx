import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';

interface CompanyLogoSliderProps {
  className?: string;
}

const featuredProjects = [
  {
    name: 'LH Decants',
    logo: '/lhdecant-logo.jpg',
    alt: 'Logo de LH Decants',
    badge: 'Cliente real',
  },
  {
    name: 'TuWeb.ai Dashboard',
    logo: '/dashboardtuwebai.webp',
    alt: 'Vista de TuWeb.ai Dashboard',
    badge: 'Producto propio',
  },
  {
    name: 'SafeSpot',
    logo: '/safespot.webp',
    alt: 'Vista de SafeSpot',
    badge: 'Proyecto lanzado',
  },
  {
    name: 'Trading TuWeb.ai',
    logo: '/trading-tuwebai.webp',
    alt: 'Vista de Trading TuWeb.ai',
    badge: 'Proyecto activo',
  },
] as const;

export default function CompanyLogoSlider({ className = '' }: CompanyLogoSliderProps) {
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`w-full py-8 transform-gpu transition-all duration-700 ease-out ${
        hasIntersected ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      } ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--signal)]">
            Prueba real
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-gray-300 sm:text-base">
            Negocios y productos que ya confian en codigo a medida construido por TuWebAI.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 place-items-center">
          {featuredProjects.map((project) => (
            <div
              key={project.name}
              className="flex h-full w-full max-w-[180px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-gray-800/50">
                <img
                  src={project.logo}
                  alt={project.alt}
                  className="h-full w-full object-contain p-2"
                />
              </div>

              <p className="mt-3 text-sm font-medium text-white">{project.name}</p>
              <p className="mt-1 text-xs text-gray-400">{project.badge}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
