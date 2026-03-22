import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/core/hooks/use-mobile";
import ScrollProgress from "@/shared/ui/scroll-progress";
import WhatsAppButton from "@/shared/ui/whatsapp-button";
import { TUWEBAI_WHATSAPP_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';
import "./uxui-page.css";

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

type WindowWithGlobalNav = Window & {
  isUsingGlobalNav?: boolean;
};

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
      description: "Entendemos a tus usuarios para diseñar experiencias claras y alineadas con objetivos reales de negocio.",
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
      description: "Transformamos ideas en interfaces intuitivas y atractivas que ordenan el recorrido y reflejan tu marca.",
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
      description: "Mejoramos interfaces para reducir fricción y aumentar consultas o ventas con métricas claras.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      features: [
        "Tests A/B",
        "Optimización de flujos clave",
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
      description: "Entendemos tu negocio, objetivos y usuarios para establecer las bases de un diseño efectivo y alineado a resultados.",
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
      description: "Creamos prototipos interactivos para validar decisiones antes del desarrollo.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )
    },
    {
      id: 6,
      title: "Testing y Mejora",
      description: "Evaluamos el diseño con usuarios reales para detectar y corregir problemas antes del lanzamiento.",
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
      title: "LH Decants - E-commerce Premium",
      description: "Diseño UX/UI para sitio web corporativo premium de perfumes y fragancias exclusivas, enfocado en la experiencia de compra y la elegancia de la marca.",
      challenge: "El cliente necesitaba un sitio web que reflejara la exclusividad de su marca y ofreciera una experiencia de compra simple.",
      solution: "Creamos una interfaz elegante con jerarquía clara y un flujo de compra ordenado.",
      results: [
        "Percepción de marca más sólida",
        "Recorrido de compra más claro",
        "Mejor lectura del catálogo",
        "Navegación más fluida"
      ],
      tags: ["E-commerce", "Diseño Premium", "Perfumes", "Lujo"],
      image: "/lhdecant-card.webp",
      mockups: [
        "/lhdecant-card.webp",
        "/lhdecant-card.webp"
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
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0f] animate-in fade-in slide-in-from-right duration-300">
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
    </div>
  );

  // Verificar si se está utilizando el navbar global
  const isUsingGlobalNav = (window as WindowWithGlobalNav).isUsingGlobalNav !== false;
  
  return (
    <>
      <MetaTags
        title="Diseño UX/UI Web"
        description="Diseño de interfaces web centradas en conversión. Wireframes, prototipos y diseño visual alineado al objetivo comercial del negocio."
        keywords="diseño UX UI web, interfaces que convierten, wireframes, prototipos, diseño visual, TuWebAI"
        url="https://tuweb-ai.com/uxui"
        ogType="website"
        ogImage="/logo-tuwebai.png"
      />
      <div className="uxui-page">
        <ScrollProgress color="#00CCFF" />
        <WhatsAppButton />
      
      {/* Header flotante para desktop y móvil (solo si no se usa GlobalNavbar) */}
      {!isUsingGlobalNav && (
        <>
          <header className="uxui-floating-header">
            <div className="container mx-auto">
              <div className="uxui-floating-header-inner">
                <Link to="/" className="uxui-wordmark">
                  TuWeb<span className="uxui-wordmark-accent">.ai</span>
                </Link>
                
                {isMobile ? (
                  <button onClick={() => setIsMenuOpen(true)} className="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                ) : (
                  <nav className="uxui-nav">
                    <button 
                      onClick={() => setActiveTab("servicios")}
                      className={`uxui-nav-link ${activeTab === "servicios" ? 'uxui-nav-link--active' : ''}`}
                    >
                      Servicios UX/UI
                    </button>
                    <button 
                      onClick={() => setActiveTab("procesos")}
                      className={`uxui-nav-link ${activeTab === "procesos" ? 'uxui-nav-link--active' : ''}`}
                    >
                      Nuestro Proceso
                    </button>
                    <button 
                      onClick={() => setActiveTab("proyectos")}
                      className={`uxui-nav-link ${activeTab === "proyectos" ? 'uxui-nav-link--active' : ''}`}
                    >
                      Proyectos
                    </button>
                    <button 
                      onClick={() => setActiveTab("contacto")}
                      className={`uxui-nav-link ${activeTab === "contacto" ? 'uxui-nav-link--active' : ''}`}
                    >
                      Contacto
                    </button>
                    <Link 
                      to="/consulta"
                      className="uxui-nav-cta"
                    >
                      Solicitar propuesta
                    </Link>
                  </nav>
                )}
              </div>
            </div>
          </header>
          
          {/* Menú móvil */}
          {isMenuOpen && renderMobileMenu()}
        </>
      )}
      
      {/* Hero Section */}
      <section className="uxui-hero animate-in fade-in duration-500">
        <div className="container mx-auto">
          <div className="uxui-hero-layout">
            <div className="uxui-hero-copy">
              <h1 className="uxui-hero-title animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="gradient-text">Diseño UX/UI</span> que <br />
                transforma visitantes <br />
                en clientes fieles
              </h1>
              
              <p className="uxui-hero-subtitle animate-in fade-in slide-in-from-bottom-2 duration-500">
                Creamos experiencias digitales intuitivas, atractivas y efectivas que encantan a tus usuarios y mejoran tus métricas de conversión.
              </p>
              
              <div className="uxui-hero-actions animate-in fade-in slide-in-from-bottom-2 duration-500">
                <button
                  onClick={() => setActiveTab("servicios")}
                  className="uxui-hero-primary"
                >
                  Explorar servicios
                </button>
                <button
                  onClick={() => setActiveTab("proyectos")}
                  className="uxui-hero-secondary"
                >
                  Ver proyectos
                </button>
              </div>
            </div>
            
            <div className="uxui-hero-visual animate-in fade-in zoom-in-95 duration-500">
              <div className="uxui-hero-visual-glow uxui-hero-visual-glow--main"></div>
              <div className="uxui-hero-visual-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div className="uxui-hero-visual-glow uxui-hero-visual-glow--top"></div>
              <div className="uxui-hero-visual-glow uxui-hero-visual-glow--bottom"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Servicios Section */}
      <section ref={serviciosRef} id="servicios" className="uxui-section">
        <div className="container mx-auto">
          <div className="uxui-section-heading animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="uxui-section-title">
              <span className="gradient-text">Servicios</span> de diseño UX/UI
            </h2>
            <p className="uxui-section-copy">
              Ofrecemos soluciones completas de experiencia de usuario para crear productos digitales que conectan con tus clientes y generan resultados.
            </p>
          </div>
          
          <div className="uxui-services-grid">
            {uxuiServices.map((service, index) => (
              <div
                key={service.id}
                className="uxui-service-frame animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="uxui-service-card">
                  <div className="uxui-service-icon">
                    <div className="text-white">
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="uxui-service-title">{service.title}</h3>
                  <p className="uxui-service-description">{service.description}</p>
                  
                  <div className="mt-auto">
                    <h4 className="uxui-service-meta-title">Incluye:</h4>
                    <ul className="uxui-service-list">
                      {service.features.map((feature, i) => (
                        <li key={i} className="uxui-service-list-item">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00CCFF] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Proceso Section */}
      <section ref={procesosRef} id="procesos" className="uxui-section uxui-section--alt">
        <div className="container mx-auto">
          <div className="uxui-section-heading animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="uxui-section-title">
              Nuestro <span className="gradient-text">proceso</span> de diseño
            </h2>
            <p className="uxui-section-copy">
              Seguimos una metodología ágil y centrada en el usuario para entregar diseños que superan expectativas.
            </p>
          </div>
          
          <div className="uxui-process-grid">
            {uxuiProcesses.map((process, index) => (
              <div
                key={process.id}
                className="uxui-process-item animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="uxui-process-step">
                  {process.id}
                </div>
                
                <div className="uxui-process-card">
                  <div className="uxui-process-header">
                    <div className="uxui-process-icon">
                      <div>
                        {process.icon}
                      </div>
                    </div>
                    <h3 className="uxui-process-title">{process.title}</h3>
                  </div>
                  
                  <p className="uxui-process-description">{process.description}</p>
                </div>
                
                {index < uxuiProcesses.length - 1 && !isMobile && (
                  <div className="uxui-process-connector">
                    <div className="uxui-process-connector-line"></div>
                    <div className="uxui-process-connector-dot"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Proyectos Section */}
      <section ref={proyectosRef} id="proyectos" className="py-20 px-4 bg-[#0a0a0f]">
        <div className="container mx-auto">
          <div className="mx-auto mb-16 max-w-3xl text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-3xl md:text-4xl font-rajdhani font-bold mb-4">
              <span className="gradient-text">Proyectos</span> destacados
            </h2>
            <p className="text-gray-300 text-lg">
              Diseños que transforman negocios y generan resultados medibles para nuestros clientes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uxuiProjects.map((project, index) => (
              <div
                key={project.id}
                className="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-[#121217] transition-transform duration-200 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
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
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section ref={contactoRef} id="contacto" className="uxui-section uxui-section--cta">
        <div className="container mx-auto">
          <div className="uxui-cta-card animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="uxui-cta-header">
              <h2 className="uxui-cta-title gradient-text">
                Transformá la experiencia de tus usuarios
              </h2>
              <p className="uxui-cta-copy">
                Convertí visitas en acciones concretas con interfaces claras y efectivas.
              </p>
            </div>
            
            <div className="uxui-cta-actions">
              <Link 
                to="/consulta"
                className="uxui-cta-primary"
              >
                Solicitá tu proyecto UX/UI
              </Link>
              <a 
                href={`${TUWEBAI_WHATSAPP_URL}?text=Hola,%20estoy%20interesado%20en%20sus%20servicios%20de%20UX/UI`}
                target="_blank"
                rel="noopener noreferrer"
                className="uxui-cta-secondary"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Modal de proyecto */}
      {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8 animate-in fade-in duration-300"
            onClick={closeProjectModal}
          >
            <div
              className="w-full max-w-4xl overflow-hidden rounded-xl bg-[#121217] animate-in fade-in zoom-in-95 duration-300"
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
                        className="text-xs px-3 py-1 bg-black/50 lg:backdrop-blur-sm rounded-full text-white"
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
            </div>
          </div>
        )}
      </div>
    </>
  );
}

