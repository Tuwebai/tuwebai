# Configuración del Proyecto

## Estado

Documento de consolidación de configuración.

Resultado de Fase 5 del `ENTERPRISE_RESTRUCTURE_PLAN`:

- build frontend: fuente oficial definida
- deploy Netlify: fuente oficial definida
- configuraciones duplicadas: documentadas como deprecated

## Source of Truth

### Build frontend

Fuente oficial:

- `vite.config.ts`

Motivo:

- `npm run build`
- `npm run build:frontend`
- `npm run dev:frontend`
- `Dockerfile.frontend`

usan la configuración raíz y resuelven `client/` como `root` del frontend.

### Deploy Netlify

Fuente oficial:

- `netlify.toml`

Motivo:

- Netlify detecta por defecto el archivo en la raíz del repositorio
- el build oficial del proyecto se ejecuta desde raíz
- el publish oficial apunta a `dist/`, que es el outdir generado por `vite.config.ts`

### Tailwind

Fuente oficial:

- `tailwind.config.ts`

### PostCSS

Fuente oficial:

- `postcss.config.js`

## Configuraciones Deprecadas

Los siguientes archivos quedan deprecados y no deben usarse como referencia principal:

- `client/vite.config.ts`
- `client/netlify.toml`
- `client/tailwind.config.ts`
- `client/postcss.config.js`

Estado:

- se mantienen solo por compatibilidad y trazabilidad histórica
- no deben recibir cambios funcionales nuevos
- cualquier ajuste futuro debe partir de la configuración raíz

## Variables de Entorno Relevantes

### Frontend / Vite

Usadas por build o runtime frontend:

- `VITE_API_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_STRICT_PAYMENT_ERROR_DIALOG`

### Backend / Runtime

Usadas por server, smoke o deploy backend:

- `NODE_ENV`
- `PORT`
- `ENFORCE_FIREBASE_AUTH`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SESSION_SECRET`
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_WEBHOOK_SECRET`
- `FIREBASE_PROJECT_ID`
- credenciales Firebase Admin asociadas

## Reglas Operativas

1. Cambios de build frontend deben hacerse en `vite.config.ts`.
2. Cambios de deploy Netlify deben hacerse en `netlify.toml`.
3. Cambios de Tailwind deben hacerse en `tailwind.config.ts`.
4. Cambios de PostCSS deben hacerse en `postcss.config.js`.
5. Los archivos deprecados en `client/` no son fuente de verdad.

## Notas de Compatibilidad

- Esta fase no modifica parámetros de build ni deploy.
- Esta fase no elimina archivos duplicados.
- Esta fase no cambia variables de entorno.
- Si en el futuro se decide eliminar configuraciones legacy, primero debe verificarse que no existan pipelines externos apuntando a `client/`.
