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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div className="ml-auto flex min-h-screen w-full max-w-sm flex-col overflow-y-auto border-l border-white/5 bg-[var(--bg-elevated)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 p-4">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-black tracking-tight text-white sm:text-2xl" onClick={onCloseMenu}>
            <span>TuWeb</span>
            <span className="text-[var(--signal)]">.ai</span>
            <span className="animate-pulse-glow h-2.5 w-2.5 rounded-full bg-[var(--signal)]" />
          </Link>
          <button
            onClick={onCloseMenu}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-200 transition-colors hover:border-[var(--signal-border)] hover:bg-white/10"
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

        <div className="border-t border-white/5 p-4">
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
            className="glow-violet block w-full rounded-full bg-[image:var(--gradient-brand)] py-3 text-center font-medium text-white"
            onClick={onCloseMenu}
          >
            Empezar proyecto
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
