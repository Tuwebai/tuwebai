import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { AppQueryProvider } from '@/app/providers/app-query-provider';
import AppRoutes from '@/app/router/AppRoutes';
import { MemoryManager, ThirdPartyScriptManager } from '@/app/performance';
import { ThemeProvider } from '@/core/theme/ThemeContext';
import { AuthProvider, useAuthState } from '@/features/auth/context/AuthContext';
import { LoginModalProvider } from '@/features/auth/hooks/use-login-modal';
import { useUserPrivacyQuery } from '@/features/users/hooks/use-privacy-settings';
import { DEFAULT_USER_PRIVACY_SETTINGS } from '@/features/users/types/privacy';
import analytics from '@/lib/analytics';
import { runWhenIdle } from '@/lib/performance';
import GlobalNavbar from '@/app/layout/global-navbar';
import { SkipLink } from '@/shared/ui/skip-link';
import Footer from '@/shared/ui/footer';
import { Toaster } from '@/shared/ui/toaster';

const shouldEagerlyRunAnalytics = (pathname: string) =>
  pathname.startsWith('/panel') || pathname.startsWith('/auth/');

function AuthenticatedShellFrame() {
  if (typeof window !== 'undefined') {
    (window as Window & { isUsingGlobalNav?: boolean }).isUsingGlobalNav = true;
  }

  return (
    <>
      <MemoryManager thresholdMB={150} debug={false} />
      <ThirdPartyScriptManager />
      <SkipLink />
      <GlobalNavbar />
      <AppRoutes />
      <Footer />
      <Toaster />
    </>
  );
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
      analytics.initialize();
      return;
    }

    let settled = false;

    const initializeAnalytics = () => {
      if (settled) {
        return;
      }

      settled = true;
      analytics.initialize();
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
    if (!canTrackAnalytics || !analytics.isConfigured()) {
      return;
    }

    const path = location.pathname + location.search;
    const pageTitle = document.title || 'Tuweb.ai';

    if (shouldEagerlyRunAnalytics(location.pathname)) {
      analytics.pageview(path, pageTitle);
      return;
    }

    let settled = false;

    const trackPageView = () => {
      if (settled) {
        return;
      }

      settled = true;
      analytics.pageview(path, pageTitle);
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

  return <AuthenticatedShellFrame />;
}

export default function AuthenticatedAppRoot() {
  return (
    <AppQueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <LoginModalProvider>
            <AuthenticatedAppShell />
          </LoginModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppQueryProvider>
  );
}
