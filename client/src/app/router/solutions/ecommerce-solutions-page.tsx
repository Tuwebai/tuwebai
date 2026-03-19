import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TUWEBAI_WHATSAPP_URL } from "@/shared/constants/contact";
import WhatsAppButton from "@/shared/ui/whatsapp-button";
import "./ecommerce-solutions-page.css";

const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Compra sin fricción",
    description: "Flujos claros para que el usuario llegue al pago sin obstáculos.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Pagos seguros",
    description: "Integración con métodos de pago confiables y experiencia de checkout consistente.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Métricas claras",
    description: "Paneles para monitorear ventas, comportamiento del usuario y stock en tiempo real.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: "Escalabilidad garantizada",
    description: "Infraestructura que crece con tu negocio, soportando desde pocas hasta miles de transacciones diarias.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Base SEO técnica",
    description: "Estructura optimizada para que tu tienda pueda posicionar con estabilidad.",
  },
] as const;

export default function Ecommerce() {
  return (
    <div className="ecommerce-page">
      <WhatsAppButton />

      <motion.header
        className="ecommerce-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto">
          <div className="ecommerce-header-layout">
            <div className="ecommerce-header-copy">
              <Link to="/" className="ecommerce-wordmark">
                TuWeb<span className="ecommerce-wordmark-accent">.ai</span>
              </Link>
              <h1 className="ecommerce-title">
                <span className="gradient-text pb-2">Soluciones E-Commerce</span>
              </h1>
              <p className="ecommerce-subtitle">
                Tiendas online pensadas para vender con claridad, velocidad y una experiencia de compra confiable.
              </p>
            </div>

            <motion.div
              className="ecommerce-hero-icon"
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

      <section className="ecommerce-section">
        <div className="container mx-auto">
          <motion.div
            className="ecommerce-intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="ecommerce-section-title">E-commerce listo para operar con confianza</h2>
            <p className="ecommerce-section-copy">
              Una tienda online no es solo un catálogo: es un sistema de ventas. En TuWeb.ai desarrollamos e-commerce profesionales con foco en experiencia de compra, performance y una operación ordenada, adaptados a distintos niveles de escala.
            </p>
          </motion.div>

          <div className="ecommerce-block-spacing">
            <motion.h3
              className="ecommerce-section-title ecommerce-section-title--centered"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Ventajas de nuestras tiendas online
            </motion.h3>

            <div className="ecommerce-benefits-grid">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="ecommerce-benefit-frame"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="ecommerce-benefit-card">
                    <div className="ecommerce-benefit-icon">
                      <div className="text-white">{benefit.icon}</div>
                    </div>
                    <h4 className="ecommerce-benefit-title">{benefit.title}</h4>
                    <p className="ecommerce-benefit-description">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ecommerce-section ecommerce-section--featured">
        <div className="container mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <h2 className="ecommerce-section-title ecommerce-section-title--centered">Casos destacados</h2>
            <p className="ecommerce-section-copy ecommerce-section-copy--centered">
              Proyectos reales con foco en operación y conversión.
            </p>
          </motion.div>

          <div className="ecommerce-featured-grid">
            <motion.div
              className="ecommerce-featured-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="ecommerce-featured-frame">
                <div className="ecommerce-featured-card">
                  <div className="ecommerce-featured-media">
                    <img src="/lhdecant-card.webp" alt="LH Decants" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="ecommerce-featured-title">LH Decants - E-commerce Premium</h4>
                  <p className="ecommerce-featured-description">
                    Tienda online premium para una marca de fragancias exclusivas. Diseño elegante y flujo de compra claro.
                  </p>
                  <div className="ecommerce-featured-tags">
                    <span className="ecommerce-tag ecommerce-tag--cyan">Experiencia de compra clara</span>
                    <span className="ecommerce-tag ecommerce-tag--purple">Diseño premium</span>
                    <span className="ecommerce-tag ecommerce-tag--cyan">Perfumes Exclusivos</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="ecommerce-section ecommerce-section--cta">
        <div className="container mx-auto">
          <motion.div
            className="ecommerce-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="ecommerce-cta-title">Potenciá tus ventas online</h2>
            <p className="ecommerce-cta-copy">Convirtamos tu catálogo en una plataforma de ventas confiable.</p>
            <div className="ecommerce-cta-actions">
              <Link to="/consulta" className="ecommerce-cta-primary">
                Solicitar propuesta
              </Link>
              <a
                href={`${TUWEBAI_WHATSAPP_URL}?text=Hola,%20estoy%20interesado%20en%20sus%20servicios%20de%20e-commerce`}
                target="_blank"
                rel="noopener noreferrer"
                className="ecommerce-cta-secondary"
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
