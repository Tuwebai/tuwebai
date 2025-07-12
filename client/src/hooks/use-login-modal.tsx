import React, { createContext, useContext, useState } from 'react';
import LoginModal from '@/components/auth/LoginModal';

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

export const LoginModalProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);
  const [defaultMode, setDefaultMode] = useState<'login' | 'register'>('login');

  const openModal = (
    newRedirectUrl?: string,
    newDefaultMode: 'login' | 'register' = 'login'
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
      <LoginModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        redirectUrl={redirectUrl}
        defaultMode={defaultMode}
      />
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => useContext(LoginModalContext);