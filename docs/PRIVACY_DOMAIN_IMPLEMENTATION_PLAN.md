# Privacy Domain Implementation Plan

## Estado

Auditoria completa del dominio `Privacidad` para el `/panel`.

Objetivo:

- definir una frontera real de producto y arquitectura para privacidad
- evitar reciclar el modelo legacy `users.preferences`
- ordenar implementacion por fases chicas, verificables y sin deuda tecnica nueva

## Resumen Ejecutivo

Hoy `Privacidad` ya existe como dominio tecnico y como tab funcional del `/panel`.

La auditoria muestra que:

- el panel ya no usa `userPreferences` en frontend
- el backend aun conserva `/api/users/:uid/preferences` por compatibilidad contractual
- la politica de privacidad y cookies promete consentimientos y tratamiento de datos que no tienen una capa de gestion en runtime
- el panel no tiene un dominio propio para consentimiento, visibilidad, exportacion o borrado de datos

Conclusion:

- `Privacidad` no debe implementarse sobre el contrato legacy `preferences`
- necesita un dominio propio, separado, con schema y responsabilidades claras
- la primera fase no debe intentar resolver todo; debe introducir una base pequena pero real

## Alcance Auditado

### Frontend

Archivos revisados:

- `client/src/features/users/components/user-dashboard-page.tsx`
- `client/src/features/auth/context/AuthContext.tsx`
- `client/src/shared/ui/meta-tags.tsx`
- `client/src/app/router/legal/privacy-policy-page.tsx`

Hallazgos:

- la tab `Privacidad` ya tiene wiring real de visibilidad y consentimientos
- el panel ya no conserva consumers del viejo modelo `userPreferences`
- la analitica cliente sigue activa en runtime mediante `client/index.html`, `client/src/app/App.tsx`, formularios y `client/src/lib/performance.ts`
- el perfil visible del usuario en panel hoy expone:
  - avatar
  - nombre
  - email
  - estado de cuenta
  - fecha de alta
- no existe una capa global de consentimiento ni de configuracion de privacidad

### Backend

Archivos revisados:

- `server/src/modules/users/controller.ts`
- `server/src/modules/users/routes.ts`
- `server/src/schemas/api.schemas.ts`
- `docs/API_CONTRACTS.md`

Hallazgos:

- sigue existiendo `GET/PUT /api/users/:uid/preferences`
- ese contrato solo soporta:
  - `emailNotifications`
  - `newsletter`
  - `darkMode`
  - `language`
- ese contrato ya no representa el producto actual del panel
- por estabilidad contractual no conviene removerlo en el mismo frente que `Privacidad`

### Legal y cumplimiento

Archivos revisados:

- `client/src/app/router/legal/privacy-policy-page.tsx`
- `client/src/app/router/legal/cookies-policy-page.tsx`

Hallazgos:

- la politica de privacidad declara consentimiento comercial y tratamiento de datos
- la politica de cookies declara analitica y preferencias
- no hay hoy un centro de privacidad que permita al usuario gobernar esas decisiones desde el panel

## Diagnostico

### Hallazgo 1. El dominio de privacidad ya existe a nivel tecnico, pero aun no gobierna la UI

Nivel: alto

Hoy ya hay:

- shell visual
- documentos legales
- contrato backend propio
- servicio, hook y tipos dedicados en frontend

Pero todavia no hay:

- side effects reales
- auditoria de consentimiento

### Hallazgo 2. El contrato `preferences` es legacy y semanticamente incorrecto

Nivel: alto

El contrato legacy sirve para compatibilidad tecnica, pero ya no corresponde usarlo como base de:

- consentimiento
- visibilidad de datos
- cookies
- control de comunicaciones

### Hallazgo 3. No toda "privacidad" vale la pena en esta fase

Nivel: alto

No conviene meter desde el inicio:

- exportacion completa de datos
- borrado de cuenta automatico
- centro de cookies full stack
- historial de actividad detallado

Eso seria demasiado frente junto y abriria deuda.

### Hallazgo 4. La primera fase debe tener efecto real y visible

Nivel: alto

La primera fase de `Privacidad` debe cumplir tres cosas:

- persistir de verdad
- gobernar algo visible en el panel
- mantener coherencia con la politica de privacidad

## Principios del Dominio

`Privacidad` debe cubrir solo estos ejes:

1. consentimiento
2. visibilidad de datos personales en el panel
3. control de tratamiento opcional
4. trazabilidad minima de cambios sensibles

No debe cubrir:

1. seguridad de cuenta
2. integraciones
3. experiencia visual
4. configuraciones de marketing no implementadas

## Modelo Target

### Ubicacion recomendada

Persistencia sugerida en documento de usuario:

```text
users/{uid}/privacy
```

o como subobjeto:

```text
users/{uid}.privacy
```

Recomendacion:

- usar subobjeto `privacy` dentro de `users/{uid}`
- evita otra coleccion innecesaria
- mantiene coherencia con el resto del perfil

### Shape recomendado

```ts
type UserPrivacySettings = {
  marketingConsent: boolean;
  analyticsConsent: boolean;
  profileEmailVisible: boolean;
  profileStatusVisible: boolean;
  updatedAt: string;
  updatedBy: 'self';
}
```

### Justificacion de cada campo

- `marketingConsent`
  - alinea panel con politica de privacidad
  - sirve de base para futuras comunicaciones reales
- `analyticsConsent`
  - alinea panel con politica de cookies y futura analitica
  - aunque el enforcement completo llegue despues, el dominio queda bien orientado
- `profileEmailVisible`
  - tiene efecto UI inmediato en el resumen del panel
  - es pequeno y verificable
- `profileStatusVisible`
  - controla la exposicion del badge de estado en el resumen
  - es otro efecto visible y barato
- `updatedAt`
  - trazabilidad minima enterprise
- `updatedBy`
  - deja abierta futura administracion sin inventarla hoy

## API Target

### Nuevo contrato recomendado

- `GET /api/users/:uid/privacy`
- `PUT /api/users/:uid/privacy`

### Reglas

- no tocar ni romper `/api/users/:uid/preferences`
- `privacy` nace como contrato nuevo
- auth y autorizacion iguales a `users/:uid`
- validacion Zod propia

### Schema recomendado

```ts
{
  marketingConsent?: boolean;
  analyticsConsent?: boolean;
  profileEmailVisible?: boolean;
  profileStatusVisible?: boolean;
}
```

## Frontend Target

### Estructura recomendada

No volver a meter todo en `user-dashboard-page.tsx`.

Cuando se implemente:

- `client/src/features/users/components/privacy-tab.tsx`
- `client/src/features/users/services/privacy.service.ts`
- `client/src/features/users/hooks/use-privacy-settings.ts`
- `client/src/features/users/types/privacy.ts`

El contenedor `user-dashboard-page.tsx` solo orquesta la tab.

### UI minima recomendada

#### Bloque 1. Visibilidad del panel

- mostrar email en encabezado del panel
- mostrar estado de cuenta en encabezado del panel

#### Bloque 2. Consentimientos

- permitir contacto comercial
- permitir analitica funcional

#### Bloque 3. Estado legal

- texto chico aclarando que las decisiones quedan registradas en la cuenta
- link a politica de privacidad y cookies

## Fases

### Fase 0. Congelar el modelo legacy

Objetivo:

- no volver a reutilizar `preferences` para privacidad

Estado:

- cerrada

Resultado real:

- el frontend ya no depende de `userPreferences`
- la tab `Privacidad` ya no recicla toggles descartados

### Fase 1. Crear el dominio tecnico

Objetivo:

- introducir el contrato nuevo de privacidad de punta a punta

Entregables:

- tipo `UserPrivacySettings`
- schema Zod nuevo
- `GET /api/users/:uid/privacy`
- `PUT /api/users/:uid/privacy`
- servicio frontend dedicado

Criterio:

- sin tocar el contrato legacy `/preferences`

Estado:

- cerrada

Resultado real:

- `server/src/modules/users/routes.ts` ya expone `GET/PUT /api/users/:uid/privacy`
- `server/src/modules/users/controller.ts` persiste el subobjeto `users/{uid}.privacy` sin tocar el contrato legacy `/preferences`
- `server/src/schemas/api.schemas.ts` ya valida el payload de privacidad con schema propio
- `client/src/features/users/types/privacy.ts`, `services/privacy.service.ts` y `hooks/use-privacy-settings.ts` ya definen la frontera tecnica nueva del cliente sin reabrir la UI del panel

### Fase 2. Implementar visibilidad del panel

Objetivo:

- dar el primer efecto visible real de privacidad

Entregables:

- `profileEmailVisible`
- `profileStatusVisible`
- render condicional en header del panel

Criterio:

- cambios minimos
- copy honesto
- responsive intacto

Estado:

- cerrada

Resultado real:

- `client/src/features/users/components/privacy-tab.tsx` ya expone controles reales de visibilidad para el resumen del panel
- `client/src/features/users/components/user-dashboard-page.tsx` ya consume `profileEmailVisible` y `profileStatusVisible` desde el dominio `privacy`
- el encabezado del `/panel` ya oculta o muestra email y badge de estado en funcion de la configuracion persistida
- la tab ya usa un layout con sidebar interno de secciones para evitar apilar bloques sensibles en una sola columna larga

### Fase 3. Implementar consentimientos reales basicos

Objetivo:

- introducir decisiones de consentimiento con semantica real

Entregables:

- `marketingConsent`
- `analyticsConsent`
- persistencia real
- textos legales alineados

Criterio:

- no prometer mas de lo que hoy aplica el runtime

Estado:

- cerrada

Resultado real:

- `client/src/features/users/components/privacy-tab.tsx` ya expone `marketingConsent` y `analyticsConsent` como controles persistidos dentro del dominio `privacy`
- la UI del panel ya alinea esos toggles con copy legal honesto y enlaces directos a `Politica de Privacidad` y `Politica de Cookies`
- el panel no promete enforcement fuera de la cuenta mientras Fase 4 siga pendiente

### Fase 4. Conectar enforcement minimo

Objetivo:

- hacer que al menos una decision de consentimiento tenga efecto fuera del panel

Opciones validas:

- bloquear opt-in comercial futuro si `marketingConsent` es `false`
- condicionar analitica cliente cuando `analyticsConsent` sea `false`

Recomendacion:

- priorizar `analyticsConsent` si el repo vuelve a usar analitica real
- priorizar `marketingConsent` si entra un dominio real de comunicaciones comerciales

Estado:

- cerrada

Resultado real:

- `client/src/lib/analytics.ts` ahora centraliza consentimiento, carga del script y bloqueo de eventos cuando `analyticsConsent` es `false`
- `client/src/app/App.tsx` ya gobierna inicializacion, pageviews y eventos de navegacion con el consentimiento persistido del usuario autenticado
- `client/index.html` ya no auto-inicializa Google Analytics por fuera del dominio de privacidad
- `client/src/lib/performance.ts`, `client/src/features/contact/components/contact-section.tsx` y `client/src/features/newsletter/components/newsletter-form.tsx` ya consumen la misma frontera centralizada en lugar de disparar `gtag` directo
- el enforcement actual queda acotado a analitica cliente; `marketingConsent` sigue persistido pero sin side effects adicionales mientras no exista dominio comercial real

### Fase 5. Trazabilidad y actividad sensible

Objetivo:

- registrar cambios sensibles de privacidad

Entregables:

- `updatedAt`
- evento de log estructurado
- futura integracion con tab `Actividad` si aparece ese dominio

### Fase 6. Evaluar capacidades avanzadas

Objetivo:

- decidir si el producto ya justifica capacidades pesadas

Solo si hay negocio real detras:

- exportacion de datos
- solicitud de eliminacion de cuenta
- centro de cookies mas completo
- historial de actividad de privacidad

## Orden Recomendado

1. Fase 0 cerrada
2. Fase 1 cerrada
3. Fase 2 cerrada
4. Fase 3 cerrada
5. Fase 4 cerrada
6. Fase 5 trazabilidad
7. Fase 6 capacidades avanzadas

## Riesgos

- reciclar `/preferences` por comodidad
- meter toggles sin efecto real
- abrir un dominio legal mas grande de lo que el producto soporta hoy
- mezclar privacidad con seguridad o integraciones
- introducir demasiados campos en la primera fase

## Criterio de Cierre

Este frente se considera bien encaminado cuando:

- `Privacidad` tiene contrato propio y no depende de `preferences`
- existe al menos un efecto visible real en panel
- existe al menos un consentimiento persistido con semantica clara
- backend y frontend usan el mismo modelo
- legal, UX y runtime dejan de estar desacoplados
- `check`, `lint`, `build` y `smoke` siguen en verde
