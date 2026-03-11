import { Suspense, lazy } from 'react';
import MetaTags from '@/components/seo/meta-tags';
import { useHomeSectionNavigation } from '@/features/marketing-home/hooks/use-home-section-navigation';

const HeroSection = lazy(() => import('@/features/marketing-home/components/hero-section'));
const NavDots = lazy(() => import('@/components/ui/nav-dots'));
const WhatsAppButton = lazy(() => import('@/components/ui/whatsapp-button'));
const ScrollProgress = lazy(() => import('@/components/ui/scroll-progress'));
const PhilosophySection = lazy(() => import('@/features/marketing-home/components/philosophy-section'));
const ServicesSection = lazy(() => import('@/features/marketing-home/components/services-section'));
const ProcessSection = lazy(() => import('@/components/sections/process-section'));
const TechSection = lazy(() => import('@/components/sections/tech-section'));
const ImpactSection = lazy(() => import('@/components/sections/impact-section'));
const TestimonialsSection = lazy(() => import('@/features/testimonials/components/testimonials-section'));
const ContactSection = lazy(() => import('@/features/contact/components/contact-section'));
const PricingSection = lazy(() => import('@/features/payments/components/pricing-section'));
const ComparisonSection = lazy(() => import('@/components/sections/comparison-section'));
const ShowroomSection = lazy(() => import('@/components/sections/showroom-section'));
const CompanyLogoSlider = lazy(() => import('@/components/ui/company-logo-slider'));

export default function Home() {
  const { sections, setSectionRef } = useHomeSectionNavigation();

  return (
    <>
      <MetaTags
        title="TuWeb.ai - Agencia Digital de Desarrollo Web y Marketing Digital en Argentina"
        description="Desarrollo web profesional, marketing digital y automatización para empresas. Especialistas en React, Node.js, SEO y estrategias digitales. Consultoría gratuita disponible."
        keywords="desarrollo web argentina, marketing digital, diseño web, ecommerce, SEO, agencia digital, React, Node.js, automatización marketing, consultoría digital, TuWeb.ai"
        ogImage="/logo-tuwebai.png"
        ogType="website"
        twitterCard="summary_large_image"
      />

      <Suspense fallback={null}>
        <ScrollProgress />
      </Suspense>

      <Suspense fallback={null}>
        <NavDots sections={sections} />
      </Suspense>

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

        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-[#00CCFF] border-t-transparent animate-spin"></div></div>}>
          <PhilosophySection setRef={(ref: HTMLElement | null) => setSectionRef('philosophy', ref)} />
          <ServicesSection setRef={(ref: HTMLElement | null) => setSectionRef('services', ref)} />
          <ProcessSection setRef={(ref: HTMLElement | null) => setSectionRef('process', ref)} />
          <TechSection setRef={(ref: HTMLElement | null) => setSectionRef('tech', ref)} />
          <ComparisonSection setRef={(ref: HTMLElement | null) => setSectionRef('comparison', ref)} />
          <ShowroomSection setRef={(ref: HTMLElement | null) => setSectionRef('showroom', ref)} />
          <PricingSection setRef={(ref: HTMLElement | null) => setSectionRef('pricing', ref)} />

          <CompanyLogoSlider className="py-20 bg-gray-900 bg-opacity-30" />

          <ImpactSection setRef={(ref: HTMLElement | null) => setSectionRef('impact', ref)} />
          <TestimonialsSection setRef={(ref: HTMLElement | null) => setSectionRef('testimonials', ref)} />
          <ContactSection setRef={(ref: HTMLElement | null) => setSectionRef('contact', ref)} />
        </Suspense>
      </main>
    </>
  );
}
