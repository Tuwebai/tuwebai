import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { LazyRoute } from '@/app/router/lazy-route';
import HomePage from '@/app/router/home/home-page';
import NotFoundPage from '@/app/router/errors/not-found-page';
import PaymentReturnView from '@/features/payments/components/payment-return-view';

const CorporateSolutionsPage = lazy(() => import('@/app/router/solutions/corporate-solutions-page'));
const UxUiPage = lazy(() => import('@/app/router/solutions/uxui-page'));
const EcommerceSolutionsPage = lazy(() => import('@/app/router/solutions/ecommerce-solutions-page'));
const ProposalRequestPage = lazy(() => import('@/features/proposals/components/proposal-request-page'));

const StrategicConsultingPage = lazy(() => import('@/app/router/services/strategic-consulting-page'));
const WebDevelopmentPage = lazy(() => import('@/app/router/services/web-development-page'));
const MarketingPositioningPage = lazy(() => import('@/app/router/services/marketing-positioning-page'));
const MarketingAutomationPage = lazy(() => import('@/app/router/services/marketing-automation-page'));

const FaqPage = lazy(() => import('@/app/router/knowledge/faq-page'));
const ComparisonsPage = lazy(() => import('@/app/router/knowledge/comparisons-page'));
const BlogPage = lazy(() => import('@/app/router/blog/blog-page'));
const BlogArticlePage = lazy(() => import('@/app/router/blog/blog-article-page'));
const TeamPage = lazy(() => import('@/app/router/company/team-page'));
const VacanciesPage = lazy(() => import('@/app/router/company/vacancies-page'));
const TechnologiesPage = lazy(() => import('@/app/router/knowledge/technologies-page'));

const StudioPage = lazy(() => import('@/app/router/company/studio-page'));

const AuthVerifyPage = lazy(() => import('@/features/auth/components/auth-verify-page'));
const UserDashboardPage = lazy(() => import('@/features/users/components/user-dashboard-page'));

const SupportContactPage = lazy(() => import('@/features/contact/components/support-contact-page'));

const TermsAndConditionsPage = lazy(() => import('@/app/router/legal/terms-and-conditions-page'));
const PrivacyPolicyPage = lazy(() => import('@/app/router/legal/privacy-policy-page'));
const CookiesPolicyPage = lazy(() => import('@/app/router/legal/cookies-policy-page'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/corporativos" element={<LazyRoute><CorporateSolutionsPage /></LazyRoute>} />
      <Route path="/uxui" element={<LazyRoute><UxUiPage /></LazyRoute>} />
      <Route path="/ecommerce" element={<LazyRoute><EcommerceSolutionsPage /></LazyRoute>} />
      <Route path="/consulta" element={<LazyRoute><ProposalRequestPage /></LazyRoute>} />

      <Route path="/servicios/consultoria-estrategica" element={<LazyRoute><StrategicConsultingPage /></LazyRoute>} />
      <Route path="/servicios/desarrollo-web" element={<LazyRoute><WebDevelopmentPage /></LazyRoute>} />
      <Route path="/servicios/posicionamiento-marketing" element={<LazyRoute><MarketingPositioningPage /></LazyRoute>} />
      <Route path="/servicios/automatizacion-marketing" element={<LazyRoute><MarketingAutomationPage /></LazyRoute>} />

      <Route path="/faq" element={<LazyRoute><FaqPage /></LazyRoute>} />
      <Route path="/comparativas" element={<LazyRoute><ComparisonsPage /></LazyRoute>} />
      <Route path="/blog" element={<LazyRoute><BlogPage /></LazyRoute>} />
      <Route path="/blog/:slug" element={<LazyRoute><BlogArticlePage /></LazyRoute>} />
      <Route path="/equipo" element={<LazyRoute><TeamPage /></LazyRoute>} />
      <Route path="/vacantes" element={<LazyRoute><VacanciesPage /></LazyRoute>} />
      <Route path="/tecnologias" element={<LazyRoute><TechnologiesPage /></LazyRoute>} />

      <Route path="/estudio" element={<LazyRoute><StudioPage /></LazyRoute>} />

      <Route path="/auth/verify/:token" element={<LazyRoute><AuthVerifyPage /></LazyRoute>} />
      <Route path="/auth/reset-password" element={<LazyRoute><AuthVerifyPage /></LazyRoute>} />
      <Route path="/panel" element={<LazyRoute><UserDashboardPage /></LazyRoute>} />

      <Route
        path="/pago-exitoso"
        element={
          <LazyRoute>
            <PaymentReturnView
              variant="success"
              title="Pago realizado con exito"
              description="Tu pago fue procesado correctamente. En breve recibiras la confirmacion por email."
              ctaLabel="Volver al inicio"
            />
          </LazyRoute>
        }
      />
      <Route
        path="/pago-fallido"
        element={
          <LazyRoute>
            <PaymentReturnView
              variant="failure"
              title="Pago fallido"
              description="No pudimos procesar tu pago. Revisa tus datos y vuelve a intentarlo."
              ctaLabel="Volver e intentar"
            />
          </LazyRoute>
        }
      />
      <Route
        path="/pago-pendiente"
        element={
          <LazyRoute>
            <PaymentReturnView
              variant="pending"
              title="Pago pendiente"
              description="Tu pago esta en proceso de acreditacion. Te notificaremos por email cuando se confirme."
              ctaLabel="Volver al inicio"
            />
          </LazyRoute>
        }
      />
      <Route path="/contacto" element={<LazyRoute><SupportContactPage /></LazyRoute>} />

      <Route path="/terminos-condiciones" element={<LazyRoute><TermsAndConditionsPage /></LazyRoute>} />
      <Route path="/politica-privacidad" element={<LazyRoute><PrivacyPolicyPage /></LazyRoute>} />
      <Route path="/politica-cookies" element={<LazyRoute><CookiesPolicyPage /></LazyRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
