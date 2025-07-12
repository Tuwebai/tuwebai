import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import AnimatedShape from '../ui/animated-shape';

interface PhilosophySectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function PhilosophySection({ setRef }: PhilosophySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: leftColumnRef, hasIntersected: leftVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: rightColumnRef, hasIntersected: rightVisible } = useIntersectionObserver<HTMLDivElement>();
  
  // Set the ref for the parent component
  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const leftVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } }
  };

  return (
    <section 
      id="philosophy" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative bg-gradient-2"
    >
      <AnimatedShape type={1} className="top-[30%] left-[-150px]" delay={5} />
      
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center z-10">
        <motion.div 
          ref={leftColumnRef}
          initial="hidden"
          animate={leftVisible ? "visible" : "hidden"}
          variants={leftVariants}
        >
          <h2 className="font-rajdhani font-bold text-3xl md:text-5xl mb-6">
            <span className="gradient-text gradient-border inline-block pb-2">
              Liderando la Transformación Digital Global
            </span>
          </h2>
          
          <p className="text-lg md:text-xl font-medium mb-6 text-gray-200">
            TuWeb.ai — Consultoría Digital y Comercial Global para el Éxito Empresarial
          </p>
          
          <p className="text-gray-300 mb-4">
            <strong>Misión:</strong> Impulsamos el crecimiento de empresas con soluciones digitales que generan resultados reales.
          </p>
          
          <p className="text-gray-300 mb-4">
            <strong>Visión:</strong> Ser el socio estratégico líder en transformación digital y éxito global para nuestros clientes.
          </p>

          <div className="inline-flex items-center space-x-3 mb-2">
            <div className="h-1 w-12 bg-[#00CCFF]"></div>
            <span className="text-gray-400 font-rajdhani uppercase tracking-wider text-sm">
              Valores
            </span>
          </div>

          <ul className="mb-4 space-y-1">
            <li className="text-gray-300">• Innovación</li>
            <li className="text-gray-300">• Excelencia</li>
            <li className="text-gray-300">• Resultados</li>
            <li className="text-gray-300">• Integridad</li>
          </ul>
        </motion.div>
        
        <motion.div 
          ref={rightColumnRef}
          initial="hidden"
          animate={rightVisible ? "visible" : "hidden"}
          variants={rightVariants}
        >
          <div className="relative p-1 rounded-lg bg-gradient-to-br from-[#00CCFF] to-[#9933FF]">
            <div className="bg-[#0a0a0f] rounded-lg p-8">
              <h3 className="font-rajdhani text-2xl mb-6 text-gray-100">Superando los Retos Digitales del Siglo XXI</h3>
              <h4 className="text-gray-200 mb-4 font-medium">En un entorno digital en constante cambio, incluso las grandes empresas enfrentan obstáculos que frenan su crecimiento y competitividad.</h4>
              <ul className="mb-4 space-y-2">
                <li className="text-gray-300">• Estrategias digitales ineficaces</li>
                <li className="text-gray-300">• Falta de visión y adaptación</li>
                <li className="text-gray-300">• Tecnología sin alineación al negocio</li>
                <li className="text-gray-300">• Procesos lentos y resistencia</li>
                <li className="text-gray-300">• ROI digital poco claro</li>
                <li className="text-gray-300">• Oportunidades perdidas por falta de anticipación</li>
                <li className="text-gray-300">• Equipos sin capacitación</li>
                <li className="text-gray-300">• Ausencia de alianzas globales</li>
              </ul>
              <div className="mt-6">
                <p className="text-gray-400 text-sm">
                  En TuWebi, convertimos estos desafíos en oportunidades, impulsando la transformación digital de tu empresa con soluciones a medida, visión estratégica y resultados tangibles.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
