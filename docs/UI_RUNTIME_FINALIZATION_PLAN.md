# Plan Enterprise de Finalización de Runtime UI

## Objetivo

Cerrar la última brecha antes de la limpieza final de Fase 6 sin romper:

- rutas existentes
- contratos API
- comportamiento funcional
- composición actual de UI

Este plan cubre tres frentes:

1. reclasificar `components/ui` y `components/sections`
2. mover `App.tsx` y el runtime a ubicación arquitectónica final
3. ejecutar recién después la limpieza final de Fase 6

## Contexto

Estado actual del repo:

- la compatibilidad legacy de auth, services y backend façade ya fue retirada o desacoplada
- ya no quedan wrappers invertidos `components/* -> features/*`
- el bloqueo restante ya no está en `pages/` ni en el bootstrap de `App`; hoy se concentra en remanentes activos dentro de `client/src/components/*`

Conclusión:

- `pages/` ya salió del runtime
- no corresponde borrar `components/` todavía
- primero hay que reclasificar qué es `shared` y qué es `feature`

## Principios

1. Cambios mínimos por slice.
2. Un solo tipo de movimiento por vez.
3. Mantener compatibilidad temporal con wrappers invertidos si hacen falta.
4. No mover routing y UI compartida en el mismo commit.
5. Cada fase debe cerrar con validación completa:
   - `npm run check`
   - `npm run lint`
   - `npm run build`
   - `npm run smoke`

## Criterios de Clasificación

### Va a `client/src/shared/ui/`

Componentes que:

- no contienen lógica de negocio
- son reutilizables en múltiples pantallas
- reciben datos por props
- no dependen de un dominio específico

Ejemplos esperables:

- `button`
- `input`
- `textarea`
- `dialog`
- `toast`
- `skeleton`
- `footer`
- `page-banner`
- `scroll-progress`
- `whatsapp-button`
- `animated-shape`

### Va a `client/src/features/<dominio>/components/`

Componentes que:

- representan una capability de negocio
- dependen de hooks o services del dominio
- renderizan una sección concreta del producto
- tienen coupling semántico con un flujo funcional

Ejemplos esperables:

- `contact-section`
- `newsletter-form`
- `pricing-section`
- `payment-return-view`
- `testimonials-section`
- `testimonial-form`
- `LoginModal`

### Se mantiene temporalmente en `components/`

Componentes que todavía:

- son consumidos por varias páginas legacy
- no están suficientemente estabilizados para reclasificarlos sin riesgo
- mezclan layout, motion y ensamblado visual no trivial

Ejemplos probables a revisar:

- `hero-section`
- `services-section`
- `tech-section`
- `process-section`
- `comparison-section`
- `showroom-section`

## Fases

### Fase 0. Auditoría de clasificación

Estado:

- ✅ corregido
- matriz entregada en `docs/UI_RUNTIME_CLASSIFICATION_MATRIX.md`

Objetivo:

- inventariar cada archivo en `client/src/components/ui` y `client/src/components/sections`
- decidir si va a `shared/ui`, `features/*/components` o se mantiene temporalmente

Entregable:

- matriz `archivo actual -> destino -> motivo -> riesgo`

Regla:

- no mover nada todavía

### Fase 1. Shared UI base

Estado:

- ✅ corregido parcialmente: lote 1 movido a `shared/ui`
- componentes movidos: `button`, `input`, `textarea`, `label`
- ✅ corregido parcialmente: lote 2 movido a `shared/ui`
- componentes movidos: `checkbox`, `select`, `radio-group`, `switch`
- ✅ corregido parcialmente: lote 3 movido a `shared/ui`
- componentes movidos: `accordion`, `alert`, `badge`, `card`, `separator`, `skeleton`
- ✅ corregido parcialmente: lote 4 movido a `shared/ui`
- componentes movidos: `dialog`, `drawer`, `tabs`, `tooltip`, `hover-card`, `scroll-area`
- ✅ corregido parcialmente: lote 5 movido a `shared/ui`
- componentes movidos: `popover`, `sheet`, `dropdown-menu`, `context-menu`, `navigation-menu`, `menubar`
- ✅ corregido parcialmente: lote 6 movido a `shared/ui`
- componentes movidos: `collapsible`, `toggle`, `toggle-group`, `slider`, `progress`, `resizable`
- ✅ corregido parcialmente: lote 7 movido a `shared/ui`
- componentes movidos: `alert-dialog`, `avatar`, `breadcrumb`, `pagination`, `table`, `loading-spinner`
- ✅ corregido parcialmente: lote 8 movido a `shared/ui`
- componentes movidos: `toast`, `toaster`, `use-toast/index`, `page-banner`, `animated-shape`, `whatsapp-button`
- ✅ corregido parcialmente: lote 9 movido a `shared/ui`
- componentes movidos: `scroll-progress`, `particle-effect`, `company-logo-slider`, `nav-dots`, `sidebar`
- ✅ corregido parcialmente: `footer` movido a `shared/ui`
- ✅ corregido parcialmente: `global-navbar` movido a `client/src/app/layout/`
- ✅ corregido parcialmente: `command` movido a `shared/ui`
- ✅ corregido parcialmente: `form`, `calendar` y `carousel` movidos a `shared/ui`
- ✅ corregido: `client/src/components/ui/{command,form,calendar,carousel}.tsx` fueron retirados tras quedar sin consumidores internos; sus implementaciones finales viven en `client/src/shared/ui/*`
- ✅ corregido: `client/src/components/ui/{global-navbar,chart,aspect-ratio,input-otp}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; no correspondía mantenerlos como compatibilidad activa
- ✅ corregido: `client/src/components/ui/{button,input,textarea,label,toast,toaster}` y `client/src/components/ui/use-toast/*` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como destino final
- ✅ corregido: `client/src/components/ui/{accordion,alert,alert-dialog,badge,card,checkbox}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final
- ✅ corregido: `client/src/components/ui/{dialog,drawer,dropdown-menu,context-menu,popover,hover-card}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final
- ✅ corregido: `client/src/components/ui/{animated-shape,avatar,breadcrumb,company-logo-slider,footer,loading-spinner}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` y `client/src/app/layout/*` quedaron como implementación final
- ✅ corregido: `client/src/components/ui/{nav-dots,page-banner,pagination,particle-effect,progress,scroll-progress,separator,skeleton}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final
- ✅ corregido: `client/src/components/ui/{collapsible,menubar,navigation-menu,radio-group,select,sheet}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final
- ✅ corregido: `client/src/components/ui/{resizable,scroll-area,sidebar,slider,switch,table,tabs,toggle-group,toggle,tooltip,whatsapp-button}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final y `client/src/components/ui/*` dejó de participar del runtime frontend
- ✅ corregido: `client/src/app/App.tsx` dejó de depender de `client/src/components/performance/*`; `ResourcePreload` y `MemoryManager` fueron reclasificados a `client/src/app/performance/*` como instrumentación propia del runtime de aplicación
- ✅ corregido: `client/src/components/a11y/*` fue retirado tras confirmar ausencia de consumidores internos; `SkipLink` quedó consolidado en `client/src/shared/ui/skip-link.tsx` y el resto del paquete no participaba del runtime activo
- ✅ corregido: `client/src/components/performance/*` fue retirado tras confirmar ausencia de consumidores internos; `ResourcePreload` y `MemoryManager` ya quedaron consolidados en `client/src/app/performance/*` y `DeferredContent`/`OptimizedImage` no participaban del runtime activo

Objetivo:

- mover primero UI verdaderamente compartida a `client/src/shared/ui`

Orden recomendado:

1. primitives ya desacopladas
2. utilitarios visuales simples
3. layout helpers

Estrategia:

- crear implementación real en `shared/ui`
- dejar wrapper temporal en `components/ui` solo si existe consumo activo
- migrar consumidores gradualmente

No incluir:

- sections grandes
- páginas
- routing

Definition of Done:

- los componentes shared seleccionados ya viven en `shared/ui`
- `components/ui` queda reducido a compatibilidad o a remanentes no reclasificados

### Fase 2. Sections por dominio

Estado:

- ✅ corregido parcialmente: `contact` ya consume `client/src/features/contact/components/contact-section.tsx` desde `home.tsx`
- ✅ corregido parcialmente: `testimonials` ya consume `client/src/features/testimonials/components/testimonials-section.tsx` desde `home.tsx`
- ✅ corregido parcialmente: `payments` ya consume `client/src/features/payments/components/pricing-section.tsx` desde `home.tsx` y `client/src/features/payments/components/payment-return-view.tsx` desde `pages/pago-*`
- ✅ corregido: el bloque restante de `components/sections/*` asociado a `marketing-home` ya fue absorbido por `client/src/features/marketing-home/components/*`; los wrappers temporales fueron retirados tras la re-auditoría

Objetivo:

- mover secciones acopladas a negocio desde `components/sections` a `features/*/components`

Orden recomendado:

1. `contact`
2. `testimonials`
3. `payments`
4. resto de secciones con dependencia funcional clara

Estrategia:

- crear implementación real en la feature si aún no existe
- redirigir páginas activas a `features/*/components`
- mantener wrapper temporal solo si sigue habiendo consumidores secundarios

Definition of Done:

- las sections de negocio dejan de depender de `components/sections`

### Fase 3. Runtime shell

Estado:

- ✅ corregido: implementación principal movida a `client/src/app/App.tsx`
- ✅ corregido: `client/src/main.tsx` ya consume `client/src/app/App.tsx` como bootstrap final y `client/src/App.tsx` fue retirado tras quedar sin consumidores
- ✅ corregido parcialmente: providers globales extraídos a `client/src/app/providers/AppProviders.tsx`
- ✅ corregido parcialmente: tabla de rutas extraída a `client/src/app/router/AppRoutes.tsx`

Objetivo:

- mover el shell de aplicación a la estructura final

Target:

- `client/src/app/App.tsx`
- `client/src/app/providers/`
- `client/src/app/router/`

Alcance:

- mover `App.tsx`
- separar providers globales
- separar tabla de rutas

Regla crítica:

- no cambiar paths públicos
- no cambiar lazy loading efectivo
- no cambiar composición funcional visible

Compatibilidad:

- la compatibilidad temporal vía `client/src/App.tsx` ya fue retirada; el bootstrap real ya entra directo por `client/src/app/App.tsx`

Definition of Done:

- el runtime principal ya vive en `app/`
- `App.tsx` legacy queda vacío o como puente temporal controlado

### Fase 4. Pages finalization

Estado:

- ✅ corregido: `pago-exitoso`, `pago-fallido` y `pago-pendiente` dejaron de ser dependencia estructural del router; `AppRoutes` consume `features/payments/components/payment-return-view` y los entrypoints legacy fueron retirados
- ✅ corregido: `contacto` dejó de ser dependencia estructural del router; `AppRoutes` consume `features/contact/components/support-contact-page` y el bridge legacy fue retirado
- ✅ corregido: `auth-verify` dejó de ser dependencia estructural del router; `AppRoutes` consume `features/auth/components/auth-verify-page` y el bridge legacy fue retirado
- ✅ corregido: `consulta` dejó de ser dependencia estructural del router; `AppRoutes` y `route-prefetch` consumen `features/proposals/components/proposal-request-page` y el bridge legacy fue retirado
- ✅ corregido: `panel-usuario` dejó de ser dependencia estructural del router y del prefetch; `AppRoutes` y `route-prefetch` consumen `features/users/components/user-dashboard-page` y el bridge legacy fue retirado
- ✅ corregido: `not-found` dejó de depender de `pages/`; `AppRoutes` consume `client/src/app/router/errors/not-found-page.tsx` como runtime final y el entrypoint legacy fue retirado
- ✅ corregido: `home` dejó de depender de `pages/`; `AppRoutes` consume `client/src/app/router/home/home-page.tsx`, que mantiene el shell SEO del landing y delega la composición a `features/marketing-home/components/marketing-home-page`
- ✅ corregido: las páginas legales `terminos-condiciones`, `politica-privacidad` y `politica-cookies` dejaron de depender de `pages/`; `AppRoutes` consume `client/src/app/router/legal/*` y los entrypoints legacy fueron retirados
- ✅ corregido: las páginas de servicios `consultoria-estrategica`, `desarrollo-web`, `posicionamiento-marketing` y `automatizacion-marketing` dejaron de depender de `pages/`; `AppRoutes` consume `client/src/app/router/services/*` y los entrypoints legacy fueron retirados
- ✅ corregido: `vacantes` dejó de depender de `pages/`; `AppRoutes` y `route-prefetch` consumen `client/src/app/router/company/vacancies-page.tsx` y el entrypoint legacy fue retirado
- ✅ corregido: `corporativos` y `ecommerce` dejaron de depender de `pages/`; `AppRoutes` consume `client/src/app/router/solutions/*` y los entrypoints legacy fueron retirados
- ✅ corregido: `uxui` dejó de depender de `pages/`; `AppRoutes` consume `client/src/app/router/solutions/uxui-page.tsx` y el entrypoint legacy fue retirado
- ✅ corregido: `equipo` dejó de depender de `pages/`; `AppRoutes` consume `client/src/app/router/company/team-page.tsx` y el entrypoint legacy fue retirado
- ✅ corregido: `estudio` dejó de depender de `pages/`; `AppRoutes` consume `client/src/app/router/company/studio-page.tsx` y el entrypoint legacy fue retirado
- ✅ corregido: `faq` dejó de depender de `pages/`; `AppRoutes` consume `client/src/app/router/knowledge/faq-page.tsx` y el entrypoint legacy fue retirado
- ✅ corregido: `tecnologias` dejó de depender de `pages/`; `AppRoutes` consume `client/src/app/router/knowledge/technologies-page.tsx` y el entrypoint legacy fue retirado
- ✅ corregido: `client/src/pages/*` dejó de ser runtime activo; `AppRoutes` quedó normalizado con entrypoints agrupados por dominios semánticos en `app/router/{home,errors,company,knowledge,legal,services,solutions}`
- ✅ corregido: `client/src/components/route-wrapper.tsx` dejó de formar parte del runtime estructural; `AppRoutes` consume `client/src/app/router/lazy-route.tsx` y el wrapper legacy fue retirado
- ✅ corregido: el runtime base en `client/src/app/App.tsx` y `client/src/app/router/lazy-route.tsx` ya consume `client/src/shared/ui/{footer,toaster,skeleton}`; los wrappers equivalentes en `client/src/components/ui/*` dejaron de ser dependencia estructural
- ✅ corregido: `client/src/app/router/solutions/*`, `features/proposals/components/proposal-request-page.tsx` y `features/contact/components/support-contact-page.tsx` ya consumen `client/src/shared/ui/{button,input,textarea,scroll-progress,whatsapp-button}`; los wrappers equivalentes en `client/src/components/ui/*` quedaron fuera de ese runtime activo
- ✅ corregido: `features/contact/components/contact-section.tsx`, `features/testimonials/components/testimonials-section.tsx` y `features/payments/components/payment-error-dialog.tsx` ya consumen `client/src/shared/ui/{animated-shape,alert-dialog}`; los wrappers equivalentes en `client/src/components/ui/*` quedaron fuera de ese runtime activo
- ✅ corregido: `app/router/home/home-page.tsx`, `app/router/company/studio-page.tsx`, `features/users/components/user-dashboard-page.tsx` y `features/auth/components/auth-verify-page.tsx` ya consumen `client/src/shared/ui/meta-tags.tsx`; `client/src/components/seo/meta-tags.tsx` quedó fuera del runtime activo
- ✅ corregido: `features/users/components/user-dashboard-page.tsx` ya consume `client/src/shared/ui/whatsapp-button.tsx`; el wrapper equivalente en `client/src/components/ui/whatsapp-button.tsx` quedó fuera de ese runtime activo
- ✅ corregido: `client/src/hooks/use-vacancies.ts` ya consume `client/src/shared/ui/use-toast`; `client/src/components/ui/use-toast/*` dejó de tener consumidores runtime directos
- ✅ corregido: `client/src/app/App.tsx` ya consume `client/src/shared/ui/skip-link.tsx`; `client/src/components/a11y/skip-link.tsx` quedó reducido a wrapper de compatibilidad
- ✅ corregido parcialmente: re-auditoría completada; `panel-usuario` sigue concentrando orquestación funcional y no corresponde adelgazarlo en esta fase sin separar antes su flujo por dominio

Objetivo:

- reducir `client/src/pages/*` a entrypoints mínimos o moverlas al router/app si corresponde

Estrategia:

- no borrar todas las páginas juntas
- empezar por páginas ya fuertemente desacopladas
- mantener exports/rutas hasta que el router final quede consolidado

Definition of Done:

- `pages/*` deja de contener lógica relevante
- las páginas quedan como shell mínimo o desaparecen si ya no tienen consumidores
- `app/router` queda agrupado por dominios semánticos, sin entrypoints sueltos fuera de `AppRoutes.tsx`

### Fase 5. Fase 6 real

Precondiciones:

- no existen imports activos desde wrappers legacy
- `components/ui` no contiene shared pendiente
- `components/sections` no contiene sections de negocio activas
- `App.tsx` ya está reubicado
- `pages/*` ya no son runtime estructural legacy
- `components/ui` sigue mezclando wrappers de compatibilidad con implementación real (`command`, `form`, `calendar`, `carousel`), por lo que no corresponde borrarlo en bloque todavía
- `components/performance` quedó re-auditado como instrumentacion de runtime de `app`; no corresponde mover `ResourcePreload` ni `MemoryManager` a `shared/ui`
- `components/ui` ya no necesita compatibilidad para `command`, `form`, `calendar` ni `carousel`
- `components/ui` ya no necesita conservar `global-navbar`, `chart`, `aspect-ratio` ni `input-otp` tras la re-auditoria de consumidores
- `components/ui` ya no necesita conservar compatibilidad para `button`, `input`, `textarea`, `label`, `toast`, `toaster` ni `use-toast`
- `components/ui` ya no necesita conservar compatibilidad para `accordion`, `alert`, `alert-dialog`, `badge`, `card` ni `checkbox`
- `components/ui` ya no necesita conservar compatibilidad para `dialog`, `drawer`, `dropdown-menu`, `context-menu`, `popover` ni `hover-card`
- ✅ corregido parcialmente: el bloqueo por `components/sections/*` temporales del landing ya fue removido; `marketing-home` quedó consolidado en `features/marketing-home` y la re-auditoría de Fase 6 queda pendiente solo por las páginas institucionales activas restantes
- plan específico abierto en `docs/MARKETING_HOME_FINALIZATION_PLAN.md`

Ahora sí:

- eliminar wrappers restantes
- eliminar carpetas legacy vacías o sin consumidores
- actualizar documentación final:
  - `docs/ARCHITECTURE.md`
  - `docs/CONFIGURATION.md`
  - `audit-tuweai.md`

## Riesgos de Regresión

### Riesgo 1. Romper imports por mover UI compartida

Mitigación:

- mover por grupos pequeños
- dejar wrappers temporales cuando haga falta

### Riesgo 2. Romper lazy loading del home

Mitigación:

- no cambiar estrategia de `lazy()` en la misma fase que el move físico

### Riesgo 3. Mezclar layout shared con feature components

Mitigación:

- clasificar primero, mover después
- no decidir por nombre del archivo, sino por responsabilidad

### Riesgo 4. Romper router al mover `App.tsx`

Mitigación:

- bootstrap frontend ya consolidado en `client/src/app/App.tsx` sin puente legacy intermedio
- mover providers y routes en pasos separados

## Orden exacto recomendado

1. auditoría de clasificación
2. mover `shared/ui` puro
3. mover `sections` por dominio
4. mover `App.tsx` a `app/`
5. separar `providers/` y `router/`
6. adelgazar `pages/*`
7. ejecutar Fase 6 real

## Criterio de “Go / No-Go”

### Go

Se puede pasar a Fase 6 real solo si:

- `rg "components/auth/LoginModal|components/sections/contact-section|components/ui/newsletter-form"` no devuelve consumidores
- `rg "client/src/App.tsx" client/src` no devuelve consumidores runtime
- `rg "client/src/pages/" client/src` ya no muestra dependencia estructural legacy relevante

### No-Go

No ejecutar Fase 6 real si:

- `pages/*` sigue siendo el punto principal de orquestación
- `components/sections/*` sigue conteniendo dominio activo fuera de los slices ya finalizados
- `components/ui/*` mezcla shared real con wrappers temporales

## Resultado Esperado

Al cerrar este plan, el frontend debería quedar conceptualmente así:

```text
client/src/
  app/
    App.tsx
    providers/
    router/
  core/
  features/
  shared/
    ui/
```

Y recién después:

- `components/`
- `pages/`

podrán limpiarse sin riesgo estructural.
