import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedShape from '../../components/ui/animated-shape';

export default function ConsultoriaEstrategica() {
  const [activeTab, setActiveTab] = useState<number>(1);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[#0a0a0f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-1 pt-24 pb-16">
        <AnimatedShape type={1} className="top-[10%] right-[-150px]" delay={1} />
        <AnimatedShape type={2} className="bottom-[10%] left-[-100px]" delay={2} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al inicio
              </Link>
              
              <h1 className="font-rajdhani font-bold text-4xl md:text-6xl mb-6">
                <span className="gradient-text">Consultoría Estratégica</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-10">
                Analizamos tu negocio actual y diseñamos estrategias digitales personalizadas para maximizar tu ROI y crecimiento online
              </p>
              
              <motion.a 
                href="#contacto" 
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Solicitar consultoría
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-[#121217] rounded-xl p-6 sticky top-24">
                <h3 className="font-rajdhani font-bold text-2xl mb-6 gradient-text">
                  ¿Qué incluye?
                </h3>
                
                <ul className="space-y-4">
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 1 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(1)}
                  >
                    <div className="font-medium">Análisis y Diagnóstico</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 2 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(2)}
                  >
                    <div className="font-medium">Metodología de Trabajo</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 3 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(3)}
                  >
                    <div className="font-medium">Entregables</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 4 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(4)}
                  >
                    <div className="font-medium">Casos de Éxito</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 5 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(5)}
                  >
                    <div className="font-medium">Preguntas Frecuentes</div>
                  </li>
                </ul>
                
                <div className="mt-8 p-4 bg-[#1a1a23] rounded-lg">
                  <div className="text-[#00CCFF] font-medium mb-2">¿Necesitas más información?</div>
                  <p className="text-gray-400 text-sm mb-4">Agenda una llamada gratuita con uno de nuestros consultores especializados</p>
                  <a 
                    href="/consulta" 
                    className="w-full block text-center py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                  >
                    Agendar llamada
                  </a>
                </div>
              </div>
            </div>
            
            {/* Main content based on selected tab */}
            <div className="md:col-span-2">
              {activeTab === 1 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Análisis y Diagnóstico
                  </h2>
                  
                  <p className="text-gray-300 mb-6">
                    Nuestro proceso de consultoría estratégica comienza con un análisis exhaustivo de tu negocio, mercado y competencia. 
                    Utilizamos herramientas avanzadas de análisis de datos para identificar oportunidades de crecimiento y áreas de mejora.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#00CCFF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Análisis de Mercado</h3>
                      <p className="text-gray-400">Investigamos tendencias, competidores y nichos de mercado para identificar oportunidades estratégicas para tu negocio.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#9933FF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Auditoría Digital</h3>
                      <p className="text-gray-400">Evaluamos tu presencia online actual, incluyendo sitio web, SEO, redes sociales y canales de marketing digital.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#00CCFF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Análisis de Conversión</h3>
                      <p className="text-gray-400">Identificamos cuellos de botella en tu embudo de conversión y oportunidades para mejorar las tasas de conversión.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#9933FF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Benchmarking Competitivo</h3>
                      <p className="text-gray-400">Comparamos tu estrategia digital con los líderes de tu industria para identificar ventajas competitivas.</p>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">Herramientas que utilizamos</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                      <div className="font-medium text-[#00CCFF]">Google Analytics</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                      <div className="font-medium text-[#00CCFF]">SEMrush</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                      <div className="font-medium text-[#00CCFF]">Hotjar</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                      <div className="font-medium text-[#00CCFF]">Ahrefs</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">¿Qué obtendrás?</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Informe detallado del estado actual de tu presencia digital</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Identificación de oportunidades específicas para tu negocio</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Recomendaciones priorizadas según impacto potencial y dificultad de implementación</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === 2 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Metodología de Trabajo
                  </h2>
                  
                  <p className="text-gray-300 mb-8">
                    Nuestra metodología se basa en un enfoque estructurado y orientado a resultados. 
                    Combinamos análisis de datos con experiencia en negocios digitales para desarrollar 
                    estrategias personalizadas que impulsen el crecimiento sostenible de tu empresa.
                  </p>
                  
                  <div className="space-y-8 mb-10">
                    <div className="flex">
                      <div className="flex-shrink-0 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full h-10 w-10 flex items-center justify-center font-bold text-white">
                        1
                      </div>
                      <div className="ml-4">
                        <h3 className="font-rajdhani font-bold text-xl mb-2">Descubrimiento</h3>
                        <p className="text-gray-400">
                          Realizamos 2-3 entrevistas por Zoom para entender tu negocio, competencia y objetivos. 
                          Analizamos tu sitio web actual, redes sociales, y presencia digital. Utilizamos herramientas 
                          como Google Analytics, Search Console y SEMrush para recopilar datos reales.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full h-10 w-10 flex items-center justify-center font-bold text-white">
                        2
                      </div>
                      <div className="ml-4">
                        <h3 className="font-rajdhani font-bold text-xl mb-2">Análisis</h3>
                        <p className="text-gray-400">
                          Analizamos datos de tráfico, conversiones, competencia y mercado. Utilizamos Google Analytics 4, 
                          Google Search Console, SEMrush y herramientas de análisis de redes sociales. Identificamos 
                          oportunidades específicas de mejora y crecimiento.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full h-10 w-10 flex items-center justify-center font-bold text-white">
                        3
                      </div>
                      <div className="ml-4">
                        <h3 className="font-rajdhani font-bold text-xl mb-2">Estrategia</h3>
                        <p className="text-gray-400">
                          Creamos un plan de acción con 3-5 estrategias prioritarias, cronograma de implementación 
                          y presupuesto estimado. Definimos KPIs específicos como: aumento de tráfico, conversiones, 
                          posiciones en Google, y ROI de campañas.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full h-10 w-10 flex items-center justify-center font-bold text-white">
                        4
                      </div>
                      <div className="ml-4">
                        <h3 className="font-rajdhani font-bold text-xl mb-2">Implementación</h3>
                        <p className="text-gray-400">
                          Ejecutamos las recomendaciones aprobadas o proporcionamos orientación detallada 
                          para su implementación interna. Mantenemos una comunicación constante durante 
                          todo el proceso.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full h-10 w-10 flex items-center justify-center font-bold text-white">
                        5
                      </div>
                      <div className="ml-4">
                        <h3 className="font-rajdhani font-bold text-xl mb-2">Medición y Optimización</h3>
                        <p className="text-gray-400">
                          Monitoreamos continuamente los KPIs definidos, evaluamos el rendimiento de las 
                          estrategias implementadas y realizamos ajustes basados en datos para maximizar 
                          los resultados.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">Nuestro compromiso</h3>
                    <p className="text-gray-300">
                      Nos comprometemos a proporcionar análisis basados en datos, recomendaciones prácticas 
                      y una comunicación clara y constante. Nuestro objetivo es generar un impacto medible 
                      en tu negocio a través de estrategias digitales efectivas.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 3 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Entregables
                  </h2>
                  
                  <p className="text-gray-300 mb-8">
                    Nuestros servicios de consultoría estratégica incluyen entregables claros y accionables 
                    que te proporcionan una hoja de ruta completa para el crecimiento digital de tu negocio.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Informe de Diagnóstico Digital</h3>
                      <p className="text-gray-400">
                        Análisis completo de tu presencia digital actual, incluyendo sitio web, SEO, 
                        redes sociales, publicidad digital y competencia.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Plan Estratégico Digital</h3>
                      <p className="text-gray-400">
                        Documento estratégico con recomendaciones específicas, priorizadas según impacto 
                        potencial y facilidad de implementación.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Plan de Implementación</h3>
                      <p className="text-gray-400">
                        Cronograma detallado con pasos accionables para implementar las recomendaciones 
                        estratégicas, incluyendo recursos necesarios y plazos estimados.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Marco de Medición y KPIs</h3>
                      <p className="text-gray-400">
                        Definición de métricas clave para medir el éxito de la estrategia, incluyendo 
                        configuración de dashboards personalizados.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="font-rajdhani font-bold text-2xl mb-4">Formatos de entrega</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                        <div className="font-medium text-white">PDF Interactivo</div>
                      </div>
                      <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                        <div className="font-medium text-white">Presentación</div>
                      </div>
                      <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                        <div className="font-medium text-white">Dashboard Online</div>
                      </div>
                      <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                        <div className="font-medium text-white">Hojas de Cálculo</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">Soporte post-entrega</h3>
                    <p className="text-gray-300 mb-4">
                      Todos nuestros servicios de consultoría incluyen:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>2 sesiones de seguimiento para resolver dudas</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>30 días de soporte por email</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Acceso a documentación y recursos adicionales</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === 4 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Casos de Éxito
                  </h2>
                  
                  <p className="text-gray-300 mb-8">
                    Estos son algunos ejemplos reales de cómo nuestra consultoría estratégica ha ayudado a 
                    empresas como la tuya a transformar su presencia digital y lograr resultados excepcionales.
                  </p>
                  
                  <div className="space-y-8 mb-10">
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="h-12 w-12 bg-[#00CCFF]/20 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                          ME
                        </div>
                        <div>
                          <h3 className="font-rajdhani font-bold text-xl">Muebles Elegantes</h3>
                          <p className="text-gray-400">E-commerce de Muebles</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-[#00CCFF] mb-2">Desafío</h4>
                        <p className="text-gray-300">
                          La empresa tenía una web atractiva pero con tasas de conversión muy bajas (0.8%) 
                          y un coste de adquisición de cliente demasiado alto a través de sus campañas de Google y Facebook.
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-[#00CCFF] mb-2">Solución</h4>
                        <p className="text-gray-300">
                          Realizamos un análisis exhaustivo de su embudo de conversión e identificamos cuellos 
                          de botella críticos. Rediseñamos las páginas de producto, optimizamos el proceso de 
                          checkout y reestructuramos su estrategia de anuncios basada en segmentación avanzada.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-4 rounded-lg">
                        <h4 className="font-medium text-white mb-2">Resultados</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#00CCFF]">+245%</div>
                            <div className="text-sm text-gray-400">Aumento de conversiones</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#00CCFF]">-35%</div>
                            <div className="text-sm text-gray-400">Reducción en CPA</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#00CCFF]">+187%</div>
                            <div className="text-sm text-gray-400">Aumento de ROI</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="h-12 w-12 bg-[#9933FF]/20 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                          CD
                        </div>
                        <div>
                          <h3 className="font-rajdhani font-bold text-xl">Clínica Dental Sonrisas</h3>
                          <p className="text-gray-400">Servicios de Salud</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-[#9933FF] mb-2">Desafío</h4>
                        <p className="text-gray-300">
                          La clínica estaba invirtiendo una cantidad significativa en marketing digital pero 
                          recibía pocas solicitudes de cita y tenían dificultades para destacar en un mercado local competitivo.
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-[#9933FF] mb-2">Solución</h4>
                        <p className="text-gray-300">
                          Implementamos una estrategia de SEO local avanzada, creamos landing pages específicas 
                          para cada tratamiento y desarrollamos una campaña de Google Ads segmentada por ubicación 
                          y servicios con mayor margen.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-4 rounded-lg">
                        <h4 className="font-medium text-white mb-2">Resultados</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#9933FF]">+180%</div>
                            <div className="text-sm text-gray-400">Aumento de solicitudes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#9933FF]">Top 3</div>
                            <div className="text-sm text-gray-400">Posición en Google Maps</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#9933FF]">+68%</div>
                            <div className="text-sm text-gray-400">Aumento de ingresos</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">¿Quieres ser nuestro próximo caso de éxito?</h3>
                    <p className="text-gray-300 mb-4">
                      Descubre cómo podemos ayudarte a transformar tu negocio digital con estrategias basadas en datos y orientadas a resultados.
                    </p>
                    <a 
                      href="/consulta" 
                      className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                    >
                      Solicitar consultoría gratuita
                    </a>
                  </div>
                </div>
              )}
              
              {activeTab === 5 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Preguntas Frecuentes
                  </h2>
                  
                  <p className="text-gray-300 mb-8">
                    Respuestas a las preguntas más comunes sobre nuestros servicios de consultoría estratégica.
                  </p>
                  
                  <div className="space-y-6 mb-10">
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Cuánto tiempo lleva completar una consultoría estratégica?</h3>
                      <p className="text-gray-300">
                        El tiempo promedio para completar una consultoría estratégica completa es de 2-4 semanas, 
                        dependiendo de la complejidad del negocio y el alcance del proyecto. Sin embargo, comenzarás 
                        a recibir insights y recomendaciones desde la primera semana.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Qué información necesitan para empezar?</h3>
                      <p className="text-gray-300">
                        Para comenzar, necesitamos acceso a tus analíticas actuales (Google Analytics, Facebook Ads, 
                        Google Ads, etc.), información sobre tu modelo de negocio, objetivos comerciales y, si es posible, 
                        datos históricos de rendimiento. Proporcionamos una lista de verificación detallada al inicio del proyecto.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Ustedes implementan las recomendaciones o solo las sugieren?</h3>
                      <p className="text-gray-300">
                        Ofrecemos ambas opciones. Podemos proporcionar solo la estrategia y recomendaciones detalladas 
                        para que tu equipo las implemente, o podemos encargarnos de la implementación completa. También 
                        ofrecemos un modelo híbrido donde implementamos los componentes más técnicos y guiamos a tu equipo 
                        en el resto.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Cómo miden el éxito de la consultoría?</h3>
                      <p className="text-gray-300">
                        Definimos KPIs específicos al inicio del proyecto basados en tus objetivos de negocio. 
                        Estos pueden incluir aumento en conversiones, reducción del costo de adquisición, 
                        mejora en el posicionamiento SEO, aumento de tráfico cualificado, o cualquier otra 
                        métrica relevante para tu negocio. Realizamos seguimiento continuo de estos KPIs 
                        para medir el impacto de nuestras estrategias.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Qué pasa si ya tenemos una estrategia digital?</h3>
                      <p className="text-gray-300">
                        Si ya tienes una estrategia digital, nuestro enfoque será evaluarla, identificar 
                        oportunidades de mejora y optimizar los elementos que ya están funcionando. 
                        Nos adaptamos a tu situación actual y construimos sobre lo que ya has logrado, 
                        en lugar de empezar desde cero.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Ofrecen garantías de resultados?</h3>
                      <p className="text-gray-300">
                        Aunque no podemos garantizar resultados específicos debido a la variabilidad en los mercados 
                        y la implementación, sí ofrecemos una garantía de satisfacción. Si no estás satisfecho con 
                        la calidad de nuestro análisis y recomendaciones, trabajaremos contigo hasta que lo estés. 
                        Además, nuestro historial de casos de éxito demuestra nuestra capacidad para generar resultados 
                        significativos para nuestros clientes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">¿Tienes más preguntas?</h3>
                    <p className="text-gray-300 mb-4">
                      Estamos aquí para ayudarte. Agenda una llamada gratuita con uno de nuestros consultores 
                      para resolver todas tus dudas.
                    </p>
                    <a 
                      href="/consulta" 
                      className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                    >
                      Agendar llamada sin compromiso
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="contacto" className="py-16 bg-gradient-1">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-[#121217] rounded-xl p-8 border border-gray-800">
            <div className="text-center mb-8">
              <h2 className="font-rajdhani font-bold text-3xl mb-4 gradient-text">
                ¿Listo para transformar tu estrategia digital?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Agenda una consultoría estratégica gratuita y descubre cómo podemos ayudarte 
                a alcanzar tus objetivos de negocio a través de estrategias digitales efectivas.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                      placeholder="Tu nombre"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email-consultoria" className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email-consultoria"
                      className="w-full px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300">
                      Empresa
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="w-full px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                      ¿Cuál es tu principal desafío digital?
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white resize-none"
                      placeholder="Cuéntanos brevemente sobre tu situación actual..."
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30"
                  >
                    Solicitar consultoría gratuita
                  </button>
                </form>
              </div>
              
              <div>
                <div className="bg-[#1a1a23] p-6 rounded-lg mb-6">
                  <h3 className="font-rajdhani font-bold text-xl mb-4">¿Qué incluye la consultoría gratuita?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Evaluación inicial de tu presencia digital</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Identificación de oportunidades inmediatas</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Recomendaciones personalizadas para tu negocio</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Estimación de resultados potenciales</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#1a1a23] p-6 rounded-lg">
                  <h3 className="font-rajdhani font-bold text-xl mb-4">¿Prefieres hablar directamente?</h3>
                  <div className="space-y-4">
                    <a href="mailto:hola@tuweb.ai" className="flex items-center text-gray-300 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      hola@tuweb.ai
                    </a>
                    <a href="https://wa.me/543571416044" className="flex items-center text-gray-300 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      WhatsApp: +54 9 3571 416044
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}