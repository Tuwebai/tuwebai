import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

interface HeroSectionProps {
  setRef: (ref: HTMLElement | null) => void;
  children?: React.ReactNode;
}

export default function HeroSection({ setRef, children }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const heroMessage = useMemo(
    () =>
      'Sitios corporativos, e-commerce y sistemas web construidos a medida para negocios argentinos. Sin templates. Sin atajos.',
    [],
  );

  useEffect(() => {
    if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
      setRef(sectionRef.current);
      sectionRef.current.setAttribute('data-ref-set', 'true');
    }
  }, [setRef]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) {
          ticking = false;
          return;
        }

        const rect = section.getBoundingClientRect();
        const sectionHeight = Math.max(section.offsetHeight, 1);
        const progress = Math.min(Math.max((-rect.top) / sectionHeight, 0), 1);
        const nextOpacity = Math.max(0, 1 - progress * 2);
        setHeroOpacity((prev) => (Math.abs(prev - nextOpacity) < 0.001 ? prev : nextOpacity));
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="intro"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center overflow-hidden bg-gradient-1"
    >
      <div className="container mx-auto z-10 px-4 text-center" style={{ opacity: heroOpacity }}>
        <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 sm:px-4 sm:text-sm lg:backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[#00CCFF] shadow-[0_0_10px_rgba(0,204,255,0.8)]" />
          <span className="font-medium">Código a medida para negocios argentinos</span>
        </div>

        <div className="mb-6">
          <div className="mb-4">
            <span className="gradient-text font-rajdhani text-base font-semibold uppercase tracking-[0.18em] sm:text-lg md:text-xl">
              TuWeb.ai
            </span>
          </div>

          <h1 className="mx-auto max-w-5xl font-rajdhani text-[2.35rem] font-bold leading-[0.98] sm:text-5xl md:text-6xl xl:text-7xl">
            <span className="text-white">Webs que venden.</span>
            <br />
            <span className="gradient-text">No que decoran.</span>
          </h1>
        </div>

        <div className="mx-auto mb-8 min-h-[6.5rem] max-w-4xl px-2 font-rajdhani text-base text-gray-300 sm:min-h-[5rem] sm:text-lg md:min-h-[3.5rem] md:px-0 md:text-2xl">
          <p className="mx-auto max-w-4xl text-gray-300">{heroMessage}</p>
        </div>

        <div className="mb-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <RouterLink
            to="/consulta"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 text-center font-semibold text-white shadow-[0_10px_30px_rgba(0,204,255,0.22)] transition-transform duration-300 hover:scale-[1.02] sm:px-7"
          >
            Contar mi proyecto
          </RouterLink>

          <ScrollLink
            to="showroom"
            spy={true}
            smooth={true}
            offset={-70}
            duration={1000}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-center font-medium text-gray-200 transition-colors duration-300 hover:border-[#00CCFF]/50 hover:text-white sm:px-7 lg:backdrop-blur-sm"
          >
            Ver proyectos reales
          </ScrollLink>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-300 sm:gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs sm:px-4 sm:text-sm">
            Sitios corporativos
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs sm:px-4 sm:text-sm">
            E-commerce
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs sm:px-4 sm:text-sm">
            Sistemas web
          </span>
        </div>

        <div className="mt-10">
          <ScrollLink
            to="philosophy"
            spy={true}
            smooth={true}
            offset={-70}
            duration={1000}
            className="inline-flex cursor-pointer items-center"
          >
            <span className="mr-2 text-gray-300 transition-colors duration-300 hover:text-[#00CCFF]">
              Conocer cómo trabajamos
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 animate-bounce text-[#00CCFF]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </ScrollLink>
        </div>
      </div>

      {children ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20">
          <div className="container mx-auto pointer-events-auto px-4">{children}</div>
        </div>
      ) : null}
    </section>
  );
}
