import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useOptionalAuthState } from '@/features/auth/context/auth-context';
import { scrollToHomeSection } from '@/features/marketing-home/utils/scroll-to-home-section';

import { AuthenticatedNavbarActions } from './global-navbar/authenticated-navbar-actions';
import { DesktopNavbarLinks } from './global-navbar/desktop-navbar-links';
import { MAIN_NAVIGATION, prefetchNavigationPath } from './global-navbar/navigation';
import { PublicNavbarActions } from './global-navbar/public-navbar-actions';

const MobileNavbarOverlay = lazy(() => import('./global-navbar/mobile-navbar-overlay'));

export function NavbarMetaLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <Link
        to="/politica-privacidad"
        className="transition-colors hover:text-[var(--signal)]"
        onClick={onClick}
      >
        Política de Privacidad
      </Link>
      <span className="text-gray-600">&bull;</span>
      <Link
        to="/terminos-condiciones"
        className="transition-colors hover:text-white"
        onClick={onClick}
      >
        Términos y Condiciones
      </Link>
    </>
  );
}

interface GlobalNavbarProps {
  authMode?: 'auto' | 'public';
}

export default function GlobalNavbar({ authMode = 'auto' }: GlobalNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePage, setActivePage] = useState('');
  const location = useLocation();
  const { isAuthenticated } = useOptionalAuthState();
  const shouldShowAuthenticatedActions = authMode === 'auto' && isAuthenticated;

  useEffect(() => {
    const nextActivePage = MAIN_NAVIGATION.find((item) => item.href === location.pathname)?.name || '';
    setActivePage(nextActivePage);
  }, [location.pathname]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 50;
        setIsScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const syncMenuState = (event: MediaQueryList | MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    syncMenuState(desktopQuery);
    desktopQuery.addEventListener('change', syncMenuState);

    return () => desktopQuery.removeEventListener('change', syncMenuState);
  }, []);

  const handleSectionSelect = (sectionId: string) => {
    setIsMenuOpen(false);

    const activeNavItem = MAIN_NAVIGATION.find((item) => item.href === location.pathname);
    const targetPage = MAIN_NAVIGATION.find((item) =>
      item.sections?.some((section) => section.id === sectionId),
    );

    if (
      location.pathname === targetPage?.href ||
      (location.pathname === '/' && targetPage?.href === '/') ||
      activeNavItem?.sections?.some((section) => section.id === sectionId)
    ) {
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          scrollToHomeSection(section);
        } else {
          console.warn('Seccion no encontrada:', sectionId);
        }
      }, 200);
      return;
    }

    if (targetPage) {
      window.location.href = `${targetPage.href}#${sectionId}`;
      return;
    }

    console.warn('No se encontro pagina para la seccion:', sectionId);
  };

  const navbarActions = shouldShowAuthenticatedActions
    ? <AuthenticatedNavbarActions />
    : <PublicNavbarActions />;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'border-b border-white/5 bg-[var(--bg-base)]/90 shadow-[var(--shadow-card)] backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between gap-3 py-3 sm:py-4">
            <Link to="/" className="inline-flex shrink-0 items-center gap-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              <span>TuWeb</span>
              <span className="text-[var(--signal)]">.ai</span>
              <span className="animate-pulse-glow h-2.5 w-2.5 rounded-full bg-[var(--signal)]" />
            </Link>

            <div className="hidden items-center space-x-4 text-xs text-gray-400 xl:flex">
              <NavbarMetaLinks />
            </div>

            <nav className="hidden min-w-0 items-center gap-4 lg:flex xl:gap-6">
              <DesktopNavbarLinks
                activePage={activePage}
                onSectionSelect={handleSectionSelect}
              />

              <div className="relative z-20 flex shrink-0 flex-wrap items-center justify-end gap-2 xl:gap-3">
                {navbarActions}

                <Link
                  to="/consulta"
                  onMouseEnter={() => prefetchNavigationPath('/consulta')}
                  onFocus={() => prefetchNavigationPath('/consulta')}
                  onTouchStart={() => prefetchNavigationPath('/consulta')}
                  className="glow-violet whitespace-nowrap rounded-full bg-[image:var(--gradient-brand)] px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 xl:px-5"
                >
                  Empezar proyecto
                </Link>
              </div>
            </nav>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-200 transition-colors hover:border-[var(--signal-border)] hover:bg-[var(--bg-elevated)]/70 lg:hidden"
              aria-label="Abrir menu de navegacion"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <Suspense fallback={null}>
          <MobileNavbarOverlay
            activePage={activePage}
            onCloseMenu={() => setIsMenuOpen(false)}
            onSectionSelect={handleSectionSelect}
            shouldShowAuthenticatedActions={shouldShowAuthenticatedActions}
          >
            <NavbarMetaLinks onClick={() => setIsMenuOpen(false)} />
          </MobileNavbarOverlay>
        </Suspense>
      ) : null}
    </>
  );
}
