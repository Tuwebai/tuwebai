import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';

import { useOptionalAuthState } from '@/features/auth/context/auth-context';
import { scrollToHomeSection } from '@/features/marketing-home/utils/scroll-to-home-section';
import {
  TUWEBAI_INSTAGRAM_URL,
  TUWEBAI_LINKEDIN_URL,
  TUWEBAI_WHATSAPP_URL,
} from '@/shared/constants/contact';
import { WhatsAppIcon } from '@/shared/ui/whatsapp-icon';

import { AuthenticatedNavbarActions } from './global-navbar/authenticated-navbar-actions';
import { DesktopNavbarLinks } from './global-navbar/desktop-navbar-links';
import { MobileNavbarLinks } from './global-navbar/mobile-navbar-links';
import { MAIN_NAVIGATION, prefetchNavigationPath } from './global-navbar/navigation';
import { PublicNavbarActions } from './global-navbar/public-navbar-actions';

function NavbarMetaLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <Link
        to="/politica-privacidad"
        className="hover:text-[#00CCFF] transition-colors"
        onClick={onClick}
      >
        Politica de Privacidad
      </Link>
      <span className="text-gray-600">•</span>
      <Link
        to="/terminos-condiciones"
        className="hover:text-[#9933FF] transition-colors"
        onClick={onClick}
      >
        Terminos y Condiciones
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

  const mobileNavbarActions = shouldShowAuthenticatedActions
    ? <AuthenticatedNavbarActions isMobileMenu onAction={() => setIsMenuOpen(false)} />
    : <PublicNavbarActions isMobileMenu onAction={() => setIsMenuOpen(false)} />;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#0a0a0f]/95 lg:bg-[#0a0a0f]/90 lg:backdrop-blur-sm shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between gap-3 py-3 sm:py-4">
            <Link to="/" className="shrink-0 text-xl font-rajdhani font-bold sm:text-2xl">
              TuWeb<span className="text-[#00CCFF]">.ai</span>
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
                  className="rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-[#00CCFF]/20 transition-all whitespace-nowrap hover:shadow-[#9933FF]/30 xl:px-5"
                >
                  Consultanos
                </Link>
              </div>
            </nav>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="rounded-md p-2 text-gray-200 hover:bg-gray-800/30 lg:hidden"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0a0f] transition-transform duration-300 ease-out translate-x-0 opacity-100">
          <div className="min-h-screen flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <Link to="/" className="text-xl font-rajdhani font-bold sm:text-2xl" onClick={() => setIsMenuOpen(false)}>
                TuWeb<span className="text-[#00CCFF]">.ai</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md text-gray-200 hover:bg-gray-800/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 p-4">
              <nav className="flex flex-col space-y-4">
                <MobileNavbarLinks
                  activePage={activePage}
                  onCloseMenu={() => setIsMenuOpen(false)}
                  onSectionSelect={handleSectionSelect}
                />
              </nav>
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="mb-6 text-center">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-400">
                  <NavbarMetaLinks onClick={() => setIsMenuOpen(false)} />
                </div>
              </div>

              {mobileNavbarActions}

              <Link
                to="/consulta"
                onMouseEnter={() => prefetchNavigationPath('/consulta')}
                onFocus={() => prefetchNavigationPath('/consulta')}
                onTouchStart={() => prefetchNavigationPath('/consulta')}
                className="block w-full py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Consultanos
              </Link>

              <div className="mt-8 flex justify-center space-x-6">
                <a href={TUWEBAI_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <span className="sr-only">WhatsApp</span>
                  <WhatsAppIcon className="h-6 w-6" />
                </a>
                <a href={TUWEBAI_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <Instagram className="h-6 w-6" />
                </a>
                <a href={TUWEBAI_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
