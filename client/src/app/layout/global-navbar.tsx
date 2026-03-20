import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useIsMobile } from '@/core/hooks/use-mobile';
import { scrollToHomeSection } from '@/features/marketing-home/utils/scroll-to-home-section';

import { AuthenticatedNavbarActions } from './global-navbar/authenticated-navbar-actions';
import { DesktopNavbarLinks } from './global-navbar/desktop-navbar-links';
import { MobileNavbarLinks } from './global-navbar/mobile-navbar-links';
import { MAIN_NAVIGATION, prefetchNavigationPath, shouldUseAuthenticatedNavbar } from './global-navbar/navigation';
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

export default function GlobalNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePage, setActivePage] = useState('');
  const location = useLocation();
  const isMobile = useIsMobile();
  const shouldRenderAuthenticatedNavbar = shouldUseAuthenticatedNavbar(location.pathname);

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

  const navbarActions = shouldRenderAuthenticatedNavbar
    ? <AuthenticatedNavbarActions />
    : <PublicNavbarActions />;

  const mobileNavbarActions = shouldRenderAuthenticatedNavbar
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

            {!isMobile ? (
              <div className="hidden items-center space-x-4 text-xs text-gray-400 xl:flex">
                <NavbarMetaLinks />
              </div>
            ) : null}

            {!isMobile ? (
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
            ) : null}

            {isMobile ? (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-md text-gray-200 hover:bg-gray-800/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            ) : null}
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
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
