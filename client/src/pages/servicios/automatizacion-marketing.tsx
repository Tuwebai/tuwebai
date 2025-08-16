import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedShape from '../../components/ui/animated-shape';

export default function AutomatizacionMarketing() {
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
                <span className="gradient-text">Automatización de Marketing</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-10">
                Automatización inteligente para escalar tus procesos de marketing y ventas
              </p>
              
              <motion.a 
                href="#contacto" 
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Solicitar demostración
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
                    <div className="font-medium">Automatización de Marketing</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 2 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(2)}
                  >
                    <div className="font-medium">Email Marketing</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 3 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(3)}
                  >
                    <div className="font-medium">CRM e Integraciones</div>
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
                  <div className="text-[#00CCFF] font-medium mb-2">¿Quieres ver cómo funciona?</div>
                  <p className="text-gray-400 text-sm mb-4">Solicita una demostración gratuita y descubre el poder de la automatización para tu negocio.</p>
                  <a 
                    href="/consulta" 
                    className="w-full block text-center py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                  >
                    Solicitar demo
                  </a>
                </div>
              </div>
            </div>
            
            {/* Main content based on selected tab */}
            <div className="md:col-span-2">
              {activeTab === 1 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Automatización de Marketing
                  </h2>
                  
                  <p className="text-gray-300 mb-6">
                    Automatiza tus procesos de marketing y ventas para escalar tu negocio sin aumentar 
                    tu equipo. Nuestras soluciones de automatización te ayudan a captar, nutrir y 
                    convertir leads de forma eficiente, permitiéndote enfocarte en el crecimiento estratégico.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#00CCFF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Lead Nurturing</h3>
                      <p className="text-gray-400">Flujos automatizados para guiar a tus prospectos a través del embudo de ventas hasta la conversión.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#9933FF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Customer Journey Mapping</h3>
                      <p className="text-gray-400">Diseño estratégico del recorrido del cliente para crear experiencias personalizadas en cada punto de contacto.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#00CCFF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Segmentación Avanzada</h3>
                      <p className="text-gray-400">Segmentación inteligente basada en comportamientos, intereses y etapa en el embudo de ventas.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#9933FF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Lead Scoring</h3>
                      <p className="text-gray-400">Sistema de puntuación para identificar los leads más cualificados y listos para la compra.</p>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">¿Por qué automatizar tus procesos?</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Escalabilidad sin sobrecostes</span>
                        <p className="text-gray-400 text-sm">Aumenta tu capacidad de gestión de leads y clientes sin necesidad de ampliar tu equipo proporcionalmente.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Consistencia en la comunicación</span>
                        <p className="text-gray-400 text-sm">Asegura que todos los leads reciban comunicaciones oportunas y relevantes, sin caer en el olvido.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Personalización a escala</span>
                        <p className="text-gray-400 text-sm">Ofrece experiencias personalizadas a miles de clientes simultáneamente gracias a la automatización inteligente.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Datos y análisis avanzados</span>
                        <p className="text-gray-400 text-sm">Obtén insights valiosos sobre el comportamiento de tus leads para optimizar tus estrategias de marketing.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">Plataformas con las que trabajamos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                        <div className="font-medium text-white">Marketing Automation</div>
                      </div>
                      <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                        <div className="font-medium text-white">Email Marketing</div>
                      </div>
                      <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                        <div className="font-medium text-white">CRM Integration</div>
                      </div>
                      <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                        <div className="font-medium text-white">Workflow Automation</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <a 
                        href="/consulta" 
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                      >
                        Solicitar consulta de automatización
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 2 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Email Marketing
                  </h2>
                  
                  <p className="text-gray-300 mb-6">
                    Estrategias de email marketing avanzadas que generan engagement y conversiones. 
                    Diseñamos, implementamos y optimizamos campañas de email personalizadas que 
                    conectan con tu audiencia y generan resultados medibles.
                  </p>
                  
                  <div className="relative h-64 md:h-80 mb-8 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 flex items-center justify-center">
                      <div className="bg-[#0a0a0f]/80 p-4 rounded-lg text-center">
                        <p className="text-white font-medium">Imagen de ejemplo de secuencia de emails</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">Nuestros servicios de Email Marketing</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Estrategia de Email Marketing</h3>
                      <p className="text-gray-400">
                        Desarrollo de estrategias personalizadas basadas en tus objetivos de negocio, 
                        audiencia y ciclo de ventas. Definimos el plan de contenidos, frecuencia, 
                        segmentación y métricas de éxito.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Diseño y Desarrollo de Emails</h3>
                      <p className="text-gray-400">
                        Creación de templates personalizados y responsivos que reflejan tu marca. 
                        Diseñamos emails optimizados para maximizar las aperturas, clics y conversiones.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Automatización de Secuencias</h3>
                      <p className="text-gray-400">
                        Implementación de flujos de emails automatizados para diferentes escenarios: 
                        bienvenida, nurturing, recuperación de carritos abandonados, reactivación de 
                        clientes, etc.
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
                        Monitoreo continuo del rendimiento de tus campañas, con informes detallados 
                        y optimización basada en datos para mejorar constantemente los resultados.
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">Tipos de campañas que desarrollamos</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                      <div className="font-medium text-white">Bienvenida</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                      <div className="font-medium text-white">Lead Nurturing</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                      <div className="font-medium text-white">Promocionales</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                      <div className="font-medium text-white">Recuperación</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                      <div className="font-medium text-white">Fidelización</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg text-center">
                      <div className="font-medium text-white">Eventos</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">Resultados promedio</h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4">
                        <div className="text-3xl font-bold text-[#00CCFF] mb-2">+40%</div>
                        <div className="text-gray-300">Tasa de apertura</div>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-3xl font-bold text-[#00CCFF] mb-2">+25%</div>
                        <div className="text-gray-300">Tasa de clics</div>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-3xl font-bold text-[#00CCFF] mb-2">42x</div>
                        <div className="text-gray-300">ROI promedio</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <a 
                        href="/consulta" 
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                      >
                        Solicitar estrategia de email marketing
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 3 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    CRM e Integraciones
                  </h2>
                  
                  <p className="text-gray-300 mb-6">
                    Implementación, configuración y optimización de sistemas CRM e integraciones 
                    con otras herramientas para centralizar tus datos y optimizar tus procesos 
                    de marketing y ventas.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <h3 className="font-rajdhani font-bold text-xl mb-3 text-[#00CCFF]">Implementación de CRM</h3>
                      <p className="text-gray-300">
                        Configuramos y personalizamos tu sistema CRM para que se adapte perfectamente 
                        a los procesos y necesidades específicas de tu negocio. Trabajamos con las 
                        principales plataformas del mercado:
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="flex items-center bg-[#0a0a0f] p-3 rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Marketing Automation</span>
                        </div>
                        <div className="flex items-center bg-[#0a0a0f] p-3 rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Salesforce</span>
                        </div>
                        <div className="flex items-center bg-[#0a0a0f] p-3 rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Zoho CRM</span>
                        </div>
                        <div className="flex items-center bg-[#0a0a0f] p-3 rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Pipedrive</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <h3 className="font-rajdhani font-bold text-xl mb-3 text-[#9933FF]">Integraciones</h3>
                      <p className="text-gray-300">
                        Conectamos tus diferentes herramientas y plataformas para crear un ecosistema 
                        digital coherente y eficiente que centralice datos y automatice procesos:
                      </p>
                      <ul className="space-y-2 mt-4">
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">CRM + Web (formularios, chat, etc.)</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">CRM + Email Marketing</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">CRM + Redes Sociales</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">CRM + ERP o software de gestión</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">Beneficios de un CRM bien implementado</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <div className="ml-4">
                        <span className="font-medium text-white">Visión 360° de tus clientes</span>
                        <p className="text-gray-400 text-sm">Centraliza toda la información y el historial de interacciones con cada cliente en un solo lugar.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <div className="ml-4">
                        <span className="font-medium text-white">Mejora en la conversión de leads</span>
                        <p className="text-gray-400 text-sm">Seguimiento estructurado del ciclo de ventas y automatización de seguimientos para no perder oportunidades.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <div className="ml-4">
                        <span className="font-medium text-white">Datos precisos para decisiones estratégicas</span>
                        <p className="text-gray-400 text-sm">Reportes y dashboards personalizados con métricas clave para tu negocio.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-bold">
                        4
                      </div>
                      <div className="ml-4">
                        <span className="font-medium text-white">Ahorro de tiempo en tareas manuales</span>
                        <p className="text-gray-400 text-sm">Automatización de procesos repetitivos para que tu equipo se enfoque en lo que realmente importa.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">Nuestro servicio incluye</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Análisis de necesidades y procesos</span>
                      </div>
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Configuración personalizada</span>
                      </div>
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Migración de datos</span>
                      </div>
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Integraciones con otras plataformas</span>
                      </div>
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Automatización de procesos clave</span>
                      </div>
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Capacitación de usuarios</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <a 
                        href="/consulta" 
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                      >
                        Solicitar implementación de CRM
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
                    Descubre cómo hemos ayudado a empresas como la tuya a transformar sus 
                    procesos de marketing y ventas a través de la automatización inteligente.
                  </p>
                  
                  <div className="space-y-12 mb-10">
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center mb-6">
                        <div className="md:w-1/4 mb-4 md:mb-0">
                          <div className="h-20 w-20 bg-[#00CCFF]/20 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                            SB
                          </div>
                        </div>
                        <div className="md:w-3/4">
                          <h3 className="font-rajdhani font-bold text-2xl mb-1 text-white">Software B2B</h3>
                          <p className="text-gray-400 mb-2">Implementación CRM + Automatización Marketing</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs bg-[#00CCFF]/20 text-[#00CCFF] px-2 py-1 rounded">Marketing Automation</span>
                            <span className="text-xs bg-[#9933FF]/20 text-[#9933FF] px-2 py-1 rounded">Lead Nurturing</span>
                            <span className="text-xs bg-[#00CCFF]/20 text-[#00CCFF] px-2 py-1 rounded">CRM</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-[#00CCFF] mb-2">Desafío</h4>
                        <p className="text-gray-300">
                          Empresa de software B2B con un proceso de ventas complejo y ciclos largos. 
                          Generaban leads pero tenían dificultades para hacer seguimiento efectivo 
                          y la tasa de conversión era baja. No tenían visibilidad del customer journey.
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-[#00CCFF] mb-2">Solución Implementada</h4>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Implementación de Marketing Automation (Marketing, Sales y Service Hub)</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Desarrollo de flujos de nurturing segmentados por industria y fase del ciclo de compra</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Implementación de lead scoring basado en comportamiento y perfil</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Automatización del proceso de ventas con alertas y tareas para el equipo comercial</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-4 rounded-lg">
                        <h4 className="font-medium text-white mb-3">Resultados (en 4 meses)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#00CCFF]">-40%</div>
                            <div className="text-sm text-gray-400">Reducción en CAC</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#00CCFF]">+68%</div>
                            <div className="text-sm text-gray-400">Tasa de conversión</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#00CCFF]">+45%</div>
                            <div className="text-sm text-gray-400">Leads cualificados</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#00CCFF]">15h</div>
                            <div className="text-sm text-gray-400">Ahorro semanal en tareas</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center mb-6">
                        <div className="md:w-1/4 mb-4 md:mb-0">
                          <div className="h-20 w-20 bg-[#9933FF]/20 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                            EC
                          </div>
                        </div>
                        <div className="md:w-3/4">
                          <h3 className="font-rajdhani font-bold text-2xl mb-1 text-white">E-commerce de Moda</h3>
                          <p className="text-gray-400 mb-2">Email Marketing + Automatización</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs bg-[#00CCFF]/20 text-[#00CCFF] px-2 py-1 rounded">Email Marketing</span>
                            <span className="text-xs bg-[#9933FF]/20 text-[#9933FF] px-2 py-1 rounded">Shopify</span>
                            <span className="text-xs bg-[#00CCFF]/20 text-[#00CCFF] px-2 py-1 rounded">Email Marketing</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-[#9933FF] mb-2">Desafío</h4>
                        <p className="text-gray-300">
                          E-commerce de moda con buenas cifras de tráfico pero alta tasa de abandono 
                          de carrito (85%) y poca recurrencia de compra. Sus emails tenían baja tasa 
                          de apertura y no aprovechaban la segmentación.
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-[#9933FF] mb-2">Solución Implementada</h4>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Implementación de Email Marketing con integración avanzada con Shopify</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Automatización de recuperación de carritos abandonados con secuencia de 3 emails</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Segmentación avanzada basada en historial de compras y comportamiento de navegación</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Diseño y desarrollo de templates personalizados de alto impacto visual</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-r from-[#9933FF]/10 to-[#00CCFF]/10 p-4 rounded-lg">
                        <h4 className="font-medium text-white mb-3">Resultados (en 2 meses)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#9933FF]">+32%</div>
                            <div className="text-sm text-gray-400">Recuperación de carritos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#9933FF]">+47%</div>
                            <div className="text-sm text-gray-400">Tasa de apertura emails</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#9933FF]">+25%</div>
                            <div className="text-sm text-gray-400">Ingreso por cliente</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#9933FF]">38x</div>
                            <div className="text-sm text-gray-400">ROI de email marketing</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg text-center">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">¿Quieres ser nuestro próximo caso de éxito?</h3>
                    <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
                      Descubre cómo podemos ayudarte a escalar tus procesos de marketing y ventas 
                      a través de la automatización inteligente.
                    </p>
                    <a 
                      href="/consulta" 
                      className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                    >
                      Solicitar demostración gratuita
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
                    Respuestas a las preguntas más comunes sobre automatización de marketing y CRM.
                  </p>
                  
                  <div className="space-y-6 mb-10">
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Qué plataforma de automatización es mejor para mi negocio?</h3>
                      <p className="text-gray-300">
                        La elección de la plataforma adecuada depende de diversos factores como el 
                        tamaño de tu empresa, industria, presupuesto, objetivos y complejidad de tus 
                        procesos. Por ejemplo, las plataformas de Marketing Automation son ideales para empresas que buscan una solución 
                        all-in-one con un fuerte componente de inbound marketing, mientras que 
                        las herramientas de Email Marketing son excelentes para negocios centrados en email marketing con 
                        automatización avanzada a un precio más asequible. Durante nuestra consulta 
                        inicial, analizamos tus necesidades específicas para recomendarte la solución 
                        más adecuada.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Podré gestionar la plataforma yo mismo después de la implementación?</h3>
                      <p className="text-gray-300">
                        Sí, ese es precisamente nuestro objetivo. Además de implementar la solución, 
                        proporcionamos capacitación personalizada para tu equipo y documentación detallada 
                        para que puedas gestionar y aprovechar la plataforma de forma autónoma. No obstante, 
                        también ofrecemos servicios de soporte y mantenimiento continuo para aquellos 
                        clientes que prefieren externalizar la gestión técnica o necesitan apoyo puntual 
                        para optimizaciones avanzadas.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Cuánto tiempo lleva implementar una solución de automatización?</h3>
                      <p className="text-gray-300">
                        El tiempo de implementación varía según la complejidad del proyecto, pero 
                        generalmente oscila entre 2-8 semanas. La configuración básica puede estar 
                        lista en 1-2 semanas, mientras que integraciones complejas, migraciones de 
                        datos extensos y automatizaciones avanzadas pueden requerir más tiempo. 
                        Trabajamos con un enfoque por fases que permite comenzar a obtener resultados 
                        rápidamente mientras se implementan gradualmente funcionalidades más avanzadas.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Qué tipo de resultados puedo esperar?</h3>
                      <p className="text-gray-300">
                        Los resultados varían según tu situación actual y objetivos, pero nuestros 
                        clientes suelen experimentar mejoras significativas en varios aspectos: 
                        aumento en tasas de conversión de leads (30-70%), reducción del tiempo 
                        dedicado a tareas manuales (60-80%), mejora en tasas de apertura y clics 
                        de emails (30-50%), reducción en ciclos de venta (20-40%) y aumento en 
                        retención de clientes (15-35%). En nuestra propuesta inicial, estableceremos 
                        KPIs específicos basados en tu situación actual y objetivos.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Qué pasa con mis datos existentes?</h3>
                      <p className="text-gray-300">
                        Realizamos un proceso estructurado de migración de datos que incluye limpieza, 
                        normalización e importación a la nueva plataforma. Conservamos todo el 
                        historial valioso de tus clientes y leads, asegurando la integridad de los 
                        datos y minimizando cualquier interrupción en tus operaciones. Antes de la 
                        migración definitiva, hacemos pruebas para verificar que todo funcione 
                        correctamente, y mantenemos copias de seguridad de los datos originales 
                        como medida de seguridad adicional.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Cómo se integra con mi sitio web u otras herramientas?</h3>
                      <p className="text-gray-300">
                        Desarrollamos integraciones personalizadas entre tu plataforma de automatización 
                        y otras herramientas de tu stack tecnológico. Esto puede incluir tu sitio web, 
                        e-commerce, ERP, sistemas de atención al cliente, plataformas de webinars, 
                        herramientas de análisis, etc. Utilizamos APIs nativas, webhooks, herramientas de integración u otras 
                        soluciones dependiendo de tus necesidades específicas. El 
                        objetivo es crear un ecosistema digital coherente donde los datos fluyan 
                        automáticamente entre sistemas, eliminando silos de información y procesos manuales.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">¿Tienes más preguntas?</h3>
                    <p className="text-gray-300 mb-4">
                      Estamos aquí para ayudarte. Agenda una llamada gratuita con uno de nuestros 
                      especialistas en automatización para resolver todas tus dudas.
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
                ¿Listo para automatizar tu marketing?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Solicita una demostración gratuita y descubre cómo nuestra solución de 
                automatización puede ayudarte a escalar tu negocio.
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
                    <label htmlFor="email-automatizacion" className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email-automatizacion"
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
                    <label htmlFor="interest" className="block text-sm font-medium text-gray-300">
                      ¿Qué te interesa?
                    </label>
                    <select
                      id="interest"
                      className="w-full px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="marketing">Automatización de Marketing</option>
                      <option value="email">Email Marketing</option>
                      <option value="crm">Implementación de CRM</option>
                      <option value="everything">Solución integral</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30"
                  >
                    Solicitar demostración gratuita
                  </button>
                </form>
              </div>
              
              <div>
                <div className="bg-[#1a1a23] p-6 rounded-lg mb-6">
                  <h3 className="font-rajdhani font-bold text-xl mb-4">Tu demostración incluye</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Análisis de tu situación actual</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Demostración práctica de la plataforma</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Ejemplos de automatizaciones específicas para tu negocio</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Estimación de resultados potenciales</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Recomendaciones personalizadas</span>
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