import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AppProviders from '@/app/providers/AppProviders';
import AppRoutes from '@/app/router/AppRoutes';
import { SkipLink } from '@/components/a11y';
import { ResourcePreload, MemoryManager } from '@/components/performance';
import analytics from '@/lib/analytics';
import Footer from '@/shared/ui/footer';

const GlobalNavbar = lazy(() => import('@/app/layout/global-navbar'));
const Toaster = lazy(() => import('@/shared/ui/toaster').then((module) => ({ default: module.Toaster })));

export default function App() {
  const location = useLocation();
  const shouldUseGlobalNav = true;

  (window as Window & { isUsingGlobalNav?: boolean }).isUsingGlobalNav = shouldUseGlobalNav;

  useEffect(() => {
    analytics.initialize('G-H3MG4C5T12');
  }, []);

  useEffect(() => {
    const path = location.pathname + location.search;
    const pageTitle = document.title || 'Tuweb.ai';

    analytics.pageview(path, pageTitle);
    analytics.event('Navigation', 'Page View', path);
  }, [location]);

  return (
    <AppProviders>
      <>
        <MemoryManager thresholdMB={150} debug={false} />
        <ResourcePreload resources={[]} />

        <SkipLink />
        {shouldUseGlobalNav && (
          <Suspense fallback={<div className="h-16" />}>
            <GlobalNavbar />
          </Suspense>
        )}

        <AppRoutes />

        <Footer />
        <Suspense fallback={null}>
          <Toaster />
        </Suspense>
      </>
    </AppProviders>
  );
}
