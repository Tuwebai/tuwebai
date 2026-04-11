import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';

import {
  TUWEBAI_INSTAGRAM_URL,
  TUWEBAI_LINKEDIN_URL,
  TUWEBAI_WHATSAPP_URL,
} from '@/shared/constants/contact';
import { WhatsAppIcon } from '@/shared/ui/whatsapp-icon';

import { AuthenticatedNavbarActions } from './authenticated-navbar-actions';
import { MobileNavbarLinks } from './mobile-navbar-links';
import { prefetchNavigationPath } from './navigation';
import { PublicNavbarActions } from './public-navbar-actions';

interface MobileNavbarOverlayProps {
  activePage: string;
  onCloseMenu: () => void;
  onSectionSelect: (sectionId: string) => void;
  shouldShowAuthenticatedActions: boolean;
  children: React.ReactNode;
}

export default function MobileNavbarOverlay({
  activePage,
  onCloseMenu,
  onSectionSelect,
  shouldShowAuthenticatedActions,
  children,
}: MobileNavbarOverlayProps) {
  const mobileNavbarActions = shouldShowAuthenticatedActions
    ? <AuthenticatedNavbarActions isMobileMenu onAction={onCloseMenu} />
    : <PublicNavbarActions isMobileMenu onAction={onCloseMenu} />;

  return (
    <div className="page-shell-surface fixed inset-0 z-50 overflow-y-auto transition-transform duration-300 ease-out translate-x-0 opacity-100">
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] p-4">
          <Link to="/" className="text-xl font-rajdhani font-bold sm:text-2xl" onClick={onCloseMenu}>
            TuWeb<span className="text-[var(--signal)]">.ai</span>
          </Link>
          <button
            onClick={onCloseMenu}
            className="rounded-md p-2 text-gray-200 transition-colors hover:bg-[var(--bg-elevated)]/70"
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
              onCloseMenu={onCloseMenu}
              onSectionSelect={onSectionSelect}
            />
          </nav>
        </div>

        <div className="border-t border-[var(--border-subtle)] p-4">
          <div className="mb-6 text-center">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-400">
              {children}
            </div>
          </div>

          {mobileNavbarActions}

          <Link
            to="/consulta"
            onMouseEnter={() => prefetchNavigationPath('/consulta')}
            onFocus={() => prefetchNavigationPath('/consulta')}
            onTouchStart={() => prefetchNavigationPath('/consulta')}
            className="block w-full rounded-lg bg-[image:var(--gradient-brand)] py-3 text-center font-medium text-white shadow-[var(--glow-signal)]"
            onClick={onCloseMenu}
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
  );
}
