import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppQueryProvider } from '@/app/providers/app-query-provider';
import { LazyRoute } from '@/app/router/lazy-route';
import NotFoundPage from '@/app/router/errors/not-found-page';
import PaymentReturnView from '@/features/payments/components/payment-return-view';

const CorporateSolutionsPage = lazy(() => import('@/app/router/solutions/corporate-solutions-page'));
const UxUiPage = lazy(() => import('@/app/router/solutions/uxui-page'));
const EcommerceSolutionsPage = lazy(() => import('@/app/router/solutions/ecommerce-solutions-page'));
const ProposalRequestPage = lazy(() => import('@/features/proposals/components/proposal-request-page'));

const WebDevelopmentPage = lazy(() => import('@/app/router/services/web-development-page'));
const AboutPage = lazy(() => import('@/app/router/about/about-page'));
const ProcessPage = lazy(() => import('@/app/router/company/process-page'));

const FaqPage = lazy(() => import('@/app/router/knowledge/faq-page'));
const BlogPage = lazy(() => import('@/app/router/blog/blog-page'));
const BlogArticlePage = lazy(() => import('@/app/router/blog/blog-article-page'));

const AuthActionPage = lazy(() => import('@/features/auth/components/auth-action-page'));
const NewsletterConfirmPage = lazy(() => import('@/features/newsletter/components/newsletter-confirm-page'));
const NewsletterConfirmationLandingPage = lazy(() => import('@/features/newsletter/components/newsletter-confirmation-landing-page'));
const NewsletterUnsubscribePage = lazy(() => import('@/features/newsletter/components/newsletter-unsubscribe-page'));

const SupportContactPage = lazy(() => import('@/features/contact/components/support-contact-page'));
const DiagnosticoGratuitoPage = lazy(() => import('@/features/contact/components/diagnostico-gratuito-page'));

const TermsAndConditionsPage = lazy(() => import('@/app/router/legal/terms-and-conditions-page'));
const PrivacyPolicyPage = lazy(() => import('@/app/router/legal/privacy-policy-page'));
const CookiesPolicyPage = lazy(() => import('@/app/router/legal/cookies-policy-page'));

export default function PublicRoutes() {
  return (
    <AppQueryProvider>
      <Routes>
      <Route path="/corporativos" element={<LazyRoute><CorporateSolutionsPage /></LazyRoute>} />
      <Route path="/uxui" element={<LazyRoute><UxUiPage /></LazyRoute>} />
      <Route path="/ecommerce" element={<LazyRoute><EcommerceSolutionsPage /></LazyRoute>} />
      <Route path="/consulta" element={<LazyRoute><ProposalRequestPage /></LazyRoute>} />
      <Route path="/nosotros" element={<LazyRoute><AboutPage /></LazyRoute>} />
      <Route path="/proceso" element={<LazyRoute><ProcessPage /></LazyRoute>} />

      <Route path="/servicios/desarrollo-web" element={<LazyRoute><WebDevelopmentPage /></LazyRoute>} />
      <Route path="/servicios/estrategia-digital" element={<Navigate to="/consulta" replace />} />
      <Route path="/servicios/consultoria-estrategica" element={<Navigate to="/consulta" replace />} />
      <Route path="/servicios/posicionamiento-marketing" element={<Navigate to="/consulta" replace />} />
      <Route path="/servicios/automatizacion-marketing" element={<Navigate to="/consulta" replace />} />

      <Route path="/faq" element={<LazyRoute><FaqPage /></LazyRoute>} />
      <Route path="/blog" element={<LazyRoute><BlogPage /></LazyRoute>} />
      <Route path="/blog/:slug" element={<LazyRoute><BlogArticlePage /></LazyRoute>} />

      <Route path="/auth/action" element={<LazyRoute><AuthActionPage /></LazyRoute>} />
      <Route path="/auth/verify/:token" element={<LazyRoute><AuthActionPage /></LazyRoute>} />
      <Route path="/auth/reset-password" element={<LazyRoute><AuthActionPage /></LazyRoute>} />
      <Route path="/newsletter/confirmacion" element={<LazyRoute><NewsletterConfirmationLandingPage /></LazyRoute>} />
      <Route path="/newsletter/confirm/:token" element={<LazyRoute><NewsletterConfirmPage /></LazyRoute>} />
      <Route path="/newsletter/unsubscribe/:token" element={<LazyRoute><NewsletterUnsubscribePage /></LazyRoute>} />
      <Route path="/diagnostico-gratuito" element={<LazyRoute><DiagnosticoGratuitoPage /></LazyRoute>} />

      <Route
        path="/pago-exitoso"
        element={
          <LazyRoute>
            <PaymentReturnView
              variant="success"
              title="Pago realizado con éxito"
              description="Tu pago fue procesado correctamente. En breve recibirás la confirmación por email."
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
              description="Tu pago está en proceso de acreditación. Te notificaremos por email cuando se confirme."
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
    </AppQueryProvider>
  );
}
