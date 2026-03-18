import type { ReactNode } from 'react';

import { ThemeProvider } from '@/core/theme/ThemeContext';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { LoginModalProvider } from '@/features/auth/hooks/use-login-modal';

interface AppProvidersProps {
  children: ReactNode;
  authMode?: 'public' | 'authenticated';
}

export default function AppProviders({ children, authMode = 'authenticated' }: AppProvidersProps) {
  if (authMode === 'public') {
    return (
      <ThemeProvider>
        <LoginModalProvider mountAuthProvider>{children}</LoginModalProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <LoginModalProvider>{children}</LoginModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
