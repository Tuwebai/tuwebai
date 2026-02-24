import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedShape from '../../components/ui/animated-shape';

export default function PosicionamientoMarketing() {
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
                <span className="gradient-text">Posicionamiento y Marketing</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-10">
                Estrategias avanzadas de marketing digital para atraer, convertir y fidelizar clientes
              </p>
              
              <motion.a 
                href="#contacto" 
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Solicitar análisis gratuito
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
                  Nuestros Servicios
                </h3>
                
                <ul className="space-y-4">
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 1 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(1)}
                  >
                    <div className="font-medium">SEO Avanzado</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 2 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(2)}
                  >
                    <div className="font-medium">Publicidad Digital (PPC)</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 3 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(3)}
                  >
                    <div className="font-medium">Optimización de Conversión (CRO)</div>
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
                  <div className="text-[#00CCFF] font-medium mb-2">¿No sabes por dónde empezar?</div>
                  <p className="text-gray-400 text-sm mb-4">Solicita un análisis gratuito de tu presencia digital y descubre oportunidades de mejora.</p>
                  <a 
                    href="/consulta" 
                    className="w-full block text-center py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                  >
                    Solicitar análisis gratuito
                  </a>
                </div>
              </div>
            </div>
            
            {/* Main content based on selected tab */}
            <div className="md:col-span-2">
              {activeTab === 1 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    SEO Avanzado
                  </h2>
                  
                  <p className="text-gray-300 mb-6">
                    Posiciona tu negocio en los primeros resultados de búsqueda con nuestras 
                    estrategias de SEO avanzadas y personalizadas. Combinamos investigación de palabras 
                    clave, optimización técnica y creación de contenido de calidad para aumentar 
                    tu visibilidad orgánica.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#00CCFF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Auditoría SEO Completa</h3>
                      <p className="text-gray-400">Análisis exhaustivo de tu sitio web para identificar problemas técnicos y oportunidades de mejora.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#9933FF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Optimización On-Page</h3>
                      <p className="text-gray-400">Mejora de elementos clave como meta etiquetas, estructura de URL, contenido y velocidad de carga.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#00CCFF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">SEO Técnico</h3>
                      <p className="text-gray-400">Optimización de aspectos técnicos como sitemap, enlaces internos, datos estructurados y experiencia móvil.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#9933FF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Link Building Estratégico</h3>
                      <p className="text-gray-400">Estrategias avanzadas para conseguir enlaces de calidad que aumenten la autoridad de tu dominio.</p>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">Nuestro proceso SEO</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex">
                      <div className="flex-shrink-0 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full h-10 w-10 flex items-center justify-center font-bold text-white">
                        1
                      </div>
                      <div className="ml-4">
                        <h4 className="font-rajdhani font-bold text-xl mb-2">Auditoría e Investigación</h4>
                        <p className="text-gray-400">
                          Análisis exhaustivo de tu sitio web, competencia y público objetivo. 
                          Investigación de palabras clave para identificar oportunidades de alto valor.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full h-10 w-10 flex items-center justify-center font-bold text-white">
                        2
                      </div>
                      <div className="ml-4">
                        <h4 className="font-rajdhani font-bold text-xl mb-2">Estrategia Personalizada</h4>
                        <p className="text-gray-400">
                          Desarrollo de un plan SEO a medida basado en los hallazgos de la auditoría 
                          y alineado con tus objetivos de negocio.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full h-10 w-10 flex items-center justify-center font-bold text-white">
                        3
                      </div>
                      <div className="ml-4">
                        <h4 className="font-rajdhani font-bold text-xl mb-2">Implementación</h4>
                        <p className="text-gray-400">
                          Optimización técnica, mejora del contenido existente, creación de nuevo 
                          contenido, y ejecución de estrategias de link building.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full h-10 w-10 flex items-center justify-center font-bold text-white">
                        4
                      </div>
                      <div className="ml-4">
                        <h4 className="font-rajdhani font-bold text-xl mb-2">Monitoreo y Ajustes</h4>
                        <p className="text-gray-400">
                          Seguimiento constante del rendimiento, análisis de resultados y ajustes 
                          continuos para maximizar el ROI.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full h-10 w-10 flex items-center justify-center font-bold text-white">
                        5
                      </div>
                      <div className="ml-4">
                        <h4 className="font-rajdhani font-bold text-xl mb-2">Informes y Análisis</h4>
                        <p className="text-gray-400">
                          Reportes detallados con métricas clave y recomendaciones para continuar 
                          mejorando tu posicionamiento.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">Resultados que puedes esperar</h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4">
                        <div className="text-3xl font-bold text-[#00CCFF] mb-2">+200%</div>
                        <div className="text-gray-300">Aumento de tráfico orgánico</div>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-3xl font-bold text-[#00CCFF] mb-2">Top 10</div>
                        <div className="text-gray-300">Posiciones para palabras clave principales</div>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-3xl font-bold text-[#00CCFF] mb-2">+150%</div>
                        <div className="text-gray-300">Aumento en leads generados</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <a 
                        href="/consulta" 
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                      >
                        Solicitar auditoría SEO gratuita
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 2 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Publicidad Digital (PPC)
                  </h2>
                  
                  <p className="text-gray-300 mb-6">
                    Campañas de publicidad digital altamente segmentadas y optimizadas para 
                    maximizar tu retorno de inversión. Gestionamos estratégicamente tus campañas 
                    en Google Ads, Facebook Ads, LinkedIn Ads y otras plataformas relevantes para tu negocio.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Google Ads</h3>
                      <p className="text-gray-400">
                        Campañas en la red de búsqueda, display, shopping y YouTube optimizadas 
                        para captar usuarios con intención de compra.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Facebook & Instagram Ads</h3>
                      <p className="text-gray-400">
                        Publicidad altamente segmentada por intereses, comportamientos y datos 
                        demográficos para generar awareness y leads cualificados.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">LinkedIn Ads</h3>
                      <p className="text-gray-400">
                        Campañas B2B dirigidas a profesionales y empresas específicas, ideales 
                        para servicios corporativos y generación de leads B2B.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Análisis y Optimización</h3>
                      <p className="text-gray-400">
                        Monitoreo constante de resultados y optimización continua para maximizar 
                        el retorno de inversión y reducir el costo por adquisición.
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">¿Por qué nuestras campañas generan mejores resultados?</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Segmentación avanzada</span>
                        <p className="text-gray-400 text-sm">Utilizamos técnicas avanzadas de segmentación para mostrar tus anuncios solo a usuarios altamente cualificados.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Pruebas A/B continuas</span>
                        <p className="text-gray-400 text-sm">Testamos constantemente diferentes elementos de las campañas para identificar las combinaciones más efectivas.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Optimización basada en datos</span>
                        <p className="text-gray-400 text-sm">Tomamos decisiones basadas en datos, no en suposiciones, para maximizar el rendimiento de tu inversión.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Landing pages optimizadas</span>
                        <p className="text-gray-400 text-sm">Creamos landing pages específicas para cada campaña, diseñadas para maximizar la conversión.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                      <h3 className="font-rajdhani font-bold text-xl mb-4">Plan Básico</h3>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">1 plataforma publicitaria</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Configuración inicial de campañas</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Optimización semanal</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Informe mensual de resultados</span>
                        </li>
                      </ul>
                      <div className="text-center">
                        <a 
                          href="/consulta" 
                          className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                        >
                          Solicitar presupuesto
                        </a>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-[#9933FF]/10 to-[#00CCFF]/10 p-6 rounded-lg">
                      <h3 className="font-rajdhani font-bold text-xl mb-4">Plan Premium</h3>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Múltiples plataformas</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Estrategia publicitaria integral</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Optimización continua</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Desarrollo de landing pages</span>
                        </li>
                      </ul>
                      <div className="text-center">
                        <a 
                          href="/consulta" 
                          className="inline-block px-6 py-3 bg-gradient-to-r from-[#9933FF] to-[#00CCFF] rounded-lg text-white font-medium"
                        >
                          Solicitar presupuesto
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 3 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Optimización de Conversión (CRO)
                  </h2>
                  
                  <p className="text-gray-300 mb-6">
                    Maximiza el rendimiento de tu sitio web y campañas digitales con estrategias 
                    de CRO (Conversion Rate Optimization) basadas en datos. Aumentamos 
                    significativamente el porcentaje de visitantes que realizan las acciones deseadas.
                  </p>
                  
                  <div className="relative h-64 md:h-80 mb-8 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 flex items-center justify-center">
                      <div className="bg-[#0a0a0f]/80 p-4 rounded-lg text-center">
                        <p className="text-white font-medium">Imagen ilustrativa de funnel de conversión</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">Nuestro proceso de CRO</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <h4 className="font-rajdhani font-bold text-xl mb-3 text-[#00CCFF]">1. Análisis y Diagnóstico</h4>
                      <p className="text-gray-300">
                        Analizamos detalladamente tu embudo de conversión actual utilizando herramientas 
                        como Google Analytics, heatmaps, mapas de clics y grabaciones de sesiones para 
                        identificar cuellos de botella y áreas de mejora.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <h4 className="font-rajdhani font-bold text-xl mb-3 text-[#9933FF]">2. Hipótesis y Planificación</h4>
                      <p className="text-gray-300">
                        Formulamos hipótesis basadas en los datos recopilados y establecemos un plan 
                        de pruebas A/B priorizadas según su potencial impacto y factibilidad de implementación.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <h4 className="font-rajdhani font-bold text-xl mb-3 text-[#00CCFF]">3. Implementación de Tests</h4>
                      <p className="text-gray-300">
                        Ejecutamos pruebas A/B y multivariantes para elementos clave como títulos, 
                        llamadas a la acción, formularios, diseño y otros componentes que influyen 
                        en la conversión.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <h4 className="font-rajdhani font-bold text-xl mb-3 text-[#9933FF]">4. Análisis de Resultados</h4>
                      <p className="text-gray-300">
                        Evaluamos los resultados de las pruebas para determinar qué variantes generan 
                        mejores tasas de conversión y por qué, extrayendo insights valiosos para 
                        futuras optimizaciones.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <h4 className="font-rajdhani font-bold text-xl mb-3 text-[#00CCFF]">5. Implementación y Mejora Continua</h4>
                      <p className="text-gray-300">
                        Implementamos los cambios ganadores y continuamos con nuevas pruebas en un 
                        ciclo de mejora continua para seguir aumentando progresivamente las tasas 
                        de conversión.
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">Elementos que optimizamos</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#0a0a0f] p-4 rounded-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Páginas de destino</span>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Llamadas a la acción</span>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Formularios</span>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Navegación del sitio</span>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Proceso de checkout</span>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Contenido persuasivo</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">Resultados promedio</h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4">
                        <div className="text-3xl font-bold text-[#00CCFF] mb-2">+75%</div>
                        <div className="text-gray-300">Aumento en tasa de conversión</div>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-3xl font-bold text-[#00CCFF] mb-2">-40%</div>
                        <div className="text-gray-300">Reducción en tasa de rebote</div>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-3xl font-bold text-[#00CCFF] mb-2">+120%</div>
                        <div className="text-gray-300">Mejora en ROI de marketing</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <a 
                        href="/consulta" 
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                      >
                        Solicitar análisis de conversión
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 4 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Casos de Éxito
                  </h2>
                  
                  <p className="text-gray-300 mb-8">
                    Resultados reales que hemos conseguido para nuestros clientes con estrategias 
                    personalizadas de posicionamiento y marketing digital.
                  </p>
                  
                  <div className="space-y-12 mb-10">
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center mb-6">
                        <div className="md:w-1/4 mb-4 md:mb-0">
                          <div className="h-20 w-20 bg-[#9933FF]/20 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                            EM
                          </div>
                        </div>
                        <div className="md:w-3/4">
                          <h3 className="font-rajdhani font-bold text-2xl mb-1 text-white">E-commerce de Muebles</h3>
                          <p className="text-gray-400 mb-2">Estrategia SEO + Google Ads + CRO</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs bg-[#00CCFF]/20 text-[#00CCFF] px-2 py-1 rounded">SEO</span>
                            <span className="text-xs bg-[#9933FF]/20 text-[#9933FF] px-2 py-1 rounded">Google Ads</span>
                            <span className="text-xs bg-[#00CCFF]/20 text-[#00CCFF] px-2 py-1 rounded">CRO</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-[#00CCFF] mb-2">Desafío</h4>
                        <p className="text-gray-300">
                          Tienda online de muebles con tráfico decente pero baja tasa de conversión (0.8%) 
                          y alto costo de adquisición en sus campañas de Google Ads y Facebook.
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-[#00CCFF] mb-2">Estrategia Implementada</h4>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Optimización SEO completa enfocada en palabras clave de alta intención de compra</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Reestructuración de campañas de Google Ads con segmentación avanzada</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Optimización del proceso de compra con testing A/B de páginas de producto</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-4 rounded-lg">
                        <h4 className="font-medium text-white mb-3">Resultados (en 3 meses)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#00CCFF]">+245%</div>
                            <div className="text-sm text-gray-400">Aumento en conversiones</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#00CCFF]">+89%</div>
                            <div className="text-sm text-gray-400">Tráfico orgánico</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#00CCFF]">-35%</div>
                            <div className="text-sm text-gray-400">Costo por adquisición</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#00CCFF]">8.5x</div>
                            <div className="text-sm text-gray-400">ROI en publicidad</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center mb-6">
                        <div className="md:w-1/4 mb-4 md:mb-0">
                          <div className="h-20 w-20 bg-[#00CCFF]/20 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                            CD
                          </div>
                        </div>
                        <div className="md:w-3/4">
                          <h3 className="font-rajdhani font-bold text-2xl mb-1 text-white">Clínica Dental</h3>
                          <p className="text-gray-400 mb-2">SEO Local + Google Ads</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs bg-[#00CCFF]/20 text-[#00CCFF] px-2 py-1 rounded">SEO Local</span>
                            <span className="text-xs bg-[#9933FF]/20 text-[#9933FF] px-2 py-1 rounded">Google Ads</span>
                            <span className="text-xs bg-[#00CCFF]/20 text-[#00CCFF] px-2 py-1 rounded">Landing Pages</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-[#9933FF] mb-2">Desafío</h4>
                        <p className="text-gray-300">
                          Clínica dental con baja visibilidad en búsquedas locales y dificultad para 
                          captar nuevos pacientes en un mercado altamente competitivo.
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-[#9933FF] mb-2">Estrategia Implementada</h4>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Estrategia de SEO local completa con optimización de Google My Business</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Creación de landing pages específicas para cada tratamiento</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Campañas de Google Ads geo-segmentadas con extensiones de ubicación</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-r from-[#9933FF]/10 to-[#00CCFF]/10 p-4 rounded-lg">
                        <h4 className="font-medium text-white mb-3">Resultados (en 2 meses)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#9933FF]">+180%</div>
                            <div className="text-sm text-gray-400">Aumento en solicitudes de citas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#9933FF]">TOP 3</div>
                            <div className="text-sm text-gray-400">Posición en Google Maps</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#9933FF]">+220%</div>
                            <div className="text-sm text-gray-400">Tráfico local cualificado</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#9933FF]">+68%</div>
                            <div className="text-sm text-gray-400">Aumento en ingresos</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg text-center">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">¿Quieres ser nuestro próximo caso de éxito?</h3>
                    <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
                      Descubre cómo podemos ayudarte a alcanzar tus objetivos de marketing digital 
                      con estrategias personalizadas y basadas en datos.
                    </p>
                    <a 
                      href="/consulta" 
                      className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                    >
                      Solicitar diagnóstico gratuito
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
                    Respuestas a las preguntas más comunes sobre nuestros servicios de posicionamiento y marketing digital.
                  </p>
                  
                  <div className="space-y-6 mb-10">
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Cuánto tiempo se tarda en ver resultados con el SEO?</h3>
                      <p className="text-gray-300">
                        El SEO es una estrategia a medio-largo plazo. Generalmente, comenzarás a ver mejoras 
                        en el tráfico y posicionamiento en un periodo de 3-6 meses, aunque esto puede 
                        variar según la competitividad de tu sector, el estado actual de tu sitio web, 
                        y la agresividad de la estrategia implementada. No obstante, solemos conseguir 
                        algunas "victorias rápidas" en las primeras semanas que generan mejoras iniciales.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Qué plataformas publicitarias son mejores para mi negocio?</h3>
                      <p className="text-gray-300">
                        La elección de plataformas depende de tu tipo de negocio, público objetivo y 
                        objetivos de marketing. Google Ads es excelente para captar usuarios con 
                        intención de compra, mientras que Facebook e Instagram Ads funcionan mejor 
                        para construcción de marca y productos visuales. LinkedIn es ideal para B2B. 
                        En nuestra consulta inicial, analizamos tu caso específico y recomendamos las 
                        plataformas más adecuadas para maximizar tu ROI.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Cómo miden el éxito de las campañas?</h3>
                      <p className="text-gray-300">
                        Definimos KPIs específicos alineados con tus objetivos de negocio, que pueden 
                        incluir conversiones, leads generados, coste por adquisición, retorno de 
                        inversión, posicionamiento en buscadores, tráfico cualificado, etc. Utilizamos 
                        herramientas avanzadas de analytics para seguir estos KPIs y proporcionamos 
                        informes detallados y transparentes que muestran claramente el impacto de 
                        nuestras estrategias.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Necesito tener un presupuesto mínimo para publicidad?</h3>
                      <p className="text-gray-300">
                        Sí, recomendamos un presupuesto mínimo que varía según la plataforma y la 
                        competitividad de tu sector. Esto es necesario para recopilar datos suficientes 
                        y optimizar efectivamente las campañas. Para Google Ads, por ejemplo, sugerimos 
                        un mínimo de 300-500€ mensuales en sectores poco competitivos, y más en 
                        industrias competitivas. Durante nuestra consulta inicial, te proporcionaremos 
                        recomendaciones específicas basadas en tu industria y objetivos.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Con qué frecuencia recibiré informes sobre el rendimiento?</h3>
                      <p className="text-gray-300">
                        Proporcionamos informes mensuales detallados con análisis y recomendaciones, 
                        además de acceso a dashboards en tiempo real para que puedas monitorear el 
                        rendimiento cuando lo desees. También programamos llamadas de revisión regulares 
                        para discutir los resultados y ajustar la estrategia según sea necesario. 
                        Para campañas críticas o de corta duración, podemos proporcionar informes 
                        semanales si es necesario.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Qué hace que vuestro enfoque de CRO sea efectivo?</h3>
                      <p className="text-gray-300">
                        Nuestra efectividad en CRO se basa en tres pilares: 1) Un enfoque basado 
                        exclusivamente en datos, no en opiniones o tendencias, 2) Un proceso 
                        estructurado de hipótesis y pruebas, y 3) La experiencia específica en 
                        diferentes sectores que nos permite identificar rápidamente patrones y 
                        aplicar soluciones probadas. Además, utilizamos tecnología avanzada para 
                        el análisis de comportamiento del usuario que proporciona insights más 
                        profundos que las herramientas estándar.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">¿Tienes más preguntas?</h3>
                    <p className="text-gray-300 mb-4">
                      Estamos aquí para ayudarte. Agenda una llamada gratuita con uno de nuestros 
                      especialistas en marketing digital para resolver todas tus dudas.
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
                ¿Listo para impulsar tu presencia digital?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Solicita un diagnóstico gratuito de tu situación actual y descubre cómo podemos 
                ayudarte a conseguir más clientes y aumentar tus ventas.
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
                    <label htmlFor="email-posicionamiento" className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email-posicionamiento"
                      className="w-full px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-300">
                      Sitio web (opcional)
                    </label>
                    <input
                      type="url"
                      id="website"
                      className="w-full px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                      placeholder="https://tusitio.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-300">
                      Servicio de interés
                    </label>
                    <select
                      id="service"
                      className="w-full px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="seo">SEO</option>
                      <option value="ppc">Publicidad Digital</option>
                      <option value="cro">Optimización de Conversión</option>
                      <option value="all">Estrategia integral</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30"
                  >
                    Solicitar diagnóstico gratuito
                  </button>
                </form>
              </div>
              
              <div>
                <div className="bg-[#1a1a23] p-6 rounded-lg mb-6">
                  <h3 className="font-rajdhani font-bold text-xl mb-4">Tu diagnóstico gratuito incluye</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Análisis de tu presencia digital actual</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Identificación de oportunidades de mejora</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Comparativa con competidores principales</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Recomendaciones estratégicas personalizadas</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Estimación de resultados potenciales</span>
                    </li>
                  </ul>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}