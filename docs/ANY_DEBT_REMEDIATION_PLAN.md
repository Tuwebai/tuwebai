# Any Debt Remediation Plan

Fecha de auditoria: 2026-03-12

## Objetivo

Inventariar la deuda de tipado basada en `any` y definir un plan de remediacion enterprise, priorizando primero backend y auth porque son las superficies que hoy mas afectan mantenibilidad, seguridad operativa y capacidad de evolucion.

## Alcance auditado

Se auditaron ocurrencias en:

- `client/`
- `server/`
- `scripts/`
- `legacy/`
- `firebase-functions-contacto/`

Patrones auditados:

- `: any`
- `as any`
- `Promise<any>`
- `Array<any>`
- `Record<string, any>`
- `any[]`
- `z.any()` como deuda contractual separada

## Hallazgos ejecutivos

- Baseline inicial: `77` ocurrencias de `any` explicito en runtime activo y soporte del repo.
- Estado despues del primer slice: `52` ocurrencias de `any` explicito en runtime activo y soporte del repo.
- Estado despues del segundo slice: `47` ocurrencias de `any` explicito en runtime activo y soporte del repo.
- Estado despues del tercer slice: `41` ocurrencias de `any` explicito en runtime activo y soporte del repo.
- Estado despues del cuarto slice: `34` ocurrencias de `any` explicito en runtime activo y soporte del repo.
- Estado despues del quinto slice: `30` ocurrencias de `any` explicito en runtime activo y soporte del repo.
- Estado despues del sexto slice: `28` ocurrencias de `any` explicito en runtime activo y soporte del repo.
- Adicionalmente hay `3` usos de `z.any()` en `server/src/schemas/api.schemas.ts`, que no son deuda de tipado TypeScript pura pero si deuda de contrato.
- La mayor concentracion esta en:
  - `client/src/features/auth/*`
  - `server/src/modules/*/controller.ts`
  - `server/src/middlewares/firebase-auth.middleware.ts`
- `tsconfig.json` y `tsconfig.server.json` ya corren en `strict`, por lo que el problema actual no es falta de strict mode sino uso explicito de `any`.
- `eslint.config.mjs` ya expone `@typescript-eslint/no-explicit-any` en modo `warn`, por lo que la deuda nueva ya no entra silenciosamente.

## Inventario por archivo

### P0 - Alta prioridad: auth y superficies de seguridad

- `12` - `client/src/features/auth/context/AuthContext.tsx`
  - `Promise<any>` en imports lazy de Firebase y users service
  - `catch (err: any)` repetido en flujos de login, logout, register, reset y upload de imagen
- `12` - `client/src/features/auth/hooks/use-auth-mutations.ts`
  - `Promise<any>` en imports lazy
  - `onError: (err: any)` en mutaciones de auth
  - `oldData: any` en cache update de React Query
- `1` - `client/src/features/auth/hooks/use-auth-queries.ts`
  - `Promise<any>` para users service
- `3` - `server/src/middlewares/firebase-auth.middleware.ts`
  - `(decoded as any).admin`
  - `catch (error: any)` en middlewares de auth
- `2` - `server/index.ts`
  - `(req.session as any)?.userId`
  - `(req.session as any)?.userEmail`

### P1 - Alta prioridad: backend activo con payloads y errores poco tipados

- `8` - `server/src/modules/support/controller.ts`
  - `catch (error: any)` repetido
  - `sort((a: any, b: any) => ...)`
- `6` - `server/src/modules/users/controller.ts`
  - `catch (error: any)` repetido
  - `sort((a: any, b: any) => ...)`
- `6` - `server/src/modules/testimonials/controller.ts`
  - `catch (error: any)` repetido
  - `sort((a: any, b: any) => ...)`
- `4` - `server/src/modules/projects/controller.ts`
  - `catch (error: any)` repetido
  - `sort((a: any, b: any) => ...)`
- `4` - `server/src/controllers/payment.controller.ts`
  - `catch (error: any)` y `catch (apiError: any)`
- `3` - `server/src/controllers/contact.controller.ts`
  - `catch (error: any)` repetido
- `2` - `server/src/modules/contact/controller.ts`
  - `catch (error: any)` repetido
- `2` - `server/src/services/webhook-idempotency.service.ts`
  - `catch (error: any)` en acceso a Firestore / fallback local
- `1` - `server/src/modules/newsletter/controller.ts`
  - `catch (error: any)`
- `1` - `server/src/utils/logger.ts`
  - `writeLog(data: any)`

### P2 - Prioridad media: runtime frontend no-auth

- `5` - `client/src/features/users/components/user-dashboard-page.tsx`
  - `catch (error: any)` repetido en una pantalla grande y funcionalmente sensible
- `2` - `client/src/app/performance/memory-manager.tsx`
  - `(window.performance as any)` por API de memoria no estandar
- `1` - `client/src/lib/performance.ts`
  - `(entry: any)` en observer de performance
- `1` - `client/src/app/router/solutions/uxui-page.tsx`
  - `(window as any).isUsingGlobalNav`

### P3 - Prioridad baja: contratos amplios, shims y tipos externos

- `1` - `client/src/types/index.d.ts`
  - `asNavFor?: any` en tipado de libreria externa
- `3` - `server/src/schemas/api.schemas.ts`
  - `z.array(z.any())`
  - `z.array(z.any())`
  - `z.array(z.any())`

## Clasificacion por patron

### 1. Error handling sin narrowing

Superficie dominante:

- `catch (error: any)`
- `catch (err: any)`
- `catch (apiError: any)`

Riesgo:

- oculta contratos reales de error
- dificulta centralizar helpers de parseo de errores
- promueve acceso inseguro a `.message`, `.response`, `.code`

### 2. Imports lazy no tipados

Superficie dominante:

- `Promise<any>` en auth

Riesgo:

- rompe autocomplete y refactor seguro
- degrada contratos entre `features/auth`, Firebase y `users.service`

### 3. Datos Firestore y sorters sin DTO

Superficie dominante:

- `sort((a: any, b: any) => ...)`
- payloads `snapshot.data()` sin mapeo fuerte

Riesgo:

- controllers quedan acoplados a documentos no tipados
- alta chance de regresion silenciosa si cambia estructura de documentos

### 4. Escape hatches de plataforma

Superficie dominante:

- `(window as any)`
- `(window.performance as any)`
- `(req.session as any)`

Riesgo:

- menor que auth/backend, pero sigue debilitando mantenibilidad

### 5. Contratos schema excesivamente amplios

Superficie dominante:

- `z.any()`

Riesgo:

- el schema deja de ser borde de validacion real
- los consumidores reciben payloads demasiado laxos

## Causa raiz

La deuda actual viene de cinco causas:

1. migraciones rapidas desde runtime legacy a estructura enterprise sin cierre fino de tipos
2. acceso a Firebase y Firestore sin DTOs intermedios fuertes
3. manejo de errores sin helper comun de normalizacion
4. imports dinamicos en auth sin `typeof import(...)`
5. ausencia de enforcement en lint para `no-explicit-any`

## Plan enterprise de remediacion

## Fase 0 - Guardrails antes de tocar logica

Objetivo:

- impedir que entren nuevos `any` sin bloquear de golpe el repo entero

Slices:

1. documentar este inventario como baseline ✅ completado
2. agregar una regla de lint para `@typescript-eslint/no-explicit-any` en modo `warn` ✅ completado
3. excluir temporalmente solo los archivos ya inventariados si hace falta para evitar ruido masivo

Resultado esperado:

- deuda congelada
- cualquier `any` nuevo aparece explicitamente en lint ✅ logrado

## Fase 1 - Auth frontend

Objetivo:

- cerrar primero la zona con mas `any` y mayor sensibilidad de mantenibilidad

Slices:

1. tipar imports lazy en `AuthContext.tsx` con `typeof import(...)` ✅ completado
2. crear helper comun para normalizar errores de auth y reemplazar `err: any` ✅ completado
3. tipar `use-auth-mutations.ts` y eliminar `oldData: any` usando `UserPreferences | undefined` ✅ completado mediante `DEFAULT_USER_PREFERENCES`
4. tipar `use-auth-queries.ts` para lazy import de `users.service` ✅ completado

Resultado esperado:

- `client/src/features/auth/*` sin `any` explicitos en `AuthContext.tsx`, `use-auth-mutations.ts` y `use-auth-queries.ts` ✅ logrado en el primer slice

## Fase 2 - Auth backend y session boundaries

Objetivo:

- cerrar la frontera de autenticacion del backend

Slices:

1. tipar `decoded.admin` usando el tipo correcto devuelto por Firebase Admin ✅ completado
2. reemplazar `catch (error: any)` por narrowing con `unknown` ✅ completado
3. tipar `req.session` con interfaz minima para `userId` y `userEmail` ✅ completado

Resultado esperado:

- middleware y bootstrap auth sin casts inseguros
- middleware y bootstrap auth sin casts inseguros ✅ logrado en `firebase-auth.middleware.ts` y `server/index.ts`

## Fase 3 - Controllers backend por dominio

Objetivo:

- sacar `any` de payloads y sorters donde hoy hay mayor concentracion

Orden recomendado:

1. `server/src/modules/users/controller.ts` ✅ completado
2. `server/src/modules/support/controller.ts` ✅ completado
3. `server/src/modules/testimonials/controller.ts` ✅ completado
4. `server/src/modules/projects/controller.ts` ✅ completado
5. `server/src/modules/contact/controller.ts` ✅ completado
6. `server/src/modules/newsletter/controller.ts`
7. `server/src/controllers/payment.controller.ts`
8. `server/src/controllers/contact.controller.ts`

Estrategia:

- cambiar `catch (error: any)` por `unknown`
- centralizar `getErrorMessage(error: unknown)`
- introducir tipos minimos para colecciones Firestore devueltas por cada modulo
- reemplazar sorters con interfaces concretas del documento

Resultado esperado:

- baja fuerte de `any` en backend activo sin reescribir controladores completos

## Fase 4 - Frontend residual y browser shims

Objetivo:

- cerrar los casos no criticos restantes sin sobre-refactor

Slices:

1. `user-dashboard-page.tsx`
2. `memory-manager.tsx`
3. `lib/performance.ts`
4. `uxui-page.tsx`
5. `types/index.d.ts`

Resultado esperado:

- runtime frontend principal sin escapes innecesarios a `any`

## Fase 5 - Schemas y enforcement final

Objetivo:

- cerrar bordes contractuales y endurecer governance

Slices:

1. reemplazar `z.any()` por esquemas especificos o `z.unknown()` si el shape sigue siendo variable
2. subir `@typescript-eslint/no-explicit-any` de `warn` a `error`
3. re-auditar score tecnico y auditoria principal

Resultado esperado:

- no ingreso de nueva deuda de tipado
- contracts mas fuertes en bordes HTTP

## Orden de ejecucion recomendado

1. `client/src/features/auth/context/AuthContext.tsx`
2. `client/src/features/auth/hooks/use-auth-mutations.ts`
3. `client/src/features/auth/hooks/use-auth-queries.ts`
4. `server/src/middlewares/firebase-auth.middleware.ts`
5. `server/index.ts`
6. `server/src/modules/users/controller.ts`
7. `server/src/modules/support/controller.ts` ✅ completado
8. `server/src/modules/testimonials/controller.ts` ✅ completado

9. `server/src/modules/projects/controller.ts` ✅ completado

10. `server/src/modules/contact/controller.ts` ✅ completado

## Criterios de aceptacion por slice

Cada slice debe cumplir:

- cambio minimo y aislado
- sin cambio funcional
- `npm run check`
- `npm run lint`
- `npm run build`
- `npm run smoke`

## Recomendacion operativa

No conviene atacar los `77` `any` de una sola vez.

La ruta enterprise correcta es:

- congelar ingreso de deuda nueva
- cerrar auth primero
- despues backend activo por dominio
- dejar los shims de plataforma y `z.any()` para el final

Ese orden da mejor retorno tecnico con menor riesgo de regresion.
