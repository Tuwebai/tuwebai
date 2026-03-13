import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AppProviders from '@/app/providers/AppProviders';
import AppRoutes from '@/app/router/AppRoutes';
import { ResourcePreload, MemoryManager } from '@/app/performance';
import { useAuthState } from '@/features/auth/context/AuthContext';
import { useUserPrivacyQuery } from '@/features/users/hooks/use-privacy-settings';
import { DEFAULT_USER_PRIVACY_SETTINGS } from '@/features/users/types/privacy';
import analytics from '@/lib/analytics';
import Footer from '@/shared/ui/footer';
import { SkipLink } from '@/shared/ui/skip-link';

const GlobalNavbar = lazy(() => import('@/app/layout/global-navbar'));
const Toaster = lazy(() => import('@/shared/ui/toaster').then((module) => ({ default: module.Toaster })));

function AppShell() {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuthState();
  const {
    data: privacySettings = DEFAULT_USER_PRIVACY_SETTINGS,
    isLoading: isLoadingPrivacy,
  } = useUserPrivacyQuery(user?.uid);
  const shouldUseGlobalNav = true;
  const isPrivacyResolved = !isAuthenticated || !isLoadingPrivacy;
  const canTrackAnalytics = !isLoading && isPrivacyResolved && (!isAuthenticated || privacySettings.analyticsConsent);

  (window as Window & { isUsingGlobalNav?: boolean }).isUsingGlobalNav = shouldUseGlobalNav;

  useEffect(() => {
    analytics.setConsent(canTrackAnalytics);
  }, [canTrackAnalytics]);

  useEffect(() => {
    if (!canTrackAnalytics) {
      return;
    }

    analytics.initialize('G-H3MG4C5T12');
  }, [canTrackAnalytics]);

  useEffect(() => {
    if (!canTrackAnalytics) {
      return;
    }

    const path = location.pathname + location.search;
    const pageTitle = document.title || 'Tuweb.ai';

    analytics.pageview(path, pageTitle);
    analytics.event('Navigation', 'Page View', path);
  }, [location, canTrackAnalytics]);

  return (
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
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
