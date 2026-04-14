import { useOptionalAuthState } from '@/features/auth/context/auth-context';
import { useOptionalAuthActions } from '@/features/auth/context/auth-context';
import { useLoginModal } from '@/features/auth/hooks/use-login-modal';

interface PublicNavbarActionsProps {
  isMobileMenu?: boolean;
  onAction?: () => void;
}

export function PublicNavbarActions({
  isMobileMenu = false,
  onAction,
}: PublicNavbarActionsProps) {
  const { openModal } = useLoginModal();
  const { ensureAuthReady } = useOptionalAuthActions();
  const { isAuthenticated, user } = useOptionalAuthState();

  const handleAuthIntent = (mode: 'login' | 'register') => {
    onAction?.();

    if (isAuthenticated && user) {
      window.location.href = '/panel';
      return;
    }

    openModal(undefined, mode);

    void ensureAuthReady().then((currentUser) => {
      if (currentUser) {
        window.location.href = '/panel';
      }
    });
  };

  if (isMobileMenu) {
    return (
      <div className="flex gap-2 my-4">
        <button
          onClick={() => { void handleAuthIntent('login'); }}
          className="flex-1 rounded-lg border border-[var(--border-default)] py-3 text-center font-medium text-gray-300"
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => { void handleAuthIntent('register'); }}
          className="flex-1 rounded-lg bg-[image:var(--gradient-brand)] py-3 text-center font-medium text-white shadow-[var(--glow-signal)]"
        >
          Registrarse
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => { void handleAuthIntent('login'); }}
        className="rounded-md border border-[var(--border-default)] px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:border-[var(--border-strong)] hover:text-white xl:px-4"
      >
        Iniciar sesión
      </button>
      <button
        onClick={() => { void handleAuthIntent('register'); }}
        className="rounded-md bg-[image:var(--gradient-brand)] px-3 py-1.5 text-sm font-medium text-white shadow-[var(--glow-signal)] transition-all xl:px-4"
      >
        Registrarse
      </button>
    </div>
  );
}
