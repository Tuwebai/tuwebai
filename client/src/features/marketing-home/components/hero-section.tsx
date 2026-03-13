import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
      className="min-h-screen scroll-mt-28 md:scroll-mt-32 flex items-center justify-center relative bg-gradient-1 overflow-hidden"
    >
      <motion.div
        className="container mx-auto px-4 text-center z-10"
        style={{ opacity: heroOpacity }}
      >
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="h-2 w-2 rounded-full bg-[#00CCFF] shadow-[0_0_10px_rgba(0,204,255,0.8)]" />
          <span className="font-medium">Disenamos el futuro de tu negocio</span>
        </motion.div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="mb-4">
            <span className="gradient-text font-rajdhani font-semibold text-lg md:text-xl tracking-[0.22em] uppercase">
              TuWeb.ai
            </span>
          </div>

          <h1 className="font-rajdhani font-bold text-4xl md:text-6xl xl:text-7xl leading-tight max-w-5xl mx-auto">
            <span className="text-white">Desarrollo web profesional para negocios que quieren </span>
            <span className="gradient-text">vender mejor online</span>
          </h1>
        </motion.div>

        <motion.div
          className="font-rajdhani text-lg md:text-2xl text-gray-300 mb-10 min-h-[5rem] md:min-h-[3.5rem] max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={heroMessages[activeMessageIndex]}
              className="mx-auto max-w-4xl text-gray-300"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {heroMessages[activeMessageIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <RouterLink
            to="/consulta"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-7 py-3 text-white font-semibold shadow-[0_10px_30px_rgba(0,204,255,0.22)] transition-transform duration-300 hover:scale-[1.02]"
          >
            Solicitar diagnostico gratuito
          </RouterLink>

          <ScrollLink
            to="showroom"
            spy={true}
            smooth={true}
            offset={-70}
            duration={1000}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 text-gray-200 font-medium backdrop-blur-sm transition-colors duration-300 hover:border-[#00CCFF]/50 hover:text-white cursor-pointer"
          >
            Ver proyectos reales
          </ScrollLink>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Sitios corporativos</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">E-commerce</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Sistemas web</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-10"
        >
          <ScrollLink
            to="philosophy"
            spy={true}
            smooth={true}
            offset={-70}
            duration={1000}
            className="inline-flex items-center cursor-pointer"
          >
            <motion.span
              className="mr-2 text-gray-300"
              whileHover={{ color: '#00CCFF' }}
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Descubrir mas
            </motion.span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#00CCFF]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </ScrollLink>
        </motion.div>
      </motion.div>

      {children && (
        <div className="absolute inset-x-0 bottom-24 z-20 pointer-events-none">
          <div className="container mx-auto px-4 pointer-events-auto">
            {children}
          </div>
        </div>
      )}
    </section>
  );
}
