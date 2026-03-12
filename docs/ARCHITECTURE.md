# Arquitectura del Repositorio

## Estado

Documento de referencia arquitectónica para la Fase 0.  
No introduce cambios funcionales.

## Frontera General

El repositorio queda dividido conceptualmente en tres zonas:

- código activo frontend en `client/`
- código activo backend en `server/`
- código legacy aislado en `legacy/`

## Frontend

### Capa `app/`

Responsabilidad:

- bootstrap de aplicación
- providers globales
- router
- composición de entrada

Regla:

- no contiene lógica de dominio
- no contiene acceso directo a API

### Capa `core/`

Responsabilidad:

- auth transversal
- config
- cliente HTTP
- query client
- logging transversal

Regla:

- reusable a múltiples features
- no contiene UI de negocio

### Capa `features/`

Responsabilidad:

- implementación por dominio
- hooks
- services
- components específicos
- schemas y tipos de dominio

Dominios esperados:

- `auth`
- `contact`
- `newsletter`
- `payments`
- `projects`
- `support`
- `testimonials`
- `user`

### Capa `shared/`

Responsabilidad:

- UI reutilizable
- utilidades puras
- constants
- types compartidos

Regla:

- no depende de features concretas

## Backend

### Capa `app/`

Responsabilidad:

- composición del servidor
- registro global de middlewares
- composición central de rutas
- arranque de proceso

Regla:

- no contiene lógica de dominio

### Capa `core/`

Responsabilidad:

- auth transversal
- config
- validation
- logger
- manejo de errores

Regla:

- reusable por todos los módulos
- no contiene reglas de negocio de un dominio específico

### Capa `modules/`

Responsabilidad:

- controllers
- routes
- services
- schemas

Dominios esperados:

- `contact`
- `newsletter`
- `payments`
- `projects`
- `support`
- `testimonials`
- `users`

Regla:

- cada módulo expone solo lo necesario para ser montado desde `app/routes.ts`

### Capa `infrastructure/`

Responsabilidad:

- integración con Firebase
- mail
- Mercado Pago

Regla:

- es frontera con sistemas externos
- no debe mezclarse con controllers de dominio

### Capa `shared/`

Responsabilidad:

- helpers neutrales
- tipos transversales
- utilidades sin acoplamiento a un módulo concreto

## Frontera con Infraestructura

La infraestructura externa debe quedar aislada en:

- `server/src/infrastructure/firebase/`
- `server/src/infrastructure/mail/`
- `server/src/infrastructure/mercadopago/`

Regla:

- controllers y rutas no deben hablar directamente con múltiples integraciones externas sin pasar por capa de módulo/servicio

## Frontera con Legacy

El código en `legacy/`:

- no es backend activo
- no debe recibir código nuevo
- no debe ser importado desde `client/` ni `server/`
- solo se conserva como referencia o material de migración
- no participa del runtime principal ni de los workflows CI/CD del stack Node actual

Subárboles:

- `legacy/php-api/`
- `legacy/firebase/`

Fuera de `legacy/` existe además `firebase-functions-contacto/`, que hoy se considera un subproyecto heredado separado:

- no participa del runtime principal
- no participa de CI/CD principal
- solo debe mantenerse congelado o auditarse explícitamente antes de cualquier reuse

## Reglas de Compatibilidad

Durante la reestructuración:

- no cambiar rutas HTTP
- no cambiar payloads de request/response
- no eliminar exports públicos activos
- no romper imports existentes sin wrapper o reexport temporal

## Objetivo de la Fase 0

Dejar explícita la arquitectura target sin mover archivos existentes.
