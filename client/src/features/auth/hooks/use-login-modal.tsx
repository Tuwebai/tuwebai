import React, { createContext, lazy, Suspense, useContext, useState } from 'react';

const LoginModal = lazy(() => import('@/features/auth/components/LoginModal'));
const LoginModalAuthRuntime = lazy(() => import('@/features/auth/components/login-modal-auth-runtime'));

interface LoginModalContextType {
  isOpen: boolean;
  openModal: (redirectUrl?: string, defaultMode?: 'login' | 'register') => void;
  closeModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

interface LoginModalProviderProps {
  children: React.ReactNode;
  mountAuthProvider?: boolean;
}

export const LoginModalProvider: React.FC<LoginModalProviderProps> = ({
  children,
  mountAuthProvider = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);
  const [defaultMode, setDefaultMode] = useState<'login' | 'register'>('login');

  const openModal = (
    newRedirectUrl?: string,
    newDefaultMode: 'login' | 'register' = 'login',
  ) => {
    setRedirectUrl(newRedirectUrl);
    setDefaultMode(newDefaultMode);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <LoginModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen ? (
        <Suspense fallback={null}>
          {mountAuthProvider ? (
            <LoginModalAuthRuntime
              isOpen={isOpen}
              onClose={closeModal}
              redirectUrl={redirectUrl}
              defaultMode={defaultMode}
            />
          ) : (
            <LoginModal
              isOpen={isOpen}
              onClose={closeModal}
              redirectUrl={redirectUrl}
              defaultMode={defaultMode}
            />
          )}
        </Suspense>
      ) : null}
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => useContext(LoginModalContext);
