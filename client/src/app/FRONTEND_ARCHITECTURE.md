# Arquitectura Frontend

## Objetivo

Esta capa prepara la migracion gradual del frontend a una estructura con fronteras claras sin romper el comportamiento actual ni los imports legacy.

## Capas

### `app/`

Responsable de:

- routing
- providers globales
- layout raiz
- composicion de la aplicacion

### `core/`

Responsable de:

- clientes API
- auth
- config
- hooks globales
- estado compartido transversal

### `features/`

Responsable de:

- logica por dominio
- hooks de feature
- servicios especificos de cada feature
- coordinacion entre UI y datos del dominio

### `shared/`

Responsable de:

- componentes reutilizables
- primitives de UI
- utilidades compartidas
- tipos reutilizables

## Flujo de dependencias

Dependencias permitidas:

- `pages -> features`
- `pages -> shared`
- `components -> shared`
- `features -> core`
- `features -> shared`
- `app -> features`
- `app -> core`
- `app -> shared`

Dependencias prohibidas:

- `pages -> API directa`
- `components -> API directa`
- `shared -> features`
- `shared -> app`

## Compatibilidad temporal

Durante la migracion:

- `pages/` y `components/` siguen siendo validos
- `hooks/`, `services/`, `lib/` y `contexts/` siguen operativos
- no se cambian rutas
- no se cambian contratos API
- no se rompen imports existentes

## Regla de migracion

La migracion se hara por fases:

1. preparar carpetas y documentacion
2. mover hooks y servicios por feature
3. aislar acceso a API fuera de `pages/` y `components/`
4. consolidar composicion en `app/`

Hasta completar esas fases, la compatibilidad legacy tiene prioridad sobre el orden cosmetico.
