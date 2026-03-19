import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AppProviders from '@/app/providers/AppProviders';
import AppRoutes from '@/app/router/AppRoutes';
import { ResourcePreload, MemoryManager, ThirdPartyScriptManager } from '@/app/performance';
import { useAuthState } from '@/features/auth/context/AuthContext';
import { useUserPrivacyQuery } from '@/features/users/hooks/use-privacy-settings';
import { DEFAULT_USER_PRIVACY_SETTINGS } from '@/features/users/types/privacy';
import analytics from '@/lib/analytics';
import { runWhenIdle } from '@/lib/performance';
import { SkipLink } from '@/shared/ui/skip-link';
import GlobalNavbar from '@/app/layout/global-navbar';
import Footer from '@/shared/ui/footer';
import { Toaster } from '@/shared/ui/toaster';

const shouldEagerlyRunAnalytics = (pathname: string) =>
  pathname.startsWith('/panel') || pathname.startsWith('/auth/');
const shouldUseAuthenticatedShell = (pathname: string) =>
  pathname.startsWith('/panel') || pathname.startsWith('/auth/');

function ShellFrame() {
  const shouldUseGlobalNav = true;
  if (typeof window !== 'undefined') {
    (window as Window & { isUsingGlobalNav?: boolean }).isUsingGlobalNav = shouldUseGlobalNav;
  }

  return (
    <>
      <MemoryManager thresholdMB={150} debug={false} />
      <ResourcePreload resources={[]} />
      <ThirdPartyScriptManager />

      <SkipLink />
      {shouldUseGlobalNav && (
        <GlobalNavbar />
      )}

      <AppRoutes />

      <Footer />
      <Toaster />
    </>
  );
}

function PublicAppShell() {
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

  return <ShellFrame />;
}

function AuthenticatedAppShell() {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuthState();
  const {
    data: privacySettings = DEFAULT_USER_PRIVACY_SETTINGS,
    isLoading: isLoadingPrivacy,
  } = useUserPrivacyQuery(user?.uid);
  const isPrivacyResolved = !isAuthenticated || !isLoadingPrivacy;
  const canTrackAnalytics = !isLoading && isPrivacyResolved && (!isAuthenticated || privacySettings.analyticsConsent);

  useEffect(() => {
    analytics.setConsent(canTrackAnalytics);
  }, [canTrackAnalytics]);

  useEffect(() => {
    if (!canTrackAnalytics) {
      return;
    }

    if (shouldEagerlyRunAnalytics(location.pathname)) {
      analytics.initialize('G-H3MG4C5T12');
      return;
    }

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
  }, [canTrackAnalytics, location.pathname]);

  useEffect(() => {
    if (!canTrackAnalytics) {
      return;
    }

    const path = location.pathname + location.search;
    const pageTitle = document.title || 'Tuweb.ai';

    if (shouldEagerlyRunAnalytics(location.pathname)) {
      analytics.pageview(path, pageTitle);
      analytics.event('Navigation', 'Page View', path);
      return;
    }

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
  }, [location, canTrackAnalytics]);

  return <ShellFrame />;
}

function AppShell() {
  const location = useLocation();

  if (shouldUseAuthenticatedShell(location.pathname)) {
    return <AuthenticatedAppShell />;
  }

  return <PublicAppShell />;
}

export default function App() {
  const location = useLocation();
  const authMode = shouldUseAuthenticatedShell(location.pathname) ? 'authenticated' : 'public';

  return (
    <AppProviders authMode={authMode}>
      <AppShell />
    </AppProviders>
  );
}
