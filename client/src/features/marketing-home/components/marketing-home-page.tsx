import { Suspense, lazy, useEffect, useState } from 'react';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import { useHomeSectionNavigation } from '@/features/marketing-home/hooks/use-home-section-navigation';
import { runWhenIdle } from '@/lib/performance';

import HeroSection from '@/features/marketing-home/components/hero-section';
const NavDots = lazy(() => import('@/shared/ui/nav-dots'));
const WhatsAppButton = lazy(() => import('@/shared/ui/whatsapp-button'));
const ScrollProgress = lazy(() => import('@/shared/ui/scroll-progress'));
import PhilosophySection from '@/features/marketing-home/components/philosophy-section';
import ServicesSection from '@/features/marketing-home/components/services-section';
import ProcessSection from '@/features/marketing-home/components/process-section';
const ImpactSection = lazy(() => import('@/features/marketing-home/components/impact-section'));
const ContactSection = lazy(() => import('@/features/contact/components/contact-section'));
const PricingSection = lazy(() => import('@/features/payments/components/pricing-section'));
const ShowroomSection = lazy(() => import('@/features/marketing-home/components/showroom-section'));

export default function MarketingHomePage() {
  const { sections, setSectionRef } = useHomeSectionNavigation();
  const [showFloatingUi, setShowFloatingUi] = useState(false);
  const [showDeferredSections, setShowDeferredSections] = useState(false);
  const { ref: deferredSectionsGateRef, hasIntersected: shouldRevealDeferredSections } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '900px 0px',
  });

  useEffect(() => {
    let mounted = true;

    const revealFloatingUi = () => {
      if (mounted) {
        setShowFloatingUi(true);
      }
    };

    runWhenIdle(revealFloatingUi, 1200);

    const onUserIntent = () => {
      revealFloatingUi();
      window.removeEventListener('scroll', onUserIntent);
      window.removeEventListener('pointerdown', onUserIntent);
      window.removeEventListener('keydown', onUserIntent);
    };

    window.addEventListener('scroll', onUserIntent, { passive: true, once: true });
    window.addEventListener('pointerdown', onUserIntent, { passive: true, once: true });
    window.addEventListener('keydown', onUserIntent, { once: true });

    return () => {
      mounted = false;
      window.removeEventListener('scroll', onUserIntent);
      window.removeEventListener('pointerdown', onUserIntent);
      window.removeEventListener('keydown', onUserIntent);
    };
  }, []);

  useEffect(() => {
    if (shouldRevealDeferredSections) {
      setShowDeferredSections(true);
    }
  }, [shouldRevealDeferredSections]);

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

      <main id="main-content" className="landing-scroll-shell page-shell-surface marketing-home-surface relative">
        <HeroSection setRef={(ref: HTMLElement | null) => setSectionRef('intro', ref)} />

        <Suspense fallback={null}>
          <PhilosophySection setRef={(ref: HTMLElement | null) => setSectionRef('philosophy', ref)} />
          <ServicesSection setRef={(ref: HTMLElement | null) => setSectionRef('services', ref)} />
          <ProcessSection setRef={(ref: HTMLElement | null) => setSectionRef('process', ref)} />
        </Suspense>

        <div ref={deferredSectionsGateRef} aria-hidden="true" className="h-px w-full" />

        {showDeferredSections ? (
          <Suspense fallback={null}>
            <ShowroomSection setRef={(ref: HTMLElement | null) => setSectionRef('showroom', ref)} />
            <PricingSection setRef={(ref: HTMLElement | null) => setSectionRef('pricing', ref)} />

            <ImpactSection setRef={(ref: HTMLElement | null) => setSectionRef('impact', ref)} />
            <ContactSection setRef={(ref: HTMLElement | null) => setSectionRef('contact', ref)} />
          </Suspense>
        ) : null}
      </main>
    </>
  );
}
