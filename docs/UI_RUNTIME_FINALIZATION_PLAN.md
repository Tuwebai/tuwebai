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
- el bloqueo restante no es de compatibilidad muerta, sino de runtime activo todavía montado desde:
  - `client/src/App.tsx`
  - `client/src/pages/*`
  - `client/src/components/ui/*`
  - `client/src/components/sections/*`

Conclusión:

- no corresponde borrar `pages/` ni `components/` todavía
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

- `client/src/App.tsx` puede quedar como wrapper temporal hacia `client/src/app/App.tsx` hasta cerrar migración

Definition of Done:

- el runtime principal ya vive en `app/`
- `App.tsx` legacy queda vacío o como puente temporal controlado

### Fase 4. Pages finalization

Objetivo:

- reducir `client/src/pages/*` a entrypoints mínimos o moverlas al router/app si corresponde

Estrategia:

- no borrar todas las páginas juntas
- empezar por páginas ya fuertemente desacopladas
- mantener exports/rutas hasta que el router final quede consolidado

Definition of Done:

- `pages/*` deja de contener lógica relevante
- las páginas quedan como shell mínimo o desaparecen si ya no tienen consumidores

### Fase 5. Fase 6 real

Precondiciones:

- no existen imports activos desde wrappers legacy
- `components/ui` no contiene shared pendiente
- `components/sections` no contiene sections de negocio activas
- `App.tsx` ya está reubicado
- `pages/*` ya no son runtime estructural legacy

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

- usar `client/src/App.tsx` como puente temporal
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
- `rg "client/src/App.tsx"` muestra solo bridge o runtime final controlado
- `rg "client/src/pages/" client/src` ya no muestra dependencia estructural legacy relevante

### No-Go

No ejecutar Fase 6 real si:

- `pages/*` sigue siendo el punto principal de orquestación
- `components/sections/*` sigue conteniendo dominio activo
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
