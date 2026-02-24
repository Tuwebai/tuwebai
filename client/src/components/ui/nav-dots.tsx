import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

interface NavDotsProps {
  sections: Section[];
}

export default function NavDots({ sections }: NavDotsProps) {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (const section of sections) {
          const element = document.getElementById(section.id);
          if (!element) continue;

          const { offsetTop, offsetHeight } = element;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection((prev) => (prev === section.id ? prev : section.id));
            break;
          }
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <nav className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-4 p-2">
      {sections.map((section) => (
        <div
          key={section.id}
          className="relative flex items-center group"
        >
          <a
            href={`#${section.id}`}
            className="block"
            aria-label={`Navigate to ${section.label} section`}
            onClick={(e) => {
              // Previene el comportamiento predeterminado para poder manejar manualmente
              e.preventDefault();
              
              // Navega al ID usando el fragmento de URL
              const sectionElement = document.getElementById(section.id);
              if (sectionElement) {
                const headerOffset = 100;
                const elementPosition = sectionElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
                
                // Actualiza la URL sin recargar la página
                window.history.pushState(null, '', `#${section.id}`);
              }
            }}
          >
            <motion.div
              className={`h-2 w-2 rounded-full transition-all duration-300 hover:bg-[#9933FF] cursor-pointer ${
                activeSection === section.id 
                  ? 'bg-[#00CCFF] shadow-[0_0_8px_rgba(0,204,255,0.8)]' 
                  : 'bg-gray-500'
              }`}
              whileHover={{ scale: 1.3 }}
              animate={{ 
                scale: activeSection === section.id ? 1.3 : 1
              }}
            />
          </a>
          <span className="opacity-0 group-hover:opacity-100 absolute right-full mr-2 text-white text-xs whitespace-nowrap transition-opacity duration-300 pointer-events-none">
            {section.label}
          </span>
        </div>
      ))}
    </nav>
  );
}
