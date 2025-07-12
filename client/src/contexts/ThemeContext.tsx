import React, { createContext, useState, useContext, useEffect } from 'react';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Comprobar el tema del sistema, preferencia guardada o usar light como predeterminado
  const getPreferredTheme = (): ThemeType => {
    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      return savedTheme as ThemeType;
    }
    
    // Verificar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Tema predeterminado
    return 'light';
  };
  
  const [theme, setThemeState] = useState<ThemeType>(getPreferredTheme);
  
  // Aplicar tema al documento HTML
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Quitar ambas clases para evitar conflictos
    root.classList.remove('light', 'dark');
    
    // Añadir la clase del tema actual
    root.classList.add(theme);
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Solo cambiar si no hay preferencia guardada
      if (!localStorage.getItem('theme')) {
        setThemeState(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};