import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';

interface CompanyLogoSliderProps {
  className?: string;
}

const featuredProjects = [
  {
    name: 'LH Decants',
    logo: '/lhdecant-logo.jpg',
    alt: 'Logo de LH Decants',
  },
  {
    name: 'Pulse by TuWebAI',
    logo: '/pulse-by-tuwebai.png',
    alt: 'Vista de Pulse by TuWebAI',
  },
  {
    name: 'SafeSpot',
    logo: '/safespot.webp',
    alt: 'Vista de SafeSpot',
  },
  {
    name: 'Trading TuWeb.ai',
    logo: '/trading-tuwebai.webp',
    alt: 'Vista de Trading TuWeb.ai',
  },
] as const;

export default function CompanyLogoSlider({ className = '' }: CompanyLogoSliderProps) {
  const { ref, hasIntersected } = useIntersectionObserver();
  const marqueeProjects = [...featuredProjects, ...featuredProjects];

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`w-full py-8 transform-gpu transition-all duration-700 ease-out ${
        hasIntersected ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      } ${className}`}
    >
      <div className="trustbar-marquee-shell mx-auto max-w-6xl overflow-hidden px-4">
        <div className="trustbar-marquee-track flex w-max items-center gap-10 sm:gap-14">
          {marqueeProjects.map((project, index) => (
            <div
              key={`${project.name}-${index}`}
              className="flex h-16 min-w-[112px] items-center justify-center opacity-70 transition-opacity duration-300 hover:opacity-100 sm:h-20 sm:min-w-[148px]"
            >
              <img
                src={project.logo}
                alt={project.alt}
                className="h-full w-auto max-w-[140px] object-contain sm:max-w-[170px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
