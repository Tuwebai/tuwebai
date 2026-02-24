import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

import { SiReact, SiNextdotjs, SiVite, SiTailwindcss, SiNodedotjs, SiExpress, SiShopify, SiWoocommerce, SiStripe } from 'react-icons/si';

interface TechItemProps {
  icon: React.ReactNode;
  name: string;
  index: number;
}

function TechItem({ icon, name, index }: TechItemProps) {
  const { ref, hasIntersected } = useIntersectionObserver();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={itemVariants}
      className="flex flex-col items-center"
    >
      <div className="h-16 w-16 flex items-center justify-center text-[#00CCFF] hover:text-[#9933FF] transition-colors duration-300">
        {icon}
      </div>
      <p className="mt-2 text-sm text-gray-300">{name}</p>
    </motion.div>
  );
}

interface TechSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function TechSection({ setRef }: TechSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver();
  
  // Set the ref for the parent component
  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const technologies = [
    { icon: <SiReact size={40} />, name: "React" },
    { icon: <SiNextdotjs size={40} />, name: "Next.js" },
    { icon: <SiVite size={40} />, name: "Vite" },
    { icon: <SiTailwindcss size={40} />, name: "Tailwind CSS" },
    { icon: <SiNodedotjs size={40} />, name: "Node.js" },
    { icon: <SiExpress size={40} />, name: "Express" },
    { icon: <SiShopify size={40} />, name: "Shopify" },
    { icon: <SiWoocommerce size={40} />, name: "WooCommerce" },
    { icon: <SiStripe size={40} />, name: "Stripe" },
  ];

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section
      id="tech"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative bg-gradient-1"
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
            <span className="gradient-text gradient-border inline-block pb-2">Tecnologías que dominamos</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Herramientas modernas para soluciones de vanguardia
          </p>
        </motion.div>
        
        <motion.div
          className="bg-[#121217]/50 rounded-xl p-10 backdrop-blur-sm border border-gray-800 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <TechItem key={index} icon={tech.icon} name={tech.name} index={index} />
            ))}
          </div>
          
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="text-gray-300">
              Y muchas más herramientas especializadas según las necesidades de cada proyecto.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}