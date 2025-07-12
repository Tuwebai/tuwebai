import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
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

  // Proyectos de muestra
  const projects: Project[] = [
    {
      id: 1,
      title: "E-commerce Moda",
      category: "e-commerce",
      description: "Tienda online de moda con diseño atractivo, integración de pasarela de pagos, y gestión de inventario en tiempo real.",
      features: [
        "Catálogo de productos",
        "Pasarela de pagos",
        "Gestión de inventario",
        "Panel de administración",
        "Analíticas de ventas"
      ],
      results: [
        { label: "Tasa de conversión", value: "+127%" },
        { label: "Tiempo de carga", value: "0.8s" },
        { label: "Ventas mensuales", value: "+45%" }
      ],
      image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      detailsUrl: "/ecommerce-moda"
    },
    {
      id: 2,
      title: "Plataforma Educativa",
      category: "plataforma",
      description: "Sistema completo de cursos online con funcionalidades para profesores y estudiantes, incluyendo gestión de contenidos y analíticas.",
      features: [
        "Videoconferencias integradas",
        "Sistema de evaluación",
        "Foros de discusión",
        "Material descargable",
        "Certificados digitales"
      ],
      results: [
        { label: "Retención", value: "+68%" },
        { label: "Participación", value: "+95%" },
        { label: "Finalización", value: "87%" }
      ],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
      detailsUrl: "/plataforma-educativa"
    },
    {
      id: 3,
      title: "Web Corporativa Premium",
      category: "web",
      description: "Sitio web corporativo con diseño personalizado, optimización SEO y animaciones avanzadas para destacar los valores de marca.",
      features: [
        "Diseño premium responsive",
        "Optimización SEO avanzada",
        "Integración CRM",
        "Blog corporativo",
        "Analítica avanzada"
      ],
      results: [
        { label: "Leads", value: "+125%" },
        { label: "Tiempo en página", value: "+45%" },
        { label: "Tasa de rebote", value: "-30%" }
      ],
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      detailsUrl: "/corporativo-premium"
    },
    {
      id: 4,
      title: "App de Reservas Restaurantes",
      category: "app",
      description: "Aplicación web progresiva (PWA) para cadena de restaurantes que permite gestionar reservas en tiempo real y pedidos online.",
      features: [
        "Reservas en tiempo real",
        "Integración con TPV",
        "Pedidos online",
        "Sistema de notificaciones",
        "Programa de fidelización"
      ],
      results: [
        { label: "Reservas online", value: "+340%" },
        { label: "Ticket medio", value: "+18%" },
        { label: "Usuarios recurrentes", value: "72%" }
      ],
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      detailsUrl: "/app-restaurantes"
    },
    {
      id: 5,
      title: "Portal Inmobiliario",
      category: "plataforma",
      description: "Plataforma inmobiliaria con búsqueda avanzada de propiedades, tours virtuales y sistema de gestión para agentes.",
      features: [
        "Búsqueda geolocalizada",
        "Tours virtuales 360°",
        "Comparador de propiedades",
        "CRM para agentes",
        "Alertas de nuevas propiedades"
      ],
      results: [
        { label: "Conversiones", value: "+85%" },
        { label: "Tiempo de búsqueda", value: "-40%" },
        { label: "Propiedades vistas", value: "+190%" }
      ],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80",
      detailsUrl: "/portal-inmobiliario"
    },
    {
      id: 6,
      title: "Marketing Automation B2B",
      category: "marketing",
      description: "Implementación de estrategia completa de automatización de marketing para empresa B2B de servicios tecnológicos.",
      features: [
        "Lead scoring avanzado",
        "Workflows automatizados",
        "Segmentación por industria",
        "Integración con CRM",
        "Reporting automatizado"
      ],
      results: [
        { label: "Leads cualificados", value: "+210%" },
        { label: "Ciclo de venta", value: "-35%" },
        { label: "ROI marketing", value: "12.5x" }
      ],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1115&q=80",
      detailsUrl: "/marketing-b2b"
    },
    {
      id: 7,
      title: "Ropa Urbana Moderna",
      category: "e-commerce",
      description: "Marca joven de moda urbana con diseño exclusivo y tienda online integrada con pasarela de pagos, stock en tiempo real y catálogo dinámico.",
      features: [
        "Diseño minimalista y moderno",
        "Slider de productos destacados",
        "Catálogo por categorías",
        "Carrito funcional",
        "Estilo dark con acentos en neón"
      ],
      results: [
        { label: "Conversión", value: "4.2%" },
        { label: "Ventas móviles", value: "+75%" },
        { label: "Retorno visitas", value: "68%" }
      ],
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80",
      detailsUrl: "/ropaurbana"
    },
    {
      id: 8,
      title: "Muebles Minimalistas",
      category: "muebleria",
      description: "Tienda de muebles de diseño contemporáneo, con catálogo interactivo, sección de inspiración y contacto personalizado.",
      features: [
        "Catálogo por ambientes",
        "Sección 'Inspiración'",
        "Carrusel de ambientes reales",
        "Página de contacto con mapa",
        "Diseño limpio con paleta clara"
      ],
      results: [
        { label: "Tiempo en página", value: "+62%" },
        { label: "Contactos", value: "+95%" },
        { label: "Visualizaciones", value: "4.3x" }
      ],
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      detailsUrl: "/muebles"
    },
    {
      id: 9,
      title: "Dulce Tentación",
      category: "tienda-online",
      description: "Sitio alegre para venta de golosinas artesanales, con promociones, sección de productos y experiencia visual divertida.",
      features: [
        "Diseño colorido y amigable",
        "Grid de productos con precios",
        "Sección 'Promos del mes'",
        "Animaciones interactivas",
        "Integración con redes sociales"
      ],
      results: [
        { label: "Ventas online", value: "+185%" },
        { label: "Tiempo en sitio", value: "+73%" },
        { label: "Tasa de rebote", value: "-45%" }
      ],
      image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      detailsUrl: "/dulce"
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
    web: 'Web Corporativa',
    'e-commerce': 'E-commerce',
    app: 'Aplicaciones',
    plataforma: 'Plataformas',
    marketing: 'Marketing',
    muebleria: 'Mueblerías',
    'tienda-online': 'Tiendas Online'
  };

  return (
    <section 
      id="showroom" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative py-20 bg-gradient-1"
    >
      <AnimatedShape type={2} className="top-[20%] right-[-150px]" delay={2} />
      
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
              onClick={() => setSelectedProject(project)}
              variants={projectVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white font-medium text-sm">Vista Previa</span>
                </div>
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
                    window.location.href = project.detailsUrl;
                  }}
                  className="flex items-center text-[#00CCFF] text-sm font-medium hover:text-[#9933FF] transition-colors bg-transparent border-0 p-0 cursor-pointer"
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
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-[#121217] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
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
                    <button 
                      onClick={() => window.location.href = selectedProject.detailsUrl}
                      className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium border-0 cursor-pointer"
                    >
                      Ver página completa
                    </button>
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
            <a 
              href="/consulta"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20"
            >
              Solicitar una consulta
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}