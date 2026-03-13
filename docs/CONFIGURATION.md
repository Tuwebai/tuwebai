# Configuracion del Proyecto

## Estado

Documento de consolidacion de configuracion.

Resultado de Fase 5 del `ENTERPRISE_RESTRUCTURE_PLAN`:

- build frontend: fuente oficial definida
- deploy Netlify: fuente oficial definida
- configuraciones duplicadas de `client/`: retiradas

## Source of Truth

### Build frontend

Fuente oficial:

- `vite.config.ts`

Motivo:

- `npm run build`
- `npm run build:frontend`
- `npm run dev:frontend`
- `Dockerfile.frontend`

usan la configuracion raiz y resuelven `client/` como `root` del frontend.
Ademas, `vite.config.ts` fija `envDir: "."` para que las variables `VITE_*` se lean desde el `.env` de la raiz del repo y no desde `client/`.

### Deploy Netlify

Fuente oficial:

- `netlify.toml`

Motivo:

- Netlify detecta por defecto el archivo en la raiz del repositorio
- el build oficial del proyecto se ejecuta desde raiz
- el publish oficial apunta a `dist/`, que es el outdir generado por `vite.config.ts`

### Tailwind

Fuente oficial:

- `tailwind.config.ts`

### PostCSS

Fuente oficial:

- `postcss.config.js`

## Configuraciones Retiradas

Los siguientes archivos legacy de `client/` ya fueron retirados tras confirmar ausencia de consumidores reales:

- `client/vite.config.ts`
- `client/netlify.toml`
- `client/tailwind.config.ts`
- `client/postcss.config.js`

Estado:

- la unica fuente de verdad vive en la raiz del repositorio
- cualquier ajuste futuro debe partir de la configuracion raiz

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
- `DISABLE_FIREBASE_ADMIN`
- `DISABLE_SMTP_DELIVERY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SESSION_SECRET`
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_WEBHOOK_SECRET`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `FIREBASE_SERVICE_ACCOUNT_KEY`

Regla recomendada para Firebase Admin:

- preferir `FIREBASE_SERVICE_ACCOUNT_JSON` en CI/CD, deploy y secret managers
- usar `FIREBASE_SERVICE_ACCOUNT_KEY` solo como fallback local apuntando a un archivo ignorado por Git
- el archivo `firebase-service-account.json` en raiz no es requerido por la arquitectura actual; es solo una conveniencia local opcional

Variables operativas de smoke:

- `SMOKE_USE_REAL_FIREBASE=1`
  - opt-in para permitir que `npm run smoke` use Firebase Admin real
- `SMOKE_USE_REAL_SMTP=1`
  - opt-in para permitir que `npm run smoke` use SMTP real

Comportamiento por defecto:

- `npm run smoke` aisla Firebase Admin y SMTP aunque el `.env` local tenga credenciales cargadas
- solo usa infraestructura real si se habilita explicitamente con las variables `SMOKE_USE_REAL_*`

## Reglas Operativas

1. Cambios de build frontend deben hacerse en `vite.config.ts`.
2. Cambios de deploy Netlify deben hacerse en `netlify.toml`.
3. Cambios de Tailwind deben hacerse en `tailwind.config.ts`.
4. Cambios de PostCSS deben hacerse en `postcss.config.js`.
5. No deben reintroducirse archivos de configuracion duplicados dentro de `client/`.

## Notas de Compatibilidad

- Esta fase no modifica parametros de build ni deploy.
- Esta fase ya elimino los archivos duplicados de configuracion en `client/`.
- Esta fase no cambia variables de entorno.
- Si algun pipeline externo aun apuntara a `client/`, debe corregirse contra la configuracion raiz antes de reintroducir cualquier compatibilidad.
