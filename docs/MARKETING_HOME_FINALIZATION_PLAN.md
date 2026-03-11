# Plan Enterprise de Finalización de Marketing Home

## Objetivo

Desbloquear la Fase 6 sin romper el landing actual.

Este plan existe porque el bloqueo real ya no está en wrappers legacy ni en runtime transversal, sino en la composición activa de:

- `client/src/pages/home.tsx`
- `client/src/components/sections/*`

## Estado actual auditado

`home.tsx` sigue haciendo tres trabajos al mismo tiempo:

1. SEO y metadata del landing
2. scroll orchestration y navegación por secciones
3. composición visual de secciones lazy

Además, todavía consume secciones temporales en:

- `hero-section.tsx`
- `philosophy-section.tsx`
- `services-section.tsx`
- `process-section.tsx`
- `tech-section.tsx`
- `impact-section.tsx`
- `comparison-section.tsx`
- `showroom-section.tsx`

Conclusión:

- no corresponde ejecutar Fase 6 mientras el landing siga orquestado desde `pages/home.tsx`
- primero hay que definir un target estable para `marketing-home`

## Arquitectura objetivo

Target conceptual:

```text
client/src/
  features/
    marketing-home/
      components/
        hero-section.tsx
        philosophy-section.tsx
        services-section.tsx
        process-section.tsx
        tech-section.tsx
        impact-section.tsx
        comparison-section.tsx
        showroom-section.tsx
      hooks/
        use-home-section-navigation.ts
      types/
      constants/
    contact/
    payments/
    testimonials/
  app/
    router/
  shared/
    ui/
```

## Principios

1. No cambiar la URL `/`.
2. No cambiar el orden visual del landing.
3. No cambiar el comportamiento de scroll/hash/query.
4. No mover todas las sections juntas.
5. No mezclar extracción de hooks con rediseño visual.

## Fases

### Fase 0. Auditoría de responsabilidades

Estado:

- ✅ corregido
- mapa entregado en `docs/MARKETING_HOME_RESPONSIBILITY_MAP.md`

Objetivo:

- separar qué parte de `home.tsx` es:
  - shell de página
  - scroll orchestration
  - composición de secciones

Entregable:

- mapa `responsabilidad -> destino`

### Fase 1. Extraer hook de navegación del landing

Estado:

- ✅ corregido parcialmente: la lógica de navegación y scroll de `home.tsx` fue extraída a `client/src/features/marketing-home/hooks/use-home-section-navigation.ts`

Objetivo:

- sacar de `home.tsx` toda la lógica de:
  - `location.search`
  - `location.hash`
  - `sectionRefs`
  - `scrollToSection`
  - fallback scrolling

Destino:

- `client/src/features/marketing-home/hooks/use-home-section-navigation.ts`

Regla:

- mantener exactamente el mismo comportamiento de scroll

### Fase 2. Crear feature `marketing-home`

Estado:

- ✅ corregido parcialmente: `hero-section` ya vive en `client/src/features/marketing-home/components/hero-section.tsx`; `home.tsx` consume esa implementación y `components/sections/hero-section.tsx` quedó como wrapper temporal
- ✅ corregido parcialmente: `philosophy-section` ya vive en `client/src/features/marketing-home/components/philosophy-section.tsx`; `home.tsx` consume esa implementación y `components/sections/philosophy-section.tsx` quedó como wrapper temporal
- ✅ corregido parcialmente: `services-section` ya vive en `client/src/features/marketing-home/components/services-section.tsx`; `home.tsx` consume esa implementación y `components/sections/services-section.tsx` quedó como wrapper temporal
- ✅ corregido parcialmente: `process-section` ya vive en `client/src/features/marketing-home/components/process-section.tsx`; `home.tsx` consume esa implementación y `components/sections/process-section.tsx` quedó como wrapper temporal
- ✅ corregido parcialmente: `tech-section` ya vive en `client/src/features/marketing-home/components/tech-section.tsx`; `home.tsx` consume esa implementación y `components/sections/tech-section.tsx` quedó como wrapper temporal
- ✅ corregido parcialmente: `impact-section` ya vive en `client/src/features/marketing-home/components/impact-section.tsx`; `home.tsx` consume esa implementación y `components/sections/impact-section.tsx` quedó como wrapper temporal
- ✅ corregido parcialmente: `comparison-section` ya vive en `client/src/features/marketing-home/components/comparison-section.tsx`; `home.tsx` consume esa implementación y `components/sections/comparison-section.tsx` quedó como wrapper temporal
- ✅ corregido parcialmente: `showroom-section` ya vive en `client/src/features/marketing-home/components/showroom-section.tsx`; `home.tsx` consume esa implementación y `components/sections/showroom-section.tsx` quedó como wrapper temporal

Objetivo:

- crear `client/src/features/marketing-home/components/`
- mover primero implementación real sin borrar legacy

Orden recomendado:

1. `hero-section`
2. `philosophy-section`
3. `services-section`
4. `process-section`
5. `tech-section`
6. `impact-section`
7. `comparison-section`
8. `showroom-section`

Regla:

- cada section se mueve en un slice separado
- `pages/home.tsx` pasa a consumir la feature
- `components/sections/*` queda como wrapper temporal si hace falta

### Fase 3. Reducir `home.tsx` a shell del landing

Objetivo:

- dejar `home.tsx` como página delgada
- que solo componga:
  - SEO
  - layout principal
  - sections desde `features/marketing-home`
  - sections ya migradas de negocio

Resultado esperado:

- `home.tsx` deja de contener lógica relevante

### Fase 4. Re-auditoría de precondiciones para Fase 6

Verificar:

- no quedan imports activos desde `components/sections/*`
- `home.tsx` ya no contiene orchestration compleja
- `App.tsx` sigue como bridge controlado
- el landing ya responde al target final

Si todo eso cumple:

- recién ahí habilitar Fase 6 real

## Riesgos

### Riesgo 1. Romper navegación por hash o `?section=`

Mitigación:

- extraer el hook antes que mover sections
- validar manualmente scroll y deep links después de cada slice

### Riesgo 2. Romper lazy loading y performance del home

Mitigación:

- no cambiar la estrategia de `lazy()` en la misma extracción del hook
- mover composición sin alterar `Suspense`

### Riesgo 3. Mezclar sections de negocio con sections de marketing

Mitigación:

- mantener `contact`, `testimonials` y `payments` donde ya están
- `marketing-home` debe agrupar solo sections del landing no dominiales

## Definition of Done

Este plan queda completo cuando:

- `features/marketing-home` existe
- `home.tsx` es shell delgada
- `components/sections/*` ya no contiene runtime activo del landing
- Fase 6 deja de estar bloqueada por el home

## Siguiente paso recomendado

Ejecutar primero:

1. `Fase 0. Auditoría de responsabilidades`
2. después `Fase 1. Extraer hook de navegación del landing`

No conviene mover sections antes de sacar la lógica de scroll de `home.tsx`.
