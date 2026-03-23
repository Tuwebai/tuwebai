import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuthActions, useAuthState } from '@/features/auth/context/auth-context';
import { usePulseAccessState } from '@/features/users/hooks/use-pulse-access-state';
import { openPulseAccess } from '@/features/users/services/pulse.service';
import { UserAvatar } from '@/shared/ui/user-avatar';

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
  const { data: pulseAccess } = usePulseAccessState(isAuthenticated ? user?.email : undefined);
  const isPendingActivation = pulseAccess?.status === 'pending_activation';

  if (!isAuthenticated) {
    return <PublicNavbarActions isMobileMenu={isMobileMenu} onAction={onAction} />;
  }

  if (isMobileMenu) {
    return (
      <div className="border-t border-gray-800 my-4 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <UserAvatar
            image={user?.image}
            name={user?.username || user?.name}
            username={user?.username}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-medium overflow-hidden"
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
          className="block w-full py-2 px-4 text-left rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
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
        ) : (
          <button
            type="button"
            className="block w-full py-2 px-4 text-left rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
              onClick={() => {
              void openPulseAccess(user?.email);
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
          className="block w-full py-2 px-4 text-left rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
        >
          Cerrar sesion
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setShowProfileMenu((current) => !current)}
        className="flex items-center gap-2 py-1.5 px-3 rounded-md hover:bg-gray-800/50 transition-colors"
      >
        <UserAvatar
          image={user?.image}
          name={user?.username || user?.name}
          username={user?.username}
          className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-medium overflow-hidden border-2 border-white/20"
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
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-white/10 bg-[#18181b] shadow-lg ring-1 ring-black ring-opacity-5 xl:w-56">
          <div className="py-1">
            <Link
              to="/panel"
              onMouseEnter={() => prefetchNavigationPath('/panel')}
              onFocus={() => prefetchNavigationPath('/panel')}
              onTouchStart={() => prefetchNavigationPath('/panel')}
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#23232b] hover:text-white rounded-lg transition-colors"
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
            ) : (
              <button
                type="button"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#23232b] hover:text-white rounded-lg transition-colors"
                onClick={() => {
                  void openPulseAccess(user?.email);
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
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#23232b] hover:text-white rounded-lg transition-colors"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
