import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import WhatsAppButton from "@/components/ui/whatsapp-button";

export default function Ecommerce() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <WhatsAppButton />
      
      {/* Header */}
      <motion.header 
        className="bg-gradient-to-b from-[#0f0f19] to-[#0a0a0f] pt-24 pb-16 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <Link to="/" className="text-3xl font-rajdhani font-bold mb-6 inline-block">
                TuWeb<span className="text-[#00CCFF]">.ai</span>
              </Link>
              <h1 className="text-4xl md:text-5xl font-rajdhani font-bold mb-4">
                <span className="gradient-text pb-2">Soluciones E-Commerce</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mt-4">
                Tiendas online optimizadas para conversión que transforman visitantes en compradores recurrentes.
              </p>
            </div>

            <motion.div 
              className="w-40 h-40 bg-gradient-to-br from-[#00CCFF]/30 to-[#9933FF]/30 rounded-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Descripción extendida */}
      <section className="py-16 px-4 bg-[#0a0a0f]">
        <div className="container mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-rajdhani font-bold mb-6 text-white">Comercio electrónico que genera resultados</h2>
            <p className="text-lg text-gray-300 mb-8">
              Una tienda online no es solo un catálogo digital, sino un complejo ecosistema de ventas que debe funcionar perfectamente para maximizar cada oportunidad. En TuWeb.ai desarrollamos e-commerce profesionales con foco en la experiencia de compra, optimización de conversión y gestión eficiente del inventario, adaptados tanto para pequeños emprendedores como para grandes marcas.
            </p>
          </motion.div>

          {/* Beneficios clave */}
          <div className="mt-16">
            <motion.h3 
              className="text-2xl font-rajdhani font-bold mb-8 text-center text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Ventajas de nuestras tiendas online
            </motion.h3>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Optimización de conversión",
                  description: "Procesos de compra simplificados que aumentan la tasa de conversión y reducen el abandono de carrito."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: "Pasarelas de pago seguras",
                  description: "Integración con múltiples métodos de pago y transacciones protegidas para generar confianza."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: "Reportes avanzados",
                  description: "Paneles analíticos para monitorear ventas, comportamiento del usuario y stock en tiempo real."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  ),
                  title: "Escalabilidad garantizada",
                  description: "Infraestructura que crece con tu negocio, soportando desde pocas hasta miles de transacciones diarias."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                  title: "SEO para e-commerce",
                  description: "Optimización específica para tiendas online que aumenta la visibilidad en buscadores y marketplaces."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-[#00CCFF]/10 to-[#9933FF]/10 rounded-xl p-[1px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="bg-[#121217] rounded-xl p-6 h-full">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                      <div className="text-white">
                        {benefit.icon}
                      </div>
                    </div>
                    <h4 className="text-xl font-rajdhani font-bold mb-3 text-white">{benefit.title}</h4>
                    <p className="text-gray-300">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ejemplos de tiendas */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f19]">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-rajdhani font-bold mb-4 text-white">Tiendas que generan resultados</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              E-commerce que superan las expectativas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2].map((item, index) => (
              <motion.div
                key={index}
                className="rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <div className="bg-gradient-to-br from-[#00CCFF]/10 to-[#9933FF]/10 p-[1px] rounded-xl">
                  <div className="bg-[#121217] rounded-xl p-6">
                    <div className="h-64 rounded-lg bg-gradient-to-br from-[#0f0f19]/90 to-[#121217]/90 mb-4 flex items-center justify-center">
                      <span className="text-gray-500 font-medium">
                        Tienda {item}
                      </span>
                    </div>
                    <h4 className="text-xl font-rajdhani font-bold mb-2 text-white">E-commerce {item}</h4>
                    <p className="text-gray-300 mb-4">
                      Descripción del proyecto, implementaciones y resultados obtenidos tras el lanzamiento.
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="px-3 py-1 rounded-full bg-[#00CCFF]/20 text-[#00CCFF]">+200% ventas</span>
                      <span className="px-3 py-1 rounded-full bg-[#9933FF]/20 text-[#9933FF]">Multimoneda</span>
                      <span className="px-3 py-1 rounded-full bg-[#00CCFF]/20 text-[#00CCFF]">Integraciones API</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 px-4 bg-[#0a0a0f]">
        <div className="container mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-rajdhani font-bold mb-6 text-white">
              Potenciá tus ventas online
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Convirtamos tu catálogo en una poderosa plataforma de ventas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/consulta"
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20 transition-all transform hover:scale-105"
              >
                Solicitá tu e-commerce
              </Link>
              <a 
                href="https://wa.me/5492215688349?text=Hola,%20estoy%20interesado%20en%20sus%20servicios%20de%20e-commerce"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 border border-[#9933FF] rounded-full text-[#9933FF] font-medium hover:bg-[#9933FF]/10 transition-all"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}