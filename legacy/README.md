# Legacy Isolation

## Estado

Este directorio contiene el stack PHP legacy aislado del runtime principal Node/Express.

## Alcance

- `php-api/`: endpoints, config y utilidades PHP heredadas
- `firebase/`: scripts auxiliares heredados que dependen del stack PHP legacy

## Reglas

- No integrar código nuevo contra este stack
- No desplegarlo junto al backend Node salvo decisión explícita y auditada
- Tratarlo como material de referencia o migración, no como sistema activo

## Motivo del aislamiento

El runtime actual del proyecto usa:

- `client/` para frontend React/Vite
- `server/` para backend Express/TypeScript

El stack PHP no forma parte del flujo actual de build, CI ni `docker-compose`, pero seguía mezclado en rutas operativas del repo. Se aisló para:

- reducir ambigüedad arquitectónica
- evitar despliegues accidentales
- hacer explícita la frontera entre código vigente y legacy
