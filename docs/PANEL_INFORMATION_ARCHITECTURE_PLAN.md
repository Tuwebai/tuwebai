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
- `Preferencias`
- `Integraciones`

El problema actual no es falta de tabs, sino que `Preferencias` venia cargando configuraciones sin efecto real.

Conclusion:

- no conviene seguir agregando toggles decorativos
- `Preferencias` debe quedar limitada a configuracion personal de experiencia, privacidad y accesibilidad
- una nueva tab solo se justifica si expone informacion operativa real, no promesas futuras

## Flujo Auditado

### 1. Tabs actuales

Archivo:

- `client/src/features/users/components/user-dashboard-page.tsx`

Estado auditado:

- `profile`
- `security`
- `preferences`
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

#### `Preferencias`

Estado actual:

- ya no contiene tema ni idioma
- quedo reducida a comunicaciones

Lectura:

- esta mejor que antes
- pero todavia no esta cerrada
- hoy sigue sosteniendo toggles que persisten pero no gobiernan comportamiento real

#### `Integraciones`

Contiene:

- conexiones externas
- servicios vinculables

Lectura:

- no debe mezclarse con preferencias personales
- la separacion actual es correcta

## Hallazgos

### Hallazgo 1. `Preferencias` debe ser una capa personal, no una mezcla de dominio

Nivel: alto

Una tab de preferencias enterprise no deberia incluir:

- integraciones
- seguridad
- edicion de perfil
- estados de proyecto

Porque eso ya tiene fronteras mejores en otras tabs.

### Hallazgo 2. `Comunicaciones` sigue siendo un frente debil

Nivel: alto

Hoy `newsletter` y `emailNotifications`:

- persisten
- pero no gobiernan un comportamiento global visible y confiable

Conclusion:

- no son una base fuerte para sostener por si solas toda la tab de `Preferencias`

### Hallazgo 3. Falta una seccion de preferencias con efecto visible real

Nivel: alto

Si `Preferencias` no controla:

- tema
- idioma
- comunicaciones reales

entonces necesita un nuevo nucleo funcional que si tenga efecto verificable.

### Hallazgo 4. No hace falta sumar tabs nuevas si todavia no existe un caso operativo claro

Nivel: medio

Agregar tabs extra por volumen visual seria anti-enterprise.

Una tab nueva solo se justifica si:

- concentra un dominio real
- evita mezclar responsabilidades
- tiene datos o acciones verificables

## Criterio Enterprise para `Preferencias`

`Preferencias` deberia contener solo configuracion personal de experiencia del usuario dentro del panel y de la app.

Eso deja tres familias correctas:

### 1. Privacidad

Ejemplos viables:

- permitir contacto comercial
- visibilidad de email en vistas internas del panel
- visibilidad de telefono en vistas internas del panel
- consentimiento de seguimiento funcional del panel

Ventaja:

- pertenece a configuracion personal
- no duplica `Seguridad`
- puede tener semantica clara y persistencia limpia

### 2. Experiencia

Ejemplos viables:

- recordar ultima tab abierta del panel
- densidad de interfaz
- reducir animaciones
- mostrar u ocultar modulos secundarios del dashboard

Ventaja:

- efecto visible real
- no rompe branding
- se puede implementar en slices chicos y medibles

### 3. Accesibilidad

Ejemplos viables:

- reducir motion
- contraste reforzado
- tamano de texto

Ventaja:

- es una familia legitima de preferencias
- tiene impacto real de UX
- no compite con `Seguridad` ni `Integraciones`

## Recomendacion de Arquitectura

### Estructura recomendada de `Preferencias`

Orden sugerido:

1. `Privacidad`
2. `Experiencia`
3. `Accesibilidad`

No recomendaria dejar:

- `Tema`
- `Idioma`
- `Comunicaciones` sola

porque hoy o ya fueron descartadas por producto, o todavia no tienen wiring real.

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

### Fase 1. Vaciar `Preferencias` de configuracion debil

Objetivo:

- retirar `Comunicaciones` si sigue sin wiring real

Resultado esperado:

- `Preferencias` deja de depender de toggles que hoy no gobiernan nada

### Fase 2. Introducir `Privacidad`

Objetivo:

- darle a `Preferencias` un primer bloque con semantica enterprise real

Slice minimo recomendado:

- una o dos opciones claras
- persistidas en `users.preferences`
- con copy honesto

### Fase 3. Introducir `Experiencia`

Objetivo:

- sumar una preferencia con efecto visible real en el panel

Slice minimo recomendado:

- recordar ultima tab abierta
o
- reducir animaciones del panel

### Fase 4. Introducir `Accesibilidad`

Objetivo:

- consolidar `Preferencias` como espacio legitimo de configuracion personal

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
2. Fase 1 retirar `Comunicaciones` si sigue sin wiring real
3. Fase 2 introducir `Privacidad`
4. Fase 3 introducir `Experiencia`
5. Fase 4 introducir `Accesibilidad`
6. Fase 5 evaluar `Actividad`

## Riesgos

- volver a inflar `Preferencias` con configuraciones fake
- abrir tabs nuevas sin dominio real
- mezclar seguridad, integraciones y preferencias personales
- meter una capa visual bonita pero sin efecto funcional

## Criterio de Cierre

Este frente se considera bien encaminado cuando:

- `Preferencias` contiene solo configuracion personal real
- no quedan toggles sin efecto verificable
- no se agregan tabs decorativas
- cualquier nueva tab responde a un dominio claro y operativo
- `check`, `lint`, `build` y `smoke` siguen en verde
