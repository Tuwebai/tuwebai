import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavDots from '@/components/ui/nav-dots';
import HeroSection from '@/components/sections/hero-section';
import PhilosophySection from '@/components/sections/philosophy-section';
import ServicesSection from '@/components/sections/services-section';
import ProcessSection from '@/components/sections/process-section';
import TechSection from '@/components/sections/tech-section';
import ImpactSection from '@/components/sections/impact-section';
import TestimonialsSection from '@/components/sections/testimonials-section';
import ContactSection from '@/components/sections/contact-section';
import PricingSection from '@/components/sections/pricing-section';
import ResourcesSection from '@/components/sections/resources-section';
import ComparisonSection from '@/components/sections/comparison-section';
import ShowroomSection from '@/components/sections/showroom-section';
import CompanyLogoSlider from '@/components/ui/company-logo-slider';
import WhatsAppButton from '@/components/ui/whatsapp-button';
import ScrollProgress from '@/components/ui/scroll-progress';
import MetaTags from '@/components/seo/meta-tags';

export default function Home() {
  const location = useLocation();
  const sections = [
    { id: "intro", label: "Introducción" },
    { id: "philosophy", label: "Filosofía" },
    { id: "services", label: "Servicios" },
    { id: "process", label: "Proceso" },
    { id: "tech", label: "Tecnologías" },
    { id: "comparison", label: "Comparativa" },
    { id: "showroom", label: "Proyectos" },
    { id: "pricing", label: "Planes" },
    { id: "resources", label: "Recursos" },
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
    resources: null,
    impact: null,
    testimonials: null,
    contact: null
  });

  const setSectionRef = (id: string, ref: HTMLElement | null) => {
    sectionRefs.current[id] = ref;
  };

  // Función para desplazarse a una sección específica
  const scrollToSection = (sectionId: string) => {
    console.log("Intentando desplazarse a la sección:", sectionId);
    const section = sectionRefs.current[sectionId];
    if (section) {
      console.log("Sección encontrada, desplazándose...");
      // Intenta un enfoque más directo para el desplazamiento
      window.scrollTo({
        top: section.offsetTop - 100, // Restamos 100px para evitar que el header cubra el contenido
        behavior: 'smooth'
      });
    } else {
      console.log("Sección no encontrada en refs:", Object.keys(sectionRefs.current));
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
    
    console.log("Intentando navegar a sección:", targetSection);
    
    // Si hay una sección objetivo válida, desplazarse a ella
    if (targetSection && sections.some(s => s.id === targetSection)) {
      // Asegurarse de que todas las secciones estén renderizadas primero
      setTimeout(() => {
        console.log("Intentando scroll a sección:", targetSection);
        scrollToSection(targetSection);
        
        // Backup scroll con otro método en caso de que el primero falle
        setTimeout(() => {
          const section = document.getElementById(targetSection);
          if (section) {
            console.log("Usando método alternativo de scroll");
            
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
            console.log("Elemento no encontrado con ID:", targetSection);
          }
        }, 100);
      }, 300);
    }
  }, [location]);

  return (
    <>
      {/* Metadatos SEO para la página principal */}
      <MetaTags
        title="Agencia Digital de Desarrollo Web y Marketing"
        description="Tu mejor aliado para desarrollar tu presencia digital. Ofrecemos soluciones web personalizadas, ecommerce, marketing digital y más para potenciar tu negocio online."
        keywords="desarrollo web, marketing digital, diseño web, ecommerce, SEO, agencia digital, Tuweb.ai"
      />
      
      {/* Barra de progreso de scroll */}
      <ScrollProgress />
      
      {/* Navegación de puntos */}
      <NavDots sections={sections} />
      
      {/* Botón de WhatsApp */}
      <WhatsAppButton />
      
      <main id="main-content" className="relative">
        <HeroSection setRef={(ref: HTMLElement | null) => setSectionRef('intro', ref)}>
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <img src="/logo-tuwebai.png" alt="Logo TuWeb.ai" className="w-28 h-28 mb-2" />
            <h1 className="text-5xl font-extrabold text-primary mb-2">TuWeb.ai</h1>
            <p className="text-xl text-gray-600 text-center max-w-2xl">La plataforma educativa premium para economía, trading y finanzas. Cursos, comunidad y soporte profesional en un solo lugar.</p>
          </div>
        </HeroSection>
        <PhilosophySection setRef={(ref: HTMLElement | null) => setSectionRef('philosophy', ref)} />
        <ServicesSection setRef={(ref: HTMLElement | null) => setSectionRef('services', ref)} />
        <ProcessSection setRef={(ref: HTMLElement | null) => setSectionRef('process', ref)} />
        <TechSection setRef={(ref: HTMLElement | null) => setSectionRef('tech', ref)} />
        <ComparisonSection setRef={(ref: HTMLElement | null) => setSectionRef('comparison', ref)} />
        <ShowroomSection setRef={(ref: HTMLElement | null) => setSectionRef('showroom', ref)} />
        <PricingSection setRef={(ref: HTMLElement | null) => setSectionRef('pricing', ref)} />
        <ResourcesSection setRef={(ref: HTMLElement | null) => setSectionRef('resources', ref)} />
        
        {/* Slider de logos de empresas antes de la sección de impacto */}
        <CompanyLogoSlider className="py-20 bg-gray-900 bg-opacity-30" />
        
        <ImpactSection setRef={(ref: HTMLElement | null) => setSectionRef('impact', ref)} />
        <TestimonialsSection setRef={(ref: HTMLElement | null) => setSectionRef('testimonials', ref)} />
        <ContactSection setRef={(ref: HTMLElement | null) => setSectionRef('contact', ref)} />
      </main>
    </>
  );
}