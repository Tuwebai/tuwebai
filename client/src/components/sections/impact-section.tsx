import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';


interface StatCardProps {
  value: string;
  label: string;
  description: string;
  delay: number;
}

function StatCard({ value, label, description, delay }: StatCardProps) {
  const { ref, hasIntersected } = useIntersectionObserver();

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.6, 
        delay: delay * 0.15 
      } 
    }
  };

  return (
    <motion.div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="bg-[#121217] rounded-lg p-6 border border-gray-800 relative"
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="font-rajdhani font-bold text-xl mb-2 text-[#00CCFF]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay * 0.15 + 0.3 }}
      >
        {value}
      </motion.div>
      
      <p className="text-gray-200 mb-2 font-medium">{label}</p>
      
      <p className="text-gray-300 text-sm">• {description}</p>
    </motion.div>
  );
}

interface ImpactSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ImpactSection({ setRef }: ImpactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver();
  const { ref: textRef, hasIntersected: textVisible } = useIntersectionObserver();
  
  // Set the ref for the parent component
  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } }
  };

  return (
    <section 
      id="impact" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative bg-gradient-2"
    >
      
      <div className="container mx-auto px-4 py-16 z-10">
        <motion.div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className="text-center mb-12"
          initial="hidden"
          animate={titleVisible ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h2 className="font-rajdhani font-bold text-3xl md:text-5xl mb-6">
            <span className="gradient-text gradient-border inline-block pb-2">Casos de Éxito Reales</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Impacto Real en el Mundo Digital
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-5xl mx-auto">
          <StatCard 
            value="Caso #1" 
            label="LH Decants - E-commerce Premium"
            description="Aumento del 150% en ventas online mediante la implementación de un sitio web corporativo premium con diseño elegante y sofisticado que refleja la calidad de sus productos exclusivos de perfumes y fragancias." 
            delay={1} 
          />
          <StatCard 
            value="Caso #2" 
            label="LH Decants - Experiencia de Usuario" 
            description="Mejora del 80% en la percepción de marca premium y reducción del 40% en el abandono del carrito gracias a una interfaz elegante y sofisticada optimizada para la experiencia de compra."
            delay={2} 
          />
          <StatCard 
            value="Caso #3" 
            label="LH Decants - Optimización Conversión" 
            description="Incremento del 60% en el tiempo de permanencia en el sitio y optimización del embudo de conversión para maximizar las ventas de productos premium."
            delay={3} 
          />
          <StatCard 
            value="Caso #4" 
            label="LH Decants - Diseño Premium" 
            description="Transformación completa de la presencia digital con un diseño que destaca la exclusividad y calidad premium de los productos de perfumes y fragancias."
            delay={4} 
          />
        </div>
        
        <motion.div 
          ref={textRef as React.RefObject<HTMLDivElement>}
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          animate={textVisible ? "visible" : "hidden"}
          variants={textVariants}
        >
          <h3 className="font-rajdhani font-bold text-2xl mb-4 text-white">¿Tu Negocio Necesita Resultados Similares?</h3>
          
          <p className="text-gray-300 text-lg">
            En TuWeb.ai nos especializamos en crear estrategias digitales que generan resultados medibles.
            No creamos simplemente sitios web bonitos, desarrollamos herramientas de venta
            que impulsan el crecimiento real de tu negocio.
          </p>
          
          <motion.div 
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="flex items-center space-x-2 text-[#00CCFF]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Resultados medibles</span>
              </div>
              
              <div className="hidden md:block h-4 w-px bg-gray-700"></div>
              
              <div className="flex items-center space-x-2 text-[#9933FF]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Enfoque en conversiones</span>
              </div>
              
              <div className="hidden md:block h-4 w-px bg-gray-700"></div>
              
              <div className="flex items-center space-x-2 text-[#00CCFF]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Estrategias comprobadas</span>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-10">
            <motion.a 
              href="/consulta" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Solicitar consulta gratuita
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}