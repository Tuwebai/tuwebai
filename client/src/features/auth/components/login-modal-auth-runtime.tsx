import { AppQueryProvider } from '@/app/providers/app-query-provider';
import LoginModal from '@/features/auth/components/LoginModal';
import { AuthProvider } from '@/features/auth/context/AuthContext';

interface LoginModalAuthRuntimeProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  redirectUrl?: string;
}

export default function LoginModalAuthRuntime(props: LoginModalAuthRuntimeProps) {
  return (
    <AppQueryProvider>
      <AuthProvider>
        <LoginModal {...props} />
      </AuthProvider>
    </AppQueryProvider>
  );
}
