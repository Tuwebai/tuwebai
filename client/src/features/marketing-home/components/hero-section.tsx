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
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const heroMessages = useMemo(
    () => [
      'Creamos sitios web, e-commerce y sistemas web que transmiten confianza y convierten visitas en oportunidades reales.',
      'Tu negocio necesita una presencia digital seria, rapida y preparada para crecer sin improvisaciones.',
      'Trabajamos con foco en negocio, rendimiento y una experiencia web profesional de punta a punta.',
    ],
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

  useEffect(() => {
    const rotationInterval = window.setInterval(() => {
      setActiveMessageIndex((currentIndex) => (currentIndex + 1) % heroMessages.length);
    }, 3200);

    return () => window.clearInterval(rotationInterval);
  }, [heroMessages.length]);

  return (
    <section
      id="intro"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-center justify-center overflow-hidden bg-gradient-1"
    >
      <div className="container mx-auto z-10 px-4 text-center" style={{ opacity: heroOpacity }}>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 lg:backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[#00CCFF] shadow-[0_0_10px_rgba(0,204,255,0.8)]" />
          <span className="font-medium">Disenamos el futuro de tu negocio</span>
        </div>

        <div className="mb-6">
          <div className="mb-4">
            <span className="gradient-text font-rajdhani text-lg font-semibold uppercase tracking-[0.22em] md:text-xl">
              TuWeb.ai
            </span>
          </div>

          <h1 className="mx-auto max-w-5xl font-rajdhani text-4xl font-bold leading-tight md:text-6xl xl:text-7xl">
            <span className="text-white">Desarrollo web profesional para negocios que quieren </span>
            <span className="gradient-text">vender mejor online</span>
          </h1>
        </div>

        <div className="mx-auto mb-10 min-h-[5rem] max-w-4xl font-rajdhani text-lg text-gray-300 md:min-h-[3.5rem] md:text-2xl">
          <p key={heroMessages[activeMessageIndex]} className="mx-auto max-w-4xl text-gray-300 transition-opacity duration-300 ease-in-out">
            {heroMessages[activeMessageIndex]}
          </p>
        </div>

        <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <RouterLink
            to="/consulta"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-7 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(0,204,255,0.22)] transition-transform duration-300 hover:scale-[1.02]"
          >
            Contar mi proyecto
          </RouterLink>

          <ScrollLink
            to="showroom"
            spy={true}
            smooth={true}
            offset={-70}
            duration={1000}
            className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 font-medium text-gray-200 transition-colors duration-300 hover:border-[#00CCFF]/50 hover:text-white lg:backdrop-blur-sm"
          >
            Ver proyectos reales
          </ScrollLink>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Sitios corporativos</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">E-commerce</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Sistemas web</span>
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
              Conocer como trabajamos
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-bounce text-[#00CCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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
