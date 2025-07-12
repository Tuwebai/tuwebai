import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import AnimatedShape from '../ui/animated-shape';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

function ServiceCard({ title, description, icon, delay }: ServiceCardProps) {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>();

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        delay: delay * 0.2 
      } 
    }
  };

  return (
    <motion.div 
      ref={ref}
      className="bg-gradient-to-br from-[#00CCFF]/10 to-[#9933FF]/10 rounded-xl p-[1px] h-full"
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={cardVariants}
    >
      <motion.div 
        className="bg-[#121217] h-full rounded-xl p-6 flex flex-col"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4 h-14 w-14 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center">
          {icon}
        </div>
        
        <h3 className="font-rajdhani font-bold text-xl mb-3 text-white">{title}</h3>
        
        <p className="text-gray-300 flex-grow">{description}</p>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          {/* Botón eliminado si no hay página funcional */}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ServicesSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ServicesSection({ setRef }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: buttonRef, hasIntersected: buttonVisible } = useIntersectionObserver<HTMLDivElement>();
  
  // Set the ref for the parent component manually
  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } }
  };

  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative bg-gradient-1"
    >
      
      <div className="container mx-auto px-4 py-16 z-10">
        <motion.div 
          ref={titleRef}
          className="text-center mb-16"
          initial="hidden"
          animate={titleVisible ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h2 className="font-rajdhani font-bold text-3xl md:text-5xl mb-6">
            <span className="gradient-text gradient-border inline-block pb-2">TuWeb.ai: Soluciones Digitales para tu Éxito</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ofrecemos consultoría digital completa y avanzada, diseñada para maximizar el rendimiento y escalar tu negocio.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <ServiceCard 
            title="Consultoría Estratégica"
            description="Análisis exhaustivo de tu modelo de negocio. Diseño de estrategias digitales adaptadas para optimizar el rendimiento comercial."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            delay={1}
          />
          
          <ServiceCard 
            title="Desarrollo Web Profesional"
            description="Diseño moderno, rápido y optimizado para SEO, conversión y generación de leads con landing pages de alto impacto."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            delay={2}
          />
          
          <ServiceCard 
            title="Posicionamiento y Marketing"
            description="SEO avanzado, campañas SEM en Google, publicidad en Facebook/LinkedIn y optimización de la tasa de conversión (CRO)."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            delay={3}
          />
          
          <ServiceCard 
            title="Automatización de Marketing"
            description="Implementación de procesos automatizados e integraciones con HubSpot, ActiveCampaign y otras herramientas líderes."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            delay={4}
          />
        </div>
        
        <motion.div 
          ref={buttonRef}
          className="text-center mt-16"
          initial="hidden"
          animate={buttonVisible ? "visible" : "hidden"}
          variants={buttonVariants}
        >
          <motion.a 
            href="/consulta" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Solicitar una Consulta
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
