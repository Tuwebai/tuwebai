import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import GlobalNavbar from './components/ui/global-navbar';
import Footer from './components/ui/footer';
import { Toaster } from "@/components/ui/toaster";
import { LazyRoute } from './components/route-wrapper';

import analytics from '@/lib/analytics';
import { SkipLink } from '@/components/a11y';
import { ResourcePreload, MemoryManager } from '@/components/performance';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginModalProvider } from './hooks/use-login-modal';

// Carga inmediata para la página principal para mejor experiencia de usuario
import Home from './pages/home';
import NotFound from './pages/not-found';

// Importaciones lazy para reducir el tamaño del bundle inicial
const Corporativos = lazy(() => import('./pages/corporativos'));
const UXUI = lazy(() => import('./pages/uxui'));
const Ecommerce = lazy(() => import('./pages/ecommerce'));
const Consulta = lazy(() => import('./pages/consulta'));

// Nuevas páginas internas (lazy loaded)
const ConsultoriaEstrategica = lazy(() => import('./pages/servicios/consultoria-estrategica'));
const DesarrolloWeb = lazy(() => import('./pages/servicios/desarrollo-web'));
const PosicionamientoMarketing = lazy(() => import('./pages/servicios/posicionamiento-marketing'));
const AutomatizacionMarketing = lazy(() => import('./pages/servicios/automatizacion-marketing'));

const FAQ = lazy(() => import('./pages/faq'));
const Equipo = lazy(() => import('./pages/equipo'));
const Vacantes = lazy(() => import('./pages/vacantes'));
const Tecnologias = lazy(() => import('./pages/tecnologias'));


// Proyectos del Showroom (lazy loaded)
const Estudio = lazy(() => import('./pages/estudio'));

// Páginas de autenticación
const AuthVerify = lazy(() => import('./pages/auth-verify'));
const PanelUsuario = lazy(() => import('./pages/panel-usuario'));



const PagoExitoso = lazy(() => import('./pages/pago-exitoso'));
const PagoFallido = lazy(() => import('./pages/pago-fallido'));
const PagoPendiente = lazy(() => import('./pages/pago-pendiente'));
const Contacto = lazy(() => import('./pages/contacto'));

// Páginas legales
const TerminosCondiciones = lazy(() => import('./pages/terminos-condiciones'));
const PoliticaPrivacidad = lazy(() => import('./pages/politica-privacidad'));
const PoliticaCookies = lazy(() => import('./pages/politica-cookies'));

function App() {
  const location = useLocation();
  
  // Determinar si debemos mostrar el nav global o mantener el antiguo por página
  const shouldUseGlobalNav = true; // Cambiar a false para volver al sistema original
  
  // Exponer la variable globalmente para que las páginas puedan verificar
  // si se está utilizando la navegación global
  (window as any).isUsingGlobalNav = shouldUseGlobalNav;
  
  // Inicializar Google Analytics con ID real de medición
  useEffect(() => {
    analytics.initialize('G-H3MG4C5T12'); // ID real de GA para tuwebai
  }, []);
  
  // Seguimiento de cambios de página
  useEffect(() => {
    const path = location.pathname + location.search;
    const pageTitle = document.title || 'Tuweb.ai';
    
    // Registrar visita a página
    analytics.pageview(path, pageTitle);
    
    // Evento de cambio de página
    analytics.event('Navigation', 'Page View', path);
  }, [location]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <LoginModalProvider>
          <>
            {/* Componente de optimización de memoria */}
            <MemoryManager thresholdMB={150} debug={false} />
            
            {/* Precargar recursos críticos */}
            <ResourcePreload
              resources={[
                // Preload solo si se usan en la carga inicial
                // { href: '/assets/logo.png', as: 'image' },
                // { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
              ]}
            />
            
            <SkipLink />
            {shouldUseGlobalNav && <GlobalNavbar />}

            <Routes>
              {/* Ruta principal sin lazy loading para mejor experiencia inicial */}
              <Route path="/" element={<Home />} />
              
              {/* Rutas con lazy loading utilizando el componente LazyRoute */}
              <Route path="/corporativos" element={<LazyRoute><Corporativos /></LazyRoute>} />
              <Route path="/uxui" element={<LazyRoute><UXUI /></LazyRoute>} />
              <Route path="/ecommerce" element={<LazyRoute><Ecommerce /></LazyRoute>} />
              <Route path="/consulta" element={<LazyRoute><Consulta /></LazyRoute>} />
              
              {/* Rutas para páginas de servicios */}
              <Route path="/servicios/consultoria-estrategica" element={
                <LazyRoute><ConsultoriaEstrategica /></LazyRoute>
              } />
              <Route path="/servicios/desarrollo-web" element={
                <LazyRoute><DesarrolloWeb /></LazyRoute>
              } />
              <Route path="/servicios/posicionamiento-marketing" element={
                <LazyRoute><PosicionamientoMarketing /></LazyRoute>
              } />
              <Route path="/servicios/automatizacion-marketing" element={
                <LazyRoute><AutomatizacionMarketing /></LazyRoute>
              } />
              
              {/* Rutas para secciones adicionales */}
              
              <Route path="/faq" element={<LazyRoute><FAQ /></LazyRoute>} />
              <Route path="/equipo" element={<LazyRoute><Equipo /></LazyRoute>} />
              <Route path="/vacantes" element={<LazyRoute><Vacantes /></LazyRoute>} />
              <Route path="/tecnologias" element={<LazyRoute><Tecnologias /></LazyRoute>} />

              
              {/* Rutas para proyectos del showroom */}
              <Route path="/estudio" element={<LazyRoute><Estudio /></LazyRoute>} />
              
              {/* Rutas de autenticación */}
              <Route path="/auth/verify/:token" element={<LazyRoute><AuthVerify /></LazyRoute>} />
              <Route path="/auth/reset-password" element={<LazyRoute><AuthVerify /></LazyRoute>} />
              <Route path="/panel" element={<LazyRoute><PanelUsuario /></LazyRoute>} />
              
              
              
              {/* Rutas para pagos */}
              <Route path="/pago-exitoso" element={<LazyRoute><PagoExitoso /></LazyRoute>} />
              <Route path="/pago-fallido" element={<LazyRoute><PagoFallido /></LazyRoute>} />
              <Route path="/pago-pendiente" element={<LazyRoute><PagoPendiente /></LazyRoute>} />
              <Route path="/contacto" element={<LazyRoute><Contacto /></LazyRoute>} />
              
              {/* Rutas para páginas legales */}
              <Route path="/terminos-condiciones" element={<LazyRoute><TerminosCondiciones /></LazyRoute>} />
              <Route path="/politica-privacidad" element={<LazyRoute><PoliticaPrivacidad /></LazyRoute>} />
              <Route path="/politica-cookies" element={<LazyRoute><PoliticaCookies /></LazyRoute>} />
              
              {/* Página 404 sin lazy loading para mejor experiencia */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
            <Toaster />
          </>
        </LoginModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
