import { Suspense, lazy, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AppProviders from '@/app/providers/AppProviders';
import GlobalNavbar from '@/app/layout/global-navbar';
import { ThirdPartyScriptManager } from '@/app/performance';
import AppRoutes from '@/app/router/AppRoutes';
import analytics from '@/lib/analytics';
import { runWhenIdle } from '@/lib/performance';
import Footer from '@/shared/ui/footer';
import { SkipLink } from '@/shared/ui/skip-link';
import { Toaster } from '@/shared/ui/toaster';

const AuthenticatedAppRoot = lazy(() => import('@/app/authenticated-app-root'));

const shouldUseAuthenticatedShell = (pathname: string) =>
  pathname.startsWith('/panel') || pathname.startsWith('/auth/');

function PublicShellFrame() {
  if (typeof window !== 'undefined') {
    (window as Window & { isUsingGlobalNav?: boolean }).isUsingGlobalNav = true;
  }

  return (
    <>
      <ThirdPartyScriptManager />
      <SkipLink />
      <GlobalNavbar />
      <AppRoutes />
      <Footer />
      <Toaster />
    </>
  );
}

function PublicAppRoot() {
  const location = useLocation();

  useEffect(() => {
    analytics.setConsent(true);
  }, []);

  useEffect(() => {
    let settled = false;

    const initializeAnalytics = () => {
      if (settled) {
        return;
      }

      settled = true;
      analytics.initialize('G-H3MG4C5T12');
    };

    runWhenIdle(initializeAnalytics, 2500);

    const onUserIntent = () => {
      initializeAnalytics();
      window.removeEventListener('pointerdown', onUserIntent);
      window.removeEventListener('keydown', onUserIntent);
      window.removeEventListener('scroll', onUserIntent);
    };

    window.addEventListener('pointerdown', onUserIntent, { passive: true, once: true });
    window.addEventListener('keydown', onUserIntent, { once: true });
    window.addEventListener('scroll', onUserIntent, { passive: true, once: true });

    return () => {
      settled = true;
      window.removeEventListener('pointerdown', onUserIntent);
      window.removeEventListener('keydown', onUserIntent);
      window.removeEventListener('scroll', onUserIntent);
    };
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname + location.search;
    const pageTitle = document.title || 'Tuweb.ai';

    let settled = false;

    const trackPageView = () => {
      if (settled) {
        return;
      }

      settled = true;
      analytics.pageview(path, pageTitle);
      analytics.event('Navigation', 'Page View', path);
    };

    runWhenIdle(trackPageView, 3000);

    const onUserIntent = () => {
      trackPageView();
      window.removeEventListener('pointerdown', onUserIntent);
      window.removeEventListener('keydown', onUserIntent);
      window.removeEventListener('scroll', onUserIntent);
    };

    window.addEventListener('pointerdown', onUserIntent, { passive: true, once: true });
    window.addEventListener('keydown', onUserIntent, { once: true });
    window.addEventListener('scroll', onUserIntent, { passive: true, once: true });

    return () => {
      settled = true;
      window.removeEventListener('pointerdown', onUserIntent);
      window.removeEventListener('keydown', onUserIntent);
      window.removeEventListener('scroll', onUserIntent);
    };
  }, [location]);

  return (
    <AppProviders authMode="public">
      <PublicShellFrame />
    </AppProviders>
  );
}

export default function App() {
  const location = useLocation();

  if (shouldUseAuthenticatedShell(location.pathname)) {
    return (
      <Suspense fallback={null}>
        <AuthenticatedAppRoot />
      </Suspense>
    );
  }

  return <PublicAppRoot />;
}
