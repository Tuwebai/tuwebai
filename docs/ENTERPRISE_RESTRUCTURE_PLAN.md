# Plan Enterprise de Reestructuración del Repositorio

## Estado

Documento de planificación.  
Estado actual: Fase 0, Fase 1, Fase 2, Fase 3, Fase 4, Fase 5 y Fase 6 ejecutadas. ✅ corregido  
No ejecuta movimientos de carpetas ni cambios de contrato.

## Objetivo

Reestructurar el repositorio para que:

- exista una frontera clara entre código activo y legacy
- frontend y backend queden organizados por dominio
- la capa UI deje de acoplarse con transporte/API
- el backend deje de concentrar múltiples dominios en un controller monolítico
- la migración ocurra sin romper contratos ni flujo productivo

## Alcance

Incluye:

- estructura target
- estrategia por fases
- orden de moves
- compatibilidad temporal
- riesgos de regresión

Excluye:

- ejecución de moves
- refactor de comportamiento
- cambios de contratos HTTP
- cambios de DB schema

## Clasificación

- Dominio: arquitectura, modularidad, gobernanza
- Tipo de cambio: estructural
- Impacto: A - Crítico

## Estructura Target

```text
client/
  src/
    app/
      providers/
      router/
    core/
      auth/
      config/
      http/
      logger/
      query/
    features/
      auth/
        components/
        hooks/
        services/
        schemas/
      contact/
      newsletter/
      payments/
      projects/
      support/
      testimonials/
      user/
    shared/
      constants/
      types/
      ui/
      utils/

server/
  src/
    app/
      server.ts
      routes.ts
    core/
      auth/
      config/
      errors/
      logger/
      validation/
    modules/
      contact/
        contact.controller.ts
        contact.routes.ts
        contact.schemas.ts
        contact.service.ts
      newsletter/
      payments/
      projects/
      support/
      testimonials/
      users/
    infrastructure/
      firebase/
      mail/
      mercadopago/
    shared/
      types/
      utils/

legacy/
  php-api/
  firebase/
```

## Principios de Migración

1. No mover múltiples dominios a la vez.
2. Mantener rutas HTTP existentes durante toda la migración.
3. Mantener exports públicos mientras existan consumidores legacy.
4. Separar arquitectura antes de optimizar implementación.
5. Toda compatibilidad temporal debe tener dueño y fecha de retiro.

## Estrategia por Fases

### Fase 0. Congelación arquitectónica ✅ corregido

Objetivo:

- fijar la estructura target
- definir naming estándar
- definir reglas de frontera entre `app`, `core`, `features/modules`, `shared`, `legacy`

Resultado esperado:

- mapa actual -> target aprobado
- lista de archivos que no deben moverse todavía

### Fase 1. Backend: descomponer controller monolítico ✅ corregido

Origen principal:

- `server/src/controllers/public.controller.ts`
- `server/src/routes/public.routes.ts`

Target:

- `server/src/modules/contact/`
- `server/src/modules/newsletter/`
- `server/src/modules/testimonials/`
- `server/src/modules/support/`
- `server/src/modules/projects/`
- `server/src/modules/users/`

Orden interno:

1. extraer `testimonials`
2. extraer `support`
3. extraer `projects`
4. extraer `users`
5. extraer `contact/newsletter/propuesta/applications`

Regla:

- primero mover archivos y exports
- después centralizar composición de rutas en `server/src/app/routes.ts`

### Fase 2. Backend: mover infraestructura fuera de módulos ✅ corregido

Mover a:

- `server/src/infrastructure/firebase/`
- `server/src/infrastructure/mail/`
- `server/src/infrastructure/mercadopago/`

Mantener en `core/`:

- auth
- logger
- validation
- config
- errores transversales

Resultado esperado:

- módulos sin dependencia caótica de paths cruzados
- frontera explícita entre dominio e infraestructura

### Fase 3. Frontend: crear frontera `app/core/features/shared` ✅ corregido

Problema actual:

- `pages/` y `components/` consumen API directamente
- lógica y presentación conviven sin aislamiento suficiente

Movimiento inicial:

1. crear `client/src/app/`
2. crear `client/src/core/`
3. crear `client/src/features/`
4. crear `client/src/shared/`

Compatibilidad temporal:

- `pages/` y `components/` pueden coexistir mientras se migran consumidores
- no se borran carpetas legacy hasta que no queden imports activos

### Fase 4. Frontend: migrar por dominios ✅ corregido

Orden recomendado:

1. `testimonials` ✅ corregido
2. `auth` ✅ corregido
3. `contact` ✅ corregido
4. `newsletter` ✅ corregido
5. `payments` ✅ corregido
6. `support` ✅ corregido
7. `projects/user` ✅ corregido

Cada dominio debe quedar con:

- hooks
- services
- tipos/schemas
- componentes específicos

Regla:

- ningún componente en `pages/` o `components/` debe importar runtime desde `lib/api`

### Fase 5. Consolidación de config duplicada ✅ corregido

Objetivo:

- decidir una sola fuente para `vite.config`
- decidir una sola fuente para `netlify.toml`
- documentar qué queda vigente y qué queda deprecado

Esto se hace al final, no al principio, para evitar mezclar riesgos.

### Fase 6. Limpieza final de compatibilidad ✅ corregido

Solo cuando:

- no existan imports legacy
- no existan rutas duplicadas
- no existan reexports temporales

Recién ahí:

- borrar wrappers de compatibilidad
- borrar rutas/capas obsoletas
- actualizar documentación final

Precondición operacional:

- antes de ejecutar limpieza final, desacoplar runtime legacy restante en `server/index.ts`, `features/auth/context/AuthContext.tsx`, `pages/consulta.tsx` y el bridge `client/src/App.tsx` ✅ corregido
- además debe completarse la sustitución final de runtime documentada en `docs/FINAL_RUNTIME_SUBSTITUTION_PLAN.md` ✅ corregido

## Mapa Actual -> Objetivo

### Backend

- `server/src/controllers/public.controller.ts`
  - se divide en módulos por dominio ✅ corregido parcialmente
- `server/src/routes/public.routes.ts`
  - se parte por dominio y luego se compone en `app/routes.ts` ✅ corregido
- `server/src/config/firebase-admin.ts`
  - migra a `infrastructure/firebase/` ✅ corregido
- `server/src/config/mailer.ts`
  - migra a `infrastructure/mail/` ✅ corregido
- `server/src/config/mercadopago.ts`
  - migra a `infrastructure/mercadopago/` ✅ corregido

### Frontend

- `client/src/pages/*`
  - dejaron de ser runtime activo; `AppRoutes` ya consume entrypoints finales agrupados en `client/src/app/router/{home,errors,company,knowledge,legal,services,solutions}` ✅ corregido
- `client/src/components/*`
  - lo reutilizable va a `shared/ui/`
  - lo de dominio va a `features/*/components/` ✅ pendiente de migración
- `client/src/lib/backend-api.ts`
  - queda como transporte, no como dependencia directa de UI ✅ pendiente de migración
- `client/src/services/*`
  - se redistribuye por dominio en `features/*/services/` ✅ pendiente de migración
- `client/src/hooks/*`
  - lo transversal queda en `core/` o `shared/`
  - lo de dominio se mueve a `features/*/hooks/` ✅ pendiente de migración

## Compatibilidad Temporal

Durante la migración se permite:

- reexports desde paths antiguos
- wrappers temporales
- composición de rutas legacy apuntando a módulos nuevos

No se permite:

- renombrar rutas HTTP
- eliminar exports públicos activos
- romper imports existentes en masa

Checklist:

- mantener contratos API
- mantener paths de import hasta migrar consumidores
- validar typecheck/lint/smoke por fase

## Orden Exacto de Moves

1. Crear carpetas target vacías. ✅ corregido
2. Extraer backend `testimonials`. ✅ corregido
3. Extraer backend `support`. ✅ corregido
4. Extraer backend `projects`. ✅ corregido
5. Extraer backend `users`. ✅ corregido
6. Extraer backend `contact/newsletter/propuesta/applications`. ✅ corregido
7. Crear estructura `client/src/app|core|features|shared`. ✅ corregido
8. Migrar `testimonials` en frontend. ✅ corregido
9. Migrar `auth`. ✅ corregido
10. Migrar `contact/newsletter`. ✅ corregido
11. Migrar `payments`. ✅ corregido
12. Migrar `support/projects/user`. ✅ corregido
13. Consolidar config duplicada. ✅ corregido
14. Eliminar compatibilidad temporal.

## Riesgos de Regresión

### 1. Imports rotos en frontend

Riesgo:

- mover componentes/hooks sin mantener paths transitorios

Mitigación:

- usar reexports temporales
- migrar dominio por dominio

### 2. Rutas backend rotas

Riesgo:

- partir `public.routes.ts` y olvidar registrar endpoints

Mitigación:

- crear `app/routes.ts`
- validar smoke después de cada extracción

### 3. Breaking change silencioso en contratos

Riesgo:

- aprovechar el move para renombrar payloads o respuestas

Mitigación:

- prohibido cambiar DTOs durante la fase estructural

### 4. Scope creep

Riesgo:

- mezclar reestructura con fixes funcionales no planificados

Mitigación:

- cada fase debe ser estructural o funcional, nunca ambas

### 5. Duplicación temporal prolongada

Riesgo:

- dejar wrappers y reexports para siempre

Mitigación:

- registrar compatibilidad temporal por fase
- retirar legacy cuando no tenga consumidores

## Criterio de Done del Plan

El plan se considera listo para ejecución cuando:

- la estructura target está aprobada
- existe mapa actual -> objetivo
- existe orden de fases
- existe estrategia de compatibilidad
- existen riesgos y mitigaciones

## Siguiente Paso Recomendado

No ejecutar un move masivo.

El siguiente paso correcto es:

1. cerrar remanentes fuera del plan por dominio
2. abrir Fase 6 de limpieza final de compatibilidad
3. mover un solo frente por vez
4. validar `npm run check`, `npm run lint`, `npm run build`, `npm run smoke`
