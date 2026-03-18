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

  if (isMobileMenu) {
    return (
      <div className="flex gap-2 my-4">
        <button
          onClick={() => {
            onAction?.();
            openModal(undefined, 'login');
          }}
          className="flex-1 py-3 border border-gray-700 rounded-lg text-gray-300 font-medium text-center"
        >
          Iniciar sesion
        </button>
        <button
          onClick={() => {
            onAction?.();
            openModal(undefined, 'register');
          }}
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
        onClick={() => openModal(undefined, 'login')}
        className="px-4 py-1.5 text-sm font-medium border border-gray-600 hover:border-gray-400 rounded-md text-gray-300 hover:text-white transition-colors"
      >
        Iniciar sesion
      </button>
      <button
        onClick={() => openModal(undefined, 'register')}
        className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-md text-white shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30 transition-all"
      >
        Registrarse
      </button>
    </div>
  );
}
