# Auditoría Técnica del Proyecto Tuwebai

## Resumen Ejecutivo

**Clasificación general:** Riesgoso

El proyecto tiene una base funcional y un frontend con bastante trabajo visual ya integrado, pero el repositorio presenta señales claras de crecimiento sin consolidación arquitectónica. Hoy conviven en el mismo repo:

- un frontend React/Vite en `client/`
- un backend Express/TypeScript en `server/`
- un stack PHP legacy en `api/` ✅ corregido: aislado en `legacy/php-api/`; `api/` hoy aparece solo como residuo local vacío sin archivos versionados
- una Cloud Function separada en `firebase-functions-contacto/`
- artefactos compilados, binarios, reportes, logs y credenciales en raíz ✅ corregido parcialmente: builds/reportes/logs generados, tooling local heredado y el secreto local Firebase Admin ya fueron limpiados del workspace; persisten solo variables sensibles en `.env`

Eso eleva el costo de mantenimiento, debilita la gobernanza y deja riesgos concretos de seguridad, despliegue y escalabilidad.

### Estado real del proyecto

- El frontend principal compila y `eslint` pasa.
- El backend actual compila con `esbuild`.
- El smoke test pasa, pero no es una garantía suficiente de salud sistémica.
- `tsc` **no** valida el backend, porque [`tsconfig.json`](./tsconfig.json) solo incluye `client/src`. ✅ corregido
- Existen rutas sensibles del backend sin autenticación suficiente. ✅ corregido
- El repositorio contiene código legacy operativo o semihuéfano que compite con la implementación principal. ✅ corregido parcialmente: stack PHP aislado en `legacy/`

### Validaciones ejecutadas

- `npm run check`
- `npm run lint`
- `npm run build:backend`
- `npm run smoke`
- `npm outdated --json`
- inventario completo de archivos y revisión manual de rutas, controladores, servicios, config y workflows

### Riesgos dominantes

1. Exposición de datos por endpoints sin auth consistente. ✅ corregido
2. Backend con cobertura de calidad incompleta. ✅ corregido
3. Deploy/config rotos o ambiguos por duplicación de stacks y archivos. ✅ corregido parcialmente
4. Repositorio contaminado con basura operativa, binarios y secretos. ✅ corregido parcialmente

---

## Arquitectura Actual

### Estructura real

```text
/
├─ client/                         # Frontend React/Vite
├─ server/                         # Backend Express/TypeScript
├─ api/                            # Residuo local vacío sin archivos versionados ✅ corregido: removido del versionado
├─ firebase/                       # Reglas/config Firestore
├─ firebase-functions-contacto/    # Cloud Function separada
├─ scripts/                        # Smoke/log scripts
├─ docs/                           # Auditorías y documentación
├─ dist/                           # Build frontend versionado ✅ corregido: ya no persistido en workspace tras validaciones
├─ dist-server/                    # Build backend versionado ✅ corregido: removido del versionado y limpiado del workspace
├─ node_modules/                   # Dependencias instaladas dentro del repo
├─ php-temp/                       # Runtime PHP completo dentro del repo ✅ corregido: removido del versionado
└─ raíz                            # Configs, imágenes, reports, secrets ✅ corregido parcialmente
```

### Lectura arquitectónica

- No es un monorepo gobernado; es un repositorio único con múltiples stacks mezclados.
- Hay dos backends potenciales para varias capacidades: `server/` y `api/`. ✅ corregido: PHP movido a `legacy/` y `api/` quedó reducido a residuo local vacío sin archivos versionados ni uso operativo
- Hay dos centros de configuración frontend: [`vite.config.ts`](./vite.config.ts) y [`client/vite.config.ts`](./client/vite.config.ts). ✅ corregido parcialmente: raíz definida como source of truth; `client/` marcado deprecated
- Hay dos configuraciones Netlify: [`netlify.toml`](./netlify.toml) y [`client/netlify.toml`](./client/netlify.toml). ✅ corregido parcialmente: raíz definida como source of truth; `client/` marcado deprecated
- El frontend usa una mezcla de `contexts`, `hooks`, `services` y acceso directo a API desde componentes/páginas. ✅ corregido parcialmente: frontera `app/core/features/shared` preparada, migración de consumers pendiente
- El backend concentra demasiada responsabilidad en [`server/src/controllers/public.controller.ts`](./server/src/controllers/public.controller.ts). ✅ corregido parcialmente: dominios extraídos a `server/src/modules/` con facade temporal

### Evaluación de escalabilidad

**No está preparado para escalar con seguridad** en equipo, features o tráfico sin una fase de consolidación previa.

Motivos:

- límites de capa poco claros ✅ corregido parcialmente
- contratos débiles entre frontend y backend
- ausencia de frontera clara entre código vigente y código legacy ✅ corregido parcialmente
- cobertura insuficiente de validaciones estáticas y automatizadas ✅ corregido parcialmente
- superficie de despliegue duplicada

---

## Problemas Críticos

### 1. ✅ Endpoints sensibles expuestos sin autorización suficiente

**Impacto:** A - Crítico

En [`server/src/routes/public.routes.ts`](./server/src/routes/public.routes.ts):

- línea 106: `GET /api/tickets/:ticketId` no exige auth ✅ corregido
- línea 123: `PUT /api/projects/:projectId` no exige auth ✅ corregido
- línea 124: `GET /api/projects` no exige auth ✅ corregido
- línea 125: `GET /api/tickets` no exige auth ✅ corregido

Esas rutas delegan directamente a Firestore desde [`server/src/controllers/public.controller.ts`](./server/src/controllers/public.controller.ts), por ejemplo:

- línea 471: `handleGetTicketById`
- línea 486: `handleGetAllProjects`
- línea 505: `handleGetAllTickets`
- línea 395: `handleUpdateProject`

Resultado:

- lectura global de tickets/proyectos sin identidad validada ✅ corregido
- modificación de proyectos sin middleware de auth ✅ corregido
- posible exposición de datos de clientes y operación interna

### 2. ✅ El typecheck oficial no cubre el backend

**Impacto:** A - Crítico

[`tsconfig.json`](./tsconfig.json) línea 29:

```json
"include": ["client/src"]
```

Pero el proyecto vende la sensación de control con `npm run check`, CI y deploy gates. En realidad:

- `npm run check` valida solo frontend ✅ corregido
- `eslint` valida solo `client/src` ✅ corregido
- el backend puede degradarse sin quedar bloqueado por los quality gates ✅ corregido

### 3. ✅ Docker/backend static serving inconsistente y probablemente roto

**Impacto:** A - Crítico

Hallazgos:

- no existe carpeta `public/` en raíz ✅ corregido
- [`server/index.ts`](./server/index.ts) líneas 304 y 306 sirven `../public` ✅ corregido
- [`Dockerfile.backend`](./Dockerfile.backend) línea 21 intenta copiar `/app/public` ✅ corregido

Eso deja tres riesgos:

- el `favicon` del backend falla en runtime ✅ corregido
- el `express.static` apunta a un directorio inexistente ✅ corregido
- el build de Docker backend queda inconsistente respecto a la estructura real del repo ✅ corregido

### 4. Repositorio con credencial sensible y fallback inseguro a archivo local

**Impacto:** A - Crítico

Existe [`firebase-service-account.json`](./firebase-service-account.json) en raíz. ✅ corregido: retirado del workspace tras confirmar que el server ya opera con credencial inline y `applicationDefault()` sin depender del archivo físico local

Además, el stack PHP legacy usa fallback explícito al archivo local: ✅ corregido parcialmente al aislarse el stack en `legacy/`

- [`legacy/php-api/config/firebase.php`](./legacy/php-api/config/firebase.php) línea 28
- [`legacy/php-api/config/firebase.php`](./legacy/php-api/config/firebase.php) línea 284

Aunque `.gitignore` lo ignora, su presencia física en el repo de trabajo es una mala práctica de alto riesgo y fomenta dependencia operativa en secretos locales. ✅ corregido

### 5. ✅ Código legacy PHP con prácticas inseguras sigue coexistiendo

**Impacto:** A - Crítico

En [`legacy/php-api/config/firebase.php`](./legacy/php-api/config/firebase.php):

- línea 88: `CURLOPT_SSL_VERIFYPEER` en `false`
- línea 340: fallback a `VITE_FIREBASE_API_KEY` como token

En [`legacy/php-api/webhooks/mercadopago.php`](./legacy/php-api/webhooks/mercadopago.php):

- procesa pagos y notifica dashboard en paralelo al stack Node actual

Esto no solo es deuda técnica: es **riesgo activo** si ese código sigue desplegado o es reactivable. ✅ corregido parcialmente mediante aislamiento del stack

---

## Archivos Basura

### Safe to delete

- `generated-icon.png`
  - sin referencias detectadas
- `ts_errors.log`
  - sin referencias detectadas ✅ corregido: limpiado del workspace
- `dist/`
  - artefacto compilado ✅ corregido: limpiado del workspace
- `dist-server/`
  - artefacto compilado ✅ corregido: limpiado del workspace
- `node_modules/`
  - dependencia instalada, no debe vivir en repo
- `logs/`
  - datos operativos locales ✅ corregido: patrón protegido por `.gitignore` y artefactos locales limpiados
- `php-temp/`
  - runtime/binarios de PHP, no corresponde versionarlo ✅ corregido

### Needs review

- `api/`
  - residuo local vacío, sin archivos versionados ni despliegue asociado ✅ corregido: ya no representa stack activo del repo
- `firebase-functions-contacto/functions/lib/`
  - build compilado dentro de subproyecto ✅ corregido
- `client/vite.config.ts`
  - configuración duplicada respecto a raíz ✅ corregido parcialmente: marcada deprecated
- `client/netlify.toml`
  - configuración duplicada respecto a raíz ✅ corregido parcialmente: marcada deprecated
- `tuweb-ai.com-20260305T235948.json`
  - reporte Lighthouse puntual; útil solo si se versiona deliberadamente ✅ corregido: patrón ignorado y artefacto local limpiado
- `.replit`
  - resto de entorno anterior; no integra con el stack vigente ✅ corregido: retirado tras confirmar ausencia de consumidores en el repo actual
- imágenes duplicadas en raíz y `client/public/`
  - `dashboardtuwebai.png`, `safespot.png`, `trading-tuwebai.png`, `image_perfil.jpg`

---

## Código Muerto

### Archivos o módulos sin integración visible

- [`client/src/components/auth/AdminRoute.tsx`](./client/src/components/auth/AdminRoute.tsx)
  - no se encontró consumo desde el árbol principal
- [`client/src/components/auth/DashboardRoute.tsx`](./client/src/components/auth/DashboardRoute.tsx)
  - mismo caso
- [`client/src/types/admin.ts`](./client/src/types/admin.ts)
  - sin referencias detectadas
- [`client/src/lib/gtag.ts`](./client/src/lib/gtag.ts)
  - coexistencia con [`client/src/lib/analytics.ts`](./client/src/lib/analytics.ts), pero sin integración clara

### Zombies parciales

- [`client/src/pages/panel-usuario.tsx`](./client/src/pages/panel-usuario.tsx)
  - integra UI de “Google / Facebook / GitHub”, “API Key de desarrollo” y “Próximamente” sin backend real
  - línea 422 devuelve una fecha hardcodeada: `12 de julio de 2025`
- [`client/src/pages/auth-verify.tsx`](./client/src/pages/auth-verify.tsx) ✅ corregido parcialmente: API directa movida a `features/auth/services`
  - muestra flujo de reset, pero termina llamando a un stub no soportado
- [`client/src/contexts/AuthContext.tsx`](./client/src/contexts/AuthContext.tsx) ✅ corregido: eliminado tras quedar sin consumidores runtime directos
  - línea 256 define `resetPassword` que solo muestra toast: no implementa el caso esperado por la UI

### Deuda de tipado / limpieza

- uso extendido de `any` en backend y frontend
- `@ts-ignore` en slider/testimonials
- imports y helpers duplicados entre `AuthContext`, hooks de auth y servicios

---

## Dependencias Problemáticas

Clasificación basada en `package.json`, búsqueda de uso en código y `npm outdated --json`.

### Critical

- `express-static`
  - dependencia sospechosa y sin uso
  - además se usa `serve-static`, por lo que parece redundante o equivocada
- `firebase-service-account.json` + dependencia operativa de `firebase-admin`
  - no es un problema de versión, sino de gobernanza de secretos ✅ corregido parcialmente

### Should update

- `vite`, `react-router-dom`, `@tanstack/react-query`, `mercadopago`, `firebase-admin`, `nodemailer`, `express-rate-limit`, `tsx`
  - no urge migración mayor inmediata, pero hay rezago visible
- casi toda la familia `@radix-ui/*`
  - rezago menor, pero acumulado

### Optional cleanup / likely unused

- `@emailjs/nodejs`
- `@sendgrid/mail`
- `@jridgewell/trace-mapping`
- `archiver`
- `bcryptjs`
- `extract-zip`
- `highlight.js`
- `image-size`
- `passport-google-oauth20`
- `passport-local`
- `puppeteer`
- `react-ga4`
- `sharp`
- `zod-validation-error`
- `@replit/vite-plugin-*`
- `nodemon`
- `ts-node`

Observación:

- varias dependencias figuran instaladas pero no tienen referencias de runtime detectables en el código revisado
- conviene confirmar con `knip` o `depcheck` antes de remover

---

## Bugs Potenciales

### Critical

- Endpoints sin auth suficiente en backend ✅ corregido
- `Dockerfile.backend` y `server/index.ts` apuntan a `public/` inexistente ✅ corregido
- `handleDeleteTestimonial` usa `delete()` hard delete en [`server/src/controllers/public.controller.ts`](./server/src/controllers/public.controller.ts) línea 590, violando la política de soft delete ✅ corregido

### Medium

- [`client/src/pages/auth-verify.tsx`](./client/src/pages/auth-verify.tsx) expone UX de reset que no ejecuta el caso real
- [`client/src/lib/http-client.ts`](./client/src/lib/http-client.ts) línea 105 fuerza `credentials: 'include'`
  - puede causar comportamiento inconsistente en CORS/cookies si el backend no usa cookies como mecanismo principal
- [`client/src/pages/contacto.tsx`](./client/src/pages/contacto.tsx) y [`client/src/components/ui/newsletter-form.tsx`](./client/src/components/ui/newsletter-form.tsx)
  - muestran éxito optimista antes de confirmar respuesta del backend
- [`scripts/smoke.mjs`](./scripts/smoke.mjs)
  - usa `.env` local si está presente y consulta Firestore real / SMTP real, por lo que no es un smoke aislado

### Low

- `console.log`/`console.debug` todavía presentes en config y utilidades
- encoding dañado en múltiples archivos (`Ã³`, `Ã¡`, etc.), síntoma de manejo inconsistente de charset
- README prácticamente vacío

---

## Deuda Técnica

### 1. Archivos demasiado grandes

Frontend:

- `client/src/pages/servicios/posicionamiento-marketing.tsx`
- `client/src/pages/servicios/automatizacion-marketing.tsx`
- `client/src/pages/servicios/desarrollo-web.tsx`
- `client/src/pages/panel-usuario.tsx`
- `client/src/pages/consulta.tsx` ✅ corregido parcialmente: API directa movida a `features/proposals/services`

Backend:

- `server/src/controllers/public.controller.ts` ✅ corregido parcialmente: descompuesto por dominio con facade temporal

Esto indica:

- demasiadas responsabilidades por archivo
- baja reutilización de lógica
- difícil testing unitario
- riesgo alto de regresión al tocar cualquier feature

### 2. Capa UI violando frontera de datos

Hay imports directos de `backendApi` en componentes/páginas, por ejemplo:

- [`client/src/pages/contacto.tsx`](./client/src/pages/contacto.tsx) ✅ corregido parcialmente: API directa movida a `features/contact/services`
- [`client/src/pages/consulta.tsx`](./client/src/pages/consulta.tsx) ✅ corregido parcialmente: API directa movida a `features/proposals/services`
- [`client/src/pages/auth-verify.tsx`](./client/src/pages/auth-verify.tsx)
- [`client/src/components/ui/newsletter-form.tsx`](./client/src/components/ui/newsletter-form.tsx) ✅ corregido parcialmente: API directa movida a `features/newsletter/services`
- [`client/src/hooks/use-toast.ts`](./client/src/hooks/use-toast.ts) ✅ corregido: eliminado tras redirigir sus consumidores a `shared/ui/use-toast`
- [`client/src/hooks/use-mobile.tsx`](./client/src/hooks/use-mobile.tsx) ✅ corregido: eliminado tras redirigir sus consumidores a `core/hooks/use-mobile`
- [`client/src/hooks/use-intersection-observer.tsx`](./client/src/hooks/use-intersection-observer.tsx) ✅ corregido: eliminado tras redirigir sus consumidores a `core/hooks/use-intersection-observer`
- [`client/src/contexts/ThemeContext.tsx`](./client/src/contexts/ThemeContext.tsx) ✅ corregido: eliminado tras redirigir su consumidor a `core/theme/ThemeContext`
- [`client/src/components/sections/pricing-section.tsx`](./client/src/components/sections/pricing-section.tsx) ✅ corregido: runtime migrado a `features/payments/components/pricing-section.tsx`
- [`client/src/components/sections/contact-section.tsx`](./client/src/components/sections/contact-section.tsx) ✅ corregido: runtime migrado a `features/contact/components/contact-section.tsx`
- [`client/src/components/payment/payment-return-view.tsx`](./client/src/components/payment/payment-return-view.tsx) ✅ corregido: runtime migrado a `features/payments/components/payment-return-view.tsx`

Esto rompe el patrón indicado por la gobernanza del repo y acopla UI con transporte. ✅ corregido parcialmente: `testimonials`, `auth`, `contact`, `newsletter`, `payments`, `support`, `projects`, `users` y `proposals` ya migrados a `features/`; quedan remanentes legacy de composición/UI
Las `sections` restantes del landing (`hero`, `philosophy`, `services`, `process`, `tech`, `impact`, `comparison`, `showroom`) fueron re-auditadas y siguen temporales por formar parte del runtime estructural del home; no conviene moverlas antes de `Runtime shell` y `Pages finalization`. ✅ corregido parcialmente
El runtime principal ya fue reubicado a `client/src/app/App.tsx`; `client/src/main.tsx` consume esa implementación final y `client/src/App.tsx` fue retirado tras quedar sin consumidores. ✅ corregido
Los providers globales del runtime frontend ya fueron extraídos a `client/src/app/providers/AppProviders.tsx`, reduciendo acoplamiento en `App`. ✅ corregido parcialmente
La tabla de rutas del runtime frontend ya fue extraída a `client/src/app/router/AppRoutes.tsx`, manteniendo paths y lazy loading sin cambios funcionales. ✅ corregido parcialmente
Las páginas `pago-exitoso`, `pago-fallido` y `pago-pendiente` ya no forman parte estructural del router; el runtime consume directamente `features/payments/components/payment-return-view` y esos entrypoints legacy fueron retirados tras quedar sin consumidores. ✅ corregido
La página `contacto` ya no forma parte estructural del router; el runtime consume directamente `features/contact/components/support-contact-page` y `client/src/pages/contacto.tsx` fue retirada tras quedar sin consumidores. ✅ corregido
La página `auth-verify` ya no forma parte estructural del router; el runtime consume directamente `features/auth/components/auth-verify-page` y `client/src/pages/auth-verify.tsx` fue retirada tras quedar sin consumidores. ✅ corregido
La página `consulta` ya no forma parte estructural del router; el runtime consume directamente `features/proposals/components/proposal-request-page`, el prefetch ya apunta a esa implementación final y `client/src/pages/consulta.tsx` fue retirada tras quedar sin consumidores. ✅ corregido
La página `panel-usuario` ya no forma parte estructural del router ni del prefetch; el runtime consume directamente `features/users/components/user-dashboard-page` y `client/src/pages/panel-usuario.tsx` fue retirada tras quedar sin consumidores. ✅ corregido
La página `home` sigue siendo runtime estructural del landing; hoy mezcla composición, scroll orchestration y lazy loading de sections temporales, por lo que no corresponde adelgazarla en Fase 4 sin definir antes el target final de `marketing-home`. ✅ corregido parcialmente
`client/src/App.tsx` ya no forma parte del bootstrap; `client/src/main.tsx` consume `client/src/app/App.tsx` como runtime final y el bloqueo del landing por su composición temporal en `components/sections/*` ya fue removido. ✅ corregido
La ruta `not-found` ya no depende de `client/src/pages/not-found.tsx`; `AppRoutes` consume `client/src/app/router/errors/not-found-page.tsx` como runtime final y el entrypoint legacy fue retirado. ✅ corregido
Las páginas legales `terminos-condiciones`, `politica-privacidad` y `politica-cookies` ya no dependen de `client/src/pages/*`; `AppRoutes` consume `client/src/app/router/legal/*` como runtime final y los entrypoints legacy fueron retirados. ✅ corregido
Las páginas de servicios `consultoria-estrategica`, `desarrollo-web`, `posicionamiento-marketing` y `automatizacion-marketing` ya no dependen de `client/src/pages/servicios/*`; `AppRoutes` consume `client/src/app/router/services/*` como runtime final y los entrypoints legacy fueron retirados. ✅ corregido
La página `vacantes` ya no depende de `client/src/pages/vacantes.tsx`; `AppRoutes` y `route-prefetch` consumen `client/src/app/router/company/vacancies-page.tsx` como runtime final y el entrypoint legacy fue retirado. ✅ corregido
Las páginas `corporativos` y `ecommerce` ya no dependen de `client/src/pages/*`; `AppRoutes` consume `client/src/app/router/solutions/*` como runtime final y los entrypoints legacy fueron retirados. ✅ corregido
La página `uxui` ya no depende de `client/src/pages/uxui.tsx`; `AppRoutes` consume `client/src/app/router/solutions/uxui-page.tsx` como runtime final y el entrypoint legacy fue retirado. ✅ corregido
La página `equipo` ya no depende de `client/src/pages/equipo.tsx`; `AppRoutes` consume `client/src/app/router/company/team-page.tsx` como runtime final y el entrypoint legacy fue retirado. ✅ corregido
La página `estudio` ya no depende de `client/src/pages/estudio.tsx`; `AppRoutes` consume `client/src/app/router/company/studio-page.tsx` como runtime final y el entrypoint legacy fue retirado. ✅ corregido
La página `faq` ya no depende de `client/src/pages/faq.tsx`; `AppRoutes` consume `client/src/app/router/knowledge/faq-page.tsx` como runtime final y el entrypoint legacy fue retirado. ✅ corregido
La página `tecnologias` ya no depende de `client/src/pages/tecnologias.tsx`; `AppRoutes` consume `client/src/app/router/knowledge/technologies-page.tsx` como runtime final y el entrypoint legacy fue retirado. ✅ corregido
Se auditó `marketing-home` y quedó trazado el mapa `responsabilidad -> destino`; el shell estructural del landing ya vive en `client/src/app/router/home/home-page.tsx` y las sections temporales quedaron clasificadas para migración por slices, no para limpieza directa. ✅ corregido
La navegación del landing (`location.search`, `location.hash`, `sectionRefs` y fallback scrolling) ya fue extraída desde `client/src/pages/home.tsx` hacia `features/marketing-home/hooks/use-home-section-navigation`, reduciendo acoplamiento sin alterar la UX del home. ✅ corregido parcialmente
La `hero-section` del landing ya fue movida a `features/marketing-home/components/hero-section`; `home.tsx` consume la implementación final y `components/sections/hero-section.tsx` fue retirado tras quedar sin consumidores. ✅ corregido
La `philosophy-section` del landing ya fue movida a `features/marketing-home/components/philosophy-section`; `home.tsx` consume la implementación final y `components/sections/philosophy-section.tsx` fue retirado tras quedar sin consumidores. ✅ corregido
La `services-section` del landing ya fue movida a `features/marketing-home/components/services-section`; `home.tsx` consume la implementación final y `components/sections/services-section.tsx` fue retirado tras quedar sin consumidores. ✅ corregido
La `process-section` del landing ya fue movida a `features/marketing-home/components/process-section`; `home.tsx` consume la implementación final y `components/sections/process-section.tsx` fue retirado tras quedar sin consumidores. ✅ corregido
La `tech-section` del landing ya fue movida a `features/marketing-home/components/tech-section`; `home.tsx` consume la implementación final y `components/sections/tech-section.tsx` fue retirado tras quedar sin consumidores. ✅ corregido
La `impact-section` del landing ya fue movida a `features/marketing-home/components/impact-section`; `home.tsx` consume la implementación final y `components/sections/impact-section.tsx` fue retirado tras quedar sin consumidores. ✅ corregido
La `comparison-section` del landing ya fue movida a `features/marketing-home/components/comparison-section`; `home.tsx` consume la implementación final y `components/sections/comparison-section.tsx` fue retirado tras quedar sin consumidores. ✅ corregido
La `showroom-section` del landing ya fue movida a `features/marketing-home/components/showroom-section`; `home.tsx` consume la implementación final y `components/sections/showroom-section.tsx` fue retirado tras quedar sin consumidores. ✅ corregido
La página `panel-usuario` sigue concentrando orquestación funcional de perfil, seguridad, preferencias e imagen; no corresponde adelgazarla en Fase 4 sin separar antes ese flujo por dominio. ✅ corregido parcialmente

### 3. Backend tipo “God controller”

[`server/src/controllers/public.controller.ts`](./server/src/controllers/public.controller.ts) mezcla: ✅ corregido parcialmente

- propuestas
- newsletter
- testimonials
- applications
- auth verify
- users
- preferences
- tickets
- projects
- listados globales

No hay separación por dominio ni capa de servicios de negocio consistente. ✅ corregido parcialmente: módulos y routing central ya creados

### 4. Duplicación de stacks y configuración

- dos `vite.config`
- dos `netlify.toml`
- backend Node + backend PHP + Cloud Function
- lógica Firebase en Node y en PHP

Estado: ✅ corregido parcialmente: `vite.config.ts`, `netlify.toml`, `tailwind.config.ts` y `postcss.config.js` de raíz definidos como fuentes oficiales; duplicados de `client/` documentados como deprecated

Esto complica onboarding, incidentes y despliegue.

---

## Gobernanza del Proyecto

### Scripts rotos o inseguros

En [`package.json`](./package.json):

- líneas 16-17
  - `check-oauth` apunta a `scripts/check-google-oauth.js` inexistente
  - `fix-oauth` apunta a `scripts/fix-google-oauth.js` inexistente
- línea 32
  - `setup:mp` apunta a `setup-mercado-pago.js` inexistente
- línea 33
  - `deploy` ejecuta `git add . && git commit && git push`
  - esto no es un deploy enterprise; mezcla build con control de versiones y puede versionar basura accidental ✅ corregido parcialmente

### Quality gates incompletos

- CI valida frontend, pero no backend con TypeScript estricto ✅ corregido
- ESLint solo cubre `client/src` ✅ corregido
- no hay suite de tests unitarios/integración por dominio
- smoke test no está aislado de infraestructura real

### Documentación insuficiente

- [`README.md`](./README.md) no sirve como entrada operativa
- no hay documento claro de arquitectura vigente vs legacy ✅ corregido parcialmente
- no hay inventario de componentes activos/inactivos

---

## Calidad General del Código

### Puntos positivos

- uso de Zod en varios bordes HTTP del backend Node
- estructura de middlewares razonable en Express
- intento de observabilidad con request IDs y logger estructurado
- adopción de React Query en parte de auth/testimonials

### Problemas de consistencia

- mezcla de español, inglés y naming híbrido
- mezcla de estrategias de acceso a datos ✅ corregido parcialmente
- mezcla de estilos de logging
- mezcla de flujos modernos con placeholders y stubs
- mezcla de arquitecturas activas y legacy en el mismo repo ✅ corregido parcialmente

---

## Preparación para Escalar

### Crecer en features

**Estado:** Débil

Bloqueantes:

- páginas monolíticas
- controller backend monolítico ✅ corregido parcialmente
- duplicación de stacks
- falta de frontera clara por dominio ✅ corregido parcialmente

### Crecer en equipo

**Estado:** Débil

Bloqueantes:

- onboarding documental casi inexistente
- repo con ruido operativo alto
- difícil distinguir qué código está vivo

### Crecer en tráfico

**Estado:** Frágil

Bloqueantes:

- endpoints abiertos ✅ corregido
- dependencia parcial en filesystem local para logs e idempotencia fallback
- smoke/operación tocando infraestructura real
- control de auth activable por env, no necesariamente enforced por diseño ✅ corregido parcialmente

---

## Arquitectura Recomendada

### Objetivo

Consolidar un solo stack activo y volver explícito qué queda deprecado.

### Propuesta

```text
src/
  app/
    providers/
    router/
  core/
    config/
    env/
    http/
    logger/
    auth/
  features/
    auth/
      components/
      hooks/
      services/
      schemas/
    contact/
    newsletter/
    payments/
    testimonials/
    support/
    projects/
  shared/
    ui/
    utils/
    types/

server/
  src/
    app/ ✅ corregido parcialmente
    core/ ✅ corregido parcialmente
      config/
      logger/
      auth/
      validation/
    modules/ ✅ corregido parcialmente
      contact/
      newsletter/
      payments/
      testimonials/
      users/
      support/
      projects/
    infrastructure/ ✅ corregido parcialmente
      firebase/
      mail/
      mercadopago/
```

### Decisiones recomendadas

- elegir **un** backend activo: Node/Express o PHP, no ambos ✅ corregido parcialmente: PHP aislado
- mover legacy a `legacy/` o eliminarlo ✅ corregido
- separar frontend por `features` ✅ corregido parcialmente: estructura preparada
- encapsular acceso a backend solo en hooks/services
- crear contratos tipados compartidos o al menos DTOs por módulo
- sacar artefactos, binarios, reportes y secretos fuera del repo ✅ corregido parcialmente: builds/reportes/logs locales, tooling heredado y el archivo local de Firebase Admin ya fueron limpiados; siguen pendientes secretos sensibles dentro de `.env`

---

## Plan de Refactor

### Alta prioridad

1. Cerrar rutas sensibles con auth/autorización real. ✅ corregido
2. Eliminar o aislar el stack PHP legacy. ✅ corregido
3. Corregir la cobertura de `tsc` y `eslint` para backend. ✅ corregido
4. Limpiar secretos, binarios, logs y builds del repo. ✅ corregido parcialmente
5. Corregir `Dockerfile.backend` y serving estático. ✅ corregido
6. Reemplazar hard delete por soft delete donde aplique. ✅ corregido

### Media prioridad

1. Particionar `public.controller.ts` por dominios. ✅ corregido parcialmente
2. Mover acceso a API fuera de `pages/` y `components/`. ✅ corregido parcialmente: `testimonials`, `auth`, `contact`, `newsletter`, `payments`, `support`, `projects`, `users` y `proposals` ya migrados; wrappers legacy de auth y services ya fueron retirados o quedaron fuera del runtime directo
3. Depurar scripts rotos y remover `deploy` basado en `git add .`.
4. Consolidar `vite.config` y `netlify.toml`. ✅ corregido parcialmente: source of truth documentada y configs duplicadas marcadas deprecated
5. Revisar dependencias posiblemente no usadas y podar.

### Baja prioridad

1. Normalizar encoding y textos.
2. Reducir tamaño de páginas/componentes grandes.
3. Eliminar placeholders y UX no implementada del panel.
4. Reescribir README con arquitectura, setup y despliegue.

---

## Conclusión

Tuwebai no está en estado caótico total, pero sí en una zona peligrosa: funciona por acumulación de soluciones, no por una arquitectura consolidada. La prioridad no debería ser agregar más features; debería ser **consolidar el sistema vigente, cerrar superficies expuestas y separar definitivamente lo activo de lo legacy**.

Si se corrigen primero seguridad, gobernanza de repo y consolidación de stack, el proyecto puede pasar de **Riesgoso** a **Aceptable** relativamente rápido. Si no se hace, cualquier crecimiento va a aumentar tanto el costo de mantenimiento como la probabilidad de incidentes.

Nota de seguimiento:

- ✅ corregido parcialmente: client/index.html ya no carga Google Analytics ni AdSense en localhost, evitando pausas del runtime por excepciones de dsbygoogle.js durante desarrollo local.

- ✅ corregido: `client/src/pages/home.tsx` fue retirado tras mover el shell SEO y composición a `client/src/app/router/home/home-page.tsx`; la composición principal del landing vive en `features/marketing-home/components/marketing-home-page`.
- ✅ corregido: `client/src/pages/*` dejó de ser runtime activo y `client/src/app/router/` quedó normalizado por dominios semánticos (`home`, `errors`, `company`, `knowledge`, `legal`, `services`, `solutions`).
- ✅ corregido: `client/src/components/route-wrapper.tsx` dejó de ser dependencia estructural del runtime; `AppRoutes` consume `client/src/app/router/lazy-route.tsx` y el wrapper legacy fue retirado.
- ✅ corregido: `client/src/app/App.tsx` y `client/src/app/router/lazy-route.tsx` ya consumen `client/src/shared/ui/{footer,toaster,skeleton}` como runtime final; dejaron de depender de wrappers equivalentes en `client/src/components/ui/*`.
- ✅ corregido: `client/src/app/router/solutions/*`, `client/src/features/proposals/components/proposal-request-page.tsx` y `client/src/features/contact/components/support-contact-page.tsx` ya consumen `client/src/shared/ui/{button,input,textarea,scroll-progress,whatsapp-button}`; los wrappers equivalentes en `client/src/components/ui/*` quedaron fuera de ese runtime activo.
- ✅ corregido: `client/src/features/contact/components/contact-section.tsx`, `client/src/features/testimonials/components/testimonials-section.tsx` y `client/src/features/payments/components/payment-error-dialog.tsx` ya consumen `client/src/shared/ui/{animated-shape,alert-dialog}`; los wrappers equivalentes en `client/src/components/ui/*` quedaron fuera de ese runtime activo.
- ✅ corregido: `client/src/app/router/home/home-page.tsx`, `client/src/app/router/company/studio-page.tsx`, `client/src/features/users/components/user-dashboard-page.tsx` y `client/src/features/auth/components/auth-verify-page.tsx` ya consumen `client/src/shared/ui/meta-tags.tsx`; `client/src/components/seo/meta-tags.tsx` quedó fuera del runtime activo.
- ✅ corregido: `client/src/features/users/components/user-dashboard-page.tsx` ya consume `client/src/shared/ui/whatsapp-button.tsx`; el wrapper equivalente en `client/src/components/ui/whatsapp-button.tsx` quedó fuera de ese runtime activo.
- ✅ corregido: `client/src/hooks/use-vacancies.ts` ya consume `client/src/shared/ui/use-toast`; `client/src/components/ui/use-toast/*` quedó fuera del runtime activo directo.
- ✅ corregido: `client/src/app/App.tsx` ya consume `client/src/shared/ui/skip-link.tsx`; `client/src/components/a11y/skip-link.tsx` quedó reducido a wrapper temporal de compatibilidad.
- ✅ corregido parcialmente: `client/src/shared/ui/command.tsx` ya concentra la implementación real; `client/src/components/ui/command.tsx` quedó reducido a wrapper temporal de compatibilidad.
- ✅ corregido parcialmente: `client/src/shared/ui/{form,calendar,carousel}.tsx` ya concentran la implementación real; `client/src/components/ui/{form,calendar,carousel}.tsx` quedaron reducidos a wrappers temporales de compatibilidad.
- ✅ corregido: `client/src/components/ui/{command,form,calendar,carousel}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final.
- ✅ corregido: `client/src/components/ui/{global-navbar,chart,aspect-ratio,input-otp}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; no correspondía mantenerlos como código muerto ni compatibilidad activa.
- ✅ corregido: `client/src/components/ui/{button,input,textarea,label,toast,toaster}` y `client/src/components/ui/use-toast/*` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final.
- ✅ corregido: `client/src/components/ui/{accordion,alert,alert-dialog,badge,card,checkbox}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final.
- ✅ corregido: `client/src/components/ui/{dialog,drawer,dropdown-menu,context-menu,popover,hover-card}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final.
- ✅ corregido: `client/src/components/ui/{animated-shape,avatar,breadcrumb,company-logo-slider,footer,loading-spinner}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` y `client/src/app/layout/*` quedaron como implementación final.
- ✅ corregido: `client/src/components/ui/{nav-dots,page-banner,pagination,particle-effect,progress,scroll-progress,separator,skeleton}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final.
- ✅ corregido: `client/src/components/ui/{collapsible,menubar,navigation-menu,radio-group,select,sheet}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final.
- ✅ corregido: `client/src/components/ui/{resizable,scroll-area,sidebar,slider,switch,table,tabs,toggle-group,toggle,tooltip,whatsapp-button}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedó como implementación final y `client/src/components/ui/*` dejó de participar del runtime frontend.
- ✅ corregido: `client/src/app/App.tsx` dejó de depender de `client/src/components/performance/*`; `ResourcePreload` y `MemoryManager` fueron reclasificados a `client/src/app/performance/*` como instrumentación propia del runtime de aplicación.
- ✅ corregido: `client/src/components/a11y/*` fue retirado tras confirmar ausencia de consumidores internos; `SkipLink` quedó consolidado en `client/src/shared/ui/skip-link.tsx` y el resto del paquete no participaba del runtime activo.
- ✅ corregido: `client/src/components/performance/*` fue retirado tras confirmar ausencia de consumidores internos; `ResourcePreload` y `MemoryManager` ya quedaron consolidados en `client/src/app/performance/*` y `DeferredContent`/`OptimizedImage` no participaban del runtime activo.
- ✅ corregido: `client/src/components/auth/{AdminRoute,DashboardRoute}.tsx` fue retirado tras confirmar ausencia de consumidores internos; la protección efectiva quedó resuelta en `features/*` y el paquete legacy dejó de participar del runtime frontend.
- ✅ corregido: la precondición de Fase 6 quedó satisfecha y la limpieza final de compatibilidad del runtime frontend quedó materializada sin consumidores legacy residuales.
- ✅ corregido: `package.json` dejó de exponer los scripts rotos `check-oauth`, `fix-oauth` y `setup:mp`; todos apuntaban a archivos inexistentes y agregaban ruido operativo sin valor de runtime.
- ✅ corregido: `package.json` dejó de exponer el script `deploy`, que mezclaba build con `git add/commit/push`; se retiró por no cumplir gobernanza enterprise ni trazabilidad operativa segura.
- ✅ corregido: `package.json` dejó de declarar dependencias sin referencias en el repo principal (`@emailjs/nodejs`, `@replit/vite-plugin-shadcn-theme-json`, `archiver`, `emailjs-com`, `extract-zip`, `highlight.js`, `image-size`, `input-otp`, `react-ga4`, `recharts`, `websocket`); se retiraron tras auditoría de uso real para reducir ruido y deuda de gobernanza.
- ✅ corregido: `package.json` dejó de declarar dependencias y tooling sin referencias en el repo principal (`express-static`, `puppeteer`, `nodemon`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-runtime-error-modal`); se retiraron tras auditoría de uso real en código, scripts y workflows.
- ✅ corregido: `package.json` dejó de declarar dependencias backend/infra sin consumidores detectables (`serve-static`, `passport-local`, `passport-google-oauth20`, `uuid`, `nanoid`, `sharp`, `ws`) junto con sus tipos asociados; se retiraron tras auditoría de uso real en código y configuración.
- ✅ corregido: `package.json` dejó de declarar dependencias sin consumidores detectables ni en runtime ni en configuración (`@sendgrid/mail` y `@jridgewell/trace-mapping`); se retiraron tras auditoría fina de código, scripts y configuración para seguir bajando riesgo de gobernanza.
- ✅ corregido: `scripts/smoke.mjs` dejó de heredar por defecto SMTP y Firebase Admin reales desde `.env`; ahora fuerza aislamiento con `DISABLE_SMTP_DELIVERY=true` y `DISABLE_FIREBASE_ADMIN=true`, con escape explícito vía `SMOKE_USE_REAL_SMTP=1` y `SMOKE_USE_REAL_FIREBASE=1` solo cuando se quiera probar infraestructura real.
- ✅ corregido: `firebase-functions-contacto/functions/src/index.ts` dejó de exponer `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID` y `EMAILJS_PRIVATE_KEY` hardcodeados; ahora exige configuración por entorno y queda explícito que ese subproyecto no debe versionar secretos en código.
- ✅ corregido: `legacy/php-api/webhooks/mercadopago.php` ahora valida el webhook con `validateMercadoPagoWebhook(...)` antes de procesarlo; el stack PHP legacy deja de aceptar notificaciones sin validación cuando existe `MERCADOPAGO_WEBHOOK_SECRET`.
- ✅ corregido: `legacy/php-api/config/firebase.php` ya no desactiva verificación TLS en cURL y dejó de caer a `VITE_FIREBASE_API_KEY` como bearer token para Firestore; el acceso legacy ahora falla cerrado si no puede obtener credenciales válidas.
- ✅ corregido: la re-auditoría arquitectónica confirmó que `legacy/` y `firebase-functions-contacto/` no participan del runtime ni de CI/CD principal; quedaron formalizados como superficies heredadas aisladas y congeladas fuera del stack Node activo.
- ✅ corregido: el workspace dejó de arrastrar artefactos generados ignorados (`dist/`, `dist-server/`, `logs/`, `.firebase/`, `client/dist`, `firebase-functions-contacto/functions/lib`, `ts_errors*.log`, reporte Lighthouse local); ya no suman ruido operativo sobre el estado real del repo.
- ✅ corregido: `.replit` fue retirado tras confirmar que solo describía workflows obsoletos de Replit y no tenía consumidores en código, scripts ni documentación operativa del stack actual.
- ✅ corregido: `php-temp/` fue retirado del workspace tras confirmar que era solo tooling local heredado sin integración con el runtime, CI/CD ni scripts activos del repo principal.
- ✅ corregido: `eslint.config.mjs` ahora expone `@typescript-eslint/no-explicit-any` en modo `error`; el repo ya no conserva `any` explícitos ni `z.any()` y la deuda de tipado queda cerrada con enforcement real en lint.
- ✅ corregido parcialmente: `README.md`, `docs/ARCHITECTURE.md`, `docs/CONFIGURATION.md` y el fallback visible de `client/src/features/marketing-home/components/marketing-home-page.tsx` ya no conservan texto roto por encoding heredado; la documentacion operativa base y el copy visible del landing quedaron legibles en ASCII estable.
- ✅ corregido parcialmente: el root ya no conserva duplicados binarios de frontend (`dashboardtuwebai.png`, `safespot.png`, `trading-tuwebai.png`, `image_perfil.jpg`) ni el residuo sin referencias `generated-icon.png`; los assets publicos canonicos quedan en `client/public/*` y el build los sigue emitiendo a `dist/` sin cambiar rutas.
- ✅ corregido parcialmente: `docs/MARKETING_HOME_RESPONSIBILITY_MAP.md` y `docs/RESTRUCTURE_MAP.md` dejaron de formar parte del flujo operativo; ambas quedaron retiradas por ser mapas historicos 100% materializados y solo agregaban ruido documental.
- ✅ corregido parcialmente: la re-auditoria del root confirmo que las configs restantes en raiz (`vite.config.ts`, `netlify.toml`, `tailwind.config.ts`, `postcss.config.js`, `firebase.json`, `.lighthouserc.json`, `Dockerfile.*`, `docker-compose.yml`, `tsconfig*`) siguen siendo operativas o forman parte de workflows vigentes; no quedaron duplicados raiz muertos adicionales para retirar.
- ✅ corregido parcialmente: `dist/` y `logs/` siguen clasificados como ruido local ignorado del workspace; no se versionan y su limpieza no cambia el estado del repo, aunque en esta corrida el entorno bloqueo su borrado automatico.
- ✅ corregido parcialmente: `docs/TECHNICAL_RISK_SCORE.md` fue re-auditado contra el estado real post-cierre de runtime, tipado y cleanup documental; `Mantenibilidad` bajó a `4/10` y `Deuda tecnica` a `5/10`, manteniéndose `Arquitectura` y `Gobernanza` en `4/10` y `Escalabilidad` en `5/10`.
- ✅ corregido parcialmente: `client/src/features/auth/context/AuthContext.tsx`, `client/src/features/auth/hooks/use-auth-mutations.ts` y `client/src/features/auth/hooks/use-auth-queries.ts` ya no usan `Promise<any>`, `err: any` ni `oldData: any`; auth frontend quedó cerrada en su primer slice de tipado sin cambios funcionales.
- ✅ corregido parcialmente: `server/src/middlewares/firebase-auth.middleware.ts` ya no usa `(decoded as any)` ni `catch (error: any)`; ahora tipa `AuthUser` con `DecodedIdToken`, normaliza errores con `unknown` y mantiene el mismo contrato HTTP.
- ✅ corregido parcialmente: `server/index.ts` ya no usa `(req.session as any)` en el logging de auth; la sesión quedó tipada mediante augmentación mínima de `express-session` y `tsconfig.server.json` incorpora `server/**/*.d.ts`.
- ✅ corregido parcialmente: `server/src/modules/users/controller.ts` ya no usa `catch (error: any)` ni `sort((a: any, b: any) => ...)`; el módulo quedó tipado con documentos mínimos de `users`, `preferences` y `payments` sin alterar rutas ni respuestas.
- ✅ corregido parcialmente: `server/src/modules/support/controller.ts` ya no usa `catch (error: any)` ni `sort((a: any, b: any) => ...)`; el módulo quedó tipado con documentos mínimos de tickets y responses sin alterar rutas ni respuestas.
- ✅ corregido parcialmente: `server/src/modules/testimonials/controller.ts` ya no usa `catch (error: any)` ni `sort((a: any, b: any) => ...)`; el módulo quedó tipado con documentos mínimos de testimonios y actualizaciones sin alterar rutas ni respuestas.
- ✅ corregido parcialmente: `server/src/modules/projects/controller.ts` ya no usa `catch (error: any)` ni `sort((a: any, b: any) => ...)`; el módulo quedó tipado con documentos mínimos de proyectos y actualizaciones sin alterar rutas ni respuestas.
- ✅ corregido parcialmente: `server/src/modules/contact/controller.ts` ya no usa `catch (error: any)`; el módulo normaliza errores con `unknown` y `getErrorMessage(...)` sin alterar rutas ni respuestas de contacto, propuesta o aplicaciones.
- ✅ corregido parcialmente: `server/src/modules/newsletter/controller.ts` ya no usa `catch (error: any)`; el módulo normaliza errores con `unknown` y `getErrorMessage(...)` sin alterar rutas ni respuestas de suscripción.
- ✅ corregido parcialmente: `server/src/controllers/payment.controller.ts` ya no usa `catch (error: any)` ni `catch (apiError: any)`; el controller normaliza errores con `unknown`, preserva el tratamiento especial de `Plan invalido` y mantiene intactos los contratos HTTP y el flujo de webhooks.
- ✅ corregido parcialmente: `server/src/controllers/contact.controller.ts` ya no usa `catch (error: any)`; el controller normaliza errores con `unknown` y `getErrorMessage(...)` sin alterar rutas ni respuestas de contacto, consulta o test SMTP.
- ✅ corregido parcialmente: `server/src/services/webhook-idempotency.service.ts` ya no usa `catch (error: any)`; el servicio tipa errores como `unknown`, detecta códigos de Firestore/fs con narrowing local y mantiene intacta la estrategia de idempotencia con fallback a filesystem.
- ✅ corregido parcialmente: `server/src/utils/logger.ts` ya no usa `writeLog(data: any)`; el utilitario acepta `unknown`, manteniendo intacta la serialización JSON y el contrato operativo de logging.
- ✅ corregido parcialmente: `client/src/features/users/components/user-dashboard-page.tsx` ya no usa `catch (error: any)`; el panel normaliza errores con `unknown` y `getErrorMessage(...)` sin alterar flujos de perfil, contraseña, preferencias, imagen ni logout.
- ✅ corregido parcialmente: `client/src/app/performance/memory-manager.tsx` ya no usa `window.performance as any`; el runtime tipa la API de memoria del navegador con una extensión local mínima sin alterar el monitoreo existente.
- ✅ corregido parcialmente: `client/src/app/router/solutions/uxui-page.tsx` ya no usa `window as any` para `isUsingGlobalNav`; la página tipa esa bandera con una extensión mínima de `Window` sin alterar el runtime del navbar.
- ✅ corregido parcialmente: `client/src/lib/performance.ts` ya no usa `entry: any` para CLS; el tracking tipa `layout-shift` con una extensión mínima de `PerformanceEntry` sin alterar las métricas reportadas.
- ✅ corregido parcialmente: `client/src/types/index.d.ts` ya no usa `asNavFor?: any` en el shim de `react-slick`; el tipado externo quedó cerrado con `Slider | null` y el runtime activo del repo ya no conserva usos explícitos de `any`.
- ✅ corregido parcialmente: `server/src/schemas/api.schemas.ts` ya no usa `z.any()` en `ticket.responses` ni `project.phases`; los tickets quedaron validados con un schema abierto y consistente con el runtime real, y `phases` quedó como arreglo de objetos abiertos sin inventar un contrato más estricto del soportado hoy.
- ✅ corregido: auth ya sincroniza de forma canónica el avatar real de Google desde Firebase en `AuthContext` y `useGoogleLoginMutation`; las cuentas Google existentes refrescan `user.image` y el panel dejó de rehidratar fotos viejas desde `localStorage`, por lo que navbar, panel y consumidores globales vuelven a mostrar la foto real de la cuenta cuando corresponde.
- ✅ corregido: el resync de avatar Google ya no reutiliza ciegamente documentos históricos de usuario devueltos por backend; auth recompone un `User` canónico desde Firebase antes del `PUT /api/users/:uid`, evitando que registros legacy incompletos degraden el payload o rompan la persistencia del avatar global.
- ✅ corregido: las cuentas Google ya no degradan `image` a vacío por snapshots transitorios; el source of truth del avatar prioriza `photoURL` real y conserva la última imagen canónica si Firebase no la expone en ese instante.
- ✅ corregido: `server/src/middlewares/validate.middleware.ts` ya emite `users.upsert.validation_failed` con `uid`, `bodyKeys` e issues cuando falla la validación de `PUT /api/users/:uid`, dejando trazabilidad inmediata para futuros casos de avatar roto o payload inválido.
- ✅ corregido: `client/src/shared/ui/whatsapp-button.tsx` ya usa el isotipo real de WhatsApp también en el popup flotante y el número canónico quedó centralizado en `client/src/shared/constants/contact.ts` como `5493571417960`, reemplazando hardcodes de `wa.me`, `tel:` y metadatos SEO en los consumers activos.
- âœ… corregido: `docs/ARCHITECTURE.md` y `AGENTS.md` ya fijan que `ui-ux-pro-max-skill/` debe auditarse como referencia visual premium para cambios de UI/UX, pero siempre prevalece la identidad y la paleta visual de TuWeb.ai.
- ✅ corregido: el popup y el botón flotante de WhatsApp ya reutilizan el mismo SVG canónico desde `client/src/shared/ui/whatsapp-icon.tsx`, dejando una sola fuente visual para el isotipo en toda la app.
- ✅ corregido: los últimos hardcodes activos del teléfono viejo quedaron retirados de `client/src/features/contact/components/contact-section.tsx` y `client/src/app/router/legal/privacy-policy-page.tsx`; ambos consumen ahora `TUWEBAI_WHATSAPP_DISPLAY` como fuente canónica global.
- ✅ corregido: el panel de usuario ya no expone cambio de tema claro/oscuro; `client/src/core/theme/ThemeContext.tsx` fija `dark` como tema canónico global y `/panel` deja el modo oscuro como identidad visual estable de TuWeb.ai.
- ✅ corregido: el avatar de cuentas Google ya no depende del render directo a `lh3.googleusercontent.com`; `server/src/modules/users/controller.ts` expone un proxy restringido a hosts de avatar de Google y `client/src/shared/ui/user-avatar.tsx` consume esa URL canónica en navbar y panel, con degradación controlada a iniciales si una carga puntual falla.
- ✅ corregido: el avatar Google no fallaba por base de datos sino por política global de `Origin`; `server/index.ts` ahora permite `GET /api/users/avatar` sin cabecera `Origin`, que es válido para cargas de `<img>`, y la ruta sigue blindada por whitelist estricta de hosts en el controller.
- ✅ corregido: `docs/PANEL_SETTINGS_REMEDIATION_PLAN.md` ya refleja el estado real del producto; `darkMode` e `language` quedaron cerrados como frentes descartados por decision de producto y el siguiente frente util del panel pasa a ser comunicaciones/copy.
- ✅ corregido: `/panel` ya no expone selector de idioma ni wiring parcial asociado; `client/src/app/providers/AppProviders.tsx` y `client/src/shared/ui/meta-tags.tsx` volvieron a idioma estable del producto para no reabrir una preferencia descartada.
- ✅ corregido: `/panel` ya no conserva UI residual de `Apariencia`; el tab de preferencias quedo reducido al frente real de comunicaciones y deja de mostrar contenido basura de tema/idioma ya descartados.
- ✅ corregido: la arquitectura de informacion del `/panel` ya quedo auditada en `docs/PANEL_INFORMATION_ARCHITECTURE_PLAN.md`; `Preferencias` se redefine como espacio de privacidad/experiencia/accesibilidad y cualquier nueva tab queda condicionada a dominio operativo real.
- ✅ corregido: la Fase 0 de `docs/PANEL_INFORMATION_ARCHITECTURE_PLAN.md` quedo cerrada; el `/panel` ya no acepta expansion de tabs o toggles sin efecto real y el siguiente frente util queda acotado a reemplazar `Comunicaciones` por preferencias con semantica operativa verdadera.

- ✅ corregido: la Fase 1 del plan de arquitectura del `/panel` ya quedo cerrada; `Comunicaciones` fue retirada del runtime porque solo exponia persistencia nominal sin comportamiento real y `Preferencias` deja de mostrar toggles fake.
- ✅ corregido: la Fase 2 del plan de arquitectura del `/panel` ya quedo cerrada; la tab generica `Preferencias` fue reemplazada en runtime por `Privacidad`, alineando la navegacion con controles sensibles reales y evitando mezclar ajustes decorativos con configuraciones de datos personales.
- ✅ corregido: el frontend ya no conserva infraestructura viva del viejo modelo `userPreferences`; `AuthContext`, query, mutation, servicios y tipos del cliente asociados a `/api/users/:uid/preferences` fueron retirados tras confirmar ausencia total de consumidores reales desde que el panel dejo de usar preferencias fake.
- ✅ corregido parcialmente: el dominio `Privacidad` ya fue re-auditado de punta a punta y quedo bajado a `docs/PRIVACY_DOMAIN_IMPLEMENTATION_PLAN.md`; el plan separa `Privacidad` del contrato legacy `/api/users/:uid/preferences`, define un modelo propio y ordena la implementacion por fases chicas sin reabrir toggles descartados.
- ✅ corregido parcialmente: la Fase 1 del dominio `Privacidad` ya quedo materializada sin reciclar `preferences`; `server/src/modules/users/routes.ts`, `server/src/modules/users/controller.ts` y `server/src/schemas/api.schemas.ts` ya exponen `GET/PUT /api/users/:uid/privacy` sobre `users/{uid}.privacy`, y el cliente ya tiene frontera propia en `client/src/features/users/{types,services,hooks}/privacy*` sin tocar todavia la UI de la tab.
- ✅ corregido parcialmente: `docs/PRIVACY_DOMAIN_IMPLEMENTATION_PLAN.md` ya no deja la Fase 1 en estado ambiguo; el diagnostico y el orden recomendado quedaron alineados al estado real del repo, donde el dominio `privacy` ya existe a nivel tecnico pero aun no gobierna la UI del panel.
- ✅ corregido parcialmente: la Fase 2 del dominio `Privacidad` ya quedo cerrada con cambios minimos y verificables; `client/src/features/users/components/privacy-tab.tsx` ya gobierna `profileEmailVisible` y `profileStatusVisible`, y el encabezado de `client/src/features/users/components/user-dashboard-page.tsx` oculta o muestra email y badge de estado segun la configuracion persistida del usuario.
- ✅ corregido: el `404` de los toggles de `Privacidad` no provenia del dominio nuevo sino del runtime local de desarrollo; `package.json` ahora levanta backend con `tsx watch server/index.ts` para no seguir sirviendo una version vieja del server, y `scripts/smoke.mjs` ya cubre `GET/PUT /api/users/:uid/privacy` para que una ruta nueva no vuelva a quedar fuera de los gates.
- ✅ corregido parcialmente: la Fase 3 del dominio `Privacidad` ya quedo cerrada sin abrir deuda de enforcement; `client/src/features/users/components/privacy-tab.tsx` ya persiste `marketingConsent` y `analyticsConsent`, y el panel los presenta con copy legal alineado a `politica-privacidad` y `politica-cookies` sin prometer side effects fuera de la cuenta mientras Fase 4 siga pendiente.
- ✅ corregido: la UX interna de la tab `Privacidad` ya no apila bloques sensibles en una sola columna larga; `client/src/features/users/components/privacy-tab.tsx` ahora usa un sidebar interno por secciones y contenido exclusivo por panel para que `Visibilidad` y `Consentimientos` no queden visualmente pegados ni compitan entre si.
- ✅ corregido: la tab `Privacidad` ya no fuerza layout lateral antes de tiempo ni hereda `whitespace-nowrap` en sus secciones internas; `client/src/features/users/components/privacy-tab.tsx` ahora apila contenido hasta `1440px`, permite wrap real en los labels del sidebar y elimina copy tecnico innecesario para usuario final.
- ✅ corregido: la tab `Privacidad` ya no usa un pseudo-sidebar de tarjetas sueltas; `client/src/features/users/components/privacy-tab.tsx` ahora organiza la navegacion interna como centro de privacidad con grupos colapsables, chevron y subitems compactos, alineando mejor el panel con un patron enterprise de secciones sensibles.
- ? corregido parcialmente: `user-dashboard-page.tsx` ya quedo catalogado como monolito critico del panel; `docs/USER_DASHBOARD_DECOMPOSITION_PLAN.md` define la descomposicion por fases y el primer slice extrae shell compartido antes de tocar tabs funcionales.
- ? corregido parcialmente: la descomposicion de `user-dashboard-page.tsx` avanzo sin cambio funcional; la Fase 2 del plan ya extrae la tab `Perfil` a `client/src/features/users/components/user-profile-tab.tsx` y deja el contenedor mas cerca de un orquestador.
- ? corregido parcialmente: la descomposicion de `user-dashboard-page.tsx` siguio sin mezclar cambios funcionales; la Fase 3 del plan ya extrae la tab `Seguridad` a `client/src/features/users/components/user-security-tab.tsx` y reduce mas el acoplamiento del contenedor principal.
- ? corregido parcialmente: la descomposicion de `user-dashboard-page.tsx` siguio sin introducir wiring nuevo; la Fase 4 del plan ya extrae la tab `Integraciones` a `client/src/features/users/components/user-integrations-tab.tsx` y deja el contenedor principal casi solo como orquestador.
- ? corregido parcialmente: la Fase 5 de la descomposicion ya extrae helpers puros del panel; `client/src/features/users/utils/user-dashboard-forms.ts` centraliza factories y validadores, evitando duplicacion de estado inicial y reglas embebidas en `user-dashboard-page.tsx`.
- ? corregido: la descomposicion estructural del panel ya quedo cerrada; `user-dashboard-page.tsx` funciona como orquestador, bajo a 348 lineas y las tabs principales ya viven en subcomponentes dedicados sin romper el comportamiento del panel.
