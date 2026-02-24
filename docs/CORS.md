# Política CORS — TuWebAI

## Resumen

En **producción** las peticiones deben incluir la cabecera `Origin` y este debe pertenecer a la lista explícita de orígenes permitidos. Las peticiones sin `Origin` se rechazan con `403 Forbidden`, salvo en las rutas de excepción indicadas más abajo.

## Lista de orígenes permitidos

Se configura mediante la variable de entorno **`ALLOWED_ORIGINS`** (lista separada por comas). Valor por defecto:

```text
http://localhost:5173,http://localhost:3000,https://tuweb-ai.com,https://www.tuweb-ai.com
```

En producción debe incluir solo los dominios del frontend y de entornos autorizados (por ejemplo staging). No se aceptan comodines.

## Comportamiento por entorno

| Entorno      | Petición con `Origin` en lista | Petición con `Origin` no en lista | Petición sin `Origin` |
|-------------|--------------------------------|------------------------------------|------------------------|
| Development | Permitida                      | Permitida (con warning en log)     | Permitida              |
| Production  | Permitida                      | Rechazada (CORS)                   | Rechazada salvo excepciones |

## Excepciones: rutas que aceptan peticiones sin `Origin` (solo producción)

Estas rutas pueden ser llamadas por servicios que no envían cabecera `Origin` (load balancers, monitoreo, webhooks de terceros):

| Método | Ruta                         | Uso                                      |
|--------|------------------------------|------------------------------------------|
| GET    | `/api/health`                | Health checks (Render, load balancers)   |
| GET    | `/webhook/mercadopago/health`| Comprobación de disponibilidad del webhook |
| POST   | `/webhook/mercadopago`       | Webhook server-to-server de Mercado Pago |

Cualquier otra ruta en producción que reciba una petición sin `Origin` responde con **403 Forbidden** y cuerpo:

```json
{ "error": "Forbidden", "message": "Origin header required" }
```

## Añadir una nueva excepción

Si un servicio legítimo (por ejemplo otro webhook o un job interno) debe llamar al API sin `Origin`:

1. Añadir la ruta exacta al array `PATHS_ALLOWED_WITHOUT_ORIGIN` en `server/index.ts`.
2. Actualizar esta tabla en `docs/CORS.md`.
3. Revisar que la ruta esté protegida por autenticación/firma o rate limit si es sensible.

## Referencia de implementación

- Middleware de rechazo sin Origin: `server/index.ts` (bloque `if (env.NODE_ENV === 'production')`).
- Lista de orígenes: `server/src/config/env.config.ts` → `ALLOWED_ORIGINS`.
- Validación CORS: `server/index.ts` → `cors({ origin: ... })`.
