import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginModal } from '@/hooks/use-login-modal';

interface NavigationLink {
  name: string;
  href: string;
  sections?: { id: string; label: string }[];
}

export default function GlobalNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePage, setActivePage] = useState('');
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout } = useAuth();
  const { openModal } = useLoginModal();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Navegación principal
  const mainNavigation: NavigationLink[] = [
    { 
      name: 'Inicio', 
      href: '/',
      sections: [
        { id: 'intro', label: 'Introducción' },
        { id: 'philosophy', label: 'Filosofía' },
        { id: 'services', label: 'Servicios' },
        { id: 'process', label: 'Proceso' },
        { id: 'tech', label: 'Tecnologías' },
        { id: 'showroom', label: 'Proyectos' }
      ] 
    },
    { name: 'Corporativos', href: '/corporativos' },
    { 
      name: 'UX/UI', 
      href: '/uxui',
      sections: [
        { id: 'servicios', label: 'Servicios UX/UI' },
        { id: 'procesos', label: 'Proceso de diseño' },
        { id: 'proyectos', label: 'Proyectos destacados' },
        { id: 'contacto', label: 'Contacto' }
      ]
    },
    { name: 'E-commerce', href: '/ecommerce' },
    
    { name: 'Equipo', href: '/equipo' },
    { 
      name: 'Tecnologías', 
      href: '/tecnologias',
      sections: [
        { id: 'frontend', label: 'Frontend' },
        { id: 'backend', label: 'Backend' },
        { id: 'cms', label: 'CMS' },
        { id: 'ecommerce', label: 'E-commerce' },
        { id: 'design', label: 'Diseño' }
      ]
    },
    { name: 'Recursos', href: '/recursos' },
    { name: 'FAQ', href: '/faq' }
  ];
  
  // Detecta página activa según ubicación
  useEffect(() => {
    const path = location.pathname;
    const activePage = mainNavigation.find(item => item.href === path)?.name || '';
    setActivePage(activePage);
  }, [location]);
  
  // Detecta scroll para cambiar apariencia del navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificar estado inicial
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll a sección en cualquier página
  const scrollToSection = (sectionId: string) => {
    // Cerrar menú móvil
    setIsMenuOpen(false);
    
    // Buscar el item de navegación activo y la página de destino
    const activeNavItem = mainNavigation.find(item => item.href === location.pathname);
    const targetPage = mainNavigation.find(item => 
      item.sections?.some(s => s.id === sectionId)
    );
    
    // Si estamos en la misma página que contiene la sección, hacer scroll
    if (
      (location.pathname === targetPage?.href) ||
      (location.pathname === '/' && targetPage?.href === '/') ||
      (activeNavItem?.sections?.some(s => s.id === sectionId))
    ) {
      console.log("Intentando hacer scroll en la misma página a la sección:", sectionId);
      
      // Esperar un momento para asegurar que el DOM esté listo
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          console.log("Sección encontrada, haciendo scroll");
          
          const headerOffset = 100; // Ajuste para el header
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          // Intento 1: Usar scrollTo
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Intento 2: Respaldo usando scrollIntoView
          setTimeout(() => {
            try {
              section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
              });
              console.log("Método alternativo de scroll aplicado");
            } catch (error) {
              console.error("Error al hacer scroll:", error);
            }
          }, 100);
        } else {
          console.warn("Sección no encontrada:", sectionId);
        }
      }, 200);
    } else if (targetPage) {
      // Navegar a otra página con el hash para la sección
      console.log(`Navegando a ${targetPage.href}#${sectionId}`);
      window.location.href = `${targetPage.href}#${sectionId}`;
    } else {
      console.warn("No se encontró página para la sección:", sectionId);
    }
  };
  
  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="text-2xl font-rajdhani font-bold">
              TuWeb<span className="text-[#00CCFF]">.ai</span>
            </Link>
            
            {/* Navegación desktop */}
            {!isMobile && (
              <nav className="hidden md:flex items-center space-x-6">
                {mainNavigation.map((item) => (
                  <div key={item.name} className="relative group">
                    <Link
                      to={item.href}
                      className={`text-sm font-medium transition-colors ${
                        activePage === item.name 
                          ? 'text-[#00CCFF]' 
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                    
                    {/* Menú desplegable para secciones */}
                    {item.sections && item.sections.length > 0 && (
                      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[#0a0a0f] ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          {item.sections.map((section) => (
                            <button
                              key={section.id}
                              onClick={() => scrollToSection(section.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#121217] hover:text-white"
                            >
                              {section.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="flex flex-wrap items-center gap-3 md:gap-4 relative z-20">
                  {/* Botones de autenticación para desktop */}
                  {!isAuthenticated ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(undefined, 'login')}
                        className="px-4 py-1.5 text-sm font-medium border border-gray-600 hover:border-gray-400 rounded-md text-gray-300 hover:text-white transition-colors"
                      >
                        Iniciar sesión
                      </button>
                      <button
                        onClick={() => openModal(undefined, 'register')}
                        className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-md text-white shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30 transition-all"
                      >
                        Registrarse
                      </button>
                    </div>
                  ) : (
                    <div className="relative flex-shrink-0 min-w-[160px]">
                      <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-2 py-1.5 px-3 rounded-md hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-medium overflow-hidden border-2 border-white/20">
                          {user?.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'
                          )}
                        </div>
                        <span className="text-sm text-gray-300">{user?.name || user?.username}</span>
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
                      
                      {/* Menú desplegable del perfil */}
                      {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-[#18181b] ring-1 ring-black ring-opacity-5 z-50 border border-white/10">
                          <div className="py-1">
                            <Link
                              to="/panel"
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

                            <a
                              href={`https://dashboard.tuweb-ai.com/?token=${encodeURIComponent(btoa(JSON.stringify({
                                email: user?.email,
                                name: user?.name || user?.username,
                                timestamp: Date.now()
                              })))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#23232b] hover:text-white rounded-lg transition-colors"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                🎛️ Panel de Control
                              </div>
                            </a>
                            <button
                              onClick={() => {
                                logout();
                                setShowProfileMenu(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#23232b] hover:text-white rounded-lg transition-colors"
                            >
                              Cerrar sesión
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Link
                    to="/consulta"
                    className="px-5 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white text-sm font-medium shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30 transition-all whitespace-nowrap"
                  >
                    Consultanos
                  </Link>
                </div>
              </nav>
            )}
            
            {/* Botón menú móvil */}
            {isMobile && (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-md text-gray-200 hover:bg-gray-800/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Menú móvil */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-[#0a0a0f] z-50 overflow-y-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="min-h-screen flex flex-col">
              {/* Header del menú móvil */}
              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <Link to="/" className="text-2xl font-rajdhani font-bold" onClick={() => setIsMenuOpen(false)}>
                  TuWeb<span className="text-[#00CCFF]">.ai</span>
                </Link>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 rounded-md text-gray-200 hover:bg-gray-800/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Contenido del menú móvil */}
              <div className="flex-1 p-4">
                <nav className="flex flex-col space-y-4">
                  {mainNavigation.map((item) => (
                    <div key={item.name} className="border-b border-gray-800 pb-4">
                      <Link
                        to={item.href}
                        className={`text-lg font-medium block py-2 ${
                          activePage === item.name 
                            ? 'text-[#00CCFF]' 
                            : 'text-gray-200'
                        }`}
                        onClick={() => {
                          if (!item.sections) {
                            setIsMenuOpen(false);
                          }
                        }}
                      >
                        {item.name}
                      </Link>
                      
                      {/* Secciones anidadas */}
                      {item.sections && (
                        <div className="pl-4 mt-2 space-y-2">
                          {item.sections.map((section) => (
                            <button
                              key={section.id}
                              className="block text-left py-2 text-sm text-gray-400 hover:text-white w-full"
                              onClick={() => scrollToSection(section.id)}
                            >
                              {section.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
              
              {/* Footer del menú móvil */}
              <div className="p-4 border-t border-gray-800">
                {/* Botones de autenticación para móvil */}
                {!isAuthenticated ? (
                  <div className="flex gap-2 my-4">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openModal(undefined, 'login');
                      }}
                      className="flex-1 py-3 border border-gray-700 rounded-lg text-gray-300 font-medium text-center"
                    >
                      Iniciar sesión
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openModal(undefined, 'register');
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium text-center"
                    >
                      Registrarse
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-800 my-4 pt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-medium">
                        {user?.image ? (
                          <img src={user.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user?.name || user?.username}</div>
                        <div className="text-sm text-gray-400">{user?.email}</div>
                      </div>
                    </div>
                    <Link
                      to="/panel"
                      className="block w-full py-2 px-4 text-left rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mi Perfil
                      </div>
                    </Link>
                    {/* <Link
                      to="/dashboard"
                      className="block w-full py-2 px-4 text-left rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Mi Panel
                      </div>
                    </Link> */}
                    <a
                      href={`https://dashboard.tuweb-ai.com/?token=${encodeURIComponent(btoa(JSON.stringify({
                        email: user?.email,
                        name: user?.name || user?.username,
                        timestamp: Date.now()
                      })))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 px-4 text-left rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        🎛️ Panel de Control
                      </div>
                    </a>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full py-2 px-4 text-left rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
                
                <Link
                  to="/consulta"
                  className="block w-full py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Consultanos
                </Link>
                
                <div className="mt-8 flex justify-center space-x-6">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}