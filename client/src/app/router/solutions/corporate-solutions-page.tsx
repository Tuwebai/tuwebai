import { Link } from "react-router-dom";
import WhatsAppButton from "@/shared/ui/whatsapp-button";
import { TUWEBAI_WHATSAPP_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

export default function Corporativos() {
  return (
    <>
      <MetaTags
        title="Sitios Web Corporativos"
        description="Webs corporativas a medida para empresas argentinas. Diseño profesional, SEO técnico y optimización para convertir visitas en consultas. Desde $420.000 ARS."
        keywords="sitios web corporativos, desarrollo web Córdoba, webs corporativas Argentina, SEO técnico, TuWebAI"
        url="https://tuweb-ai.com/corporativos"
        ogType="website"
        ogImage="/logo-tuwebai.png"
      />
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <WhatsAppButton />
      
      {/* Header */}
      <header className="bg-gradient-to-b from-[#0f0f19] to-[#0a0a0f] px-4 pb-16 pt-24 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <Link to="/" className="text-3xl font-rajdhani font-bold mb-6 inline-block">
                TuWeb<span className="text-[#00CCFF]">.ai</span>
              </Link>
              <h1 className="text-4xl md:text-5xl font-rajdhani font-bold mb-4">
                <span className="gradient-text pb-2">Sitios Corporativos Premium</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mt-4">
                Sitios corporativos diseñados para transmitir confianza, ordenar la información clave y sostener una presencia profesional.
              </p>
            </div>

            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-[#00CCFF]/30 to-[#9933FF]/30 animate-in fade-in zoom-in-95 duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Descripción extendida */}
      <section className="py-16 px-4 bg-[#0a0a0f]">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-3xl font-rajdhani font-bold mb-6 text-white">¿Por qué necesitás un sitio corporativo?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Tu sitio web es la base de tu presencia digital. En un mercado donde la primera impresión se forma online, necesitás una web clara, confiable y alineada con tu identidad. En TuWeb.ai creamos sitios corporativos que ordenan tu propuesta, refuerzan credibilidad y preparan el camino para la conversión.
            </p>
          </div>

          {/* Beneficios clave */}
          <div className="mt-16">
            <h3 className="mb-8 text-center text-2xl font-rajdhani font-bold text-white animate-in fade-in duration-500">
              Beneficios principales
            </h3>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: "Autoridad y confianza",
                  description: "Transmití solidez con un diseño profesional y una estructura de contenido clara."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                  title: "Visibilidad en buscadores",
                  description: "Base SEO técnica para que tu sitio pueda posicionar con estabilidad."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Conversión ordenada",
                  description: "Recorridos simples y CTAs claros para convertir visitas en consultas reales."
                }
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-gradient-to-br from-[#00CCFF]/10 to-[#9933FF]/10 p-[1px] animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Casos destacados */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f19]">
        <div className="container mx-auto">
          <div className="mb-12 text-center animate-in fade-in duration-500">
            <h2 className="text-3xl font-rajdhani font-bold mb-4 text-white">Casos destacados</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Proyectos reales que muestran cómo ordenamos presencia y mensaje.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                image: "/lhdecant-card.webp",
                title: "LH Decants",
                description: "Sitio corporativo premium para una marca de fragancias. Diseño elegante y contenido jerarquizado para comunicar confianza.",
                tags: ["E-commerce", "Diseño Premium"],
                results: "Presencia digital más clara y profesional"
              },
              {
                image: "/pulse-by-tuwebai.png",
                title: "Pulse by TuWebAI",
                description: "Dashboard privado para clientes con métricas, proyecto, soporte y contexto útil en una sola vista.",
                tags: ["SaaS", "Dashboard Privado"],
                results: "Seguimiento claro de servicio y métricas"
              },
              {
                image: "/safespot.webp",
                title: "SafeSpot",
                description: "Solución digital orientada a seguridad ciudadana para reportes y trazabilidad con enfoque comunitario.",
                tags: ["Seguridad", "Comunidad"],
                results: "Comunicación y trazabilidad más ordenadas"
              },
              {
                image: "/trading-tuwebai.webp",
                title: "Trading TuWeb.ai",
                description: "Dashboard de trading para visualización de mercado, control de operaciones y rendimiento con enfoque de decisiones rápidas.",
                tags: ["Fintech", "Analítica"],
                results: "Mejor control operativo en tiempo real"
              }
            ].map((caseStudy, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="bg-gradient-to-br from-[#00CCFF]/10 to-[#9933FF]/10 p-[1px] rounded-xl">
                  <div className="bg-[#121217] rounded-xl p-6">
                    <div className="h-48 rounded-lg bg-gradient-to-br from-[#0f0f19]/90 to-[#121217]/90 mb-4 flex items-center justify-center overflow-hidden">
                      <img 
                        src={caseStudy.image} 
                        alt={caseStudy.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-rajdhani font-bold mb-2 text-white">{caseStudy.title}</h4>
                    <p className="text-gray-300 mb-3">
                      {caseStudy.description}
                    </p>
                    <p className="text-[#00CCFF] text-sm font-medium mb-4">
                      {caseStudy.results}
                    </p>
                    <div className="flex space-x-2 text-sm">
                      {caseStudy.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-3 py-1 rounded-full bg-[#00CCFF]/20 text-[#00CCFF]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 px-4 bg-[#0a0a0f]">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-3xl md:text-4xl font-rajdhani font-bold mb-6 text-white">
              ¿Listo para llevar tu presencia corporativa al siguiente nivel?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Iniciemos juntos un sitio corporativo claro, serio y confiable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/consulta"
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium shadow-lg hover:shadow-[#00CCFF]/20 transition-all transform hover:scale-105"
              >
                Solicitar propuesta
              </Link>
              <a 
                href={`${TUWEBAI_WHATSAPP_URL}?text=Hola,%20estoy%20interesado%20en%20sus%20servicios%20corporativos`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 border border-[#9933FF] rounded-full text-[#9933FF] font-medium hover:bg-[#9933FF]/10 transition-all"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

