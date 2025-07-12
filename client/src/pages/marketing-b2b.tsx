import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Componentes
import WhatsAppButton from '@/components/ui/whatsapp-button';
import ScrollProgress from '@/components/ui/scroll-progress';

export default function MarketingB2B() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDemoForm, setShowDemoForm] = useState(false);

  // Efecto para simular carga
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Soluciones de marketing
  const solutions = [
    {
      id: 1,
      title: "Lead Generation",
      description: "Captura leads de alta calidad con estrategias multicanal basadas en datos, automatización y optimización constante.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Account-Based Marketing",
      description: "Estrategias personalizadas para cuentas de alto valor con contenido específico, canales directos y mensajes personalizados.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Marketing Automation",
      description: "Automatiza flujos de marketing para comunicaciones personalizadas en el momento adecuado del customer journey.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Lead Scoring & Nurturing",
      description: "Clasifica y prioriza prospectos según su potencial, con estrategias específicas para cada etapa del embudo.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 5,
      title: "Analytics & Attribution",
      description: "Mide el impacto real de tus acciones de marketing con modelos de atribución avanzados y dashboards personalizados.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 6,
      title: "Content Marketing B2B",
      description: "Contenido estratégico para cada etapa del buyer journey, enfocado en resolver problemas de negocios específicos.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    }
  ];
  
  // Estadísticas
  const stats = [
    { value: "250%", label: "Aumento de leads cualificados" },
    { value: "65%", label: "Reducción en ciclo de venta" },
    { value: "189%", label: "Aumento en ROI de marketing" },
    { value: "12.5x", label: "Retorno de inversión promedio" }
  ];
  
  // Casos de estudio
  const caseStudies = [
    {
      id: 1,
      title: "Aumento de leads cualificados para empresa de software B2B",
      client: "TechSolutions Inc.",
      industry: "Software SaaS",
      challenge: "TechSolutions enfrentaba dificultades para generar leads cualificados para su plataforma de gestión empresarial. Su proceso de marketing era mayoritariamente manual y no contaban con mecanismos eficientes para calificar leads.",
      solution: "Implementamos una estrategia integral de lead generation y nurturing con marketing automation: \n\n• Segmentación avanzada del público objetivo\n• Campañas multicanal coordinadas (email, LinkedIn, webinars)\n• Sistema de lead scoring basado en comportamiento\n• Flujos automatizados de nurturing por segmento\n• Integración CRM con dashboards personalizados",
      results: [
        { label: "Incremento en leads cualificados", value: "+187%" },
        { label: "Reducción del ciclo de venta", value: "-42%" },
        { label: "Incremento en conversión", value: "+68%" },
        { label: "ROI de marketing", value: "15.3x" }
      ],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      testimonial: {
        quote: "La implementación de esta estrategia transformó completamente nuestro pipeline de ventas. Ahora nuestro equipo comercial trabaja con leads realmente cualificados y el proceso de conversión es mucho más eficiente.",
        author: "Elena Martínez",
        position: "CMO de TechSolutions Inc."
      }
    },
    {
      id: 2,
      title: "Estrategia ABM para expansión internacional de empresa industrial",
      client: "GlobalManufacturing Ltd.",
      industry: "Manufactura Industrial",
      challenge: "GlobalManufacturing buscaba expandirse a nuevos mercados europeos, pero carecía de una estrategia enfocada para abordar cuentas estratégicas en estos territorios. Su enfoque generalista no estaba generando resultados.",
      solution: "Desarrollamos una estrategia Account-Based Marketing (ABM) para las 50 cuentas prioritarias: \n\n• Investigación profunda de cada cuenta objetivo\n• Creación de contenido personalizado por industria y rol\n• Campañas multicanal coordinadas con equipos de ventas\n• Eventos virtuales exclusivos para decision-makers\n• Dashboard de engagement por cuenta target",
      results: [
        { label: "Tasa de engagement", value: "+240%" },
        { label: "Reuniones con decision-makers", value: "+180%" },
        { label: "Nuevos clientes estratégicos", value: "22" },
        { label: "Incremento en ticket medio", value: "+35%" }
      ],
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      testimonial: {
        quote: "La estrategia ABM nos permitió conectar con ejecutivos de alto nivel que antes eran inaccesibles. El enfoque personalizado marcó la diferencia y nos ayudó a cerrar contratos significativamente más grandes.",
        author: "Carlos Vega",
        position: "Director de Expansión en GlobalManufacturing"
      }
    },
    {
      id: 3,
      title: "Automatización del customer journey para empresa de servicios financieros",
      client: "FinancePro Services",
      industry: "Servicios Financieros B2B",
      challenge: "FinancePro ofrecía varios servicios financieros para empresas, pero tenía dificultades para escalar su proceso de captación y educación de clientes. Los procesos manuales limitaban su crecimiento.",
      solution: "Implementamos un ecosistema completo de marketing automation: \n\n• Workflows personalizados por tipo de cliente y servicio\n• Contenido educativo secuencial por etapa de consideración\n• Integración entre plataformas de marketing, ventas y servicio\n• Scoring predictivo basado en IA\n• Campañas de reactivación automatizadas",
      results: [
        { label: "Aumento en ventas", value: "+92%" },
        { label: "Reducción de costos operativos", value: "-38%" },
        { label: "Mejora en tasa de adopción", value: "+125%" },
        { label: "Incremento en customer lifetime value", value: "+47%" }
      ],
      image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      testimonial: {
        quote: "La automatización no solo mejoró nuestros resultados de marketing, sino que transformó toda la experiencia del cliente. Pudimos escalar nuestras operaciones sin perder el toque personalizado que nos diferencia.",
        author: "Marta Sánchez",
        position: "CEO de FinancePro Services"
      }
    }
  ];
  
  // Equipo
  const team = [
    {
      name: "Alejandro Torres",
      position: "Director de Estrategia",
      bio: "Más de 15 años de experiencia en marketing B2B para empresas tecnológicas y servicios profesionales.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Daniela Vega",
      position: "Head of Marketing Automation",
      bio: "Especialista en implementación de soluciones de automation con enfoque en maximizar conversión y ROI.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Roberto Méndez",
      position: "Analytics & Attribution Lead",
      bio: "Experto en medición avanzada y modelos de atribución para optimización continua de campañas B2B.",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Lucía Ramírez",
      position: "Content Strategy Director",
      bio: "Creadora de estrategias de contenido que combinan storytelling B2B con enfoque en generación de leads.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];
  
  // Tecnologías y plataformas
  const platforms = [
    { name: "HubSpot", category: "Marketing Automation" },
    { name: "Marketo", category: "Marketing Automation" },
    { name: "Pardot", category: "Marketing Automation" },
    { name: "Salesforce", category: "CRM" },
    { name: "Linkedin Ads", category: "Advertising" },
    { name: "Google Analytics", category: "Analytics" },
    { name: "Mixpanel", category: "Analytics" },
    { name: "Amplitude", category: "Analytics" },
    { name: "Zapier", category: "Integration" },
    { name: "Segment", category: "CDP" },
    { name: "Webflow", category: "CMS" },
    { name: "Intercom", category: "Customer Engagement" }
  ];
  
  // Función para formatear porcentaje
  const handleDemoSubmit = (e) => {
    e.preventDefault();
    alert('¡Solicitud enviada! Un experto se pondrá en contacto contigo pronto.');
    setShowDemoForm(false);
  };
  
  // Loader
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#1E293B] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#3B82F6] border-r-[#1E293B] border-b-[#1E293B] border-l-[#1E293B] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">MARKETIFY</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollProgress color="#3B82F6" />
      <WhatsAppButton />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Botón de menú móvil */}
              {isMobile && (
                <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1E293B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              {/* Logo */}
              <h1 className="text-2xl font-bold">
                <span className="text-[#1E293B]">MARKET</span>
                <span className="text-[#3B82F6]">IFY</span>
              </h1>
              
              {/* Navegación desktop */}
              {!isMobile && (
                <nav className="hidden lg:flex items-center space-x-6">
                  <a href="#soluciones" className="text-gray-700 hover:text-[#3B82F6] transition-colors">Soluciones</a>
                  <a href="#casos" className="text-gray-700 hover:text-[#3B82F6] transition-colors">Casos de éxito</a>
                  <a href="#plataforma" className="text-gray-700 hover:text-[#3B82F6] transition-colors">Nuestra plataforma</a>
                  <a href="#equipo" className="text-gray-700 hover:text-[#3B82F6] transition-colors">Equipo</a>
                  <a href="#contacto" className="text-gray-700 hover:text-[#3B82F6] transition-colors">Contacto</a>
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2563EB] transition-colors"
                onClick={() => setShowDemoForm(true)}
              >
                Solicitar demo
              </button>
            </div>
          </div>
          
          {/* Menú móvil */}
          {isMobile && isMenuOpen && (
            <motion.div 
              className="lg:hidden mt-4 py-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <nav className="flex flex-col space-y-3">
                <a href="#soluciones" className="text-gray-700 hover:text-[#3B82F6] transition-colors">Soluciones</a>
                <a href="#casos" className="text-gray-700 hover:text-[#3B82F6] transition-colors">Casos de éxito</a>
                <a href="#plataforma" className="text-gray-700 hover:text-[#3B82F6] transition-colors">Nuestra plataforma</a>
                <a href="#equipo" className="text-gray-700 hover:text-[#3B82F6] transition-colors">Equipo</a>
                <a href="#contacto" className="text-gray-700 hover:text-[#3B82F6] transition-colors">Contacto</a>
              </nav>
            </motion.div>
          )}
        </div>
      </header>
      
      {/* Hero section */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
                Marketing B2B que genera resultados
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Transforma leads en <span className="text-[#3B82F6]">oportunidades</span> con marketing automation
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Estrategias de lead generation, nurturing y automation diseñadas específicamente para empresas B2B que buscan maximizar ROI y acelerar ciclos de venta.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowDemoForm(true)}
                  className="bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2563EB] transition-colors"
                >
                  Solicitar demo
                </button>
                <a 
                  href="#casos"
                  className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Ver casos de éxito
                </a>
              </div>
              <div className="mt-10">
                <p className="text-sm text-gray-400 mb-3">Confían en nosotros:</p>
                <div className="flex flex-wrap gap-6 items-center">
                  {['Microsoft', 'Oracle', 'IBM', 'Salesforce', 'Adobe'].map(client => (
                    <div key={client} className="text-gray-400 font-bold">{client}</div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-[#3B82F6] rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[#3B82F6] rounded-full opacity-30 blur-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Marketing B2B Dashboard" 
                  className="rounded-lg shadow-2xl relative z-10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Estadísticas */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl font-bold text-[#3B82F6] mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Soluciones */}
      <section id="soluciones" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
                Nuestras soluciones
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Marketing B2B completo y escalable
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Soluciones integrales para cada etapa del ciclo de venta B2B, desde la captación de leads hasta la conversión y fidelización.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div 
                key={solution.id}
                className="bg-white p-6 rounded-lg shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">
                  {solution.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{solution.title}</h3>
                <p className="text-gray-600 mb-4">{solution.description}</p>
                <a href="#" className="text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors inline-flex items-center">
                  Saber más
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Cómo funcionamos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
                Nuestro proceso
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Cómo implementamos marketing automation B2B
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Un enfoque sistemático y basado en datos para transformar tu estrategia de marketing y maximizar resultados.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-12">
                {[
                  {
                    number: "01",
                    title: "Análisis y diagnóstico",
                    description: "Evaluamos tu stack tecnológico, procesos actuales y resultados para identificar oportunidades de mejora."
                  },
                  {
                    number: "02",
                    title: "Estrategia personalizada",
                    description: "Diseñamos un plan a medida basado en tus objetivos de negocio, buyer personas y customer journey."
                  },
                  {
                    number: "03",
                    title: "Implementación y setup",
                    description: "Configuramos las herramientas necesarias, workflows, segmentaciones y campañas automatizadas."
                  },
                  {
                    number: "04",
                    title: "Optimización continua",
                    description: "Monitoreo constante, testing A/B y ajustes basados en datos para maximizar conversión."
                  }
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    className="flex"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="mr-6">
                      <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center font-bold text-lg">
                        {step.number}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#3B82F6] rounded-full opacity-20 blur-2xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Marketing Strategy" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Casos de estudio */}
      <section id="casos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
                Casos de éxito
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Resultados reales para empresas B2B
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Descubre cómo nuestras estrategias han ayudado a empresas como la tuya a transformar su marketing y acelerar su crecimiento.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((caseStudy, index) => (
              <motion.div 
                key={caseStudy.id}
                className="bg-white rounded-lg overflow-hidden shadow cursor-pointer"
                onClick={() => setSelectedCaseStudy(caseStudy)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={caseStudy.image} 
                    alt={caseStudy.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-[#3B82F6] text-white px-2 py-1 text-xs rounded font-medium">
                      {caseStudy.industry}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{caseStudy.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{caseStudy.client}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {caseStudy.results.slice(0, 2).map((result, i) => (
                      <div key={i} className="bg-gray-50 p-2 rounded text-center">
                        <div className="text-[#3B82F6] font-bold">{result.value}</div>
                        <div className="text-gray-600 text-xs">{result.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className="text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors inline-flex items-center"
                  >
                    Ver caso completo
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Plataforma */}
      <section id="plataforma" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
                Tecnología
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Nuestra plataforma de marketing automation
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Combinamos las mejores herramientas con expertise único para crear un ecosistema de marketing B2B de alto rendimiento.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Integración total",
                description: "Conectamos todas tus herramientas de marketing, ventas y atención al cliente para crear una experiencia sin fricciones.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                )
              },
              {
                title: "Personalización avanzada",
                description: "Adapta cada interacción al perfil, comportamiento e intereses de cada lead con content intelligence.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )
              },
              {
                title: "Analytics en tiempo real",
                description: "Dashboards interactivos con métricas clave, atribución y oportunidades de optimización continua.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Plataformas que integramos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {platforms.map((platform, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-4 rounded border border-gray-200 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="text-gray-800 font-medium">{platform.name}</div>
                  <div className="text-gray-500 text-xs">{platform.category}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Equipo */}
      <section id="equipo" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
                Nuestro equipo
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Expertos en marketing B2B
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Un equipo especializado con amplia experiencia en estrategias de marketing para empresas B2B de distintos sectores.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-60 bg-gray-200">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-[#3B82F6] mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contacto */}
      <section id="contacto" className="py-20 bg-[#1E293B] text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
                Contáctanos
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Potencia tu estrategia de marketing B2B
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                ¿Listo para transformar tus resultados de marketing? Agenda una consulta gratuita con nuestros expertos.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Análisis personalizado de tu estrategia actual",
                  "Recomendaciones específicas para tu industria",
                  "Demo de nuestra plataforma de automation",
                  "Casos de éxito relevantes para tu negocio"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3B82F6] mr-2 mt-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setShowDemoForm(true)}
                className="bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2563EB] transition-colors"
              >
                Solicitar demo gratuita
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-[#3B82F6] rounded-full opacity-30 blur-2xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Marketing Team" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                <span className="text-white">MARKET</span>
                <span className="text-[#3B82F6]">IFY</span>
              </h2>
              <p className="text-gray-400 mb-6">
                Soluciones de marketing automation B2B que transforman leads en oportunidades de negocio cualificadas.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Soluciones</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Lead Generation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Marketing Automation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Account-Based Marketing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Lead Scoring & Nurturing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Analytics & Attribution</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guías y Ebooks</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Webinars</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Casos de estudio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Centro de recursos</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">info@marketify.com</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">+54 11 5555-7890</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">Av. del Libertador 6250, Buenos Aires, Argentina</span>
                </li>
              </ul>
              
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-4">Newsletter</h3>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Tu email" 
                    className="bg-[#1E293B] text-white px-4 py-2 rounded-l-lg flex-grow focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                  <button className="bg-[#3B82F6] text-white px-4 py-2 rounded-r-lg hover:bg-[#2563EB] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Marketify. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Modal de caso de estudio */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md z-10"
              onClick={() => setSelectedCaseStudy(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="h-72 bg-gray-300 relative">
              <img 
                src={selectedCaseStudy.image} 
                alt={selectedCaseStudy.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <span className="bg-[#3B82F6] text-white px-2 py-1 text-xs rounded font-medium">
                    {selectedCaseStudy.industry}
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-2">{selectedCaseStudy.title}</h2>
                  <p className="text-white/90">{selectedCaseStudy.client}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex border-b border-gray-200">
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Resumen
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'challenge' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('challenge')}
                >
                  Desafío
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'solution' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('solution')}
                >
                  Solución
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'results' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('results')}
                >
                  Resultados
                </button>
              </div>
              
              <div className="py-6">
                {activeTab === 'overview' && (
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {selectedCaseStudy.results.map((result, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-[#3B82F6] mb-1">{result.value}</div>
                          <div className="text-gray-600 text-sm">{result.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Desafío</h3>
                      <p className="text-gray-700">{selectedCaseStudy.challenge}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Solución</h3>
                      <p className="text-gray-700 whitespace-pre-line">{selectedCaseStudy.solution}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#3B82F6] italic">
                      <p className="text-gray-700 mb-4">"{selectedCaseStudy.testimonial.quote}"</p>
                      <div className="flex items-center">
                        <div>
                          <p className="font-bold text-gray-800">{selectedCaseStudy.testimonial.author}</p>
                          <p className="text-gray-600 text-sm">{selectedCaseStudy.testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'challenge' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">El Desafío</h3>
                    <p className="text-gray-700 mb-6">{selectedCaseStudy.challenge}</p>
                    
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">Principales obstáculos:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">Procesos manuales ineficientes</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">Falta de visibilidad en el customer journey</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">Desconexión entre marketing y ventas</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">Dificultad para medir ROI de acciones de marketing</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeTab === 'solution' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Nuestra Solución</h3>
                    <p className="text-gray-700 mb-6 whitespace-pre-line">{selectedCaseStudy.solution}</p>
                    
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">Tecnologías implementadas:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['HubSpot', 'Salesforce', 'Google Analytics', 'LinkedIn Ads', 'Custom Dashboards', 'Zapier'].map((tech, index) => (
                          <div key={index} className="bg-white p-2 rounded border border-gray-200 text-center">
                            {tech}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'results' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Resultados</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {selectedCaseStudy.results.map((result, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-[#3B82F6] mb-1">{result.value}</div>
                          <div className="text-gray-600 text-sm">{result.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 mb-2">Impacto en el negocio:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Mayor eficiencia en procesos de marketing y ventas</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Reducción significativa del ciclo de venta</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Aumento en la calidad de los leads generados</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Mejor alineación entre los equipos de marketing y ventas</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Mayor visibilidad y capacidad de ajustar estrategias en tiempo real</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#3B82F6] italic">
                      <p className="text-gray-700 mb-4">"{selectedCaseStudy.testimonial.quote}"</p>
                      <div className="flex items-center">
                        <div>
                          <p className="font-bold text-gray-800">{selectedCaseStudy.testimonial.author}</p>
                          <p className="text-gray-600 text-sm">{selectedCaseStudy.testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-6 flex justify-end">
                <button 
                  onClick={() => setShowDemoForm(true)}
                  className="bg-[#3B82F6] text-white px-6 py-3 rounded-lg hover:bg-[#2563EB] transition-colors"
                >
                  Solicitar una solución similar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de solicitud de demo */}
      {showDemoForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-lg max-w-lg w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Solicitar una demo</h2>
                  <p className="text-gray-600">Complete el formulario y nos pondremos en contacto en 24 horas</p>
                </div>
                <button 
                  onClick={() => setShowDemoForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleDemoSubmit}>
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">
                        Nombre
                      </label>
                      <input 
                        type="text" 
                        id="firstName" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">
                        Apellido
                      </label>
                      <input 
                        type="text" 
                        id="lastName" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email-marketing-b2b" className="block text-gray-700 font-medium mb-1">Email corporativo</label>
                    <input 
                      type="email" 
                      id="email-marketing-b2b"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-gray-700 font-medium mb-1">
                      Empresa
                    </label>
                    <input 
                      type="text" 
                      id="company" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="position" className="block text-gray-700 font-medium mb-1">
                      Cargo
                    </label>
                    <input 
                      type="text" 
                      id="position" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
                      Teléfono
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="interest" className="block text-gray-700 font-medium mb-1">
                      Solución de interés
                    </label>
                    <select 
                      id="interest" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      required
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="lead-generation">Lead Generation</option>
                      <option value="marketing-automation">Marketing Automation</option>
                      <option value="abm">Account-Based Marketing</option>
                      <option value="lead-scoring">Lead Scoring & Nurturing</option>
                      <option value="analytics">Analytics & Attribution</option>
                      <option value="content">Content Marketing B2B</option>
                    </select>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-[#3B82F6] text-white px-6 py-3 rounded-lg hover:bg-[#2563EB] transition-colors"
                >
                  Solicitar demo
                </button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Al enviar este formulario, acepta nuestra política de privacidad y el procesamiento de sus datos para contactarle.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}