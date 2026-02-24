import { useRef, useEffect, useState, type ComponentType, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';

interface HeroSectionProps {
  setRef: (ref: HTMLElement | null) => void;
  children?: React.ReactNode;
}

interface TypewriterEffectProps {
  textStyle: CSSProperties;
  startDelay: number;
  cursorColor: string;
  multiText: string[];
  multiTextDelay: number;
  typeSpeed: number;
  multiTextLoop: boolean;
}

export default function HeroSection({ setRef, children }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [TypewriterEffectComponent, setTypewriterEffectComponent] =
    useState<ComponentType<TypewriterEffectProps> | null>(null);
  
  // Set the ref for the parent component
  useEffect(() => {
    if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
      setRef(sectionRef.current);
      sectionRef.current.setAttribute('data-ref-set', 'true');
    }
    // Reducimos el delay a 0 para que la primera visualización sea inmediata
    // TypeWriterEffect ya manejará su propia cadencia visual
    const timer = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timer);
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
    let isMounted = true;

    const loadTypewriterEffect = () => {
      import('react-typewriter-effect')
        .then((module) => {
          if (isMounted) {
            setTypewriterEffectComponent(() => module.default as ComponentType<TypewriterEffectProps>);
          }
        })
        .catch(() => {
          // Si falla la carga diferida, se mantiene texto estático.
        });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadTypewriterEffect, { timeout: 3000 });
    } else {
      setTimeout(loadTypewriterEffect, 1200);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section 
      id="intro" 
      ref={sectionRef} 
      className="min-h-screen flex items-center justify-center relative bg-gradient-1 overflow-hidden"
    >
      
      <motion.div 
        className="container mx-auto px-4 text-center z-10"
        style={{ opacity: heroOpacity }}
      >
        <motion.div 
          className="mb-6 inline-block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-rajdhani font-bold text-5xl md:text-7xl mb-2">
            <span className="gradient-text">TuWeb.ai</span>
          </h1>
          <motion.div 
            className="h-1 w-24 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] mx-auto"
            initial={{ width: 0 }}
            animate={{ width: '6rem' }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>
        
        <motion.div 
          className="font-rajdhani text-xl md:text-3xl text-gray-300 mb-12 h-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {isReady && TypewriterEffectComponent ? (
            <TypewriterEffectComponent
              textStyle={{
                fontFamily: 'Rajdhani, sans-serif',
                color: '#d1d5db',
                fontWeight: 500,
                fontSize: '1.5rem',
                textAlign: 'center',
              }}
              startDelay={1000}
              cursorColor="#00CCFF"
              multiText={[
                'Asesoría Comercial Digital para Empresas de Alto Rendimiento',
                'Transformamos tu negocio con estrategias comerciales',
                'Digitalización y automatización de procesos',
                'Soluciones integrales para tu empresa',
              ]}
              multiTextDelay={2000}
              typeSpeed={70}
              multiTextLoop
            />
          ) : (
            <span className="inline-block text-gray-300">
              Asesoría Comercial Digital para Empresas de Alto Rendimiento
            </span>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link 
            to="philosophy" 
            spy={true} 
            smooth={true} 
            offset={-70} 
            duration={1000}
            className="inline-flex items-center cursor-pointer"
          >
            <motion.span 
              className="mr-2 text-gray-300"
              whileHover={{ color: "#00CCFF" }}
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Descubrir
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
          </Link>
        </motion.div>
      </motion.div>

      {/* Render children passed from parent */}
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
