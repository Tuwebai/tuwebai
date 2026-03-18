import { Suspense, lazy, useEffect, useState } from 'react';
import { useHomeSectionNavigation } from '@/features/marketing-home/hooks/use-home-section-navigation';
import { runWhenIdle } from '@/lib/performance';

const HeroSection = lazy(() => import('@/features/marketing-home/components/hero-section'));
const NavDots = lazy(() => import('@/shared/ui/nav-dots'));
const WhatsAppButton = lazy(() => import('@/shared/ui/whatsapp-button'));
const ScrollProgress = lazy(() => import('@/shared/ui/scroll-progress'));
const PhilosophySection = lazy(() => import('@/features/marketing-home/components/philosophy-section'));
const ServicesSection = lazy(() => import('@/features/marketing-home/components/services-section'));
const ProcessSection = lazy(() => import('@/features/marketing-home/components/process-section'));
const ImpactSection = lazy(() => import('@/features/marketing-home/components/impact-section'));
const TestimonialsSection = lazy(() => import('@/features/testimonials/components/testimonials-section'));
const ContactSection = lazy(() => import('@/features/contact/components/contact-section'));
const PricingSection = lazy(() => import('@/features/payments/components/pricing-section'));
const ComparisonSection = lazy(() => import('@/features/marketing-home/components/comparison-section'));
const ShowroomSection = lazy(() => import('@/features/marketing-home/components/showroom-section'));
const CompanyLogoSlider = lazy(() => import('@/shared/ui/company-logo-slider'));

export default function MarketingHomePage() {
  const { sections, setSectionRef } = useHomeSectionNavigation();
  const [showFloatingUi, setShowFloatingUi] = useState(false);
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  useEffect(() => {
    let mounted = true;
    let fallbackTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const revealFloatingUi = () => {
      if (mounted) {
        setShowFloatingUi(true);
      }
    };

    const revealDeferredSections = () => {
      if (mounted) {
        setShowDeferredSections(true);
      }
    };

    runWhenIdle(revealFloatingUi, 1200);
    runWhenIdle(revealDeferredSections, 1800);

    const onUserIntent = () => {
      revealFloatingUi();
      fallbackTimeoutId = setTimeout(revealDeferredSections, 150);
      window.removeEventListener('scroll', onUserIntent);
      window.removeEventListener('pointerdown', onUserIntent);
      window.removeEventListener('keydown', onUserIntent);
    };

    window.addEventListener('scroll', onUserIntent, { passive: true, once: true });
    window.addEventListener('pointerdown', onUserIntent, { passive: true, once: true });
    window.addEventListener('keydown', onUserIntent, { once: true });

    return () => {
      mounted = false;
      if (fallbackTimeoutId) {
        clearTimeout(fallbackTimeoutId);
      }
      window.removeEventListener('scroll', onUserIntent);
      window.removeEventListener('pointerdown', onUserIntent);
      window.removeEventListener('keydown', onUserIntent);
    };
  }, []);

  return (
    <>
      {showFloatingUi ? (
        <Suspense fallback={null}>
          <ScrollProgress />
        </Suspense>
      ) : null}

      {showFloatingUi ? (
        <Suspense fallback={null}>
          <NavDots sections={sections} />
        </Suspense>
      ) : null}

      {showFloatingUi ? (
        <Suspense fallback={null}>
          <WhatsAppButton />
        </Suspense>
      ) : null}

      <main id="main-content" className="landing-scroll-shell relative">
        <Suspense
          fallback={
            <section id="intro" className="landing-anchor-section flex items-center justify-center relative bg-gradient-1 overflow-hidden">
              <div className="container mx-auto px-4 text-center z-10">
                <h1 className="font-rajdhani font-bold text-5xl md:text-7xl mb-2">
                  <span className="gradient-text">TuWeb.ai</span>
                </h1>
                <p className="font-rajdhani text-xl md:text-3xl text-gray-300 mb-12">
                  Desarrollo web profesional para negocios que quieren vender mejor online
                </p>
              </div>
            </section>
          }
        >
          <HeroSection setRef={(ref: HTMLElement | null) => setSectionRef('intro', ref)} />
        </Suspense>

        <Suspense fallback={<div className="landing-anchor-section flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-[#00CCFF] border-t-transparent animate-spin"></div></div>}>
          <PhilosophySection setRef={(ref: HTMLElement | null) => setSectionRef('philosophy', ref)} />
          <ServicesSection setRef={(ref: HTMLElement | null) => setSectionRef('services', ref)} />
          <ProcessSection setRef={(ref: HTMLElement | null) => setSectionRef('process', ref)} />
        </Suspense>

        {showDeferredSections ? (
          <Suspense fallback={null}>
            <ComparisonSection setRef={(ref: HTMLElement | null) => setSectionRef('comparison', ref)} />
            <ShowroomSection setRef={(ref: HTMLElement | null) => setSectionRef('showroom', ref)} />
            <PricingSection setRef={(ref: HTMLElement | null) => setSectionRef('pricing', ref)} />

            <CompanyLogoSlider className="py-20 bg-gray-900 bg-opacity-30" />

            <ImpactSection setRef={(ref: HTMLElement | null) => setSectionRef('impact', ref)} />
            <TestimonialsSection setRef={(ref: HTMLElement | null) => setSectionRef('testimonials', ref)} />
            <ContactSection setRef={(ref: HTMLElement | null) => setSectionRef('contact', ref)} />
          </Suspense>
        ) : null}
      </main>
    </>
  );
}
