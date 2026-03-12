# Panel Settings Remediation Plan

## Estado

Auditoria del flujo de ajustes de `/panel`.

Objetivo:

- confirmar si las preferencias persisten
- confirmar si realmente se aplican fuera del panel
- definir un plan de correccion chico, verificable y sin romper contratos

## Resumen Ejecutivo

El problema principal no es solo de persistencia.

Hoy el sistema tiene dos estados distintos:

- un estado persistido de preferencias en `users.preferences` dentro de Firestore
- un estado efectivo de aplicacion repartido entre `ThemeProvider`, defaults locales y ausencia de consumidores reales

Conclusion:

- `newsletter`, `emailNotifications`, `darkMode` y `language` si pueden persistirse en backend cuando Firestore esta disponible
- pero solo una parte menor de esas preferencias se refleja realmente en la experiencia de usuario
- la UI del panel afirma que "se aplican en tiempo real", y hoy eso no es verdad para la mayoria de los casos

## Flujo Auditadado

### 1. Escritura desde `/panel`

Archivo:

- `client/src/features/users/components/user-dashboard-page.tsx`

La pantalla llama:

- `handleUpdatePreferences(...)`
- `updateUserPreferences(...)` desde `AuthContext`

### 2. Mutation frontend

Archivos:

- `client/src/features/auth/context/AuthContext.tsx`
- `client/src/features/auth/hooks/use-auth-mutations.ts`

La mutation:

- llama `setUserPreferences(uid, preferences)`
- actualiza cache React Query de `['userPreferences', uid]`

### 3. Servicio frontend

Archivo:

- `client/src/features/users/services/users.service.ts`

La preferencia se manda a:

- `PUT /api/users/:uid/preferences`

### 4. Persistencia backend

Archivos:

- `server/src/modules/users/routes.ts`
- `server/src/modules/users/controller.ts`
- `server/src/schemas/api.schemas.ts`

El backend:

- valida el payload con Zod
- hace merge en `users/{uid}.preferences`
- responde `success: true`

## Hallazgos

### Hallazgo 1. Persistencia backend existente pero condicionada a Firestore

Nivel: medio

La persistencia de preferencias depende por completo de `getAdminFirestore()`.

Si Firestore Admin no esta disponible:

- `GET /api/users/:uid/preferences` devuelve `503`
- `PUT /api/users/:uid/preferences` devuelve `503`

Impacto:

- las preferencias no persisten en ese escenario
- el panel hoy no distingue claramente entre "guardado local UI" y "persistencia real no disponible"

### Hallazgo 2. `darkMode` no gobierna el tema real de la app

Nivel: alto

Archivos:

- `client/src/core/theme/ThemeContext.tsx`
- `client/src/app/providers/AppProviders.tsx`
- `client/src/features/auth/context/AuthContext.tsx`

El `ThemeProvider` toma su source of truth de:

- `localStorage.theme`
- `prefers-color-scheme`

No consume:

- `userPreferences.darkMode`

Impacto:

- el switch de "Modo oscuro" puede persistirse
- pero no cambia el tema real del sitio
- la preferencia persistida y el tema aplicado pueden divergir

### Hallazgo 3. `language` persiste pero no controla idioma global

Nivel: alto

No existe wiring real entre:

- `userPreferences.language`
- `document.documentElement.lang`
- textos de UI
- `MetaTags`
- capa i18n o locale transversal

Impacto:

- el selector de idioma guarda un valor
- pero la app no cambia de idioma
- la preferencia no tiene efecto funcional visible

### Hallazgo 4. `newsletter` y `emailNotifications` no tienen consumidores operativos

Nivel: alto

No se encontraron consumidores reales fuera del panel para:

- `userPreferences.newsletter`
- `userPreferences.emailNotifications`

El alta de newsletter publica sigue yendo por:

- `client/src/features/newsletter/services/newsletter.service.ts`
- `POST /newsletter`

sin consultar esas preferencias.

Impacto:

- se guarda un booleano
- pero no gobierna suscripcion real ni envio de comunicaciones
- el usuario cree haber configurado algo operativo que hoy no controla nada

### Hallazgo 5. El copy del panel sobrepromete comportamiento

Nivel: medio

Archivo:

- `client/src/features/users/components/user-dashboard-page.tsx`

Texto actual:

- "Tus preferencias se guardan automaticamente y se aplican en tiempo real."

Esto hoy no es exacto para:

- `darkMode`
- `language`
- `newsletter`
- `emailNotifications`

Impacto:

- deuda UX
- expectativa rota
- falsa confirmacion funcional

### Hallazgo 6. Falta una capa de sincronizacion de preferencias aplicadas

Nivel: alto

No existe un effect o adaptador global que observe:

- `userPreferences`

y aplique side effects de UI como:

- tema
- idioma HTML
- banderas de comunicacion

Impacto:

- cada preferencia queda aislada como dato
- pero no como comportamiento efectivo

## Causa Raiz

La causa raiz no es "el panel guarda mal" sino esta:

- el panel mezcla preferencias persistidas con promesas de comportamiento global
- el repo no tiene una capa de aplicacion efectiva de preferencias de usuario
- Firestore guarda el dato, pero la app casi no lo consume como source of truth operacional

## Plan Enterprise de Correccion

### Fase 1. Alinear source of truth de preferencias visuales

Objetivo:

- hacer que `darkMode` gobierne el tema real

Slice:

- conectar `AuthContext.userPreferences.darkMode` con `ThemeProvider`
- definir precedencia:
  - usuario autenticado con preferencia persistida
  - luego `localStorage.theme` solo como fallback
  - luego `prefers-color-scheme`

Archivos probables:

- `client/src/core/theme/ThemeContext.tsx`
- `client/src/app/providers/AppProviders.tsx`
- `client/src/features/auth/context/AuthContext.tsx`

Validacion:

- cambiar switch en `/panel`
- ver cambio inmediato de clase `dark`/`light`
- recargar y confirmar persistencia real

### Fase 2. Alinear idioma con preferencia persistida

Objetivo:

- que `language` tenga efecto real minimo y verificable

Slice minimo:

- sincronizar `userPreferences.language` con `document.documentElement.lang`
- alinear `MetaTags` y cualquier metadata global donde aplique

Nota:

- no implica introducir un sistema i18n completo en este slice
- primero se corrige la preferencia como estado global observable

Validacion:

- cambiar idioma en `/panel`
- confirmar cambio de `lang` en `<html>`
- recargar y confirmar persistencia

### Fase 3. Reconciliar preferencias de comunicaciones con comportamiento real

Objetivo:

- dejar de vender toggles que no gobiernan nada

Opciones:

- conectar `newsletter` a una suscripcion real y a un flujo de opt-in/opt-out
- conectar `emailNotifications` a reglas reales de envio
- o bajar la promesa de UI mientras no exista implementacion operativa

Recomendacion:

- primero sincerar el comportamiento
- despues integrar con backend/comunicaciones en un plan separado

### Fase 4. Corregir copy y estados de guardado

Objetivo:

- que la UX refleje el estado real del sistema

Cambios esperados:

- ajustar texto de "se aplican en tiempo real"
- mostrar diferencia entre "guardado" y "aplicado"
- si Firestore no esta disponible, mostrar error mas especifico

### Fase 5. Endurecer consistencia de preferencias

Objetivo:

- centralizar aplicacion de preferencias en una sola capa

Direccion target:

- `AuthContext` o un adaptador global expone preferencias
- una capa transversal aplica side effects de UI
- el panel solo edita, no define comportamiento por si mismo

## Orden Recomendado

1. Fase 1 `darkMode`
2. Fase 2 `language`
3. Fase 4 copy y estados UX
4. Fase 3 comunicaciones reales o sinceramiento de toggles
5. Fase 5 consolidacion

## Riesgos

- mezclar correccion de tema con rediseño visual
- introducir i18n completo antes de resolver el wiring minimo
- prometer integraciones de newsletter/notificaciones sin backend operativo real
- dejar `localStorage.theme` y `userPreferences.darkMode` peleando entre si

## Criterio de Cierre

Este frente se considera cerrado cuando:

- `darkMode` persiste y gobierna el tema real
- `language` persiste y modifica al menos el `lang` global de la app
- `newsletter` y `emailNotifications` tienen comportamiento real o copy sincerado
- el panel deja de afirmar cosas que el runtime no cumple
- `check`, `lint`, `build` y `smoke` siguen en verde
