# Mapa Actual a Estructura Target

## Objetivo

Registrar el destino arquitectónico de los archivos actuales sin ejecutar moves.

## Backend

### Bootstrap y composición

- `server/index.ts` -> `server/src/app/server.ts`
- `server/src/routes/*.ts` -> `server/src/modules/*/*.routes.ts` y composición final en `server/src/app/routes.ts`

### Infraestructura y core

- `server/src/config/env.config.ts` -> `server/src/core/config/env.config.ts`
- `server/src/config/firebase-admin.ts` -> `server/src/infrastructure/firebase/firebase-admin.ts`
- `server/src/config/mailer.ts` -> `server/src/infrastructure/mail/mailer.ts`
- `server/src/config/mercadopago.ts` -> `server/src/infrastructure/mercadopago/mercadopago.ts`
- `server/src/middlewares/error.middleware.ts` -> `server/src/core/errors/error.middleware.ts`
- `server/src/middlewares/firebase-auth.middleware.ts` -> `server/src/core/auth/firebase-auth.middleware.ts`
- `server/src/middlewares/internal-auth.middleware.ts` -> `server/src/core/auth/internal-auth.middleware.ts`
- `server/src/middlewares/request-id.middleware.ts` -> `server/src/core/logger/request-id.middleware.ts`
- `server/src/middlewares/rate-limit.middleware.ts` -> `server/src/core/validation/rate-limit.middleware.ts`
- `server/src/middlewares/validate.middleware.ts` -> `server/src/core/validation/validate.middleware.ts`
- `server/src/middlewares/access-control.middleware.ts` -> `server/src/core/auth/access-control.middleware.ts`
- `server/src/utils/app-logger.ts` -> `server/src/core/logger/app-logger.ts`

### Módulos de dominio

- `server/src/controllers/contact.controller.ts` -> `server/src/modules/contact/contact.controller.ts`
- `server/src/routes/contact.routes.ts` -> `server/src/modules/contact/contact.routes.ts`
- `server/src/controllers/payment.controller.ts` -> `server/src/modules/payments/payment.controller.ts`
- `server/src/routes/payment.routes.ts` -> `server/src/modules/payments/payment.routes.ts`
- `server/src/constants/payment-plans.ts` -> `server/src/modules/payments/payment-plans.ts`
- `server/src/services/payment.service.ts` -> `server/src/modules/payments/payment.service.ts`
- `server/src/services/webhook-idempotency.service.ts` -> `server/src/modules/payments/webhook-idempotency.service.ts`
- `server/src/controllers/public.controller.ts` -> dividido entre:
  - `server/src/modules/newsletter/newsletter.controller.ts`
  - `server/src/modules/testimonials/testimonials.controller.ts`
  - `server/src/modules/support/support.controller.ts`
  - `server/src/modules/projects/projects.controller.ts`
  - `server/src/modules/users/users.controller.ts`
  - `server/src/modules/contact/contact.controller.ts`

### Shared backend

- `server/src/utils/logger.ts` -> `server/src/shared/utils/logger.ts`
- `server/src/utils/submission-store.ts` -> `server/src/shared/utils/submission-store.ts`
- `server/src/templates/email.template.ts` -> `server/src/shared/utils/email.template.ts`
- `server/src/security/access-policy.ts` -> `server/src/core/auth/access-policy.ts`

## Frontend

### App y core

- `client/src/main.tsx` -> `client/src/app/main.tsx`
- `client/src/App.tsx` -> `client/src/app/App.tsx`
- `client/src/lib/queryClient.ts` -> `client/src/core/query/queryClient.ts`
- `client/src/lib/http-client.ts` -> `client/src/core/http/http-client.ts`
- `client/src/lib/backend-api.ts` -> `client/src/core/http/backend-api.ts`
- `client/src/lib/firebase.ts` -> `client/src/core/auth/firebase.ts`
- `client/src/contexts/AuthContext.tsx` -> `client/src/core/auth/AuthContext.tsx`
- `client/src/contexts/ThemeContext.tsx` -> `client/src/core/config/ThemeContext.tsx`

### Features

- `client/src/pages/auth-verify.tsx` -> `client/src/features/auth/auth-verify-page.tsx`
- `client/src/hooks/use-auth-mutations.ts` -> `client/src/features/auth/hooks/use-auth-mutations.ts`
- `client/src/hooks/use-auth-queries.ts` -> `client/src/features/auth/hooks/use-auth-queries.ts`
- `client/src/services/testimonials.ts` -> `client/src/features/testimonials/services/testimonials.service.ts`
- `client/src/hooks/use-testimonials.ts` -> `client/src/features/testimonials/hooks/use-testimonials.ts`
- `client/src/components/sections/testimonials-section.tsx` -> `client/src/features/testimonials/components/testimonials-section.tsx`
- `client/src/components/ui/testimonial-form.tsx` -> `client/src/features/testimonials/components/testimonial-form.tsx`
- `client/src/pages/contacto.tsx` -> `client/src/features/contact/contact-page.tsx`
- `client/src/pages/consulta.tsx` -> `client/src/features/contact/consulta-page.tsx`
- `client/src/components/ui/newsletter-form.tsx` -> `client/src/features/newsletter/components/newsletter-form.tsx`
- `client/src/components/sections/pricing-section.tsx` -> `client/src/features/payments/components/pricing-section.tsx`
- `client/src/components/payment/payment-return-view.tsx` -> `client/src/features/payments/components/payment-return-view.tsx`
- `client/src/pages/panel-usuario.tsx` -> reparto entre `client/src/features/user/`, `client/src/features/support/`, `client/src/features/projects/`

### Shared frontend

- `client/src/components/ui/*` -> `client/src/shared/ui/*`
- `client/src/components/a11y/*` -> `client/src/shared/ui/a11y/*`
- `client/src/lib/utils.ts` -> `client/src/shared/utils/utils.ts`
- `client/src/types/*` -> `client/src/shared/types/*`
- `client/src/data/*` -> `client/src/shared/constants/*`

## Legacy

- `legacy/php-api/*` -> permanece en `legacy/php-api/*`
- `legacy/firebase/*` -> permanece en `legacy/firebase/*`

## Regla

Este mapa no autoriza moves automáticos.  
Solo define destino arquitectónico para fases posteriores.
