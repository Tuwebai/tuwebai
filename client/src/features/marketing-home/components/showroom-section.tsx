import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import ShowroomProjectModal from '@/features/marketing-home/components/showroom-project-modal';
import type { ShowroomProject } from '@/features/marketing-home/components/showroom-types';
interface ShowroomSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ShowroomSection({ setRef }: ShowroomSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: subtitleRef, hasIntersected: subtitleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: projectsRef, hasIntersected: projectsVisible } = useIntersectionObserver<HTMLDivElement>();
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ShowroomProject | null>(null);
  const [hasShownTitle, setHasShownTitle] = useState(false);
  const [hasShownSubtitle, setHasShownSubtitle] = useState(false);
  const [hasShownProjects, setHasShownProjects] = useState(false);

  useEffect(() => {
    if (titleVisible) setHasShownTitle(true);
  }, [titleVisible]);

  useEffect(() => {
    if (subtitleVisible) setHasShownSubtitle(true);
  }, [subtitleVisible]);

  useEffect(() => {
    if (projectsVisible) setHasShownProjects(true);
  }, [projectsVisible]);
  
  // Prevenir scroll del documento mientras el modal está abierto.
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
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
      const projects: ShowroomProject[] = [
    {
      id: 1,
      title: "LH Decants",
      category: "e-commerce",
      description: "Explora el arte del perfume sin comprar a ciegas: decants 100% originales para descubrir fragancias exclusivas por mililitro.",
      clientNeed: "Vender fragancias premium con una experiencia clara, elegante y confiable para usuarios que necesitan decidir sin probar el perfume fisicamente.",
      solutionSummary: "Disenamos un e-commerce enfocado en confianza, catalogo premium y claridad de compra para decants 100% originales.",
      valueSummary: "La solucion mejora conversion, transmite autenticidad y facilita explorar una oferta exclusiva sin friccion innecesaria.",
      features: [
        "Decants 100% originales",
        "Fragancias exclusivas del mundo",
        "Preserva calidad e intensidad",
        "Frascos autenticos",
        "Elegancia en su forma mas pura"
      ],
      results: [
        { label: "Satisfaccion", value: "98%" },
        { label: "Productos originales", value: "100%" },
        { label: "Fragancias", value: "+200" }
      ],
      image: "/lhdecant-card.png",
      detailsUrl: "/showroom",
      externalUrl: "https://lhdecant.com/"
    },
    {
      id: 2,
      title: "TuWeb.ai Dashboard",
      category: "saas",
      description: "Plataforma operativa del ecosistema TuWeb.ai para centralizar proyectos, soporte, pagos y visibilidad interna en una sola interfaz.",
      sectionLabels: {
        clientNeed: "Que necesitabamos resolver",
        solutionSummary: "Que desarrollamos en TuWeb.ai",
        valueSummary: "Que mejora en la operacion",
      },
      clientNeed: "Ordenar la operacion diaria de TuWeb.ai con una plataforma propia que unifique seguimiento, soporte y estado de servicio sin depender de procesos dispersos.",
      solutionSummary: "Desarrollamos un dashboard interno para centralizar proyectos, tickets, pagos y trazabilidad operativa dentro del ecosistema TuWeb.ai.",
      valueSummary: "La plataforma reduce friccion interna, mejora la visibilidad del servicio y profesionaliza la gestion operativa de punta a punta.",
      features: [
        "Acceso seguro por usuario",
        "Seguimiento operativo en tiempo real",
        "Centro unificado de tickets y respuestas",
        "Historial de pagos y estado de servicio",
        "Panel optimizado para desktop y mobile"
      ],
      results: [
        { label: "Visibilidad operativa", value: "360°" },
        { label: "Modulos", value: "4" },
        { label: "Disponibilidad", value: "24/7" }
      ],
      image: "/dashboardtuwebai.png",
      detailsUrl: "/showroom",
      externalUrl: "https://dashboard.tuweb-ai.com/"
    },
    {
      id: 3,
      title: "SafeSpot",
      category: "seguridad-ciudadana",
      description: "Plataforma de seguridad ciudadana para reportar objetos robados, generar alertas y conectar a la comunidad en tiempo real.",
      clientNeed: "Dar a la comunidad una herramienta concreta para reportar, alertar y seguir casos de seguridad sin depender de canales fragmentados.",
      solutionSummary: "Creamos una plataforma web para reportes geolocalizados, alertas y seguimiento comunitario en tiempo real.",
      valueSummary: "La solucion mejora la velocidad de respuesta, ordena la informacion critica y fortalece la colaboracion entre usuarios.",
      features: [
        "Reportes de objetos robados geolocalizados",
        "Busqueda por categoria, zona y descripcion",
        "Alertas y notificaciones en tiempo real",
        "Canal comunitario para seguimiento de casos",
        "Panel administrable para moderacion y soporte"
      ],
      results: [
        { label: "Foco", value: "Seguridad 24/7" },
        { label: "Cobertura", value: "Comunidad activa" },
        { label: "Objetivo", value: "Recuperacion rapida" }
      ],
      image: "/safespot.png",
      detailsUrl: "/showroom",
      externalUrl: "https://safespot.tuweb-ai.com/"
    },
    {
      id: 4,
      title: "Trading TuWeb.ai",
      category: "saas",
      description: "Dashboard de trading para monitoreo de mercado, gestion de operaciones y seguimiento de rendimiento en tiempo real.",
      clientNeed: "Tomar decisiones con datos visibles y seguimiento continuo, sin dashboards confusos ni informacion fragmentada.",
      solutionSummary: "Desarrollamos un panel de trading con monitoreo de mercado, operaciones y rendimiento en una sola interfaz.",
      valueSummary: "El sistema mejora claridad operativa, velocidad de lectura y control diario sobre balances, riesgo y movimientos.",
      features: [
        "Panel de mercado con metricas en vivo",
        "Seguimiento de operaciones y posiciones",
        "Resumen de rendimiento y riesgo",
        "Vista clara de balances y movimientos",
        "Experiencia optimizada para toma de decisiones"
      ],
      results: [
        { label: "Visibilidad", value: "Tiempo real" },
        { label: "Control", value: "Operaciones 24/7" },
        { label: "Analisis", value: "Rendimiento continuo" }
      ],
      image: "/trading-tuwebai.png",
      detailsUrl: "/showroom",
      externalUrl: "https://trading.tuweb-ai.com/"
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
    saas: 'SaaS',
    'seguridad-ciudadana': 'Seguridad Ciudadana',
    muebleria: 'Mueblerías',
    'tienda-online': 'Tiendas Online',
    'salud-bienestar': 'Salud y Bienestar',
    'diseno-branding': 'Diseño y Branding',
    'turismo-exclusivo': 'Turismo Exclusivo',
    'educacion': 'Educación',
    'mascotas': 'Mascotas'
  };

  // Manejador de navegación para proyectos
  const handleProjectClick = (project: ShowroomProject) => {
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
      className="landing-anchor-section flex items-center justify-center relative py-20 bg-gradient-1"
    >
      
      <div className="container mx-auto px-4 z-10">
        <motion.div 
          ref={titleRef}
          className="text-center"
          initial="hidden"
          animate={hasShownTitle ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h2 className="font-rajdhani font-bold text-3xl md:text-5xl mb-4">
            <span className="gradient-text gradient-border inline-block pb-2">Casos reales pensados para negocio</span>
          </h2>
        </motion.div>
        
        <motion.div 
          ref={subtitleRef}
          className="text-center mb-12"
          initial="hidden"
          animate={hasShownSubtitle ? "visible" : "hidden"}
          variants={subtitleVariants}
        >
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Mira ejemplos de sitios, dashboards y plataformas web donde combinamos claridad comercial, operacion mas ordenada y una experiencia digital profesional.
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
          animate={hasShownProjects ? "visible" : "hidden"}
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
        
        {selectedProject && (
          <ShowroomProjectModal
            project={selectedProject}
            categoryLabel={categoryNames[selectedProject.category] || selectedProject.category}
            onClose={() => setSelectedProject(null)}
          />
        )}

        {/* Call to action */}
        <div className="text-center mt-14">
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Si buscas una solucion similar para tu negocio, podemos ayudarte a definir el mejor enfoque segun tu etapa, tus objetivos y la complejidad real del proyecto.
          </p>
          
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link 
              to="/consulta"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20"
            >
              Quiero una solucion similar
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


