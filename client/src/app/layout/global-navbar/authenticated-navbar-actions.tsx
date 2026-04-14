import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuthActions, useAuthState } from '@/features/auth/context/auth-context';
import { usePulseAccessState } from '@/features/users/hooks/use-pulse-access-state';
import { openPulseAccess } from '@/features/users/services/pulse.service';
import { UserAvatar } from '@/shared/ui/user-avatar';
import { useToast } from '@/shared/ui/use-toast';

import { prefetchNavigationPath } from './navigation';
import { PublicNavbarActions } from './public-navbar-actions';

interface AuthenticatedNavbarActionsProps {
  isMobileMenu?: boolean;
  onAction?: () => void;
}

export function AuthenticatedNavbarActions({
  isMobileMenu = false,
  onAction,
}: AuthenticatedNavbarActionsProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, isAuthenticated } = useAuthState();
  const { logout } = useAuthActions();
  const { toast } = useToast();
  const { data: pulseAccess } = usePulseAccessState(isAuthenticated ? user?.email : undefined);
  const isPendingActivation = pulseAccess?.status === 'pending_activation';
  const isAccessDisabled = pulseAccess?.status === 'disabled';

  if (!isAuthenticated) {
    return <PublicNavbarActions isMobileMenu={isMobileMenu} onAction={onAction} />;
  }

  if (isMobileMenu) {
    return (
      <div className="my-4 border-t border-[var(--border-subtle)] pt-4">
        <div className="flex items-center gap-3 mb-3">
          <UserAvatar
            image={user?.image}
            name={user?.username || user?.name}
            username={user?.username}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[image:var(--gradient-brand)] text-white font-medium"
          />
          <div>
            <div className="text-white font-medium">{user?.username || user?.name}</div>
            <div className="text-sm text-gray-400">{user?.email}</div>
          </div>
        </div>
        <Link
          to="/panel"
          onMouseEnter={() => prefetchNavigationPath('/panel')}
          onFocus={() => prefetchNavigationPath('/panel')}
          onTouchStart={() => prefetchNavigationPath('/panel')}
          className="block w-full rounded-md px-4 py-2 text-left text-gray-300 transition-colors hover:bg-[var(--bg-elevated)]"
          onClick={onAction}
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mi Perfil
          </div>
        </Link>
        {isPendingActivation ? (
          <div className="block w-full py-2 px-4 text-left rounded-md text-amber-300 bg-amber-500/10 border border-amber-500/20">
            Pulse pendiente de activacion
          </div>
        ) : isAccessDisabled ? (
          <div className="block w-full py-2 px-4 text-left rounded-md text-rose-300 bg-rose-500/10 border border-rose-500/20">
            Acceso a Pulse revocado
          </div>
        ) : (
          <button
            type="button"
            className="block w-full rounded-md px-4 py-2 text-left text-gray-300 transition-colors hover:bg-[var(--bg-elevated)]"
              onClick={() => {
                void openPulseAccess(user?.email).catch(() => {
                  toast({
                    title: 'Error',
                    description: 'No pudimos abrir Pulse en este momento.',
                    variant: 'destructive',
                  });
                });
                onAction?.();
              }}
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Panel de Control
            </div>
          </button>
        )}
        <button
          onClick={() => {
            void logout();
            onAction?.();
          }}
          className="block w-full rounded-md px-4 py-2 text-left text-gray-300 transition-colors hover:bg-[var(--bg-elevated)]"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setShowProfileMenu((current) => !current)}
        className="flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors hover:bg-[var(--bg-elevated)]/70"
      >
        <UserAvatar
          image={user?.image}
          name={user?.username || user?.name}
          username={user?.username}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-[image:var(--gradient-brand)] text-white font-medium"
        />
        <span className="hidden max-w-[12rem] truncate text-sm text-gray-300 xl:inline">{user?.username || user?.name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showProfileMenu ? (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-overlay)] shadow-[var(--shadow-elevated)] xl:w-56">
          <div className="py-1">
            <Link
              to="/panel"
              onMouseEnter={() => prefetchNavigationPath('/panel')}
              onFocus={() => prefetchNavigationPath('/panel')}
              onTouchStart={() => prefetchNavigationPath('/panel')}
              className="block rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[var(--bg-elevated)] hover:text-white"
              onClick={() => setShowProfileMenu(false)}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi Perfil
              </div>
            </Link>
            {isPendingActivation ? (
              <div className="mx-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
                Pulse pendiente de activacion
              </div>
            ) : isAccessDisabled ? (
              <div className="mx-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
                Acceso a Pulse revocado
              </div>
            ) : (
              <button
                type="button"
                className="block rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[var(--bg-elevated)] hover:text-white"
                onClick={() => {
                  void openPulseAccess(user?.email).catch(() => {
                    toast({
                      title: 'Error',
                      description: 'No pudimos abrir Pulse en este momento.',
                      variant: 'destructive',
                    });
                  });
                  setShowProfileMenu(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Panel de Control
                </div>
              </button>
            )}
            <button
              onClick={() => {
                void logout();
                setShowProfileMenu(false);
              }}
              className="block w-full rounded-lg px-4 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-[var(--bg-elevated)] hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
