# Panel Information Architecture Plan

## Estado

Auditoria de la arquitectura de informacion del `/panel`.

Objetivo:

- definir que debe vivir realmente dentro de `Preferencias`
- evitar duplicacion con `Perfil`, `Seguridad` e `Integraciones`
- proponer nuevas tabs solo si agregan valor operativo real
- dejar una hoja de ruta pequeña, verificable y sin deuda tecnica nueva

## Resumen Ejecutivo

El `/panel` ya tiene una separacion base razonable:

- `Perfil`
- `Seguridad`
- `Privacidad`
- `Integraciones`

El problema actual no es falta de tabs, sino que `Preferencias` venia cargando configuraciones sin efecto real.

Conclusion:

- no conviene seguir agregando toggles decorativos
- `Privacidad` debe vivir como tab propia para controles sensibles
- una futura tab de `Preferencias` solo se justifica si aparecen ajustes reales de experiencia o accesibilidad
- una nueva tab solo se justifica si expone informacion operativa real, no promesas futuras

## Flujo Auditado

### 1. Tabs actuales

Archivo:

- `client/src/features/users/components/user-dashboard-page.tsx`

Estado auditado:

- `profile`
- `security`
- `privacy`
- `integrations`

### 2. Responsabilidad real por tab

#### `Perfil`

Contiene:

- datos personales
- edicion de nombre, username y email
- avatar

Lectura:

- esta tab esta bien ubicada
- no conviene mover preferencias visuales ni de privacidad aca

#### `Seguridad`

Contiene:

- estado de cuenta
- password
- señales basicas de seguridad

Lectura:

- esta tab tambien esta bien delimitada
- cualquier configuracion de sesiones o alertas de acceso deberia vivir aca, no en `Preferencias`

#### `Privacidad`

Estado actual:

- reemplaza a la vieja `Preferencias`
- hoy funciona como shell honesto, sin toggles fake
- queda reservada para controles sensibles con efecto verificable
- el plan de dominio dedicado vive en `docs/PRIVACY_DOMAIN_IMPLEMENTATION_PLAN.md`

Lectura:

- semantica correcta para consentimiento, visibilidad y control de datos
- no conviene mezclarla con experiencia visual ni accesibilidad
- necesita implementacion real antes de poblarla

#### `Integraciones`

Contiene:

- conexiones externas
- servicios vinculables

Lectura:

- no debe mezclarse con preferencias personales
- la separacion actual es correcta

## Hallazgos

### Hallazgo 1. `Privacidad` debe ser una capa personal, no una mezcla de dominio

Nivel: alto

Una tab de privacidad enterprise no deberia incluir:

- integraciones
- seguridad
- edicion de perfil
- estados de proyecto

Porque eso ya tiene fronteras mejores en otras tabs.

### Hallazgo 2. La vieja `Preferencias` ya no debe seguir existiendo como tab generica

Nivel: alto

Una tab generica de preferencias:

- tiende a mezclar controles blandos con configuraciones sensibles
- invita a volver a meter toggles decorativos
- queda semanticamente mas debil que una tab explicita de `Privacidad`

Conclusion:

- conviene reemplazar `Preferencias` por `Privacidad`
- experiencia y accesibilidad deben evaluarse aparte, no forzarse dentro de una tab vacia

### Hallazgo 3. Las preferencias blandas deben esperar a tener efecto visible real

Nivel: alto

Si la app todavia no controla:

- tema
- idioma
- comunicaciones reales

entonces no conviene abrir una tab nueva solo para llenarla.

### Hallazgo 4. No hace falta sumar tabs nuevas si todavia no existe un caso operativo claro

Nivel: medio

Agregar tabs extra por volumen visual seria anti-enterprise.

Una tab nueva solo se justifica si:

- concentra un dominio real
- evita mezclar responsabilidades
- tiene datos o acciones verificables

## Criterio Enterprise para `Privacidad`

`Privacidad` deberia contener solo configuracion personal sensible vinculada a visibilidad, consentimiento y control de datos.

Eso deja una familia correcta:

### 1. Privacidad

Ejemplos viables:

- permitir contacto comercial
- visibilidad de email en vistas internas del panel
- visibilidad de telefono en vistas internas del panel
- consentimiento de seguimiento funcional del panel

Ventaja:

- pertenece a configuracion personal sensible
- no duplica `Seguridad`
- puede tener semantica clara y persistencia limpia

## Recomendacion de Arquitectura

### Estructura recomendada de tabs del panel

Orden sugerido:

1. `Perfil`
2. `Seguridad`
3. `Privacidad`
4. `Integraciones`

No recomendaria dejar hoy:

- `Preferencias` como tab generica
- `Tema`
- `Idioma`
- `Comunicaciones`

porque hoy ya fueron descartadas por producto o todavia no tienen wiring real.

## Tabs nuevas: cuando si y cuando no

### No agregar ahora

No agregaria estas tabs hoy:

- `Notificaciones`
- `Idioma`
- `Tema`
- `Comunicaciones`

Motivo:

- no tienen backend o runtime suficientemente real
- terminan duplicando `Preferencias` o generando ruido

### Tab nueva que si tiene sentido a futuro: `Actividad`

Solo si existe backend o datos reales.

Contenido valido:

- ultimos accesos
- cambios de perfil
- eventos de seguridad
- eventos relevantes del usuario en el panel

Por que si:

- agrega valor real
- no pisa `Seguridad`
- mejora trazabilidad del usuario

### Tab nueva que puede tener sentido despues: `Proyecto`

Solo si el panel va a ser realmente cliente-facing.

Contenido valido:

- estado del proyecto
- hitos
- entregables
- actualizaciones operativas

Por que no ahora:

- todavia es otro dominio
- mezclarlo antes de tiempo meteria deuda y ruido

## Plan por Fases

### Fase 0. Congelar expansion innecesaria

Objetivo:

- no agregar mas toggles o tabs sin efecto real

Accion:

- usar este documento como criterio de filtro antes de cualquier nuevo cambio en `/panel`

Estado:

- cerrada

Resultado real:

- `Preferencias` ya no expone tema ni idioma
- `Preferencias` tampoco conserva UI residual de esas decisiones descartadas
- cualquier nueva tab o configuracion queda condicionada a tener dominio operativo real antes de entrar al runtime

### Fase 1. Retirar `Preferencias` como tab generica

Objetivo:

- reemplazar la vieja tab de `Preferencias` por `Privacidad`

Resultado esperado:

- el panel deja de mezclar ajustes blandos con controles sensibles
- la navegacion refleja mejor la semantica real del producto

Estado:

- cerrada

Resultado real:

- `Comunicaciones` fue retirada del runtime del panel
- la vieja semantica de `Preferencias` quedo descartada
- la tab ya quedo renombrada a `Privacidad` y funciona como shell honesto hasta tener controles reales

### Fase 2. Consolidar `Privacidad` como tab propia

Objetivo:

- materializar `Privacidad` como tab separada y dejar su shell alineado a controles sensibles

Slice minimo recomendado:

- renombrar la tab y su contenido
- mantener copy honesto
- no introducir toggles hasta tener wiring real

Estado:

- cerrada

Resultado real:

- `Preferencias` fue reemplazada en el runtime por la tab `Privacidad`
- la navegacion del panel ya no usa una etiqueta generica para controles sensibles
- `Privacidad` queda como shell honesto mientras se define wiring real para visibilidad, consentimiento y control de datos

### Fase 3. Evaluar una futura tab de `Preferencias`

Objetivo:

- decidir si experiencia y accesibilidad justifican volver a abrir una tab separada

Slice minimo recomendado:

- recordar ultima tab abierta
o
- reducir animaciones del panel

### Fase 4. Evaluar `Accesibilidad`

Objetivo:

- decidir si accesibilidad merece sub-bloque o tab propia segun alcance real

Slice minimo recomendado:

- `reduceMotion`
o
- `highContrast`

### Fase 5. Evaluar tab `Actividad`

Objetivo:

- decidir si hace falta una nueva tab real

Condicion:

- solo abrirla si existe data operativa consumible y estable

## Orden Recomendado

1. Fase 0 congelar expansion innecesaria
2. Fase 0 cerrada
3. Fase 1 cerrada
4. Fase 2 consolidar `Privacidad`
5. Fase 3 evaluar futura tab de `Preferencias`
6. Fase 4 evaluar `Accesibilidad`
7. Fase 5 evaluar `Actividad`

## Riesgos

- volver a abrir `Preferencias` como cajon de sastre
- abrir tabs nuevas sin dominio real
- mezclar seguridad, integraciones y preferencias personales
- meter una capa visual bonita pero sin efecto funcional

## Criterio de Cierre

Este frente se considera bien encaminado cuando:

- `Privacidad` existe como tab propia y coherente
- no quedan toggles sin efecto verificable
- no se agregan tabs decorativas
- cualquier nueva tab responde a un dominio claro y operativo
- `check`, `lint`, `build` y `smoke` siguen en verde
