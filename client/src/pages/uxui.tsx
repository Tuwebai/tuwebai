import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import ScrollProgress from "@/components/ui/scroll-progress";

// Tipos para proyectos UX/UI
interface UXUIProject {
  id: number;
  title: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  tags: string[];
  image: string;
  mockups: string[];
}

// Tipos para servicios UX/UI
interface UXUIService {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

// Tipos para procesos UX/UI
interface UXUIProcess {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function UXUI() {
  const [activeTab, setActiveTab] = useState<string>("servicios");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<UXUIProject | null>(null);
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0);
  const isMobile = useIsMobile();
  
  // Referencias para scroll
  const serviciosRef = useRef<HTMLDivElement>(null);
  const procesosRef = useRef<HTMLDivElement>(null);
  const proyectosRef = useRef<HTMLDivElement>(null);
  const contactoRef = useRef<HTMLDivElement>(null);
  
  // Efecto para scroll a sección en cambio de tab
  useEffect(() => {
    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
      if (ref.current) {
        const yOffset = -80; // Ajuste para el header
        const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };
    
    if (activeTab === "servicios") scrollToSection(serviciosRef);
    if (activeTab === "procesos") scrollToSection(procesosRef);
    if (activeTab === "proyectos") scrollToSection(proyectosRef);
    if (activeTab === "contacto") scrollToSection(contactoRef);
  }, [activeTab]);
  
  // Datos de servicios UX/UI
  const uxuiServices: UXUIService[] = [
    {
      id: 1,
      title: "Investigación UX",
      description: "Entendemos a tus usuarios para diseñar experiencias que conecten emocionalmente y resuelvan sus necesidades reales.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      features: [
        "Entrevistas a usuarios",
        "Tests de usabilidad",
        "Mapas de calor y recorridos",
        "Análisis de competencia",
        "Encuestas y feedback"
      ]
    },
    {
      id: 2,
      title: "Diseño de Interfaz",
      description: "Transformamos ideas en interfaces intuitivas y atractivas que destacan tu marca y mantienen a tus usuarios comprometidos.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      features: [
        "Wireframes y prototipos",
        "Sistemas de diseño",
        "Guías de estilo visual",
        "Animaciones e interacciones",
        "Diseño responsive"
      ]
    },
    {
      id: 3,
      title: "Optimización de Conversión",
      description: "Mejoramos continuamente tus interfaces para maximizar las conversiones y el retorno de inversión mediante pruebas y análisis.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      features: [
        "Tests A/B",
        "Optimización de flujos de conversión",
        "Mejora de tasas de abandono",
        "Análisis de comportamiento",
        "Métricas e informes"
      ]
    }
  ];
  
  // Datos de procesos UX/UI
  const uxuiProcesses: UXUIProcess[] = [
    {
      id: 1,
      title: "Descubrimiento",
      description: "Entendemos tu negocio, objetivos y usuarios para establecer las bases de un diseño efectivo y alineado con tus necesidades.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Investigación UX",
      description: "Analizamos a tus usuarios y la competencia para identificar oportunidades de mejora y necesidades no cubiertas.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Diseño de Wireframes",
      description: "Creamos la estructura y arquitectura de información de la interfaz, definiendo el flujo y la jerarquía visual.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Diseño Visual",
      description: "Desarrollamos interfaces atractivas con una identidad visual coherente que refuerza tu marca y guía al usuario.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    {
      id: 5,
      title: "Prototipado",
      description: "Creamos prototipos interactivos que simulan la experiencia real del usuario para validar y refinar el diseño.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )
    },
    {
      id: 6,
      title: "Testing y Mejora",
      description: "Evaluamos continuamente el diseño con usuarios reales para identificar y corregir problemas, optimizando la experiencia.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];
  
  // Datos de proyectos UX/UI
  const uxuiProjects: UXUIProject[] = [
    {
      id: 1,
      title: "Rediseño app bancaria",
      description: "Rediseño completo de la experiencia de usuario para una app bancaria enfocada en mejorar la accesibilidad y usabilidad.",
      challenge: "El cliente buscaba modernizar su app bancaria que tenía altas tasas de abandono y malas valoraciones por su complejidad de uso y diseño anticuado.",
      solution: "Realizamos un estudio completo de usabilidad con más de 50 usuarios identificando puntos de fricción. Rediseñamos la arquitectura de información y creamos una nueva interfaz centrada en la simplicidad y velocidad de las operaciones más comunes.",
      results: [
        "Reducción del 45% en las llamadas al soporte técnico",
        "Aumento del 60% en transacciones completadas",
        "Mejora de calificación en stores de 2.3 a 4.7 estrellas",
        "Incremento del 35% en usuarios activos mensuales"
      ],
      tags: ["Fintech", "App Móvil", "UX Research", "UI Design"],
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      mockups: [
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      ]
    },
    {
      id: 2,
      title: "Plataforma educativa online",
      description: "Diseño de experiencia de usuario para una plataforma educativa que facilita el aprendizaje remoto y la interacción entre estudiantes y profesores.",
      challenge: "La plataforma educativa existente presentaba problemas de navegación y dificultad para seguir el progreso de los estudiantes, lo que afectaba la retención y el engagement.",
      solution: "Desarrollamos un sistema intuitivo de seguimiento de progreso, rediseñamos la navegación principal basada en investigación con usuarios, e incorporamos elementos de gamificación para aumentar la motivación.",
      results: [
        "Incremento del 75% en la tasa de finalización de cursos",
        "Aumento del 40% en el tiempo de permanencia en la plataforma",
        "Reducción del 50% en el tiempo de aprendizaje de uso",
        "Crecimiento del 80% en interacciones entre estudiantes"
      ],
      tags: ["E-learning", "Diseño Web", "Gamificación", "Usabilidad"],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      mockups: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1590402494587-44b71d7772f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      ]
    },
    {
      id: 3,
      title: "E-commerce de moda sostenible",
      description: "Diseño UX/UI para una tienda online de moda sostenible con enfoque en la experiencia de compra y conciencia ambiental.",
      challenge: "El cliente necesitaba una tienda online que comunicara eficazmente sus valores de sostenibilidad mientras ofrecía una experiencia de compra fluida y atractiva.",
      solution: "Creamos una interfaz que destaca la historia detrás de cada prenda y su impacto ambiental positivo. Optimizamos el embudo de conversión y simplificamos el proceso de checkout para aumentar las ventas.",
      results: [
        "Aumento del 65% en la tasa de conversión",
        "Reducción del 45% en el abandono del carrito",
        "Incremento del 30% en el valor promedio de compra",
        "80% de los usuarios valoran positivamente la información de sostenibilidad"
      ],
      tags: ["E-commerce", "Sostenibilidad", "Diseño Responsivo", "CRO"],
      image: "https://images.unsplash.com/photo-1507553532144-b9df5e38c8d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      mockups: [
        "https://images.unsplash.com/photo-1507553532144-b9df5e38c8d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      ]
    }
  ];
  
  // Función para abrir el modal de proyecto
  const openProjectModal = (project: UXUIProject) => {
    setSelectedProject(project);
    setCurrentMockupIndex(0);
  };
  
  // Función para cerrar el modal de proyecto
  const closeProjectModal = () => {
    setSelectedProject(null);
  };
  
  // Navegación entre mockups del proyecto
  const nextMockup = () => {
    if (selectedProject) {
      setCurrentMockupIndex((prevIndex) => 
        prevIndex < selectedProject.mockups.length - 1 ? prevIndex + 1 : 0
      );
    }
  };
  
  const prevMockup = () => {
    if (selectedProject) {
      setCurrentMockupIndex((prevIndex) => 
        prevIndex > 0 ? prevIndex - 1 : selectedProject.mockups.length - 1
      );
    }
  };
  
  // Renderizar componentes de navegación móvil
  const renderMobileMenu = () => (
    <motion.div
      className={`fixed inset-0 bg-[#0a0a0f] z-50 flex flex-col ${isMenuOpen ? 'block' : 'hidden'}`}
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : "100%" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <Link to="/" className="text-2xl font-rajdhani font-bold">
          TuWeb<span className="text-[#00CCFF]">.ai</span>
        </Link>
        <button onClick={() => setIsMenuOpen(false)} className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col p-4 space-y-4">
        <button 
          onClick={() => { setActiveTab("servicios"); setIsMenuOpen(false); }}
          className={`p-3 rounded-lg text-left ${activeTab === "servicios" ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 text-white' : 'text-gray-400'}`}
        >
          Servicios UX/UI
        </button>
        <button 
          onClick={() => { setActiveTab("procesos"); setIsMenuOpen(false); }}
          className={`p-3 rounded-lg text-left ${activeTab === "procesos" ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 text-white' : 'text-gray-400'}`}
        >
          Nuestro Proceso
        </button>
        <button 
          onClick={() => { setActiveTab("proyectos"); setIsMenuOpen(false); }}
          className={`p-3 rounded-lg text-left ${activeTab === "proyectos" ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 text-white' : 'text-gray-400'}`}
        >
          Proyectos
        </button>
        <button 
          onClick={() => { setActiveTab("contacto"); setIsMenuOpen(false); }}
          className={`p-3 rounded-lg text-left ${activeTab === "contacto" ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 text-white' : 'text-gray-400'}`}
        >
          Contacto
        </button>
      </div>
      <div className="mt-auto p-4 border-t border-gray-800">
        <Link 
          to="/consulta"
          className="block w-full py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium text-center"
          onClick={() => setIsMenuOpen(false)}
        >
          Solicitar propuesta
        </Link>
      </div>
    </motion.div>
  );

  // Verificar si se está utilizando el navbar global
  const isUsingGlobalNav = (window as any).isUsingGlobalNav !== false;
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <ScrollProgress color="#00CCFF" />
      <WhatsAppButton />
      
      {/* Header flotante para desktop y móvil (solo si no se usa GlobalNavbar) */}
      {!isUsingGlobalNav && (
        <>
          <header className="fixed top-0 left-0 right-0 bg-[#0a0a0f]/90 backdrop-blur-sm z-40 border-b border-gray-800">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link to="/" className="text-2xl font-rajdhani font-bold">
                  TuWeb<span className="text-[#00CCFF]">.ai</span>
                </Link>
                
                {isMobile ? (
                  <button onClick={() => setIsMenuOpen(true)} className="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                ) : (
                  <nav className="flex items-center space-x-6">
                    <button 
                      onClick={() => setActiveTab("servicios")}
                      className={`text-sm font-medium transition-colors ${activeTab === "servicios" ? 'text-[#00CCFF]' : 'text-gray-300 hover:text-white'}`}
                    >
                      Servicios UX/UI
                    </button>
                    <button 
                      onClick={() => setActiveTab("procesos")}
                      className={`text-sm font-medium transition-colors ${activeTab === "procesos" ? 'text-[#00CCFF]' : 'text-gray-300 hover:text-white'}`}
                    >
                      Nuestro Proceso
                    </button>
                    <button 
                      onClick={() => setActiveTab("proyectos")}
                      className={`text-sm font-medium transition-colors ${activeTab === "proyectos" ? 'text-[#00CCFF]' : 'text-gray-300 hover:text-white'}`}
                    >
                      Proyectos
                    </button>
                    <button 
                      onClick={() => setActiveTab("contacto")}
                      className={`text-sm font-medium transition-colors ${activeTab === "contacto" ? 'text-[#00CCFF]' : 'text-gray-300 hover:text-white'}`}
                    >
                      Contacto
                    </button>
                    <Link 
                      to="/consulta"
                      className="ml-6 px-5 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white text-sm font-medium shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30 transition-all"
                    >
                      Solicitar propuesta
                    </Link>
                  </nav>
                )}
              </div>
            </div>
          </header>
          
          {/* Menú móvil */}
          {renderMobileMenu()}
        </>
      )}
      
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-b from-[#0f0f19] to-[#0a0a0f] pt-32 pb-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="max-w-2xl lg:mr-8 mb-10 lg:mb-0">
              <motion.h1 
                className="text-4xl md:text-6xl font-rajdhani font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="gradient-text">Diseño UX/UI</span> que <br />
                transforma visitantes <br />
                en clientes fieles
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Creamos experiencias digitales intuitivas, atractivas y efectivas que encantan a tus usuarios y mejoran tus métricas de conversión.
              </motion.p>
              
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button
                  onClick={() => setActiveTab("servicios")}
                  className="px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30 transition-all"
                >
                  Explorar servicios
                </button>
                <button
                  onClick={() => setActiveTab("proyectos")}
                  className="px-6 py-3 bg-transparent border border-gray-700 rounded-lg text-white font-medium hover:bg-white/5 transition-all"
                >
                  Ver proyectos
                </button>
              </motion.div>
            </div>
            
            <motion.div 
              className="w-full max-w-md h-80 lg:h-96 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00CCFF]/30 to-[#9933FF]/30 rounded-2xl blur-2xl opacity-30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div className="absolute -top-4 -right-4 h-32 w-32 bg-gradient-to-br from-[#9933FF]/20 to-[#00CCFF]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-gradient-to-br from-[#00CCFF]/20 to-[#9933FF]/20 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Servicios Section */}
      <section ref={serviciosRef} id="servicios" className="py-20 px-4 bg-[#0a0a0f]">
        <div className="container mx-auto">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-rajdhani font-bold mb-4">
              <span className="gradient-text">Servicios</span> de diseño UX/UI
            </h2>
            <p className="text-gray-300 text-lg">
              Ofrecemos soluciones completas de experiencia de usuario para crear productos digitales que conectan con tus clientes y generan resultados.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uxuiServices.map((service, index) => (
              <motion.div
                key={service.id}
                className="bg-gradient-to-br from-[#00CCFF]/10 to-[#9933FF]/10 rounded-xl p-[1px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <div className="bg-[#121217] rounded-xl p-6 h-full flex flex-col">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                    <div className="text-white">
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-rajdhani font-bold mb-3 text-white">{service.title}</h3>
                  <p className="text-gray-300 mb-6 flex-grow">{service.description}</p>
                  
                  <div className="mt-auto">
                    <h4 className="font-medium text-white text-sm mb-2">Incluye:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00CCFF] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Proceso Section */}
      <section ref={procesosRef} id="procesos" className="py-20 px-4 bg-[#0c0c14]">
        <div className="container mx-auto">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-rajdhani font-bold mb-4">
              Nuestro <span className="gradient-text">proceso</span> de diseño
            </h2>
            <p className="text-gray-300 text-lg">
              Seguimos una metodología ágil y centrada en el usuario para entregar diseños que superan expectativas.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
            {uxuiProcesses.map((process, index) => (
              <motion.div
                key={process.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <div className="absolute -top-8 left-0 w-8 h-8 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full flex items-center justify-center text-white font-bold">
                  {process.id}
                </div>
                
                <div className="bg-[#121217] rounded-xl p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 flex items-center justify-center mr-3">
                      <div className="text-[#00CCFF]">
                        {process.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-rajdhani font-bold text-white">{process.title}</h3>
                  </div>
                  
                  <p className="text-gray-300">{process.description}</p>
                </div>
                
                {index < uxuiProcesses.length - 1 && !isMobile && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-16 h-1">
                    <div className="h-0.5 w-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF]"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-2 w-2 rounded-full bg-[#9933FF]"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Proyectos Section */}
      <section ref={proyectosRef} id="proyectos" className="py-20 px-4 bg-[#0a0a0f]">
        <div className="container mx-auto">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-rajdhani font-bold mb-4">
              <span className="gradient-text">Proyectos</span> destacados
            </h2>
            <p className="text-gray-300 text-lg">
              Diseños que transforman negocios y generan resultados medibles para nuestros clientes.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uxuiProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-[#121217] rounded-xl overflow-hidden cursor-pointer h-full flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => openProjectModal(project)}
              >
                <div 
                  className="h-48 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.image})` }}
                >
                  <div className="h-full w-full bg-gradient-to-t from-[#121217] via-[#121217]/60 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-xl font-rajdhani font-bold text-white mb-1">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 2).map((tag, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-1 bg-[#1a1a23] rounded text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-[#1a1a23] rounded text-gray-300">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-800">
                    <button className="text-[#00CCFF] text-sm font-medium flex items-center">
                      Ver detalles
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section ref={contactoRef} id="contacto" className="py-20 px-4 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f19]">
        <div className="container mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto bg-[#121217] rounded-xl p-8 border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-rajdhani font-bold mb-4 gradient-text">
                Transformá la experiencia de tus usuarios
              </h2>
              <p className="text-xl text-gray-300">
                Convertí visitantes en usuarios leales con interfaces que enamoran desde el primer click.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/consulta"
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30 transition-all text-center"
              >
                Solicitá tu proyecto UX/UI
              </Link>
              <a 
                href="https://wa.me/5492215688349?text=Hola,%20estoy%20interesado%20en%20sus%20servicios%20de%20UX/UI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 border border-[#9933FF] rounded-lg text-[#9933FF] font-medium hover:bg-[#9933FF]/10 transition-all text-center"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Modal de proyecto */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
            onClick={closeProjectModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-[#121217] max-w-4xl w-full rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80 overflow-hidden">
                {selectedProject.mockups.length > 0 && (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${selectedProject.mockups[currentMockupIndex]})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121217] to-transparent"></div>
                    </div>
                    
                    {selectedProject.mockups.length > 1 && (
                      <>
                        <button 
                          onClick={prevMockup}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button 
                          onClick={nextMockup}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {selectedProject.mockups.map((_, i) => (
                            <button 
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentMockupIndex(i);
                              }}
                              className={`h-2 w-2 rounded-full ${
                                i === currentMockupIndex 
                                  ? 'bg-[#00CCFF]' 
                                  : 'bg-white/50 hover:bg-white/80'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
                
                <button
                  onClick={closeProjectModal}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="absolute bottom-6 left-6">
                  <h2 className="text-2xl md:text-3xl font-rajdhani font-bold text-white mb-2">{selectedProject.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="text-xs px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-2">El desafío</h3>
                  <p className="text-gray-300">{selectedProject.challenge}</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-2">Nuestra solución</h3>
                  <p className="text-gray-300">{selectedProject.solution}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Resultados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.results.map((result, i) => (
                      <div key={i} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00CCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-gray-300">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}