import type { ReactNode } from 'react';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { LoginModalProvider } from '@/features/auth/hooks/use-login-modal';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LoginModalProvider>{children}</LoginModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
