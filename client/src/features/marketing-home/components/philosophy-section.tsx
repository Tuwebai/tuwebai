import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import AnimatedShape from '@/shared/ui/animated-shape';

interface PhilosophySectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function PhilosophySection({ setRef }: PhilosophySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: leftColumnRef, hasIntersected: leftVisible } =
    useIntersectionObserver<HTMLDivElement>();
  const { ref: rightColumnRef, hasIntersected: rightVisible } =
    useIntersectionObserver<HTMLDivElement>();

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const leftVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } },
  };

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="landing-anchor-section flex items-center justify-center relative bg-gradient-2"
    >
      <AnimatedShape type={1} className="top-[30%] left-[-150px]" delay={5} />

      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          ref={leftColumnRef}
          initial="hidden"
          animate={leftVisible ? 'visible' : 'hidden'}
          variants={leftVariants}
        >
          <h2 className="font-rajdhani font-bold text-3xl md:text-5xl mb-6">
            <span className="gradient-text gradient-border inline-block pb-2">
              Un enfoque web pensado para negocio, no para improvisar
            </span>
          </h2>

          <p className="text-lg md:text-xl font-medium mb-6 text-gray-200">
            Diseñamos, desarrollamos y optimizamos experiencias web que ayudan a vender mejor,
            operar con más claridad y transmitir una imagen profesional.
          </p>

          <p className="text-gray-300 mb-4">
            No trabajamos con recetas genéricas ni con sitios que se ven bien pero no
            acompañan al negocio. Cada proyecto se construye con foco en objetivos reales,
            estructura clara y rendimiento.
          </p>

          <p className="text-gray-300 mb-4">
            El objetivo no es solo publicar una web: es crear una plataforma digital seria,
            confiable y preparada para crecer con tu empresa.
          </p>

          <div className="inline-flex items-center space-x-3 mb-2">
            <div className="h-1 w-12 bg-[#00CCFF]" />
            <span className="text-gray-400 font-rajdhani uppercase tracking-wider text-sm">
              Cómo trabajamos
            </span>
          </div>

          <ul className="mb-4 space-y-3">
            <li className="text-gray-300">• Estrategia antes que decoración</li>
            <li className="text-gray-300">• Desarrollo web alineado al negocio</li>
            <li className="text-gray-300">• Rendimiento, claridad y confianza</li>
            <li className="text-gray-300">• Base preparada para escalar</li>
          </ul>
        </motion.div>

        <motion.div
          ref={rightColumnRef}
          initial="hidden"
          animate={rightVisible ? 'visible' : 'hidden'}
          variants={rightVariants}
        >
          <div className="relative p-1 rounded-lg bg-gradient-to-br from-[#00CCFF] to-[#9933FF]">
            <div className="bg-[#0a0a0f] rounded-lg p-8">
              <h3 className="font-rajdhani text-2xl mb-4 text-gray-100">
                Lo que resolvemos en proyectos reales
              </h3>
              <p className="text-gray-200 mb-5 font-medium">
                Muchas empresas ya tienen presencia online, pero no una web que realmente
                acompañe ventas, operación y crecimiento.
              </p>
              <ul className="mb-4 space-y-3">
                <li className="text-gray-300">• Sitios que no transmiten confianza ni profesionalismo</li>
                <li className="text-gray-300">• Estructuras confusas que dificultan conversión y contacto</li>
                <li className="text-gray-300">• Herramientas desconectadas del proceso comercial</li>
                <li className="text-gray-300">• Tecnología que se vuelve una carga en vez de una ventaja</li>
              </ul>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Por eso trabajamos con una lógica simple: entender el negocio, definir
                  prioridades y construir una solución web clara, rápida y lista para
                  sostener crecimiento real.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
