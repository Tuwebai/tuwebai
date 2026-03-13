# User Dashboard Decomposition Plan

## Estado

Auditoria estructural de `client/src/features/users/components/user-dashboard-page.tsx`.

Objetivo:

- descomponer el panel sin cambiar comportamiento
- bajar riesgo de regresiones antes de continuar con nuevas fases funcionales
- convertir `user-dashboard-page.tsx` en un orquestador, no en un monolito

## Resumen Ejecutivo

La descomposicion del panel ya quedo materializada.

Estado auditado:

- `user-dashboard-page.tsx` bajo a 348 lineas
- el contenedor ya no renderiza tabs grandes embebidas
- header, navegacion principal y tabs pesadas viven en subcomponentes propios
- los validadores y factories de formularios ya no estan embebidos en el contenedor

Conclusion:

- el archivo ya funciona como orquestador razonable
- no corresponde seguir extrayendo por inercia
- el siguiente trabajo sobre el panel puede volver a enfocarse en cambios funcionales, no estructurales

## Alcance Auditado

Archivo principal:

- `client/src/features/users/components/user-dashboard-page.tsx`

Componentes ya extraidos:

- `client/src/features/users/components/privacy-tab.tsx`
- `client/src/features/users/components/user-dashboard-header.tsx`
- `client/src/features/users/components/user-dashboard-tabs-nav.tsx`
- `client/src/features/users/components/user-profile-tab.tsx`
- `client/src/features/users/components/user-security-tab.tsx`
- `client/src/features/users/components/user-integrations-tab.tsx`

Helpers ya extraidos:

- `client/src/features/users/utils/user-dashboard-forms.ts`

Responsabilidades detectadas:

### Shell y runtime

- guard de autenticacion
- loading state de pagina
- `MetaTags`
- animacion de entrada general

### Estado local y handlers

- `activeTab`
- edicion de perfil
- cambio de password
- upload de avatar
- toggles de visibilidad de password
- formularios y errores

### Bloques visuales

- header/resumen del usuario
- navegacion principal por tabs
- tab `Perfil`
- tab `Seguridad`
- tab `Privacidad`
- tab `Integraciones`

## Diagnostico

### Hallazgo 1. El archivo ya es un monolito de UI

Nivel: alto

Problema:

- demasiadas responsabilidades conviven en el mismo archivo
- los cambios visuales pequenos obligan a tocar un archivo enorme
- el contexto necesario para trabajar cualquier slice del panel es demasiado grande

### Hallazgo 2. La descomposicion ya quedo completada

Nivel: resuelto

El panel ya distribuye sus responsabilidades visuales principales en subcomponentes dedicados.

Eso confirma que el camino correcto fue completar la separacion por bloques y detener el crecimiento del contenedor.

### Hallazgo 3. El riesgo estructural principal ya bajo

Nivel: medio-bajo

Seguir metiendo cambios grandes en el contenedor volveria a aumentar:

- probabilidad de regresiones visuales
- riesgo de conflictos entre handlers
- costo de lectura y prueba
- deuda tecnica directa

### Hallazgo 4. La separacion aplicada respeta responsabilidades claras

Nivel: resuelto

La division debe respetar responsabilidades claras:

- shell/orquestador
- header
- tabs navigation
- tab profile
- tab security
- tab integrations
- helpers de forms/validators

## Criterio Enterprise de Descomposicion

`user-dashboard-page.tsx` debe quedar responsable solo de:

- autenticar/permitir entrada
- resolver hooks globales del panel
- coordinar `activeTab`
- pasar props a subcomponentes

No debe seguir conteniendo:

- markup completo de tabs grandes
- formularios largos embebidos
- bloques visuales enteros repetibles

## Estructura Target Recomendada

```text
client/src/features/users/components/
  user-dashboard-page.tsx
  user-dashboard-header.tsx
  user-dashboard-tabs-nav.tsx
  user-profile-tab.tsx
  user-security-tab.tsx
  user-integrations-tab.tsx
  privacy-tab.tsx
```

Opcional despues:

```text
client/src/features/users/components/user-dashboard/
  user-dashboard-page.tsx
  user-dashboard-header.tsx
  user-dashboard-tabs-nav.tsx
  user-profile-tab.tsx
  user-security-tab.tsx
  user-integrations-tab.tsx
  privacy-tab.tsx
```

Por ahora no conviene mover carpetas; primero conviene extraer sin cambiar rutas internas mas de lo necesario.

## Plan por Fases

### Fase 0. Congelar crecimiento del monolito

Objetivo:

- no agregar mas UI ni handlers grandes dentro de `user-dashboard-page.tsx`

Resultado esperado:

- toda continuidad del panel sale ya con subcomponentes

### Fase 1. Extraer shell visible compartido

Objetivo:

- sacar del monolito lo menos riesgoso y mas estable

Slice recomendado:

- `user-dashboard-header.tsx`
- `user-dashboard-tabs-nav.tsx`

Beneficio:

- baja tamaño del archivo sin tocar formularios
- desacopla layout general de contenido por tab

Estado:

- cerrada

### Fase 2. Extraer `Perfil`

Objetivo:

- mover el formulario de perfil a un componente propio

Slice recomendado:

- `user-profile-tab.tsx`

Incluye:

- inputs de perfil
- errores de perfil
- botones de editar/guardar/cancelar

Estado:

- cerrada

### Fase 3. Extraer `Seguridad`

Objetivo:

- mover estado y UI de password a un bloque aislado

Slice recomendado:

- `user-security-tab.tsx`

Incluye:

- estado de cuenta
- cambio de password
- toggles de visibilidad de password

Estado:

- cerrada

### Fase 4. Extraer `Integraciones`

Objetivo:

- aislar el bloque mas estatico del panel

Slice recomendado:

- `user-integrations-tab.tsx`

Estado:

- cerrada

### Fase 5. Reevaluar helpers y validadores

Objetivo:

- decidir si conviene extraer validaciones y tipos de forms

Solo si el estado restante del contenedor sigue siendo pesado.

Estado:

- cerrada

Resultado:

- los validadores y factories de formularios ya viven en `client/src/features/users/utils/user-dashboard-forms.ts`
- `user-dashboard-page.tsx` ya no mantiene reglas de validacion embebidas ni estados iniciales duplicados

### Fase 6. Dejar `user-dashboard-page.tsx` como orquestador

Objetivo:

- que el archivo final coordine hooks, estado transversal y render condicional de tabs

Estado:

- cerrada

Resultado:

- `user-dashboard-page.tsx` ya orquesta autenticacion, hooks, estado local y render condicional
- el archivo ya no contiene tabs grandes embebidas
- la deuda estructural critica del panel quedo desactivada

## Orden Recomendado

1. Fase 0 congelar crecimiento
2. Fase 1 header + tabs nav
3. Fase 2 profile
4. Fase 3 security
5. Fase 4 integrations
6. Fase 5 helpers si hace falta
7. Fase 6 cierre del orquestador

Estado final:

- todas las fases cerradas

## Riesgos

- mezclar descomposicion con cambios funcionales
- mover demasiados bloques en un solo commit
- extraer componentes sin props claras
- seguir dejando handlers duplicados o acoplados al contenedor

## Criterio de Cierre

Este frente se considera cerrado cuando:

- `user-dashboard-page.tsx` deja de ser archivo gigante
- cada tab grande vive en su propio componente
- el contenedor queda como orquestador
- `check`, `lint`, `build` y `smoke` siguen en verde tras cada slice
