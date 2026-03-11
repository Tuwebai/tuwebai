import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { LazyRoute } from '@/components/route-wrapper';
import Home from '@/pages/home';
import NotFound from '@/pages/not-found';

const Corporativos = lazy(() => import('@/pages/corporativos'));
const UXUI = lazy(() => import('@/pages/uxui'));
const Ecommerce = lazy(() => import('@/pages/ecommerce'));
const Consulta = lazy(() => import('@/pages/consulta'));

const ConsultoriaEstrategica = lazy(() => import('@/pages/servicios/consultoria-estrategica'));
const DesarrolloWeb = lazy(() => import('@/pages/servicios/desarrollo-web'));
const PosicionamientoMarketing = lazy(() => import('@/pages/servicios/posicionamiento-marketing'));
const AutomatizacionMarketing = lazy(() => import('@/pages/servicios/automatizacion-marketing'));

const FAQ = lazy(() => import('@/pages/faq'));
const Equipo = lazy(() => import('@/pages/equipo'));
const Vacantes = lazy(() => import('@/pages/vacantes'));
const Tecnologias = lazy(() => import('@/pages/tecnologias'));

const Estudio = lazy(() => import('@/pages/estudio'));

const AuthVerify = lazy(() => import('@/pages/auth-verify'));
const PanelUsuario = lazy(() => import('@/pages/panel-usuario'));

const PagoExitoso = lazy(() => import('@/pages/pago-exitoso'));
const PagoFallido = lazy(() => import('@/pages/pago-fallido'));
const PagoPendiente = lazy(() => import('@/pages/pago-pendiente'));
const Contacto = lazy(() => import('@/pages/contacto'));

const TerminosCondiciones = lazy(() => import('@/pages/terminos-condiciones'));
const PoliticaPrivacidad = lazy(() => import('@/pages/politica-privacidad'));
const PoliticaCookies = lazy(() => import('@/pages/politica-cookies'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/corporativos" element={<LazyRoute><Corporativos /></LazyRoute>} />
      <Route path="/uxui" element={<LazyRoute><UXUI /></LazyRoute>} />
      <Route path="/ecommerce" element={<LazyRoute><Ecommerce /></LazyRoute>} />
      <Route path="/consulta" element={<LazyRoute><Consulta /></LazyRoute>} />

      <Route path="/servicios/consultoria-estrategica" element={<LazyRoute><ConsultoriaEstrategica /></LazyRoute>} />
      <Route path="/servicios/desarrollo-web" element={<LazyRoute><DesarrolloWeb /></LazyRoute>} />
      <Route path="/servicios/posicionamiento-marketing" element={<LazyRoute><PosicionamientoMarketing /></LazyRoute>} />
      <Route path="/servicios/automatizacion-marketing" element={<LazyRoute><AutomatizacionMarketing /></LazyRoute>} />

      <Route path="/faq" element={<LazyRoute><FAQ /></LazyRoute>} />
      <Route path="/equipo" element={<LazyRoute><Equipo /></LazyRoute>} />
      <Route path="/vacantes" element={<LazyRoute><Vacantes /></LazyRoute>} />
      <Route path="/tecnologias" element={<LazyRoute><Tecnologias /></LazyRoute>} />

      <Route path="/estudio" element={<LazyRoute><Estudio /></LazyRoute>} />

      <Route path="/auth/verify/:token" element={<LazyRoute><AuthVerify /></LazyRoute>} />
      <Route path="/auth/reset-password" element={<LazyRoute><AuthVerify /></LazyRoute>} />
      <Route path="/panel" element={<LazyRoute><PanelUsuario /></LazyRoute>} />

      <Route path="/pago-exitoso" element={<LazyRoute><PagoExitoso /></LazyRoute>} />
      <Route path="/pago-fallido" element={<LazyRoute><PagoFallido /></LazyRoute>} />
      <Route path="/pago-pendiente" element={<LazyRoute><PagoPendiente /></LazyRoute>} />
      <Route path="/contacto" element={<LazyRoute><Contacto /></LazyRoute>} />

      <Route path="/terminos-condiciones" element={<LazyRoute><TerminosCondiciones /></LazyRoute>} />
      <Route path="/politica-privacidad" element={<LazyRoute><PoliticaPrivacidad /></LazyRoute>} />
      <Route path="/politica-cookies" element={<LazyRoute><PoliticaCookies /></LazyRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
