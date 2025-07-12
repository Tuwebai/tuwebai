import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Componentes
import WhatsAppButton from '@/components/ui/whatsapp-button';
import ScrollProgress from '@/components/ui/scroll-progress';

export default function CorporativoPremium() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para simular carga
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);

  // Lista de servicios
  const services = [
    {
      id: 1,
      title: "Asesoría Financiera",
      description: "Análisis detallado de su situación financiera con estrategias personalizadas para maximizar sus inversiones.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#007BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Gestión de Patrimonios",
      description: "Administración integral de activos para clientes individuales e institucionales con enfoque en preservación y crecimiento.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#007BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Planificación Fiscal",
      description: "Estrategias para optimizar la carga fiscal de personas y empresas, garantizando el cumplimiento normativo y maximizando beneficios.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#007BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Gestión de Riesgos",
      description: "Identificación, evaluación y mitigación de riesgos financieros para proteger su patrimonio y asegurar la continuidad de sus operaciones.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#007BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 5,
      title: "Inversiones Internacionales",
      description: "Acceso a oportunidades de inversión globales con enfoque en diversificación y exposición a mercados emergentes y establecidos.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#007BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 6,
      title: "Banca Privada",
      description: "Servicio exclusivo y personalizado para clientes de alto patrimonio con soluciones adaptadas a sus necesidades específicas.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#007BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  // Lista de miembros del equipo
  const teamMembers = [
    {
      name: "Alexandra Martínez",
      position: "Directora Ejecutiva",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      linkedin: "#"
    },
    {
      name: "Carlos Rodríguez",
      position: "Director de Inversiones",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      linkedin: "#"
    },
    {
      name: "Lucía Gómez",
      position: "Directora de Estrategia",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      linkedin: "#"
    },
    {
      name: "Roberto Álvarez",
      position: "Director de Operaciones",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      linkedin: "#"
    }
  ];

  // Lista de FAQs
  const faqs = [
    {
      question: "¿Cuál es el proceso para comenzar a trabajar con ustedes?",
      answer: "El proceso comienza con una reunión inicial sin costo donde conocemos sus objetivos financieros. Posteriormente, realizamos un análisis detallado de su situación actual y presentamos una propuesta personalizada. Una vez aceptada, asignamos un asesor dedicado para implementar y monitorear su estrategia."
    },
    {
      question: "¿Cuál es el monto mínimo de inversión requerido?",
      answer: "Nuestros servicios de gestión de patrimonios están diseñados para clientes con activos a partir de $500,000, aunque ofrecemos servicios de asesoría puntual con montos menores. Nuestros planes de banca privada exclusiva están disponibles para patrimonios superiores a $2 millones."
    },
    {
      question: "¿Cómo protegen la confidencialidad de mis datos financieros?",
      answer: "Implementamos estrictos protocolos de seguridad y confidencialidad. Todos nuestros sistemas utilizan encriptación de nivel bancario y cumplimos con las normativas internacionales de protección de datos. Adicionalmente, todos nuestros colaboradores firman acuerdos de confidencialidad y reciben capacitación continua en materia de seguridad."
    },
    {
      question: "¿Qué diferencia a su firma de otras instituciones financieras?",
      answer: "Nos distinguimos por nuestro enfoque verdaderamente personalizado, asignando un equipo dedicado a cada cliente. No recibimos comisiones de terceros por recomendar productos, eliminando conflictos de interés. Además, tenemos acuerdos con más de 40 instituciones financieras globales, permitiéndonos ofrecer las mejores soluciones sin limitaciones."
    },
    {
      question: "¿Cómo puedo acceder a mis informes y estado de inversiones?",
      answer: "Disponemos de una plataforma digital segura accesible 24/7 donde puede visualizar todos sus activos, rendimientos y reportes en tiempo real. Complementariamente, su asesor personal le enviará informes mensuales detallados y programará reuniones trimestrales para revisar el desempeño y ajustar estrategias si es necesario."
    }
  ];

  // Estadísticas
  const statistics = [
    { value: "$8.5B+", label: "Activos bajo gestión" },
    { value: "24+", label: "Años de experiencia" },
    { value: "97%", label: "Clientes satisfechos" },
    { value: "42", label: "Países con presencia" }
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#003366] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-white border-r-[#003366] border-b-[#003366] border-l-[#003366] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-serif font-bold text-white">FINANCE PARTNERS</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollProgress color="#007BFF" />
      <WhatsAppButton />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Botón de menú móvil */}
              {isMobile && (
                <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              {/* Logo */}
              <h1 className="text-2xl font-serif font-bold text-[#003366]">
                FINANCE<span className="text-[#007BFF]">PARTNERS</span>
              </h1>
              
              {/* Navegación desktop */}
              {!isMobile && (
                <nav className="hidden lg:flex items-center space-x-6">
                  <a href="#inicio" className="text-gray-700 hover:text-[#007BFF] transition-colors">Inicio</a>
                  <a href="#servicios" className="text-gray-700 hover:text-[#007BFF] transition-colors">Servicios</a>
                  <a href="#nosotros" className="text-gray-700 hover:text-[#007BFF] transition-colors">Nosotros</a>
                  <a href="#equipo" className="text-gray-700 hover:text-[#007BFF] transition-colors">Equipo</a>
                  <a href="#faq" className="text-gray-700 hover:text-[#007BFF] transition-colors">FAQ</a>
                  <a href="#contacto" className="text-gray-700 hover:text-[#007BFF] transition-colors">Contacto</a>
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="#"
                className="hidden sm:inline-block border border-[#007BFF] text-[#007BFF] px-4 py-2 rounded hover:bg-[#007BFF] hover:text-white transition-colors"
              >
                Portal Cliente
              </a>
              <a 
                href="#contacto"
                className="bg-[#007BFF] text-white px-4 py-2 rounded shadow hover:bg-[#0056b3] transition-colors"
              >
                Solicitar Asesoría
              </a>
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
                <a href="#inicio" className="text-gray-700 hover:text-[#007BFF] transition-colors">Inicio</a>
                <a href="#servicios" className="text-gray-700 hover:text-[#007BFF] transition-colors">Servicios</a>
                <a href="#nosotros" className="text-gray-700 hover:text-[#007BFF] transition-colors">Nosotros</a>
                <a href="#equipo" className="text-gray-700 hover:text-[#007BFF] transition-colors">Equipo</a>
                <a href="#faq" className="text-gray-700 hover:text-[#007BFF] transition-colors">FAQ</a>
                <a href="#contacto" className="text-gray-700 hover:text-[#007BFF] transition-colors">Contacto</a>
              </nav>
            </motion.div>
          )}
        </div>
      </header>
      
      {/* Hero section */}
      <section id="inicio" className="pt-28 pb-20 bg-gradient-to-r from-[#003366] to-[#0056b3]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                Soluciones financieras <span className="text-[#FFD700]">premium</span> para inversores exigentes
              </h1>
              <p className="text-lg text-gray-200 mb-8">
                Firma boutique de asesoría financiera y gestión de patrimonios con enfoque personalizado para inversores de alto valor.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#servicios"
                  className="bg-white text-[#003366] px-6 py-3 rounded font-medium hover:bg-gray-100 transition-colors"
                >
                  Nuestros Servicios
                </a>
                <a 
                  href="#contacto"
                  className="bg-transparent border border-white text-white px-6 py-3 rounded font-medium hover:bg-white/10 transition-colors"
                >
                  Contactar Ahora
                </a>
              </div>
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                {statistics.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="text-center"
                  >
                    <h3 className="text-3xl font-serif font-bold text-[#FFD700] mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-300">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Asesoría financiera" 
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <div className="bg-[#FFD700] rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Rentabilidad media</p>
                      <p className="text-lg font-bold text-[#003366]">+18.7%</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>
      
      {/* Marcas asociadas */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm text-gray-500 uppercase tracking-wider">Instituciones Asociadas</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {['JPMorgan', 'Goldman Sachs', 'Morgan Stanley', 'BlackRock', 'UBS'].map(brand => (
              <div key={brand} className="grayscale hover:grayscale-0 transition-all duration-300">
                <h3 className="text-xl font-serif font-bold text-gray-400 hover:text-[#007BFF]">{brand}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Servicios */}
      <section id="servicios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold text-[#003366] mb-4">
                Nuestros Servicios Premium
              </h2>
              <div className="w-24 h-1 bg-[#007BFF] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Ofrecemos una gama completa de servicios financieros exclusivos, diseñados para proteger y hacer crecer su patrimonio con estrategias personalizadas.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-[#003366] mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
                <a href="#" className="inline-block mt-4 text-[#007BFF] hover:text-[#0056b3] transition-colors">
                  Saber más &rarr;
                </a>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="#contacto"
              className="inline-block bg-[#007BFF] text-white px-6 py-3 rounded shadow hover:bg-[#0056b3] transition-colors"
            >
              Agendar una consulta gratuita
            </a>
          </div>
        </div>
      </section>
      
      {/* Nosotros */}
      <section id="nosotros" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <h2 className="text-3xl font-serif font-bold text-[#003366] mb-4">
                Quiénes Somos
              </h2>
              <div className="w-24 h-1 bg-[#007BFF] mb-6"></div>
              <p className="text-gray-600 mb-6">
                Finance Partners es una firma boutique de asesoría financiera fundada en 1999 con la misión de brindar soluciones patrimoniales integrales a clientes de alto valor. Nuestro enfoque combina la exclusividad de un servicio personalizado con el acceso a oportunidades globales.
              </p>
              <p className="text-gray-600 mb-6">
                Con oficinas en 42 países y un equipo de más de 200 expertos financieros, ofrecemos una perspectiva verdaderamente global con atención local, permitiendo a nuestros clientes acceder a oportunidades exclusivas en todos los mercados relevantes.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Equipo de asesores certificados con experiencia internacional",
                  "Enfoque independiente sin conflictos de interés",
                  "Acceso a oportunidades de inversión exclusivas",
                  "Tecnología avanzada para monitoreo de portafolios",
                  "Confidencialidad y seguridad absolutas"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#007BFF] mr-2 mt-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <a 
                href="#contacto"
                className="inline-block bg-[#007BFF] text-white px-6 py-3 rounded shadow hover:bg-[#0056b3] transition-colors"
              >
                Conozca más sobre nosotros
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Nuestro equipo" 
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -top-6 -left-6 bg-[#003366] p-5 rounded-lg shadow-lg">
                  <div className="text-center">
                    <h3 className="text-2xl font-serif font-bold text-white">25+</h3>
                    <p className="text-gray-300 text-sm">Años de experiencia</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#003366] to-[#0056b3] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif font-bold mb-6">
              Maximice su potencial financiero hoy mismo
            </h2>
            <p className="text-gray-200 max-w-3xl mx-auto mb-8">
              Nuestros expertos están listos para ayudarle a alcanzar sus objetivos financieros. Programe una consulta sin compromiso y descubra cómo podemos transformar su estrategia de inversión.
            </p>
            <a 
              href="#contacto"
              className="inline-block bg-white text-[#003366] px-8 py-4 rounded font-medium hover:bg-gray-100 transition-colors"
            >
              Programar una consulta gratuita
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Equipo */}
      <section id="equipo" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold text-[#003366] mb-4">
                Nuestro Equipo Directivo
              </h2>
              <div className="w-24 h-1 bg-[#007BFF] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Finance Partners cuenta con un equipo de profesionales con amplia experiencia en el sector financiero y formación en las instituciones más prestigiosas del mundo.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-60 bg-gray-200">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-[#003366] mb-1">{member.name}</h3>
                  <p className="text-gray-600 mb-4">{member.position}</p>
                  <a 
                    href={member.linkedin}
                    className="inline-block text-[#007BFF] hover:text-[#0056b3] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="#"
              className="inline-block border border-[#007BFF] text-[#007BFF] px-6 py-3 rounded hover:bg-[#007BFF] hover:text-white transition-colors"
            >
              Conocer a todo el equipo
            </a>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold text-[#003366] mb-4">
                Preguntas Frecuentes
              </h2>
              <div className="w-24 h-1 bg-[#007BFF] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Encuentre respuestas a las preguntas más comunes sobre nuestros servicios y proceso de trabajo.
              </p>
            </motion.div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  className={`flex justify-between items-center w-full p-5 text-left ${
                    activeFaq === index ? 'bg-[#003366] text-white rounded-t' : 'bg-white text-[#003366] rounded'
                  } border ${activeFaq === index ? 'border-[#003366]' : 'border-gray-200'} hover:bg-[#003366] hover:text-white transition-colors`}
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-serif font-medium">{faq.question}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 transform transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFaq === index && (
                  <div className="bg-white p-5 rounded-b border-x border-b border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              ¿No encuentra la respuesta que busca?
            </p>
            <a 
              href="#contacto"
              className="inline-block bg-[#007BFF] text-white px-6 py-3 rounded shadow hover:bg-[#0056b3] transition-colors"
            >
              Contáctenos directamente
            </a>
          </div>
        </div>
      </section>
      
      {/* Contacto */}
      <section id="contacto" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold text-[#003366] mb-4">
                Contacte con Nosotros
              </h2>
              <div className="w-24 h-1 bg-[#007BFF] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Estamos a su disposición para atender cualquier consulta y ofrecerle asesoramiento personalizado sobre nuestros servicios.
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <form className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nombre completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#007BFF]" 
                    placeholder="Su nombre"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#007BFF]" 
                    placeholder="Su correo electrónico"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Teléfono</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#007BFF]" 
                    placeholder="Su número de teléfono"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="service" className="block text-gray-700 font-medium mb-2">Servicio de interés</label>
                  <select 
                    id="service" 
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#007BFF]"
                  >
                    <option value="">Seleccione un servicio</option>
                    {services.map(service => (
                      <option key={service.id} value={service.title}>{service.title}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Mensaje</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#007BFF]"
                    placeholder="¿Cómo podemos ayudarle?"
                  ></textarea>
                </div>
                <div>
                  <button 
                    type="submit" 
                    className="w-full bg-[#007BFF] text-white px-6 py-3 rounded shadow hover:bg-[#0056b3] transition-colors"
                  >
                    Enviar mensaje
                  </button>
                </div>
              </form>
            </div>
            
            <div>
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-serif font-bold text-[#003366] mb-4">Información de contacto</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#007BFF] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-700">Dirección principal:</p>
                      <p className="text-gray-600">Av. Libertador 498, Torre Finance, Piso 25<br />Buenos Aires, Argentina</p>
                    </div>
                  </li>
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#007BFF] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-700">Teléfono:</p>
                      <p className="text-gray-600">+54 11 5555-7890</p>
                    </div>
                  </li>
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#007BFF] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-700">Email:</p>
                      <p className="text-gray-600">contacto@financepartners.com</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-serif font-bold text-[#003366] mb-4">Horarios de atención</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Lunes a Viernes:</span>
                    <span className="font-medium text-gray-700">9:00 - 18:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Sábados:</span>
                    <span className="font-medium text-gray-700">10:00 - 14:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Domingos:</span>
                    <span className="font-medium text-gray-700">Cerrado</span>
                  </li>
                </ul>
                <p className="mt-4 text-gray-600">
                  Para clientes prioritarios, disponemos de atención telefónica 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#003366] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">
                FINANCE<span className="text-[#007BFF]">PARTNERS</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Soluciones financieras premium para inversores exigentes. Protegemos y hacemos crecer su patrimonio con estrategias personalizadas.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-serif font-bold mb-4">Servicios</h3>
              <ul className="space-y-2">
                {services.slice(0, 5).map(service => (
                  <li key={service.id}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-serif font-bold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#inicio" className="text-gray-300 hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#nosotros" className="text-gray-300 hover:text-white transition-colors">Nosotros</a></li>
                <li><a href="#servicios" className="text-gray-300 hover:text-white transition-colors">Servicios</a></li>
                <li><a href="#equipo" className="text-gray-300 hover:text-white transition-colors">Equipo</a></li>
                <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-serif font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Términos y condiciones</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Aviso legal</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#0056b3] mt-12 pt-8 text-center">
            <p className="text-gray-300">
              &copy; {new Date().getFullYear()} Finance Partners. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}