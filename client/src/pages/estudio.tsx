import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useScroll } from 'framer-motion';
import MetaTags from '@/components/seo/meta-tags';

type ProjectCategory = 'todos' | 'branding' | 'diseño-web' | 'ilustracion' | 'editorial';

interface Project {
  id: number;
  title: string;
  client: string;
  category: ProjectCategory;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  services: string[];
  featured?: boolean;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  details: string[];
}

export default function Estudio() {
  // Estados
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('todos');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    message: '',
    attachment: null as File | null
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Referencias
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  
  // Animaciones
  const controlsHero = useAnimation();
  const controlsShowcase = useAnimation();
  
  // Efectos para animaciones al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
    
    controlsHero.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    });
    
    controlsShowcase.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.3, ease: "easeOut" }
    });
    
    // Función para manejar el movimiento del cursor personalizado
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && cursorDotRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        
        // Con un pequeño retraso para el punto interno
        setTimeout(() => {
          if (cursorDotRef.current) {
            cursorDotRef.current.style.left = `${e.clientX}px`;
            cursorDotRef.current.style.top = `${e.clientY}px`;
          }
        }, 50);
      }
    };
    
    // Agregar evento de movimiento de mouse
    document.addEventListener('mousemove', handleMouseMove);
    
    // Limpiar evento al desmontar
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Datos de proyectos
  const projects: Project[] = [
    {
      id: 1,
      title: "LH Decants - E-commerce Premium",
      client: "LH Decants",
      category: "diseño-web",
      description: "Sitio web corporativo premium para empresa de perfumes y fragancias exclusivas.",
      fullDescription: "Desarrollamos un sitio web corporativo premium para LH Decants, especialistas en decants de perfumes exclusivos. El proyecto incluyó diseño UX/UI sofisticado, optimización del embudo de conversión, integración de e-commerce y estrategia de marca premium que refleja la exclusividad de sus productos.",
      image: "/lhdecant-card.png",
      images: [
        "/lhdecant-card.png",
        "/lhdecant-card.png",
        "/lhdecant-card.png"
      ],
      services: ["UX/UI Design", "Desarrollo Frontend", "E-commerce", "SEO", "Optimización móvil", "Branding"],
      featured: true
    },
    {
      id: 2,
      title: "LH Decants - Branding y Identidad",
      client: "LH Decants",
      category: "branding",
      description: "Desarrollo de identidad visual premium para marca de perfumes exclusivos.",
      fullDescription: "Creamos una identidad visual sofisticada y elegante para LH Decants que comunica la exclusividad y calidad premium de sus decants de perfumes. El sistema incluye logo, paleta cromática, tipografías y aplicaciones de marca que reflejan la elegancia del mundo de las fragancias.",
      image: "/lhdecant-card.png",
      images: [
        "/lhdecant-card.png",
        "/lhdecant-card.png",
        "/lhdecant-card.png"
      ],
      services: ["Estrategia de marca", "Diseño de logo", "Sistema de identidad", "Aplicaciones de marca", "Brand Guidelines"]
    },
    {
      id: 3,
      title: "LH Decants - Experiencia de Usuario",
      client: "LH Decants",
      category: "diseño-web",
      description: "Optimización de la experiencia de compra para e-commerce de perfumes premium.",
      fullDescription: "Rediseñamos la experiencia de usuario completa del sitio web de LH Decants, focalizando en la simplicidad del proceso de compra, la presentación elegante de productos y la optimización del embudo de conversión para maximizar las ventas de productos premium.",
      image: "/lhdecant-card.png",
      images: [
        "/lhdecant-card.png",
        "/lhdecant-card.png",
        "/lhdecant-card.png"
      ],
      services: ["UX Research", "UI Design", "Optimización conversión", "Testing de usabilidad", "Analytics"]
    }
  ];
  
  // Datos de servicios ofrecidos
  const services: Service[] = [
    {
      id: 1,
      title: "Branding y Estrategia",
      description: "Desarrollamos identidades de marca memorables que conectan con tu audiencia y transmiten tus valores esenciales.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      price: "Desde $2,500",
      details: [
        "Estrategia de marca",
        "Diseño de logotipo",
        "Sistema de identidad visual",
        "Manual de marca",
        "Aplicaciones",
        "Consultoría estratégica"
      ]
    },
    {
      id: 2,
      title: "Diseño Web y UI/UX",
      description: "Creamos experiencias digitales atractivas y funcionales que cautivan a los usuarios y generan resultados.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      price: "Desde $3,200",
      details: [
        "UX Research",
        "Wireframing y prototipos",
        "Diseño de interfaz",
        "Desarrollo frontend",
        "Optimización móvil",
        "SEO y rendimiento"
      ]
    },
    {
      id: 3,
      title: "Ilustración y Animación",
      description: "Damos vida a tus ideas con ilustraciones personalizadas y animaciones que capturan la atención y comunican tu mensaje.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      price: "Desde $1,800",
      details: [
        "Ilustración digital",
        "Ilustración 3D",
        "Animación y motion graphics",
        "Storyboarding",
        "Personajes y mascotas",
        "Infografías"
      ]
    },
    {
      id: 4,
      title: "Diseño Editorial",
      description: "Creamos publicaciones impresas y digitales que combinan estética y funcionalidad para una experiencia de lectura excepcional.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      price: "Desde $2,000",
      details: [
        "Revistas y catálogos",
        "Libros y ebooks",
        "Reportes anuales",
        "Maquetación",
        "Dirección de arte",
        "Preparación para imprenta"
      ]
    }
  ];
  
  // Filtrar proyectos según la categoría activa
  const filteredProjects = activeCategory === 'todos' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);
  
  // Proyectos destacados
  const featuredProjects = projects.filter(project => project.featured);
  
  // Función para mostrar notificaciones
  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotificationMessage('¡Gracias por contactarnos! Te responderemos a la brevedad.');
    setContactForm({
      name: '',
      email: '',
      company: '',
      service: '',
      budget: '',
      message: '',
      attachment: null
    });
  };
  
  // Función para actualizar el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Función para manejar archivos adjuntos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContactForm(prev => ({ ...prev, attachment: e.target.files ? e.target.files[0] : null }));
    }
  };
  
  // Function para alternar la selección de proyectos
  const toggleProjectSelection = (project: Project) => {
    if (selectedProject && selectedProject.id === project.id) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };
  
  return (
    <div className="relative font-sans text-gray-900 overflow-x-hidden bg-gray-50">
      {/* Metadatos SEO */}
      <MetaTags
        title="TuWeb.ai - Agencia de Diseño y Desarrollo Web"
        description="Somos una agencia especializada en diseño web, desarrollo frontend, branding y marketing digital. Creamos soluciones digitales impactantes para empresas innovadoras."
        keywords="diseño web, desarrollo frontend, branding, marketing digital, agencia digital, identidad de marca"
        type="article"
      />
      
      {/* Cursor personalizado */}
      <div ref={cursorRef} className="fixed w-8 h-8 rounded-full border-2 border-black mix-blend-difference z-50 pointer-events-none" style={{ transform: 'translate(-50%, -50%)', transition: 'transform 0.1s ease-out' }}></div>
      <div ref={cursorDotRef} className="fixed w-2 h-2 rounded-full bg-black mix-blend-difference z-50 pointer-events-none" style={{ transform: 'translate(-50%, -50%)', transition: 'transform 0.2s ease-out' }}></div>
      
      {/* Botón Volver a Proyectos */}
      <div className="fixed left-5 z-50" style={{ top: '80px' }}>
        <Link 
          to="/#showroom" 
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-full text-white border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Volver a Proyectos</span>
        </Link>
      </div>
      
      {/* Notificación */}
      {showNotification && (
        <motion.div 
          className="fixed top-5 right-5 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          {notificationMessage}
        </motion.div>
      )}
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-40 backdrop-blur-sm bg-opacity-90 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Estudio<span className="text-blue-500">Creativo</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#portfolio" className="text-gray-600 hover:text-gray-900 transition-colors text-sm uppercase tracking-wide">Portfolio</a>
            <a href="#servicios" className="text-gray-600 hover:text-gray-900 transition-colors text-sm uppercase tracking-wide">Servicios</a>
            <a href="#proceso" className="text-gray-600 hover:text-gray-900 transition-colors text-sm uppercase tracking-wide">Proceso</a>
            <a href="#contacto" className="text-gray-600 hover:text-gray-900 transition-colors text-sm uppercase tracking-wide">Contacto</a>
          </nav>
          
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section - Contenido principal para accesibilidad */}
      <section ref={heroSectionRef} id="main-content" className="pt-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={controlsHero}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Transformamos ideas en<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">experiencias visuales.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Estudio de diseño multidisciplinario especializado en branding, diseño web, ilustración y experiencias digitales únicas.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="#portfolio" 
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
              >
                Ver Portafolio
              </a>
              <a 
                href="#contacto" 
                className="px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Solicitar Presupuesto
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Portfolio Showcase Section */}
      <section id="portfolio" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={controlsShowcase}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestro Portafolio</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explorá nuestros proyectos destacados y descubrí cómo ayudamos a nuestros clientes a destacarse visualmente.
            </p>
          </motion.div>
          
          {/* Filtros de categorías */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 p-1 rounded-full">
              {(['todos', 'branding', 'diseño-web', 'ilustracion', 'editorial'] as ProjectCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category === 'todos' 
                    ? 'Todos' 
                    : category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
          
          {/* Grid de proyectos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div 
                key={project.id}
                className={`group overflow-hidden rounded-xl ${
                  selectedProject && selectedProject.id === project.id 
                    ? 'col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 bg-white shadow-lg'
                    : 'relative h-80 bg-gray-200'
                }`}
                layoutId={`project-container-${project.id}`}
                onClick={() => toggleProjectSelection(project)}
              >
                {selectedProject && selectedProject.id === project.id ? (
                  // Vista detallada del proyecto
                  <>
                    <motion.div layoutId={`project-image-${project.id}`} className="relative h-96 overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    
                    <div className="p-8 flex flex-col">
                      <motion.div layoutId={`project-title-${project.id}`} className="mb-4">
                        <h3 className="text-2xl font-bold">{project.title}</h3>
                        <p className="text-blue-500">{project.client}</p>
                      </motion.div>
                      
                      <p className="text-gray-600 mb-6">{project.fullDescription}</p>
                      
                      <div className="mb-6">
                        <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Servicios</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.services.map((service, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Galería</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {project.images.map((image, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden">
                              <img 
                                src={image} 
                                alt={`${project.title} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        className="mt-8 self-end px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedProject(null)}
                      >
                        Cerrar
                      </button>
                    </div>
                  </>
                ) : (
                  // Vista previa del proyecto
                  <>
                    <motion.div 
                      layoutId={`project-image-${project.id}`}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.div>
                    
                    <motion.div 
                      layoutId={`project-title-${project.id}`}
                      className="absolute inset-0 flex flex-col justify-end p-6 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300"
                    >
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      <p className="text-blue-300">{project.client}</p>
                      <p className="text-white text-sm mt-2 line-clamp-2">{project.description}</p>
                      <div className="mt-4">
                        <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          {project.category.charAt(0).toUpperCase() + project.category.slice(1).replace('-', ' ')}
                        </span>
                      </div>
                    </motion.div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="servicios" className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ofrecemos soluciones creativas adaptadas a tus necesidades específicas, desde el concepto inicial hasta la implementación final.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <motion.div 
                key={service.id}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="flex items-start mb-6">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600 mr-4">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
                
                <div className="pl-16">
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 block mb-1">Precio estimado</span>
                    <span className="text-lg font-semibold text-gray-900">{service.price}</span>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {service.details.map((detail, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href="#contacto" 
                    className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Solicitar más información
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section id="proceso" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestro Proceso</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Una metodología probada que garantiza resultados de calidad en cada proyecto, desde el descubrimiento hasta la entrega.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {/* Timeline */}
            <div className="relative">
              {/* Línea vertical */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
              
              {/* Pasos del proceso */}
              {[
                {
                  number: 1,
                  title: "Descubrimiento",
                  description: "Exploramos tus necesidades, objetivos y visión. Investigamos tu sector, audiencia y competencia para establecer una base sólida.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )
                },
                {
                  number: 2,
                  title: "Estrategia",
                  description: "Definimos la dirección creativa, planificamos la estructura del proyecto y establecemos los criterios de éxito.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  number: 3,
                  title: "Diseño",
                  description: "Transformamos la estrategia en conceptos visuales, explorando diferentes enfoques y refinando iterativamente hasta lograr la solución ideal.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  )
                },
                {
                  number: 4,
                  title: "Implementación",
                  description: "Desarrollamos los entregables finales, preparamos los archivos para su uso y aseguramos que todo cumpla con los estándares técnicos requeridos.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )
                },
                {
                  number: 5,
                  title: "Lanzamiento",
                  description: "Realizamos la entrega final, proporcionamos capacitación si es necesario y nos aseguramos de que todo esté listo para su debut público.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )
                }
              ].map((step, index) => (
                <div key={index} className="relative z-10 mb-12">
                  <div className={`flex items-center md:justify-center ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}>
                    {/* Contenido */}
                    <div className={`w-full md:w-5/12 p-4 ${
                      index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'
                    }`}>
                      <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </motion.div>
                    </div>
                    
                    {/* Círculo con número */}
                    <motion.div 
                      className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-blue-100"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        {step.icon}
                      </div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials & Contact */}
      <section id="contacto" className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-6">Testimonios</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      quote: "El equipo de TuWeb.ai transformó completamente nuestra marca. Su enfoque detallista y su creatividad nos ayudaron a destacar en un mercado muy competitivo.",
                      author: "María González",
                      position: "CEO, LH Decants",
                      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
                    },
                    {
                      quote: "La atención al detalle y su capacidad para entender nuestros objetivos de negocio nos impresionó. El resultado final superó nuestras expectativas en todos los sentidos.",
                      author: "Carlos Méndez",
                      position: "CEO, LH Decants",
                      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
                    }
                  ].map((testimonial, index) => (
                    <motion.div 
                      key={index}
                      className="bg-gray-800 p-6 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <p className="italic mb-4">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.author} 
                          className="w-10 h-10 rounded-full object-cover mr-4"
                        />
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-gray-400">{testimonial.position}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-12">
                  <h3 className="text-xl font-semibold mb-4">Clientes que confían en nosotros</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['LH Decants', 'LH Decants', 'LH Decants', 'LH Decants', 'LH Decants', 'LH Decants'].map((client, index) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium">{client}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold mb-6">Contacto</h2>
                
                <div className="bg-gray-800 p-8 rounded-lg">
                  <p className="mb-6">
                    ¿Tenés un proyecto en mente? Usá nuestro formulario de contacto principal y nos pondremos en contacto para discutir cómo podemos ayudarte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                TuWeb<span className="text-blue-500">.ai</span>
              </h3>
              <p className="text-gray-400 mb-4">
                Transformamos ideas en experiencias digitales memorables, conectando empresas con su audiencia.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-behance" viewBox="0 0 16 16">
                    <path d="M4.654 3c.461 0 .887.035 1.278.14.39.07.711.216.996.391.286.176.497.426.641.747.14.32.216.711.216 1.137 0 .496-.106.922-.356 1.242-.215.32-.566.606-.997.817.606.176 1.067.496 1.348.922.281.426.461.957.461 1.563 0 .496-.105.922-.285 1.278a2.317 2.317 0 0 1-.782.887c-.32.215-.711.39-1.137.496a5.329 5.329 0 0 1-1.278.176L0 12.803V3h4.654zm-.285 3.978c.39 0 .71-.105.957-.285.246-.18.355-.497.355-.887 0-.216-.035-.426-.105-.567a.981.981 0 0 0-.32-.355 1.84 1.84 0 0 0-.461-.176c-.176-.035-.356-.035-.567-.035H2.17v2.31c0-.005 2.2-.005 2.2-.005zm.105 4.193c.215 0 .426-.035.606-.07.176-.035.356-.106.496-.216s.25-.215.356-.39c.07-.176.14-.391.14-.641 0-.496-.14-.852-.426-1.102-.285-.215-.676-.32-1.137-.32H2.17v2.734h2.305v.005zm6.858-.035c.286.285.711.426 1.278.426.39 0 .746-.106 1.032-.286.285-.215.46-.426.53-.64h1.74c-.286.851-.712 1.457-1.278 1.848-.566.355-1.243.566-2.06.566a4.135 4.135 0 0 1-1.527-.285 2.827 2.827 0 0 1-1.137-.782 2.851 2.851 0 0 1-.712-1.172c-.175-.461-.25-.957-.25-1.528 0-.531.07-1.032.25-1.493.18-.46.426-.852.747-1.207.32-.32.711-.606 1.137-.782a4.018 4.018 0 0 1 1.493-.285c.606 0 1.137.105 1.598.355.46.25.817.532 1.102.958.285.39.496.851.641 1.348.07.461.105.957.07 1.493h-4.873c0 .496.105.922.39 1.313a2.12 2.12 0 0 0 1.065.712zm2.24-3.732c-.25-.25-.642-.391-1.103-.391-.32 0-.566.07-.781.176-.215.105-.356.25-.496.39a.957.957 0 0 0-.25.497c-.036.175-.07.32-.07.46h3.196c-.07-.526-.25-.882-.497-1.132zm-3.127-3.728h3.978v.957h-3.978v-.957z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-dribbble" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8c4.408 0 8-3.584 8-8s-3.592-8-8-8zm5.284 3.688a6.802 6.802 0 0 1 1.545 4.251c-.226-.043-2.482-.503-4.755-.217-.052-.112-.096-.234-.148-.355-.139-.33-.295-.668-.451-.99 2.516-1.023 3.662-2.498 3.81-2.69zM8 1.18c1.735 0 3.323.65 4.53 1.718-.122.174-1.155 1.553-3.584 2.464-1.12-2.056-2.36-3.74-2.551-4A6.95 6.95 0 0 1 8 1.18zm-2.907.642A43.123 43.123 0 0 1 7.627 5.77c-3.193.85-6.013.833-6.317.833a6.865 6.865 0 0 1 3.783-4.78zM1.163 8.01V7.8c.295.01 3.61.053 7.02-.971.199.381.381.772.555 1.162l-.27.078c-3.522 1.137-5.396 4.243-5.553 4.504a6.817 6.817 0 0 1-1.752-4.564zM8 14.837a6.785 6.785 0 0 1-4.19-1.44c.12-.252 1.509-2.924 5.361-4.269.018-.009.026-.009.044-.017a28.246 28.246 0 0 1 1.457 5.18A6.722 6.722 0 0 1 8 14.837zm3.81-1.171c-.07-.417-.435-2.412-1.328-4.868 2.143-.338 4.017.217 4.251.295a6.774 6.774 0 0 1-2.924 4.573z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Branding y Estrategia</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Diseño Web y UI/UX</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Ilustración y Animación</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Diseño Editorial</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Motion Graphics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guías de diseño</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Procesos creativos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Estudios de caso</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Toolkit gratuito</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">
                    info@tuweb-ai.com
                  </span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">+54 9 3571 416044</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">
                    Calle Creativa 123<br />
                    Distrito Diseño<br />
                    Ciudad Innovación
                  </span>
                </li>
              </ul>
              
              <div className="mt-6">
                <a href="#contacto" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm">
                  Contactarnos
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 TuWeb.ai. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Términos y Condiciones</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}