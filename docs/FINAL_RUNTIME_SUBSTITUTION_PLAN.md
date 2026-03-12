# Plan de Sustitución Previa a Fase 6

## Estado

Documento operativo para desbloquear la limpieza final de compatibilidad.

Re-auditoría de precondiciones de Fase 6:

- ❌ todavía no habilitada
- motivo: `pages/` ya salió del runtime y el bootstrap de `App` ya quedó finalizado, pero siguen existiendo remanentes activos en `client/src/components/*` y compatibilidades legacy fuera del runtime principal

Motivo:

- la Fase 6 no puede ejecutarse todavía sin riesgo de regresión
- siguen existiendo imports activos desde `components/`, `contexts/`, `hooks/` y fachadas de compatibilidad

## Objetivo

Eliminar dependencias runtime legacy antes de borrar carpetas o wrappers.

Esta fase no elimina todavía:

- `components/`
- `contexts/`
- `hooks/`
- `server/src/routes/public.routes.ts`

Primero sustituye consumo activo; recién después habilita limpieza final.

## Bloqueos Confirmados

### Frontend runtime aún depende de `components/`

Entradas activas:

- `client/src/app/App.tsx`
- `client/src/app/router/home/home-page.tsx`

### Reexports temporales en features

- `client/src/features/auth/components/LoginModal.tsx` ✅ corregido
- `client/src/features/contact/components/contact-section.tsx` ✅ corregido
- `client/src/features/newsletter/components/newsletter-form.tsx` ✅ corregido
- `client/src/features/payments/components/payment-return-view.tsx` ✅ corregido
- `client/src/features/payments/components/pricing-section.tsx` ✅ corregido
- `client/src/features/testimonials/components/testimonial-form.tsx` ✅ corregido
- `client/src/features/testimonials/components/testimonials-section.tsx` ✅ corregido

### Wrappers legacy aún vivos

- `client/src/contexts/AuthContext.tsx` ✅ corregido: eliminado tras quedar sin consumidores runtime directos
- `client/src/hooks/use-auth-queries.ts` ✅ corregido: eliminado tras quedar sin consumidores runtime directos
- `client/src/hooks/use-auth-mutations.ts` ✅ corregido: eliminado tras quedar sin consumidores runtime directos
- `client/src/hooks/use-testimonials.ts` ✅ corregido: eliminado tras quedar sin consumidores runtime directos
- `client/src/services/firestore.ts` ✅ corregido: eliminado tras quedar sin consumidores runtime directos
- `client/src/services/testimonials.ts` ✅ corregido: eliminado tras quedar sin consumidores runtime directos

### Backend con fachada legacy

- `server/src/routes/public.routes.ts` ✅ corregido: eliminado tras quedar sin imports activos en runtime

## Clasificación

- Dominio: arquitectura, runtime, compatibilidad
- Tipo de cambio: estructural
- Impacto: A - Crítico

## Estrategia

### Fase A. Sustituir runtime frontend

Estado:

- ✅ corregido

Objetivo:

- que `App.tsx` y las páginas activas consuman `features/` o `shared/`
- que `components/` deje de ser dependencia obligatoria de `features/`

Orden:

1. crear implementación real dentro de `features/*/components/` para los dominios que hoy solo reexportan
2. redirigir `pages/` para que consuman esos componentes de feature
3. dejar `components/` como wrapper temporal invertido solo si hace falta compatibilidad

Resultado esperado:

- `features -> components` deja de existir
- pasa a ser `pages -> features`

### Fase B. Sustituir providers y hooks legacy

Estado:

- ✅ corregido parcialmente: `client/src/hooks/use-login-modal.tsx` ya carga `features/auth/components/LoginModal`
- ✅ corregido: `client/src/components/auth/AdminRoute.tsx` y `client/src/components/auth/DashboardRoute.tsx` ya consumen `features/auth/context/AuthContext`; `client/src/pages/panel-usuario.tsx` fue retirado tras quedar fuera del runtime
- ✅ corregido parcialmente: `client/src/app/App.tsx`, `client/src/components/ui/global-navbar.tsx` y `client/src/components/auth/AdminRoute.tsx` ya consumen `features/auth/hooks/use-login-modal`
- ✅ corregido parcialmente: `client/src/app/App.tsx` ya consume `features/auth/context/AuthContext`
- ✅ corregido parcialmente: no quedan consumidores runtime de `@/contexts/AuthContext` ni `@/hooks/use-auth-*`
- pendientes wrappers legacy mínimos de bajo impacto fuera del runtime principal

Objetivo:

- eliminar dependencia de runtime hacia `contexts/` y `hooks/` legacy

Orden:

1. mover consumo en `App.tsx`, `panel-usuario.tsx`, `global-navbar.tsx`, `DashboardRoute.tsx`
2. reemplazar imports desde:
   - `@/contexts/AuthContext`
   - `@/hooks/use-auth-*`
   - `@/hooks/use-testimonials`
3. validar que solo queden imports a `features/*`

Resultado esperado:

- wrappers legacy quedan sin consumidores

### Fase C. Sustituir servicios legacy

Estado:

- ✅ corregido: `client/src/services/firestore.ts` eliminado tras quedar sin consumidores runtime directos
- ✅ corregido parcialmente: no quedan consumidores runtime de `client/src/services/testimonials.ts`
- ✅ corregido parcialmente: `client/src/hooks/use-toast.ts` eliminado tras redirigir todos sus consumidores a `client/src/shared/ui/use-toast`
- ✅ corregido parcialmente: `client/src/hooks/use-mobile.tsx` eliminado tras redirigir sus consumidores a `client/src/core/hooks/use-mobile`
- ✅ corregido parcialmente: `client/src/hooks/use-intersection-observer.tsx` eliminado tras redirigir sus consumidores a `client/src/core/hooks/use-intersection-observer`
- ✅ corregido parcialmente: `client/src/contexts/ThemeContext.tsx` eliminado tras redirigir su consumidor a `client/src/core/theme/ThemeContext`

Objetivo:

- vaciar dependencia activa de `services/firestore.ts` y `services/testimonials.ts`

Orden:

1. localizar consumidores restantes
2. moverlos a `features/users`, `features/projects`, `features/support`, `features/testimonials`
3. verificar que los servicios legacy solo queden como compatibilidad muerta o queden listos para borrar

Resultado esperado:

- no existan imports activos desde `client/src/services/*` legacy

### Fase D. Sustituir fachada backend

Estado:

- ✅ corregido: `server/src/routes/public.routes.ts` eliminado tras quedar sin imports activos

Objetivo:

- retirar `server/src/routes/public.routes.ts` sin romper montaje

Orden:

1. verificar que ningún runtime lo importe
2. eliminar reexport temporal
3. confirmar que `server/index.ts` solo usa `server/src/app/routes.ts`

## Reglas Críticas

1. No borrar archivos mientras tengan consumidores activos.
2. No mover múltiples dominios al mismo tiempo.
3. No cambiar rutas HTTP.
4. No cambiar payloads.
5. No cambiar comportamiento de UI.
6. Cada sustitución debe validar `check`, `lint`, `build`, `smoke`.

## Orden Recomendado de Ejecución

1. `auth` runtime ✅ corregido
2. `payments` runtime ✅ corregido
3. `contact/newsletter/testimonials` runtime
   - `testimonials` ✅ corregido
   - `contact` ✅ corregido
   - `newsletter` ✅ corregido
4. `shared/ui` base
5. `services` legacy restantes
6. `public.routes.ts`
7. recién después Fase 6 real

## Criterio de Desbloqueo de Fase 6

La limpieza final queda habilitada solo si:

- `rg "@/contexts/AuthContext"` no devuelve consumidores runtime
- `rg "@/hooks/use-auth-"` no devuelve consumidores runtime
- `rg "@/services/firestore"` no devuelve consumidores runtime
- `rg "@/hooks/use-toast"` no devuelve consumidores runtime
- `rg "@/hooks/use-mobile"` no devuelve consumidores runtime
- `rg "@/hooks/use-intersection-observer"` no devuelve consumidores runtime
- `rg "@/contexts/ThemeContext"` no devuelve consumidores runtime
- `rg "export { default } from '@/components"` no devuelve reexports en `features/`
- `rg "public.routes"` no devuelve imports activos

Resultado actual de la re-auditoría:

- ✅ `@/contexts/AuthContext` sin consumidores runtime
- ✅ `@/hooks/use-auth-*` sin consumidores runtime
- ✅ `@/services/firestore` sin consumidores runtime
- ✅ `@/hooks/use-toast` sin consumidores runtime
- ✅ `@/hooks/use-mobile` sin consumidores runtime
- ✅ `@/hooks/use-intersection-observer` sin consumidores runtime
- ✅ `@/contexts/ThemeContext` sin consumidores runtime
- ✅ `public.routes` sin imports activos
- ✅ los wrappers invertidos `components/* -> features/*` ya fueron retirados
- ✅ corregido: `client/src/main.tsx` ya consume `client/src/app/App.tsx` como bootstrap final y `client/src/App.tsx` fue retirado tras quedar sin consumidores
- ✅ corregido: `client/src/app/router/home/home-page.tsx` es el entrypoint estructural del landing; mantiene el shell SEO y delega la composición a `features/marketing-home/components/marketing-home-page`
- ✅ corregido: `client/src/pages/not-found.tsx` ya no forma parte del runtime; `client/src/app/router/AppRoutes.tsx` consume `client/src/app/router/errors/not-found-page.tsx`
- ✅ corregido: `client/src/pages/terminos-condiciones.tsx`, `client/src/pages/politica-privacidad.tsx` y `client/src/pages/politica-cookies.tsx` ya no forman parte del runtime; `client/src/app/router/AppRoutes.tsx` consume `client/src/app/router/legal/*`
- ✅ corregido: `client/src/pages/servicios/*` ya no forma parte del runtime; `client/src/app/router/AppRoutes.tsx` consume `client/src/app/router/services/*`
- ✅ corregido: `client/src/pages/vacantes.tsx` ya no forma parte del runtime ni del prefetch; `client/src/app/router/AppRoutes.tsx` y `client/src/lib/route-prefetch.ts` consumen `client/src/app/router/company/vacancies-page.tsx`
- ✅ corregido: `client/src/pages/corporativos.tsx` y `client/src/pages/ecommerce.tsx` ya no forman parte del runtime; `client/src/app/router/AppRoutes.tsx` consume `client/src/app/router/solutions/*`
- ✅ corregido: `client/src/pages/uxui.tsx` ya no forma parte del runtime; `client/src/app/router/AppRoutes.tsx` consume `client/src/app/router/solutions/uxui-page.tsx`
- ✅ corregido: `client/src/pages/equipo.tsx` ya no forma parte del runtime; `client/src/app/router/AppRoutes.tsx` consume `client/src/app/router/company/team-page.tsx`
- ✅ corregido: `client/src/pages/estudio.tsx` ya no forma parte del runtime; `client/src/app/router/AppRoutes.tsx` consume `client/src/app/router/company/studio-page.tsx`
- ✅ corregido: `client/src/pages/faq.tsx` ya no forma parte del runtime; `client/src/app/router/AppRoutes.tsx` consume `client/src/app/router/knowledge/faq-page.tsx`
- ✅ corregido: `client/src/pages/tecnologias.tsx` ya no forma parte del runtime; `client/src/app/router/AppRoutes.tsx` consume `client/src/app/router/knowledge/technologies-page.tsx`
- ✅ corregido: `client/src/components/sections/*` ya no contiene ensamblado activo de `marketing-home`; los wrappers temporales (`hero`, `philosophy`, `services`, `process`, `tech`, `impact`, `comparison`, `showroom`) fueron retirados tras quedar sin consumidores
- ✅ siguiente paso definido: `docs/MARKETING_HOME_FINALIZATION_PLAN.md`
- ✅ corregido: `client/src/pages/*` dejó de ser runtime activo y `client/src/app/router/` quedó agrupado por dominios semánticos (`home`, `errors`, `company`, `knowledge`, `legal`, `services`, `solutions`)
- ✅ corregido: `client/src/components/route-wrapper.tsx` dejó de formar parte del runtime estructural; `client/src/app/router/AppRoutes.tsx` consume `client/src/app/router/lazy-route.tsx` y el wrapper legacy fue retirado
- ✅ corregido: `client/src/app/App.tsx` y `client/src/app/router/lazy-route.tsx` ya consumen `client/src/shared/ui/{footer,toaster,skeleton}`; los wrappers equivalentes en `client/src/components/ui/*` quedaron fuera del runtime estructural
- ✅ corregido: `client/src/app/router/solutions/*`, `client/src/features/proposals/components/proposal-request-page.tsx` y `client/src/features/contact/components/support-contact-page.tsx` ya consumen `client/src/shared/ui/{button,input,textarea,scroll-progress,whatsapp-button}`; los wrappers equivalentes en `client/src/components/ui/*` quedaron fuera de ese runtime activo
- ✅ corregido: `client/src/features/contact/components/contact-section.tsx`, `client/src/features/testimonials/components/testimonials-section.tsx` y `client/src/features/payments/components/payment-error-dialog.tsx` ya consumen `client/src/shared/ui/{animated-shape,alert-dialog}`; los wrappers equivalentes en `client/src/components/ui/*` quedaron fuera de ese runtime activo
- ✅ corregido: `client/src/app/router/home/home-page.tsx`, `client/src/app/router/company/studio-page.tsx`, `client/src/features/users/components/user-dashboard-page.tsx` y `client/src/features/auth/components/auth-verify-page.tsx` ya consumen `client/src/shared/ui/meta-tags.tsx`; `client/src/components/seo/meta-tags.tsx` quedó fuera del runtime activo
- ✅ corregido: `client/src/features/users/components/user-dashboard-page.tsx` ya consume `client/src/shared/ui/whatsapp-button.tsx`; el wrapper equivalente en `client/src/components/ui/whatsapp-button.tsx` quedó fuera de ese runtime activo
- ✅ corregido: `client/src/hooks/use-vacancies.ts` ya consume `client/src/shared/ui/use-toast`; `client/src/components/ui/use-toast/*` quedó fuera del runtime activo directo
- ✅ corregido: `client/src/app/App.tsx` ya consume `client/src/shared/ui/skip-link.tsx`; `client/src/components/a11y/skip-link.tsx` quedó como wrapper temporal de compatibilidad
- ✅ corregido parcialmente: `client/src/shared/ui/command.tsx` ya concentra la implementación real; `client/src/components/ui/command.tsx` quedó reducido a wrapper de compatibilidad
- ✅ corregido parcialmente: `client/src/shared/ui/{form,calendar,carousel}.tsx` ya concentran la implementación real; `client/src/components/ui/{form,calendar,carousel}.tsx` quedaron reducidos a wrappers de compatibilidad
- ✅ corregido: `client/src/components/ui/{command,form,calendar,carousel}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como destino final
- ✅ corregido: `client/src/components/ui/{global-navbar,chart,aspect-ratio,input-otp}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; no existía runtime activo ni compatibilidad necesaria para esos paths
- ✅ corregido: `client/src/components/ui/{button,input,textarea,label,toast,toaster}` y `client/src/components/ui/use-toast/*` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final
- ✅ corregido: `client/src/components/ui/{accordion,alert,alert-dialog,badge,card,checkbox}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final
- ✅ corregido: `client/src/components/ui/{dialog,drawer,dropdown-menu,context-menu,popover,hover-card}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final
- ✅ corregido: `client/src/components/ui/{animated-shape,avatar,breadcrumb,company-logo-slider,footer,loading-spinner}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` y `client/src/app/layout/*` quedaron como implementación final
- ✅ corregido: `client/src/components/ui/{nav-dots,page-banner,pagination,particle-effect,progress,scroll-progress,separator,skeleton}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final
- ✅ corregido: `client/src/components/ui/{collapsible,menubar,navigation-menu,radio-group,select,sheet}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final
- ✅ corregido: `client/src/components/ui/{resizable,scroll-area,sidebar,slider,switch,table,tabs,toggle-group,toggle,tooltip,whatsapp-button}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final y `client/src/components/ui/*` dejó de participar del runtime frontend
- ✅ corregido: `client/src/app/App.tsx` dejó de depender de `client/src/components/performance/*`; `ResourcePreload` y `MemoryManager` fueron reclasificados a `client/src/app/performance/*` como instrumentación propia del runtime de aplicación
- ✅ corregido: `client/src/components/a11y/*` fue retirado tras confirmar ausencia de consumidores internos; `SkipLink` quedó consolidado en `client/src/shared/ui/skip-link.tsx` y el resto del paquete no participaba del runtime activo
- ✅ corregido: `client/src/components/performance/*` fue retirado tras confirmar ausencia de consumidores internos; `ResourcePreload` y `MemoryManager` ya quedaron consolidados en `client/src/app/performance/*` y `DeferredContent`/`OptimizedImage` no participaban del runtime activo

Estado de re-auditoría de `client/src/components/ui`:

- no corresponde borrar la carpeta en bloque todavía
- no quedan remanentes equivalentes en `components/ui` para `command`, `form`, `calendar` ni `carousel`; esos wrappers ya fueron retirados
- tampoco quedan consumidores internos para `global-navbar`, `chart`, `aspect-ratio` ni `input-otp`; esos archivos muertos ya fueron retirados
- tampoco quedan consumidores internos para `button`, `input`, `textarea`, `label`, `toast`, `toaster` ni `use-toast`; esos wrappers ya fueron retirados
- tampoco quedan consumidores internos para `accordion`, `alert`, `alert-dialog`, `badge`, `card` ni `checkbox`; esos wrappers ya fueron retirados
- tampoco quedan consumidores internos para `dialog`, `drawer`, `dropdown-menu`, `context-menu`, `popover` ni `hover-card`; esos wrappers ya fueron retirados
- `client/src/components/performance/*` no es `shared/ui`; su destino final debe resolverse como instrumentacion de `app` en un slice especifico, no mezclado con esta limpieza
- la limpieza final debe hacerse archivo por archivo, no por borrado masivo

## Validación Obligatoria

Después de cada bloque:

- `npm run check`
- `npm run lint`
- `npm run build`
- `npm run smoke`

## Resultado Esperado

Al terminar esta fase previa:

- la Fase 6 se vuelve ejecutable
- la limpieza final pasa a ser mecánica y segura
- la auditoría puede cerrarse sin riesgo de romper runtime activo
