# Arquitectura del Repositorio

## Estado

Documento de referencia arquitectonica para la Fase 0.  
No introduce cambios funcionales.

## Frontera General

El repositorio queda dividido conceptualmente en tres zonas:

- codigo activo frontend en `client/`
- codigo activo backend en `server/`
- codigo legacy aislado en `legacy/`

## Frontend

## Criterio Visual

Para trabajos de UI/UX en el frontend activo:

- la carpeta `ui-ux-pro-max-skill/` se considera referencia de diseno premium y criterio visual reutilizable
- sus guias, templates y reglas pueden usarse para revisar o implementar ajustes visuales
- no forma parte del runtime ni del build del producto principal
- cualquier mejora visual debe respetar primero la identidad de TuWeb.ai, especialmente su paleta base y su lenguaje visual ya establecido
- cuando exista tension entre una recomendacion generica del skill y la identidad actual de TuWeb.ai, prevalece TuWeb.ai

### Capa `app/`

Responsabilidad:

- bootstrap de aplicacion
- providers globales
- router
- composicion de entrada

Regla:

- no contiene logica de dominio
- no contiene acceso directo a API

### Capa `core/`

Responsabilidad:

- auth transversal
- config
- cliente HTTP
- query client
- logging transversal

Regla:

- reusable a multiples features
- no contiene UI de negocio

### Capa `features/`

Responsabilidad:

- implementacion por dominio
- hooks
- services
- components especificos
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

- composicion del servidor
- registro global de middlewares
- composicion central de rutas
- arranque de proceso

Regla:

- no contiene logica de dominio

### Capa `core/`

Responsabilidad:

- auth transversal
- config
- validation
- logger
- manejo de errores

Regla:

- reusable por todos los modulos
- no contiene reglas de negocio de un dominio especifico

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

- cada modulo expone solo lo necesario para ser montado desde `app/routes.ts`

### Capa `infrastructure/`

Responsabilidad:

- integracion con Firebase
- mail
- Mercado Pago

Regla:

- es frontera con sistemas externos
- no debe mezclarse con controllers de dominio

### Capa `shared/`

Responsabilidad:

- helpers neutrales
- tipos transversales
- utilidades sin acoplamiento a un modulo concreto

## Frontera con Infraestructura

La infraestructura externa debe quedar aislada en:

- `server/src/infrastructure/firebase/`
- `server/src/infrastructure/mail/`
- `server/src/infrastructure/mercadopago/`

Regla:

- controllers y rutas no deben hablar directamente con multiples integraciones externas sin pasar por capa de modulo o servicio

## Frontera con Legacy

El codigo en `legacy/`:

- no es backend activo
- no debe recibir codigo nuevo
- no debe ser importado desde `client/` ni `server/`
- solo se conserva como referencia o material de migracion
- no participa del runtime principal ni de los workflows CI/CD del stack Node actual

Subarboles:

- `legacy/php-api/`
- `legacy/firebase/`

Fuera de `legacy/` existe ademas `firebase-functions-contacto/`, que hoy se considera un subproyecto heredado separado:

- no participa del runtime principal
- no participa de CI/CD principal
- solo debe mantenerse congelado o auditarse explicitamente antes de cualquier reuse

## Reglas de Compatibilidad

Durante la reestructuracion:

- no cambiar rutas HTTP
- no cambiar payloads de request/response
- no eliminar exports publicos activos
- no romper imports existentes sin wrapper o reexport temporal

## Objetivo de la Fase 0

Dejar explicita la arquitectura target sin mover archivos existentes.
