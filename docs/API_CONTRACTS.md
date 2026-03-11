# Contratos API Vigentes

## Objetivo

Registrar los endpoints actuales y fijar reglas de no breaking change para la reestructuración.

## Reglas de No Breaking Change

1. No cambiar paths HTTP existentes.
2. No renombrar campos ya consumidos por frontend.
3. No cambiar códigos de estado exitosos/esperados sin compatibilidad.
4. No eliminar middlewares de seguridad agregados en los fixes críticos.
5. Toda reestructuración posterior debe ser interna, no contractual.

## Endpoints Actuales

### Contacto y Consulta

- `POST /contact`
- `POST /consulta`
- `POST /test-email`

Payloads actuales:

- `POST /contact`: basado en `contactSchema`
- `POST /consulta`: basado en `consultationSchema`
- `POST /test-email`: endpoint interno protegido

### Pagos

- `POST /crear-preferencia`
- `GET /api/payments/status/:paymentId`
- `POST /webhook/mercadopago`
- `GET /webhook/mercadopago/health`

Payloads actuales:

- `POST /crear-preferencia`: basado en `paymentPreferenceSchema`
- `GET /api/payments/status/:paymentId`: params basados en `paymentStatusParamsSchema`

### Públicos / Testimonials / Applications

- `POST /api/propuesta`
- `POST /newsletter`
- `POST /api/testimonials`
- `GET /api/testimonials`
- `GET /api/testimonials/:testimonialId`
- `PUT /api/testimonials/:testimonialId`
- `DELETE /api/testimonials/:testimonialId`
- `POST /api/applications`
- `GET /api/auth/verify/:token`
- `GET /api/auth/dev-verify/:email`

Payloads actuales:

- `POST /api/propuesta`: `proposalSchema`
- `POST /newsletter`: `newsletterSchema`
- `POST /api/testimonials`: `testimonialSubmissionSchema`
- `GET /api/testimonials/:testimonialId`: `testimonialIdParamsSchema`
- `PUT /api/testimonials/:testimonialId`: `testimonialIdParamsSchema` + `testimonialUpdateSchema`
- `DELETE /api/testimonials/:testimonialId`: `testimonialIdParamsSchema`
- `POST /api/applications`: `applicationSubmissionSchema`
- `GET /api/auth/verify/:token`: `authVerifyParamsSchema`
- `GET /api/auth/dev-verify/:email`: `authDevVerifyParamsSchema`

### Usuarios

- `GET /api/users/:uid`
- `PUT /api/users/:uid`
- `GET /api/users/:uid/preferences`
- `PUT /api/users/:uid/preferences`
- `GET /api/users/:uid/project`
- `GET /api/users/:uid/payments`
- `GET /api/users/:uid/tickets`
- `POST /api/users/:uid/tickets`
- `PUT /api/users/:uid/tickets/:ticketId`
- `POST /api/users/:uid/tickets/:ticketId/responses`

Payloads actuales:

- params basados en `userUidParamsSchema` o `ticketIdParamsSchema`
- updates basados en `userUpdateSchema`, `userPreferencesUpdateSchema`, `ticketCreateSchema`, `ticketUpdateSchema`, `ticketResponseSchema`

### Recursos Globales Protegidos

- `GET /api/tickets/:ticketId`
- `PUT /api/projects/:projectId`
- `GET /api/projects`
- `GET /api/tickets`

Payloads actuales:

- `GET /api/tickets/:ticketId`: `ticketOnlyParamsSchema`
- `PUT /api/projects/:projectId`: `projectIdParamsSchema` + `projectUpdateSchema`

## Reglas de Compatibilidad por Reestructuración

### Backend

- extraer controllers por dominio sin alterar endpoints
- mantener middlewares de auth/autorización actuales
- mantener respuestas JSON existentes

### Frontend

- mover acceso a datos fuera de UI sin alterar rutas de navegación
- mantener hooks y wrappers temporales si existen consumidores legacy

## Observación

Este documento registra el contrato funcional actual.  
Las fases siguientes pueden cambiar ubicación de archivos, pero no el comportamiento expuesto.
