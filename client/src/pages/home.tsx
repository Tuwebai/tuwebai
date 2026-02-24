import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MetaTags from '@/components/seo/meta-tags';
import { Suspense, lazy } from 'react';

const HeroSection = lazy(() => import('@/components/sections/hero-section'));
const NavDots = lazy(() => import('@/components/ui/nav-dots'));
const WhatsAppButton = lazy(() => import('@/components/ui/whatsapp-button'));
const ScrollProgress = lazy(() => import('@/components/ui/scroll-progress'));

// Lazy loading all sections below the fold to improve LCP and TTI
const PhilosophySection = lazy(() => import('@/components/sections/philosophy-section'));
const ServicesSection = lazy(() => import('@/components/sections/services-section'));
const ProcessSection = lazy(() => import('@/components/sections/process-section'));
const TechSection = lazy(() => import('@/components/sections/tech-section'));
const ImpactSection = lazy(() => import('@/components/sections/impact-section'));
const TestimonialsSection = lazy(() => import('@/components/sections/testimonials-section'));
const ContactSection = lazy(() => import('@/components/sections/contact-section'));
const PricingSection = lazy(() => import('@/components/sections/pricing-section'));
const ComparisonSection = lazy(() => import('@/components/sections/comparison-section'));
const ShowroomSection = lazy(() => import('@/components/sections/showroom-section'));
const CompanyLogoSlider = lazy(() => import('@/components/ui/company-logo-slider'));

export default function Home() {
  const location = useLocation();
  const debugScroll = import.meta.env.DEV;
  const sections = [
    { id: "intro", label: "Introducción" },
    { id: "philosophy", label: "Filosofía" },
    { id: "services", label: "Servicios" },
    { id: "process", label: "Proceso" },
    { id: "tech", label: "Tecnologías" },
    { id: "comparison", label: "Comparativa" },
    { id: "showroom", label: "Proyectos" },
    { id: "pricing", label: "Planes" },
    { id: "impact", label: "Impacto" },
    { id: "testimonials", label: "Testimonios" },
    { id: "contact", label: "Contacto" }
  ];

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({
    intro: null,
    philosophy: null,
    services: null,
    process: null,
    tech: null,
    comparison: null,
    showroom: null,
    pricing: null,
    impact: null,
    testimonials: null,
    contact: null
  });

  const setSectionRef = (id: string, ref: HTMLElement | null) => {
    sectionRefs.current[id] = ref;
  };

  // Función para desplazarse a una sección específica
  const scrollToSection = (sectionId: string) => {
    if (debugScroll) console.debug("Intentando desplazarse a la sección:", sectionId);
    const section = sectionRefs.current[sectionId];
    if (section) {
      if (debugScroll) console.debug("Sección encontrada, desplazándose...");
      // Intenta un enfoque más directo para el desplazamiento
      window.scrollTo({
        top: section.offsetTop - 100, // Restamos 100px para evitar que el header cubra el contenido
        behavior: 'smooth'
      });
    } else {
      if (debugScroll) console.debug("Sección no encontrada en refs:", Object.keys(sectionRefs.current));
    }
  };

  // Manejar tanto el parámetro 'section' como el fragmento de URL (hash)
  useEffect(() => {
    // Parsear los parámetros de consulta de la URL
    const searchParams = new URLSearchParams(location.search);
    const sectionParam = searchParams.get('section');
    
    // Obtener el fragmento de URL (hash) sin el símbolo #
    const hashSection = location.hash ? location.hash.substring(1) : null;
    
    // Usar primero el hash, o si no existe, el parámetro de consulta
    const targetSection = hashSection || sectionParam;
    
    if (debugScroll) console.debug("Intentando navegar a sección:", targetSection);
    
    // Si hay una sección objetivo válida, desplazarse a ella
    if (targetSection && sections.some(s => s.id === targetSection)) {
      // Asegurarse de que todas las secciones estén renderizadas primero
      setTimeout(() => {
        if (debugScroll) console.debug("Intentando scroll a sección:", targetSection);
        scrollToSection(targetSection);
        
        // Backup scroll con otro método en caso de que el primero falle
        setTimeout(() => {
          const section = document.getElementById(targetSection);
          if (section) {
            if (debugScroll) console.debug("Usando método alternativo de scroll");
            
            // Aplicar desplazamiento con ajuste para el header flotante
            const headerOffset = 100;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            
            // Si aún así no funciona, intentar con scrollIntoView
            setTimeout(() => {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          } else {
            if (debugScroll) console.debug("Elemento no encontrado con ID:", targetSection);
          }
        }, 100);
      }, 300);
    }
  }, [location]);

  return (
    <>
      {/* Metadatos SEO para la página principal */}
      <MetaTags
        title="TuWeb.ai - Agencia Digital de Desarrollo Web y Marketing Digital en Argentina"
        description="Desarrollo web profesional, marketing digital y automatización para empresas. Especialistas en React, Node.js, SEO y estrategias digitales. Consultoría gratuita disponible."
        keywords="desarrollo web argentina, marketing digital, diseño web, ecommerce, SEO, agencia digital, React, Node.js, automatización marketing, consultoría digital, TuWeb.ai"
        ogImage="/logo-tuwebai.png"
        ogType="website"
        twitterCard="summary_large_image"
      />
      
      {/* Barra de progreso de scroll */}
      <Suspense fallback={null}>
        <ScrollProgress />
      </Suspense>
      
      {/* Navegación de puntos */}
      <Suspense fallback={null}>
        <NavDots sections={sections} />
      </Suspense>
      
      {/* Botón de WhatsApp */}
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
      
      <main id="main-content" className="relative">
        <Suspense
          fallback={
            <section id="intro" className="min-h-screen flex items-center justify-center relative bg-gradient-1 overflow-hidden">
              <div className="container mx-auto px-4 text-center z-10">
                <h1 className="font-rajdhani font-bold text-5xl md:text-7xl mb-2">
                  <span className="gradient-text">TuWeb.ai</span>
                </h1>
                <p className="font-rajdhani text-xl md:text-3xl text-gray-300 mb-12">
                  Asesoría Comercial Digital para Empresas de Alto Rendimiento
                </p>
              </div>
            </section>
          }
        >
          <HeroSection setRef={(ref: HTMLElement | null) => setSectionRef('intro', ref)} />
        </Suspense>
        
        {/* Usamos Suspense para mostrar las secciones dinámicas a medida que se cargan después del hilo principal */}
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-[#00CCFF] border-t-transparent animate-spin"></div></div>}>
          <PhilosophySection setRef={(ref: HTMLElement | null) => setSectionRef('philosophy', ref)} />
          <ServicesSection setRef={(ref: HTMLElement | null) => setSectionRef('services', ref)} />
          <ProcessSection setRef={(ref: HTMLElement | null) => setSectionRef('process', ref)} />
          <TechSection setRef={(ref: HTMLElement | null) => setSectionRef('tech', ref)} />
          <ComparisonSection setRef={(ref: HTMLElement | null) => setSectionRef('comparison', ref)} />
          <ShowroomSection setRef={(ref: HTMLElement | null) => setSectionRef('showroom', ref)} />
          <PricingSection setRef={(ref: HTMLElement | null) => setSectionRef('pricing', ref)} />
          
          {/* Slider de logos de empresas antes de la sección de impacto */}
          <CompanyLogoSlider className="py-20 bg-gray-900 bg-opacity-30" />
          
          <ImpactSection setRef={(ref: HTMLElement | null) => setSectionRef('impact', ref)} />
          <TestimonialsSection setRef={(ref: HTMLElement | null) => setSectionRef('testimonials', ref)} />
          <ContactSection setRef={(ref: HTMLElement | null) => setSectionRef('contact', ref)} />
        </Suspense>
      </main>
    </>
  );
}
