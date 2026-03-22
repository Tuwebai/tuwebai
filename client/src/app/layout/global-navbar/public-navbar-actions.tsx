import { useAuthActions } from '@/features/auth/context/AuthContext';
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
  const { ensureAuthReady } = useAuthActions();

  const handleAuthIntent = async (mode: 'login' | 'register') => {
    onAction?.();

    const currentUser = await ensureAuthReady();
    if (currentUser) {
      window.location.href = '/panel';
      return;
    }

    openModal(undefined, mode);
  };

  if (isMobileMenu) {
    return (
      <div className="flex gap-2 my-4">
        <button
          onClick={() => { void handleAuthIntent('login'); }}
          className="flex-1 py-3 border border-gray-700 rounded-lg text-gray-300 font-medium text-center"
        >
          Iniciar sesion
        </button>
        <button
          onClick={() => { void handleAuthIntent('register'); }}
          className="flex-1 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium text-center"
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
        className="rounded-md border border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:border-gray-400 hover:text-white xl:px-4"
      >
        Iniciar sesion
      </button>
      <button
        onClick={() => { void handleAuthIntent('register'); }}
        className="rounded-md bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-3 py-1.5 text-sm font-medium text-white shadow-lg shadow-[#00CCFF]/20 transition-all hover:shadow-[#9933FF]/30 xl:px-4"
      >
        Registrarse
      </button>
    </div>
  );
}
