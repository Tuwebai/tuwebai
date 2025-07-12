import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import AnimatedShape from '../ui/animated-shape';

interface ResourceCardProps {
  title: string;
  description: string;
  category: string;
  downloadLink: string;
  icon: React.ReactNode;
  delay: number;
}

function ResourceCard({ title, description, category, downloadLink, icon, delay }: ResourceCardProps) {
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
        <div className="flex items-start mb-4">
          <div className="mr-4 h-12 w-12 rounded-lg bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 flex items-center justify-center text-white">
            {icon}
          </div>
          
          <div>
            <span className="text-xs px-2 py-1 bg-[#1a1a23] rounded text-gray-400">{category}</span>
            <h3 className="font-rajdhani font-bold text-xl mt-1 text-white">{title}</h3>
          </div>
        </div>
        
        <p className="text-gray-400 flex-grow mb-4 text-sm">{description}</p>
        
        <div className="mt-auto">
          <motion.a 
            href={downloadLink}
            className="flex items-center text-[#00CCFF] hover:text-[#9933FF] transition-colors duration-300 font-medium"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span>Descargar gratis</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ResourcesSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ResourcesSection({ setRef }: ResourcesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: subtitleRef, hasIntersected: subtitleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: buttonRef, hasIntersected: buttonVisible } = useIntersectionObserver<HTMLDivElement>();
  
  // Set the ref for the parent component
  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } }
  };

  return (
    <section 
      id="resources" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative py-20"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #121217 100%)' }}
    >
      
      <div className="container mx-auto px-4 z-10">
        <motion.div 
          ref={titleRef}
          className="text-center"
          initial="hidden"
          animate={titleVisible ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h2 className="font-rajdhani font-bold text-3xl md:text-5xl mb-4">
            <span className="gradient-text gradient-border inline-block pb-2">Recursos Gratuitos</span>
          </h2>
        </motion.div>
        
        <motion.div 
          ref={subtitleRef}
          className="text-center mb-16"
          initial="hidden"
          animate={subtitleVisible ? "visible" : "hidden"}
          variants={subtitleVariants}
        >
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Herramientas, guías y recursos para ayudarte a impulsar tu estrategia digital. Descarga gratis y empieza a mejorar hoy mismo.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <ResourceCard 
            title="Estrategia de Contenidos"
            description="Guía paso a paso para crear una estrategia de contenidos efectiva que atraiga y convierta a tu audiencia ideal."
            category="E-Book"
            downloadLink="/recursos/estrategia-contenidos"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
            delay={5}
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
            href="/blog" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Explorar más recursos
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}