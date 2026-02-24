import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';


interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

function ProcessStep({ number, title, description, delay }: ProcessStepProps) {
  const { ref, hasIntersected } = useIntersectionObserver();

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        delay: delay * 0.15 
      } 
    }
  };

  return (
    <motion.div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex items-start gap-6"
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={stepVariants}
    >
      <div className="flex-shrink-0">
        <motion.div 
          className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-rajdhani font-bold text-xl"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {number}
        </motion.div>
      </div>
      
      <div>
        <h3 className="font-rajdhani font-bold text-xl mb-2 text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
}

interface ProcessSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ProcessSection({ setRef }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver();
  
  // Set the ref for the parent component
  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section 
      id="process" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative bg-gradient-2"
    >
      
      <div className="container mx-auto px-4 py-16 z-10">
        <motion.div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className="text-center mb-16"
          initial="hidden"
          animate={titleVisible ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h2 className="font-rajdhani font-bold text-3xl md:text-5xl mb-6">
            <span className="gradient-text gradient-border inline-block pb-2">El Proceso de Trabajo</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Nuestro Proceso: De la Estrategia a los Resultados
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto space-y-12">
          <ProcessStep 
            number={1} 
            title="Análisis y Diagnóstico Inicial" 
            description="Investigación del mercado y definición de KPIs específicos para medir el éxito de la estrategia."
            delay={1}
          />
          
          <ProcessStep 
            number={2} 
            title="Diseño de Estrategia Personalizada" 
            description="Marketing digital, desarrollo web y análisis continuo adaptado a tus objetivos comerciales."
            delay={2}
          />
          
          <ProcessStep 
            number={3} 
            title="Implementación y Ejecución" 
            description="Desarrollo de sitio web / landing pages + implementación de campañas SEO y PPC."
            delay={3}
          />
          
          <ProcessStep 
            number={4} 
            title="Monitoreo y Ajustes" 
            description="Análisis constante de resultados y mejoras continuas para optimizar la tasa de conversión."
            delay={4}
          />
          
          <ProcessStep 
            number={5} 
            title="Resultados Medibles" 
            description="Reportes detallados y recomendaciones específicas para escalar el crecimiento de tu negocio."
            delay={5}
          />
        </div>
      </div>
    </section>
  );
}