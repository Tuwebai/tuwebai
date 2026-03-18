import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';

interface CompanyLogoSliderProps {
  className?: string;
}

const featuredProjects = [
  {
    name: 'LH Decants',
    logo: '/lhdecant-logo.jpg',
    alt: 'Logo de LH Decants'
  },
  {
    name: 'TuWeb.ai Dashboard',
    logo: '/dashboardtuwebai.webp',
    alt: 'Logo de TuWeb.ai Dashboard'
  },
  {
    name: 'SafeSpot',
    logo: '/safespot.webp',
    alt: 'Logo de SafeSpot'
  },
  {
    name: 'Trading TuWeb.ai',
    logo: '/trading-tuwebai.webp',
    alt: 'Logo de Trading TuWeb.ai'
  }
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center">
          {featuredProjects.map((project) => (
            <div key={project.name} className="flex flex-col items-center justify-center h-24">
              <div className="w-16 h-16 bg-gray-800 bg-opacity-50 rounded-lg flex items-center justify-center transition-all duration-300 border border-gray-700 hover:border-[#00CCFF] overflow-hidden">
                <img
                  src={project.logo}
                  alt={project.alt}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <p className="mt-2 text-xs text-gray-400 text-center">{project.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
