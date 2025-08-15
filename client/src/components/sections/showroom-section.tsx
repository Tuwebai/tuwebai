import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import AnimatedShape from '../ui/animated-shape';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  features: string[];
  results: { label: string; value: string }[];
  image: string;
  detailsUrl: string;
  externalUrl?: string;
}

interface ShowroomSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ShowroomSection({ setRef }: ShowroomSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: subtitleRef, hasIntersected: subtitleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: projectsRef, hasIntersected: projectsVisible } = useIntersectionObserver<HTMLDivElement>();
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selectedProject) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar la posición del scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    // Cleanup al desmontar el componente
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  // Manejador de teclas para cerrar modal con Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);
  
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

  const projectsVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    }
  };

  const projectVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Array de proyectos (actualmente vacío - listo para proyectos reales)
  const projects: Project[] = [
    {
      id: 1,
      title: "LH Decants",
      category: "e-commerce",
      description: "Explorá el arte del perfume sin comprar a ciegas: nuestros decants 100% originales te acercan a las fragancias más exclusivas del mundo, gota a gota.",
      features: [
        "Decants 100% originales",
        "Fragancias exclusivas del mundo",
        "Preserva calidad e intensidad",
        "Frascos auténticos",
        "Elegancia en su forma más pura"
      ],
      results: [
        { label: "Satisfacción", value: "98%" },
        { label: "Productos originales", value: "100%" },
        { label: "Variedad", value: "+200 fragancias" }
      ],
      image: "/lhdecant-card.png",
      detailsUrl: "/showroom",
      externalUrl: "https://lhdecant.com/"
    }
  ];

  // Filtrar proyectos por categoría
  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  // Categorías únicas para filtrado
  const categories = ['all', ...Array.from(new Set(projects.map(project => project.category)))];

  // Mapeo de categorías a nombres amigables
  const categoryNames: Record<string, string> = {
    all: 'Todos',
    'e-commerce': 'E-commerce',
    muebleria: 'Mueblerías',
    'tienda-online': 'Tiendas Online',
    'salud-bienestar': 'Salud y Bienestar',
    'diseno-branding': 'Diseño y Branding',
    'turismo-exclusivo': 'Turismo Exclusivo',
    'educacion': 'Educación',
    'mascotas': 'Mascotas'
  };

  // Manejador de navegación para proyectos
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  // Manejador para visitar página web externa
  const handleVisitWebsite = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section 
      id="showroom" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative py-20 bg-gradient-1"
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
            <span className="gradient-text gradient-border inline-block pb-2">Showroom Virtual</span>
          </h2>
        </motion.div>
        
        <motion.div 
          ref={subtitleRef}
          className="text-center mb-12"
          initial="hidden"
          animate={subtitleVisible ? "visible" : "hidden"}
          variants={subtitleVariants}
        >
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explora nuestros proyectos destacados y descubre cómo transformamos ideas en experiencias digitales exitosas.
          </p>
        </motion.div>
        
        {/* Filtros de proyectos */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                    : 'bg-[#121217] text-gray-400 hover:text-white hover:bg-[#1a1a23]'
                } transition-colors`}
              >
                {categoryNames[category] || category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Grid de proyectos */}
        <motion.div 
          ref={projectsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={projectsVariants}
          initial="hidden"
          animate={projectsVisible ? "visible" : "hidden"}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-[#121217] rounded-xl overflow-hidden border border-gray-800 cursor-pointer h-full"
              onClick={() => handleProjectClick(project)}
              variants={projectVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="h-48 overflow-hidden relative group">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white font-medium text-sm">Vista Previa</span>
                </div>
                {/* Botón "Visitar página web" que aparece en hover */}
                {project.externalUrl && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => handleVisitWebsite(project.externalUrl!, e)}
                      className="bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-all duration-200 transform hover:scale-105"
                    >
                      Visitar página web
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-rajdhani font-bold text-xl text-white">{project.title}</h3>
                  <span className="text-xs px-2 py-1 bg-[#1a1a23] rounded text-gray-400">
                    {categoryNames[project.category] || project.category}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectClick(project);
                  }}
                  className="flex items-center text-[#00CCFF] text-sm font-medium hover:text-[#9933FF] transition-colors"
                >
                  <span>Ver detalles</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Modal de detalle de proyecto */}
        {selectedProject && (
          <div 
            className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4 overflow-hidden"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              className="bg-[#121217] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex justify-between items-start border-b border-gray-800">
                <div>
                  <h3 className="font-rajdhani font-bold text-2xl text-white mb-1">{selectedProject.title}</h3>
                  <span className="text-xs px-2 py-1 bg-[#1a1a23] rounded text-gray-400">
                    {categoryNames[selectedProject.category] || selectedProject.category}
                  </span>
                </div>
                
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="h-64 lg:h-80 rounded-lg overflow-hidden mb-6">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mb-6">
                  <h4 className="font-rajdhani font-bold text-xl text-white mb-3">Descripción</h4>
                  <p className="text-gray-300">{selectedProject.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-rajdhani font-bold text-xl text-white mb-3">Características</h4>
                    <ul className="space-y-2">
                      {selectedProject.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-rajdhani font-bold text-xl text-white mb-3">Resultados</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProject.results.map((result, index) => (
                        <div key={index} className="bg-[#1a1a23] p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-[#00CCFF] mb-1">{result.value}</div>
                          <div className="text-sm text-gray-400">{result.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-800">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    {selectedProject.externalUrl ? (
                      <button
                        onClick={() => window.open(selectedProject.externalUrl, '_blank', 'noopener,noreferrer')}
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                      >
                        Visitar página web
                      </button>
                    ) : (
                      <Link 
                        to={selectedProject.detailsUrl}
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                      >
                        Ver página completa
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Call to action */}
        <div className="text-center mt-14">
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            ¿Quieres ver más ejemplos de nuestro trabajo? Contáctanos para acceder a nuestro portafolio completo.
          </p>
          
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link 
              to="/consulta"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20"
            >
              Solicitar una consulta
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}