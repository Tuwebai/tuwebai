import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, useEffect, Suspense } from 'react';
import GlobalNavbar from './components/ui/global-navbar';
import Footer from './components/ui/footer';
import { Toaster } from "@/components/ui/toaster";
import { LazyRoute } from './components/route-wrapper';
import AdminRoute from './components/auth/AdminRoute';
import DashboardRoute from './components/auth/DashboardRoute';
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
const Blog = lazy(() => import('./pages/blog'));
const BlogArticle = lazy(() => import('./pages/blog-article-template'));
const FAQ = lazy(() => import('./pages/faq'));
const Equipo = lazy(() => import('./pages/equipo'));
const Tecnologias = lazy(() => import('./pages/tecnologias'));
const Recursos = lazy(() => import('./pages/recursos'));

// Proyectos del Showroom (lazy loaded)
const RopaUrbana = lazy(() => import('./pages/ropaurbana'));
const Muebles = lazy(() => import('./pages/muebles'));
const Dulce = lazy(() => import('./pages/dulce'));
const EcommerceModa = lazy(() => import('./pages/ecommerce-moda'));
const PlataformaEducativa = lazy(() => import('./pages/plataforma-educativa'));
const CorporativoPremium = lazy(() => import('./pages/corporativo-premium'));
const AppRestaurantes = lazy(() => import('./pages/app-restaurantes'));
const PortalInmobiliario = lazy(() => import('./pages/portal-inmobiliario'));
const MarketingB2B = lazy(() => import('./pages/marketing-b2b'));

// Nuevos proyectos (lazy loaded)
const Fitness = lazy(() => import('./pages/fitness'));
const Estudio = lazy(() => import('./pages/estudio'));
const Viajes = lazy(() => import('./pages/viajes'));
const Academia = lazy(() => import('./pages/academia'));
const PetBoutique = lazy(() => import('./pages/petboutique'));

// Páginas de autenticación
const AuthVerify = lazy(() => import('./pages/auth-verify'));
const PanelUsuario = lazy(() => import('./pages/panel-usuario'));
const Dashboard = lazy(() => import('./pages/dashboard'));

// Páginas de administración
const AdminDashboard = lazy(() => import('./pages/admin'));
const AdminContacts = lazy(() => import('./pages/admin/contacts'));
const AdminConsultations = lazy(() => import('./pages/admin/consultations'));
const AdminUsers = lazy(() => import('./pages/admin/users'));
const AdminNewsletter = lazy(() => import('./pages/admin/newsletter'));
const AdminAnalytics = lazy(() => import('./pages/admin/analytics'));
const AdminSettings = lazy(() => import('./pages/admin/settings'));

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
              <Route path="/blog" element={<LazyRoute><Blog /></LazyRoute>} />
              <Route path="/blog/:slug" element={<LazyRoute><BlogArticle /></LazyRoute>} />
              <Route path="/faq" element={<LazyRoute><FAQ /></LazyRoute>} />
              <Route path="/equipo" element={<LazyRoute><Equipo /></LazyRoute>} />
              <Route path="/tecnologias" element={<LazyRoute><Tecnologias /></LazyRoute>} />
              <Route path="/recursos" element={<LazyRoute><Recursos /></LazyRoute>} />
              
              {/* Rutas para proyectos del showroom */}
              <Route path="/ropaurbana" element={<LazyRoute><RopaUrbana /></LazyRoute>} />
              <Route path="/muebles" element={<LazyRoute><Muebles /></LazyRoute>} />
              <Route path="/dulce" element={<LazyRoute><Dulce /></LazyRoute>} />
              <Route path="/ecommerce-moda" element={<LazyRoute><EcommerceModa /></LazyRoute>} />
              <Route path="/plataforma-educativa" element={<LazyRoute><PlataformaEducativa /></LazyRoute>} />
              <Route path="/corporativo-premium" element={<LazyRoute><CorporativoPremium /></LazyRoute>} />
              <Route path="/app-restaurantes" element={<LazyRoute><AppRestaurantes /></LazyRoute>} />
              <Route path="/portal-inmobiliario" element={<LazyRoute><PortalInmobiliario /></LazyRoute>} />
              <Route path="/marketing-b2b" element={<LazyRoute><MarketingB2B /></LazyRoute>} />
              
              {/* Rutas para nuevos proyectos */}
              <Route path="/fitness" element={<LazyRoute><Fitness /></LazyRoute>} />
              <Route path="/estudio" element={<LazyRoute><Estudio /></LazyRoute>} />
              <Route path="/viajes" element={<LazyRoute><Viajes /></LazyRoute>} />
              <Route path="/academia" element={<LazyRoute><Academia /></LazyRoute>} />
              <Route path="/petboutique" element={<LazyRoute><PetBoutique /></LazyRoute>} />
              
              {/* Rutas de autenticación */}
              <Route path="/auth/verify/:token" element={<LazyRoute><AuthVerify /></LazyRoute>} />
              <Route path="/auth/reset-password" element={<LazyRoute><AuthVerify /></LazyRoute>} />
              <Route path="/panel" element={<LazyRoute><PanelUsuario /></LazyRoute>} />
              <Route path="/dashboard" element={<LazyRoute><Dashboard /></LazyRoute>} />
              
              {/* Rutas de administración (protegidas) */}
              <Route path="/admin" element={<LazyRoute><AdminRoute><AdminDashboard /></AdminRoute></LazyRoute>} />
              <Route path="/admin/contacts" element={<LazyRoute><AdminRoute><AdminContacts /></AdminRoute></LazyRoute>} />
              <Route path="/admin/consultations" element={<LazyRoute><AdminRoute><AdminConsultations /></AdminRoute></LazyRoute>} />
              <Route path="/admin/users" element={<LazyRoute><AdminRoute><AdminUsers /></AdminRoute></LazyRoute>} />
              <Route path="/admin/newsletter" element={<LazyRoute><AdminRoute><AdminNewsletter /></AdminRoute></LazyRoute>} />
              <Route path="/admin/analytics" element={<LazyRoute><AdminRoute><AdminAnalytics /></AdminRoute></LazyRoute>} />
              <Route path="/admin/settings" element={<LazyRoute><AdminRoute><AdminSettings /></AdminRoute></LazyRoute>} />
              
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
