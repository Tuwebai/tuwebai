# Plan de Sustitución Previa a Fase 6

## Estado

Documento operativo para desbloquear la limpieza final de compatibilidad.

Motivo:

- la Fase 6 no puede ejecutarse todavía sin riesgo de regresión
- siguen existiendo imports activos desde `pages/`, `components/`, `contexts/`, `hooks/` y fachadas de compatibilidad

## Objetivo

Eliminar dependencias runtime legacy antes de borrar carpetas o wrappers.

Esta fase no elimina todavía:

- `pages/`
- `components/`
- `contexts/`
- `hooks/`
- `server/src/routes/public.routes.ts`

Primero sustituye consumo activo; recién después habilita limpieza final.

## Bloqueos Confirmados

### Frontend runtime aún depende de `pages/` y `components/`

Entradas activas:

- `client/src/App.tsx`
- `client/src/pages/home.tsx`
- `client/src/pages/panel-usuario.tsx`
- `client/src/pages/pago-exitoso.tsx`
- `client/src/pages/pago-fallido.tsx`
- `client/src/pages/pago-pendiente.tsx`

### Reexports temporales en features

- `client/src/features/auth/components/LoginModal.tsx`
- `client/src/features/contact/components/contact-section.tsx`
- `client/src/features/newsletter/components/newsletter-form.tsx`
- `client/src/features/payments/components/payment-return-view.tsx`
- `client/src/features/payments/components/pricing-section.tsx`
- `client/src/features/testimonials/components/testimonial-form.tsx` ✅ corregido
- `client/src/features/testimonials/components/testimonials-section.tsx` ✅ corregido

### Wrappers legacy aún vivos

- `client/src/contexts/AuthContext.tsx`
- `client/src/hooks/use-auth-queries.ts`
- `client/src/hooks/use-auth-mutations.ts`
- `client/src/hooks/use-testimonials.ts`
- `client/src/services/firestore.ts`
- `client/src/services/testimonials.ts`

### Backend con fachada legacy

- `server/src/routes/public.routes.ts`

## Clasificación

- Dominio: arquitectura, runtime, compatibilidad
- Tipo de cambio: estructural
- Impacto: A - Crítico

## Estrategia

### Fase A. Sustituir runtime frontend

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

Objetivo:

- vaciar dependencia activa de `services/firestore.ts` y `services/testimonials.ts`

Orden:

1. localizar consumidores restantes
2. moverlos a `features/users`, `features/projects`, `features/support`, `features/testimonials`
3. verificar que los servicios legacy solo queden como compatibilidad muerta o queden listos para borrar

Resultado esperado:

- no existan imports activos desde `client/src/services/*` legacy

### Fase D. Sustituir fachada backend

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

1. `auth` runtime
2. `payments` runtime
3. `contact/newsletter/testimonials` runtime
   - `testimonials` ✅ corregido
   - `contact/newsletter` pendientes
4. `shared/ui` base
5. `services` legacy restantes
6. `public.routes.ts`
7. recién después Fase 6 real

## Criterio de Desbloqueo de Fase 6

La limpieza final queda habilitada solo si:

- `rg "@/contexts/AuthContext"` no devuelve consumidores runtime
- `rg "@/hooks/use-auth-"` no devuelve consumidores runtime
- `rg "@/services/firestore"` no devuelve consumidores runtime
- `rg "export { default } from '@/components"` no devuelve reexports en `features/`
- `rg "public.routes"` no devuelve imports activos

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
