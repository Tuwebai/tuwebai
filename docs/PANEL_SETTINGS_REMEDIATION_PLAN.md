# Panel Settings Remediation Plan

## Estado

Auditoria del flujo de ajustes de `/panel`.

Objetivo:

- confirmar que preferencias persisten de verdad
- distinguir que preferencias siguen vivas vs cuales ya quedaron descartadas por producto
- definir el siguiente frente util sin abrir trabajo innecesario

## Resumen Ejecutivo

El problema principal del panel no era solo de persistencia.

Hoy existen dos grupos distintos:

- preferencias que el backend puede guardar en `users.preferences`
- decisiones de producto ya cerradas que no deben seguir expuestas como configurables

Conclusion:

- `darkMode` y `language` ya no son frentes de implementacion
- ambos quedaron descartados por decision de producto
- la expansion de tabs y toggles sin efecto real ya quedo congelada como criterio operativo
- la vieja tab de `Preferencias` ya no debe volver como contenedor generico; los controles sensibles pasan a `Privacidad`
- el runtime frontend ya no debe conservar infraestructura viva del viejo modelo `userPreferences`
- cualquier continuidad de `/api/users/:uid/preferences` debe tratarse aparte, como contrato legacy estable, no como base del panel actual

## Flujo Auditado

### 1. Escritura desde `/panel`

Archivo:

- `client/src/features/users/components/user-dashboard-page.tsx`

La pantalla llamaba:

- `handleUpdatePreferences(...)`
- `updateUserPreferences(...)` desde `AuthContext`

### 2. Mutation frontend

Archivos:

- `client/src/features/auth/context/AuthContext.tsx`
- `client/src/features/auth/hooks/use-auth-mutations.ts`

La mutation hacia:

- llamar `setUserPreferences(uid, preferences)`
- actualizar cache React Query de `['userPreferences', uid]`

### 3. Servicio frontend

Archivo:

- `client/src/features/users/services/users.service.ts`

La preferencia se mandaba a:

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
- el panel todavia no distingue claramente entre "guardado local UI" y "persistencia real no disponible"

### Hallazgo 2. `darkMode` ya no es una preferencia activa del producto

Nivel: cerrado

Estado actual:

- `client/src/core/theme/ThemeContext.tsx` fija `dark` como tema canonico global
- `/panel` ya no expone UI de apariencia ni switch de claro/oscuro

Conclusion:

- no corresponde invertir mas trabajo en cablear `darkMode`
- este frente queda descartado por decision de producto

### Hallazgo 3. `language` ya no es una preferencia activa del producto

Nivel: cerrado

Estado actual:

- la app mantiene idioma fijo a nivel producto
- `/panel` ya no expone selector ni bloque visual de idioma
- `MetaTags` y providers deben mantenerse en idioma estable del producto

Conclusion:

- no corresponde abrir un frente i18n para una preferencia descartada
- cualquier wiring parcial de idioma debe retirarse para evitar falsa expectativa

### Hallazgo 4. El modelo frontend de `userPreferences` quedo obsoleto

Nivel: alto

No se encontraron consumidores reales en frontend para:

- `AuthContext.userPreferences`
- `updateUserPreferences(...)`
- `fetchUserPreferences(...)`
- query/mutation/services asociados a `/api/users/:uid/preferences`

Impacto:

- sostener ese modelo en cliente agrega deuda tecnica
- invita a reusar un contrato descartado por producto
- mezcla panel actual con persistencia legacy que ya no gobierna UX real

### Hallazgo 5. El copy del panel debia sincerarse

Nivel: medio

Archivo:

- `client/src/features/users/components/user-dashboard-page.tsx`

Problema real:

- el panel mezclaba preferencias descartadas por producto con preferencias que siguen vivas
- ademas sobreprometia aplicacion global inmediata

Impacto:

- deuda UX
- expectativa rota
- falsa confirmacion funcional

### Hallazgo 6. Falta una capa de sincronizacion solo para preferencias que siguen vivas

Nivel: alto

No existe un adaptador global que observe:

- `userPreferences`

y aplique side effects utiles para:

- banderas de comunicacion

Impacto:

- cada preferencia queda aislada como dato
- pero no como comportamiento efectivo

## Causa Raiz

La causa raiz no es "el panel guarda mal" sino esta:

- el panel mezclaba preferencias persistidas con decisiones de producto ya cerradas
- el repo no tiene una capa de aplicacion efectiva para preferencias reales del panel
- el frontend seguia cargando query/mutation/servicios sobre un contrato sin consumidores
- Firestore puede conservar ese dato por compatibilidad, pero ya no debe condicionar la arquitectura actual del panel

## Plan Enterprise de Correccion

### Fase 1. Cerrar `darkMode` como frente descartado

Objetivo:

- formalizar que el tema ya quedo resuelto por decision de producto

Resultado esperado:

- `ThemeContext` mantiene `dark` como source of truth unico
- `/panel` no promete cambio de tema
- `darkMode` deja de ser deuda funcional del panel

Estado:

- cerrada y descartada por decision de producto

### Fase 2. Cerrar `language` como frente descartado

Objetivo:

- retirar la expectativa de cambio de idioma del panel y del runtime

Resultado esperado:

- `/panel` no expone selector de idioma ni UI residual asociada
- `MetaTags` y runtime vuelven a idioma estable del producto
- no queda wiring parcial ni deuda de UX por una preferencia que no se quiere soportar

Estado:

- cerrada y descartada por decision de producto

### Fase 3. Reconciliar preferencias de comunicaciones con comportamiento real

Objetivo:

- dejar de vender toggles que no gobiernan nada y definir su rol real

Estado actual:

- los toggles ya fueron retirados de `/panel`
- este frente queda pendiente solo si en el futuro se decide implementar comunicaciones reales

Opciones:

- conectar `newsletter` a una suscripcion real y a un flujo de opt-in/opt-out
- conectar `emailNotifications` a reglas reales de envio
- o bajar la promesa de UI mientras no exista implementacion operativa

Recomendacion:

- primero sincerar el comportamiento
- despues integrar con backend/comunicaciones en un plan separado

### Fase 4. Reubicar semantica del panel en tabs coherentes

Objetivo:

- evitar que `Privacidad` quede escondida dentro de una tab generica

Cambios esperados:

- reemplazar `Preferencias` por `Privacidad`
- dejar el shell de `Privacidad` con copy honesto
- reservar futuras preferencias blandas para un frente separado solo si aparece wiring real

Estado:

- cerrada

Resultado real:

- la vieja tab de `Preferencias` fue reemplazada en runtime por `Privacidad`
- el panel ya no usa una etiqueta generica para controles sensibles
- futuras preferencias blandas quedan condicionadas a un frente separado con wiring real

### Fase 4.1. Barrer residuos frontend del modelo descartado

Objetivo:

- retirar del cliente la infraestructura vieja de `userPreferences`

Resultado esperado:

- `AuthContext` deja de exponer preferencias muertas
- se eliminan query, mutation, servicio y tipos zombie asociados al panel descartado
- el backend conserva el endpoint solo por estabilidad contractual hasta decidir su retiro

### Fase 5. Corregir copy y estados de guardado

Objetivo:

- que la UX refleje el estado real del sistema

Cambios esperados:

- ajustar textos de guardado vs aplicado
- dejar claro que tema e idioma ya quedaron definidos por producto
- mostrar que las preferencias de comunicaciones quedan preparadas para integracion global
- si Firestore no esta disponible, mostrar error mas especifico

### Fase 6. Endurecer consistencia de preferencias vivas

Objetivo:

- centralizar aplicacion de preferencias en una sola capa

Direccion target:

- `AuthContext` o un adaptador global expone preferencias vivas
- una capa transversal aplica side effects de comunicaciones cuando existan
- el panel solo edita, no define comportamiento por si mismo

## Orden Recomendado

1. Fase 1 cerrada por decision de producto
2. Fase 2 cerrada por decision de producto
3. Fase 4 reubicar semantica del panel
4. Fase 5 copy y estados UX
5. Fase 3 comunicaciones reales o sinceramiento definitivo de toggles
6. Fase 6 consolidacion

## Riesgos

- reabrir tema o idioma despues de haberlos fijado como decisiones de producto
- prometer integraciones de newsletter/notificaciones sin backend operativo real
- dejar persistencia de comunicaciones sin semantica clara para el usuario

## Criterio de Cierre

Este frente se considera cerrado cuando:

- `darkMode` y `language` quedan formalmente descartados como preferencias activas del panel
- `newsletter` y `emailNotifications` tienen comportamiento real o quedaron retirados del panel con copy sincerado
- el panel deja de afirmar cosas que el runtime no cumple
- `check`, `lint`, `build` y `smoke` siguen en verde
