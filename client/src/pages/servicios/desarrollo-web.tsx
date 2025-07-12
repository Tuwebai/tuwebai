import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedShape from '../../components/ui/animated-shape';

export default function DesarrolloWeb() {
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
                <span className="gradient-text">Desarrollo Web Profesional</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-10">
                Sitios web de alto rendimiento diseñados para convertir visitantes en clientes
              </p>
              
              <motion.a 
                href="#contacto" 
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Solicitar presupuesto
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
                    <div className="font-medium">Sitios Web Corporativos</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 2 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(2)}
                  >
                    <div className="font-medium">Landing Pages Optimizadas</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 3 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(3)}
                  >
                    <div className="font-medium">Tecnologías y Herramientas</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 4 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(4)}
                  >
                    <div className="font-medium">Portafolio de Proyectos</div>
                  </li>
                  <li 
                    className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${activeTab === 5 ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 border-l-4 border-[#00CCFF]' : 'hover:bg-[#1a1a23]'}`}
                    onClick={() => setActiveTab(5)}
                  >
                    <div className="font-medium">Preguntas Frecuentes</div>
                  </li>
                </ul>
                
                <div className="mt-8 p-4 bg-[#1a1a23] rounded-lg">
                  <div className="text-[#00CCFF] font-medium mb-2">¿Necesitas asesoramiento?</div>
                  <p className="text-gray-400 text-sm mb-4">Agenda una llamada gratuita con uno de nuestros expertos en desarrollo web</p>
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
                    Sitios Web Corporativos
                  </h2>
                  
                  <p className="text-gray-300 mb-6">
                    Desarrollamos sitios web corporativos premium que no solo destacan visualmente, 
                    sino que están diseñados estratégicamente para generar confianza, comunicar tu propuesta 
                    de valor y convertir visitantes en clientes.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#00CCFF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Diseño UI/UX Personalizado</h3>
                      <p className="text-gray-400">Interfaces atractivas y funcionales diseñadas específicamente para tu marca y objetivos comerciales.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#9933FF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Optimización para Móviles</h3>
                      <p className="text-gray-400">Experiencia perfecta en todos los dispositivos, garantizando que tu sitio se vea profesional en cualquier pantalla.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#00CCFF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Optimización SEO</h3>
                      <p className="text-gray-400">Estructura y código optimizados para mejorar tu posicionamiento en motores de búsqueda.</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg border-l-4 border-[#9933FF]">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">CMS Personalizado</h3>
                      <p className="text-gray-400">Panel de administración intuitivo para que puedas actualizar fácilmente el contenido de tu sitio.</p>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">Características técnicas</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Velocidad ultrarrápida</span>
                        <p className="text-gray-400 text-sm">Optimización avanzada para tiempos de carga menores a 2 segundos, mejorando la experiencia de usuario y el SEO.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Seguridad avanzada</span>
                        <p className="text-gray-400 text-sm">Protección contra ataques comunes, certificados SSL, y actualizaciones de seguridad regulares.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Accesibilidad web</span>
                        <p className="text-gray-400 text-sm">Cumplimiento de estándares WCAG para garantizar que tu sitio sea accesible para todos los usuarios.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Integraciones avanzadas</span>
                        <p className="text-gray-400 text-sm">Conexión con CRM, herramientas de marketing, analytics y cualquier otro sistema que necesites.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">Incluye</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Diseño UX/UI a medida</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Optimización SEO básica</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Panel de administración</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Alojamiento (1 año)</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Soporte técnico (3 meses)</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">Capacitación de uso</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <a 
                        href="/consulta" 
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                      >
                        Solicitar presupuesto personalizado
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 2 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Landing Pages Optimizadas
                  </h2>
                  
                  <p className="text-gray-300 mb-6">
                    Creamos landing pages de alta conversión diseñadas específicamente para convertir 
                    tráfico en leads o ventas. Cada elemento está estratégicamente implementado para 
                    maximizar las conversiones y el ROI de tus campañas de marketing.
                  </p>
                  
                  <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 flex items-center justify-center">
                      <div className="bg-[#0a0a0f]/80 p-4 rounded-lg text-center">
                        <p className="text-white font-medium">Imagen de ejemplo de landing page</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">Elementos Clave</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <span className="font-bold text-white">1</span>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Headlines Persuasivos</h3>
                      <p className="text-gray-400">
                        Titulares y subtítulos optimizados para captar la atención inmediata del visitante 
                        y comunicar claramente tu propuesta de valor.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <span className="font-bold text-white">2</span>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Formularios Optimizados</h3>
                      <p className="text-gray-400">
                        Diseñados para maximizar las conversiones, con el número óptimo de campos y posicionamiento estratégico.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <span className="font-bold text-white">3</span>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">CTA Estratégicos</h3>
                      <p className="text-gray-400">
                        Botones de llamada a la acción diseñados y ubicados estratégicamente para maximizar 
                        las conversiones.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                        <span className="font-bold text-white">4</span>
                      </div>
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Elementos de Confianza</h3>
                      <p className="text-gray-400">
                        Testimonios, sellos de seguridad, garantías y otras pruebas sociales que generan confianza y credibilidad.
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">Ventajas técnicas</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Velocidad extrema</span>
                        <p className="text-gray-400 text-sm">Optimizadas para cargar en menos de 1.5 segundos, crucial para minimizar el abandono y maximizar conversiones.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Testing A/B integrado</span>
                        <p className="text-gray-400 text-sm">Infraestructura para realizar pruebas A/B y optimizar continuamente la tasa de conversión.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Análisis avanzado</span>
                        <p className="text-gray-400 text-sm">Seguimiento detallado de eventos, mapas de calor y grabaciones de sesiones para optimizar continuamente.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <span className="font-medium text-white">Integraciones de marketing</span>
                        <p className="text-gray-400 text-sm">Conexión con tu CRM, herramientas de email marketing y plataformas de publicidad.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Landing Page Estándar</h3>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">1 página optimizada</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Diseño personalizado</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Formulario integrado</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Analytics básico</span>
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
                      <h3 className="font-rajdhani font-bold text-xl mb-3">Landing Page Premium</h3>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">1 landing + Thank You page</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Testing A/B</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Integraciones con CRM</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">Análisis avanzado de conversión</span>
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
                    Tecnologías y Herramientas
                  </h2>
                  
                  <p className="text-gray-300 mb-8">
                    Utilizamos tecnologías modernas y de alto rendimiento para crear sitios web que 
                    no solo se ven bien, sino que funcionan perfectamente y son fáciles de mantener.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-[#1a1a23] p-6 rounded-lg text-center">
                      <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl font-bold text-[#00CCFF]">R</span>
                      </div>
                      <h3 className="font-medium text-white">React</h3>
                      <p className="text-gray-400 text-sm mt-2">Frontend interactivo</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg text-center">
                      <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl font-bold text-[#9933FF]">N</span>
                      </div>
                      <h3 className="font-medium text-white">Next.js</h3>
                      <p className="text-gray-400 text-sm mt-2">Rendimiento superior</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg text-center">
                      <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl font-bold text-[#00CCFF]">W</span>
                      </div>
                      <h3 className="font-medium text-white">WordPress</h3>
                      <p className="text-gray-400 text-sm mt-2">CMS flexible</p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg text-center">
                      <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl font-bold text-[#9933FF]">S</span>
                      </div>
                      <h3 className="font-medium text-white">Shopify</h3>
                      <p className="text-gray-400 text-sm mt-2">E-commerce potente</p>
                    </div>
                  </div>
                  
                  <h3 className="font-rajdhani font-bold text-2xl mb-4">Ventajas de nuestro stack tecnológico</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <h4 className="font-rajdhani font-bold text-xl mb-3 text-[#00CCFF]">Rendimiento Superior</h4>
                      <p className="text-gray-300">
                        Nuestras tecnologías están optimizadas para ofrecer tiempos de carga ultrarrápidos, 
                        lo que mejora la experiencia del usuario y el posicionamiento en buscadores. Implementamos 
                        técnicas avanzadas como el server-side rendering, code splitting y lazy loading.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <h4 className="font-rajdhani font-bold text-xl mb-3 text-[#9933FF]">Escalabilidad</h4>
                      <p className="text-gray-300">
                        Desarrollamos sitios que pueden crecer con tu negocio, soportando desde pequeñas 
                        empresas hasta grandes corporaciones con millones de visitas. Nuestra arquitectura 
                        está diseñada para escalar horizontal y verticalmente según tus necesidades.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <h4 className="font-rajdhani font-bold text-xl mb-3 text-[#00CCFF]">Seguridad</h4>
                      <p className="text-gray-300">
                        Implementamos las mejores prácticas de seguridad en todas nuestras soluciones, 
                        protegiendo tu sitio y los datos de tus usuarios contra vulnerabilidades comunes 
                        y ataques maliciosos.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a23] p-6 rounded-lg">
                      <h4 className="font-rajdhani font-bold text-xl mb-3 text-[#9933FF]">Mantenibilidad</h4>
                      <p className="text-gray-300">
                        Código limpio, bien documentado y siguiendo patrones de diseño modernos que facilitan 
                        el mantenimiento y las actualizaciones futuras. Utilizamos control de versiones y 
                        procesos de desarrollo estandarizados.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">¿No estás seguro de qué tecnología es la mejor para tu proyecto?</h3>
                    <p className="text-gray-300 mb-4">
                      Nuestros expertos pueden asesorarte sobre la mejor solución tecnológica para tus 
                      necesidades específicas, considerando factores como presupuesto, escalabilidad, 
                      facilidad de mantenimiento y objetivos comerciales.
                    </p>
                    <a 
                      href="/consulta" 
                      className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                    >
                      Solicitar asesoría tecnológica
                    </a>
                  </div>
                </div>
              )}
              
              {activeTab === 4 && (
                <div className="bg-[#121217] rounded-xl p-8">
                  <h2 className="font-rajdhani font-bold text-3xl mb-6 gradient-text">
                    Portafolio de Proyectos
                  </h2>
                  
                  <p className="text-gray-300 mb-8">
                    Explora algunos de nuestros proyectos recientes y descubre cómo hemos ayudado a 
                    empresas como la tuya a transformar su presencia digital y alcanzar sus objetivos 
                    de negocio.
                  </p>
                  
                  <div className="space-y-12 mb-10">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <div className="h-64 bg-[#1a1a23] rounded-lg mb-4 overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 flex items-center justify-center">
                            <div className="bg-[#0a0a0f]/80 p-4 rounded-lg text-center">
                              <p className="text-white font-medium">Imagen de proyecto corporativo</p>
                            </div>
                          </div>
                        </div>
                        <div className="h-40 bg-[#1a1a23] rounded-lg overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 flex items-center justify-center">
                            <div className="bg-[#0a0a0f]/80 p-4 rounded-lg text-center">
                              <p className="text-white font-medium">Versión móvil</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-rajdhani font-bold text-2xl mb-3 text-white">Muebles Elegantes</h3>
                        <p className="text-gray-400 mb-4">E-commerce Premium</p>
                        
                        <p className="text-gray-300 mb-4">
                          Desarrollo de una tienda online completa para una marca de muebles de alta gama. 
                          Incluye catálogo de productos, sistema de pagos, gestión de inventario y área 
                          de clientes personalizada.
                        </p>
                        
                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Conversión:</span>
                            <span className="text-[#00CCFF]">3.8% (aumento del 245%)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Tiempo de carga:</span>
                            <span className="text-[#00CCFF]">0.8 segundos</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Tecnologías:</span>
                            <span className="text-[#00CCFF]">Next.js, Shopify, Tailwind</span>
                          </div>
                        </div>
                        
                        <a 
                          href="#" 
                          className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                        >
                          Ver caso de estudio completo
                        </a>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <div className="h-64 bg-[#1a1a23] rounded-lg mb-4 overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#9933FF]/20 to-[#00CCFF]/20 flex items-center justify-center">
                            <div className="bg-[#0a0a0f]/80 p-4 rounded-lg text-center">
                              <p className="text-white font-medium">Imagen de sitio corporativo</p>
                            </div>
                          </div>
                        </div>
                        <div className="h-40 bg-[#1a1a23] rounded-lg overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#9933FF]/20 to-[#00CCFF]/20 flex items-center justify-center">
                            <div className="bg-[#0a0a0f]/80 p-4 rounded-lg text-center">
                              <p className="text-white font-medium">Versión móvil</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-rajdhani font-bold text-2xl mb-3 text-white">Clínica Dental Sonrisa</h3>
                        <p className="text-gray-400 mb-4">Sitio Web Corporativo + Sistema de Citas</p>
                        
                        <p className="text-gray-300 mb-4">
                          Sitio web corporativo con sistema integrado de reserva de citas, blog de 
                          contenido especializado y landing pages para campañas específicas. Optimizado 
                          para SEO local.
                        </p>
                        
                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Posición local:</span>
                            <span className="text-[#9933FF]">Top 3 en Google Maps</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Aumento de citas:</span>
                            <span className="text-[#9933FF]">+180% en 3 meses</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Tecnologías:</span>
                            <span className="text-[#9933FF]">WordPress, React, Node.js</span>
                          </div>
                        </div>
                        
                        <a 
                          href="#" 
                          className="inline-block px-6 py-3 bg-gradient-to-r from-[#9933FF] to-[#00CCFF] rounded-lg text-white font-medium"
                        >
                          Ver caso de estudio completo
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg text-center">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">¿Quieres ver más ejemplos de nuestro trabajo?</h3>
                    <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
                      Contamos con un amplio portafolio de proyectos en diferentes industrias y con 
                      distintos objetivos. Agenda una llamada para mostrarte más ejemplos relevantes 
                      para tu negocio.
                    </p>
                    <a 
                      href="/consulta" 
                      className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
                    >
                      Ver portafolio completo
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
                    Respuestas a las preguntas más comunes sobre nuestros servicios de desarrollo web.
                  </p>
                  
                  <div className="space-y-6 mb-10">
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Cuánto tiempo tarda en desarrollarse un sitio web?</h3>
                      <p className="text-gray-300">
                        El tiempo de desarrollo varía según la complejidad del proyecto. En general, 
                        una landing page puede estar lista en 1-2 semanas, un sitio corporativo en 
                        4-6 semanas, y un e-commerce o plataforma más compleja puede requerir de 
                        8-12 semanas. Durante nuestra consulta inicial, te proporcionaremos un 
                        cronograma detallado específico para tu proyecto.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Qué información necesitan para empezar?</h3>
                      <p className="text-gray-300">
                        Para comenzar, necesitamos entender tu negocio, objetivos, público objetivo, 
                        preferencias de diseño y requisitos funcionales. Te proporcionaremos un 
                        cuestionario detallado para recopilar esta información. También es útil si 
                        puedes compartir ejemplos de sitios web que te gusten y cualquier material 
                        de marca como logos, colores corporativos, etc.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Incluyen el alojamiento web?</h3>
                      <p className="text-gray-300">
                        Sí, ofrecemos soluciones de alojamiento optimizadas para el rendimiento como 
                        parte de nuestros paquetes. Nuestros servidores están configurados específicamente 
                        para garantizar la velocidad, seguridad y escalabilidad de tu sitio. También 
                        podemos implementar tu sitio en tu propio servidor si lo prefieres.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Puedo actualizar el contenido de mi sitio yo mismo?</h3>
                      <p className="text-gray-300">
                        Absolutamente. Todos nuestros sitios incluyen un panel de administración 
                        intuitivo que te permite actualizar el contenido, añadir páginas, publicar 
                        artículos de blog y gestionar otros aspectos de tu sitio sin conocimientos 
                        técnicos. Además, proporcionamos capacitación completa para que te sientas 
                        cómodo administrando tu sitio.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Ofrecen servicios de mantenimiento continuo?</h3>
                      <p className="text-gray-300">
                        Sí, ofrecemos planes de mantenimiento mensuales que incluyen actualizaciones 
                        de seguridad, copias de seguridad, monitoreo de rendimiento, soporte técnico 
                        y un número determinado de horas para pequeños cambios o mejoras. Estos planes 
                        son opcionales pero altamente recomendados para mantener tu sitio seguro, 
                        actualizado y funcionando óptimamente.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-800 pb-6">
                      <h3 className="font-rajdhani font-bold text-xl mb-3">¿Cómo se integra el SEO en el desarrollo?</h3>
                      <p className="text-gray-300">
                        Incorporamos prácticas de SEO técnico en todos nuestros desarrollos, incluyendo 
                        estructura de URL amigables, optimización de la velocidad de carga, 
                        esquemas de datos estructurados, metaetiquetas optimizadas, URLs canónicas, 
                        jerarquía de encabezados adecuada y código HTML semántico. También podemos 
                        ofrecer servicios de SEO más avanzados como complemento, incluyendo keyword 
                        research, optimización de contenido y estrategias de link building.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#00CCFF]/10 to-[#9933FF]/10 p-6 rounded-lg">
                    <h3 className="font-rajdhani font-bold text-xl mb-3">¿Tienes más preguntas?</h3>
                    <p className="text-gray-300 mb-4">
                      Estamos aquí para ayudarte. Agenda una llamada gratuita con uno de nuestros 
                      expertos para resolver todas tus dudas sobre tu proyecto web.
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
                ¿Listo para crear tu sitio web profesional?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Solicita un presupuesto personalizado y descubre cómo podemos ayudarte a 
                transformar tu presencia digital.
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
                    <label htmlFor="email-desarrollo-web" className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email-desarrollo-web"
                      className="w-full px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="project" className="block text-sm font-medium text-gray-300">
                      Tipo de proyecto
                    </label>
                    <select
                      id="project"
                      className="w-full px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="corporate">Sitio Web Corporativo</option>
                      <option value="landing">Landing Page</option>
                      <option value="ecommerce">Tienda Online</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                      Detalles del proyecto
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0a0a0f]/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white resize-none"
                      placeholder="Cuéntanos brevemente sobre tu proyecto..."
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30"
                  >
                    Solicitar presupuesto sin compromiso
                  </button>
                </form>
              </div>
              
              <div>
                <div className="bg-[#1a1a23] p-6 rounded-lg mb-6">
                  <h3 className="font-rajdhani font-bold text-xl mb-4">Nuestros servicios incluyen</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Diseño UI/UX personalizado</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Desarrollo frontend y backend</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Optimización para móviles</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">SEO técnico incorporado</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Capacitación de uso</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Soporte post-lanzamiento</span>
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