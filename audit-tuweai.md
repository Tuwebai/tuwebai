# AuditorÃ­a TÃ©cnica del Proyecto Tuwebai

## Resumen Ejecutivo

**ClasificaciÃ³n general:** Riesgoso

El proyecto tiene una base funcional y un frontend con bastante trabajo visual ya integrado, pero el repositorio presenta seÃ±ales claras de crecimiento sin consolidaciÃ³n arquitectÃ³nica. Hoy conviven en el mismo repo:

- un frontend React/Vite en `client/`
- un backend Express/TypeScript en `server/`
- un stack PHP legacy en `api/` âœ… corregido: aislado en `legacy/php-api/`; `api/` hoy aparece solo como residuo local vacÃ­o sin archivos versionados
- una Cloud Function separada en `firebase-functions-contacto/`
- artefactos compilados, binarios, reportes, logs y credenciales en raÃ­z âœ… corregido parcialmente: builds/reportes/logs generados, tooling local heredado y el secreto local Firebase Admin ya fueron limpiados del workspace; persisten solo variables sensibles en `.env`

Eso eleva el costo de mantenimiento, debilita la gobernanza y deja riesgos concretos de seguridad, despliegue y escalabilidad.

### Estado real del proyecto

- El frontend principal compila y `eslint` pasa.
- El backend actual compila con `esbuild`.
- El smoke test pasa, pero no es una garantÃ­a suficiente de salud sistÃ©mica.
- `tsc` **no** valida el backend, porque [`tsconfig.json`](./tsconfig.json) solo incluye `client/src`. âœ… corregido
- Existen rutas sensibles del backend sin autenticaciÃ³n suficiente. âœ… corregido
- El repositorio contiene cÃ³digo legacy operativo o semihuÃ©fano que compite con la implementaciÃ³n principal. âœ… corregido parcialmente: stack PHP aislado en `legacy/`

### Validaciones ejecutadas

- `npm run check`
- `npm run lint`
- `npm run build:backend`
- `npm run smoke`
- `npm outdated --json`
- inventario completo de archivos y revisiÃ³n manual de rutas, controladores, servicios, config y workflows

### Riesgos dominantes

1. ExposiciÃ³n de datos por endpoints sin auth consistente. âœ… corregido
2. Backend con cobertura de calidad incompleta. âœ… corregido
3. Deploy/config rotos o ambiguos por duplicaciÃ³n de stacks y archivos. âœ… corregido parcialmente
4. Repositorio contaminado con basura operativa, binarios y secretos. âœ… corregido parcialmente

---

## Arquitectura Actual

### Estructura real

```text
/
â”œâ”€ client/                         # Frontend React/Vite
â”œâ”€ server/                         # Backend Express/TypeScript
â”œâ”€ api/                            # Residuo local vacÃ­o sin archivos versionados âœ… corregido: removido del versionado
â”œâ”€ firebase/                       # Reglas/config Firestore
â”œâ”€ firebase-functions-contacto/    # Cloud Function separada
â”œâ”€ scripts/                        # Smoke/log scripts
â”œâ”€ docs/                           # AuditorÃ­as y documentaciÃ³n
â”œâ”€ dist/                           # Build frontend versionado âœ… corregido: ya no persistido en workspace tras validaciones
â”œâ”€ dist-server/                    # Build backend versionado âœ… corregido: removido del versionado y limpiado del workspace
â”œâ”€ node_modules/                   # Dependencias instaladas dentro del repo
â”œâ”€ php-temp/                       # Runtime PHP completo dentro del repo âœ… corregido: removido del versionado
â””â”€ raÃ­z                            # Configs, imÃ¡genes, reports, secrets âœ… corregido parcialmente
```

### Lectura arquitectÃ³nica

- No es un monorepo gobernado; es un repositorio Ãºnico con mÃºltiples stacks mezclados.
- Hay dos backends potenciales para varias capacidades: `server/` y `api/`. âœ… corregido: PHP movido a `legacy/` y `api/` quedÃ³ reducido a residuo local vacÃ­o sin archivos versionados ni uso operativo
- Hay dos centros de configuraciÃ³n frontend: [`vite.config.ts`](./vite.config.ts) y el antiguo `client/vite.config.ts`. âœ… corregido: la configuraciÃ³n duplicada de `client/` fue retirada y la raÃ­z quedÃ³ como Ãºnica fuente oficial
- Hay dos configuraciones Netlify: [`netlify.toml`](./netlify.toml) y el antiguo `client/netlify.toml`. âœ… corregido: la configuraciÃ³n duplicada de `client/` fue retirada y la raÃ­z quedÃ³ como Ãºnica fuente oficial
- El frontend usa una mezcla de `contexts`, `hooks`, `services` y acceso directo a API desde componentes/pÃ¡ginas. âœ… corregido parcialmente: frontera `app/core/features/shared` preparada, migraciÃ³n de consumers pendiente
- El backend concentraba demasiada responsabilidad en `server/src/controllers/public.controller.ts`. âœ… corregido: dominios extraÃ­dos a `server/src/modules/` y la fachada temporal fue retirada tras quedar sin consumidores

### EvaluaciÃ³n de escalabilidad

**No estÃ¡ preparado para escalar con seguridad** en equipo, features o trÃ¡fico sin una fase de consolidaciÃ³n previa.

Motivos:

- lÃ­mites de capa poco claros âœ… corregido parcialmente
- contratos dÃ©biles entre frontend y backend
- ausencia de frontera clara entre cÃ³digo vigente y cÃ³digo legacy âœ… corregido parcialmente
- cobertura insuficiente de validaciones estÃ¡ticas y automatizadas âœ… corregido parcialmente
- superficie de despliegue duplicada

---

## Problemas CrÃ­ticos

### 1. âœ… Endpoints sensibles expuestos sin autorizaciÃ³n suficiente

**Impacto:** A - CrÃ­tico

En [`server/src/routes/public.routes.ts`](./server/src/routes/public.routes.ts):

- lÃ­nea 106: `GET /api/tickets/:ticketId` no exige auth âœ… corregido
- lÃ­nea 123: `PUT /api/projects/:projectId` no exige auth âœ… corregido
- lÃ­nea 124: `GET /api/projects` no exige auth âœ… corregido
- lÃ­nea 125: `GET /api/tickets` no exige auth âœ… corregido

Esas rutas delegaban directamente a Firestore desde el viejo `server/src/controllers/public.controller.ts`, por ejemplo:

- lÃ­nea 471: `handleGetTicketById`
- lÃ­nea 486: `handleGetAllProjects`
- lÃ­nea 505: `handleGetAllTickets`
- lÃ­nea 395: `handleUpdateProject`

Resultado:

- lectura global de tickets/proyectos sin identidad validada âœ… corregido
- modificaciÃ³n de proyectos sin middleware de auth âœ… corregido
- posible exposiciÃ³n de datos de clientes y operaciÃ³n interna

### 2. âœ… El typecheck oficial no cubre el backend

**Impacto:** A - CrÃ­tico

[`tsconfig.json`](./tsconfig.json) lÃ­nea 29:

```json
"include": ["client/src"]
```

Pero el proyecto vende la sensaciÃ³n de control con `npm run check`, CI y deploy gates. En realidad:

- `npm run check` valida solo frontend âœ… corregido
- `eslint` valida solo `client/src` âœ… corregido
- el backend puede degradarse sin quedar bloqueado por los quality gates âœ… corregido

### 3. âœ… Docker/backend static serving inconsistente y probablemente roto

**Impacto:** A - CrÃ­tico

Hallazgos:

- no existe carpeta `public/` en raÃ­z âœ… corregido
- [`server/index.ts`](./server/index.ts) lÃ­neas 304 y 306 sirven `../public` âœ… corregido
- [`Dockerfile.backend`](./Dockerfile.backend) lÃ­nea 21 intenta copiar `/app/public` âœ… corregido

Eso deja tres riesgos:

- el `favicon` del backend falla en runtime âœ… corregido
- el `express.static` apunta a un directorio inexistente âœ… corregido
- el build de Docker backend queda inconsistente respecto a la estructura real del repo âœ… corregido

### 4. Repositorio con credencial sensible y fallback inseguro a archivo local

**Impacto:** A - CrÃ­tico

Existe [`firebase-service-account.json`](./firebase-service-account.json) en raÃ­z. âœ… corregido: retirado del workspace tras confirmar que el server ya opera con credencial inline y `applicationDefault()` sin depender del archivo fÃ­sico local

AdemÃ¡s, el stack PHP legacy usa fallback explÃ­cito al archivo local: âœ… corregido parcialmente al aislarse el stack en `legacy/`

- [`legacy/php-api/config/firebase.php`](./legacy/php-api/config/firebase.php) lÃ­nea 28
- [`legacy/php-api/config/firebase.php`](./legacy/php-api/config/firebase.php) lÃ­nea 284

Aunque `.gitignore` lo ignora, su presencia fÃ­sica en el repo de trabajo es una mala prÃ¡ctica de alto riesgo y fomenta dependencia operativa en secretos locales. âœ… corregido

### 5. âœ… CÃ³digo legacy PHP con prÃ¡cticas inseguras sigue coexistiendo

**Impacto:** A - CrÃ­tico

En [`legacy/php-api/config/firebase.php`](./legacy/php-api/config/firebase.php):

- lÃ­nea 88: `CURLOPT_SSL_VERIFYPEER` en `false`
- lÃ­nea 340: fallback a `VITE_FIREBASE_API_KEY` como token

En [`legacy/php-api/webhooks/mercadopago.php`](./legacy/php-api/webhooks/mercadopago.php):

- procesa pagos y notifica dashboard en paralelo al stack Node actual

Esto no solo es deuda tÃ©cnica: es **riesgo activo** si ese cÃ³digo sigue desplegado o es reactivable. âœ… corregido parcialmente mediante aislamiento del stack

---

## Archivos Basura

### Safe to delete

- `generated-icon.png`
  - sin referencias detectadas
- `ts_errors.log`
  - sin referencias detectadas âœ… corregido: limpiado del workspace
- `dist/`
  - artefacto compilado âœ… corregido: limpiado del workspace
- `dist-server/`
  - artefacto compilado âœ… corregido: limpiado del workspace
- `node_modules/`
  - dependencia instalada, no debe vivir en repo
- `logs/`
  - datos operativos locales âœ… corregido: patrÃ³n protegido por `.gitignore` y artefactos locales limpiados
- `php-temp/`
  - runtime/binarios de PHP, no corresponde versionarlo âœ… corregido

### Needs review

- `api/`
  - residuo local vacÃ­o, sin archivos versionados ni despliegue asociado âœ… corregido: ya no representa stack activo del repo
- `firebase-functions-contacto/functions/lib/`
  - build compilado dentro de subproyecto âœ… corregido
- `client/vite.config.ts`
  - configuraciÃ³n duplicada respecto a raÃ­z âœ… corregido: retirada tras confirmar ausencia de consumidores
- `client/netlify.toml`
  - configuraciÃ³n duplicada respecto a raÃ­z âœ… corregido: retirada tras confirmar ausencia de consumidores
- `tuweb-ai.com-20260305T235948.json`
  - reporte Lighthouse puntual; Ãºtil solo si se versiona deliberadamente âœ… corregido: patrÃ³n ignorado y artefacto local limpiado
- `.replit`
  - resto de entorno anterior; no integra con el stack vigente âœ… corregido: retirado tras confirmar ausencia de consumidores en el repo actual
- imÃ¡genes duplicadas en raÃ­z y `client/public/`
  - `dashboardtuwebai.png`, `safespot.png`, `trading-tuwebai.png`, `image_perfil.jpg`

---

## CÃ³digo Muerto

### Archivos o mÃ³dulos sin integraciÃ³n visible

- [`client/src/components/auth/AdminRoute.tsx`](./client/src/components/auth/AdminRoute.tsx)
  - no se encontrÃ³ consumo desde el Ã¡rbol principal
- [`client/src/components/auth/DashboardRoute.tsx`](./client/src/components/auth/DashboardRoute.tsx)
  - mismo caso
- [`client/src/types/admin.ts`](./client/src/types/admin.ts)
  - sin referencias detectadas
- [`client/src/lib/gtag.ts`](./client/src/lib/gtag.ts)
  - coexistencia con [`client/src/lib/analytics.ts`](./client/src/lib/analytics.ts), pero sin integraciÃ³n clara

### Zombies parciales

- [`client/src/pages/panel-usuario.tsx`](./client/src/pages/panel-usuario.tsx)
  - integra UI de â€œGoogle / Facebook / GitHubâ€, â€œAPI Key de desarrolloâ€ y â€œPrÃ³ximamenteâ€ sin backend real
  - lÃ­nea 422 devuelve una fecha hardcodeada: `12 de julio de 2025`
- [`client/src/pages/auth-verify.tsx`](./client/src/pages/auth-verify.tsx) âœ… corregido parcialmente: API directa movida a `features/auth/services`
  - muestra flujo de reset, pero termina llamando a un stub no soportado
- [`client/src/contexts/AuthContext.tsx`](./client/src/contexts/AuthContext.tsx) âœ… corregido: eliminado tras quedar sin consumidores runtime directos
  - lÃ­nea 256 define `resetPassword` que solo muestra toast: no implementa el caso esperado por la UI

### Deuda de tipado / limpieza

- uso extendido de `any` en backend y frontend
- `@ts-ignore` en slider/testimonials
- imports y helpers duplicados entre `AuthContext`, hooks de auth y servicios

---

## Dependencias ProblemÃ¡ticas

ClasificaciÃ³n basada en `package.json`, bÃºsqueda de uso en cÃ³digo y `npm outdated --json`.

### Critical

- `express-static`
  - dependencia sospechosa y sin uso
  - ademÃ¡s se usa `serve-static`, por lo que parece redundante o equivocada
- `firebase-service-account.json` + dependencia operativa de `firebase-admin`
  - no es un problema de versiÃ³n, sino de gobernanza de secretos âœ… corregido parcialmente

### Should update

- `vite`, `react-router-dom`, `@tanstack/react-query`, `mercadopago`, `firebase-admin`, `nodemailer`, `express-rate-limit`, `tsx`
  - no urge migraciÃ³n mayor inmediata, pero hay rezago visible
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

ObservaciÃ³n:

- varias dependencias figuran instaladas pero no tienen referencias de runtime detectables en el cÃ³digo revisado
- conviene confirmar con `knip` o `depcheck` antes de remover

---

## Bugs Potenciales

### Critical

- Endpoints sin auth suficiente en backend âœ… corregido
- `Dockerfile.backend` y `server/index.ts` apuntan a `public/` inexistente âœ… corregido
- `handleDeleteTestimonial` usaba `delete()` hard delete en el antiguo `server/src/controllers/public.controller.ts` lÃ­nea 590, violando la polÃ­tica de soft delete âœ… corregido

### Medium

- [`client/src/pages/auth-verify.tsx`](./client/src/pages/auth-verify.tsx) expone UX de reset que no ejecuta el caso real
- [`client/src/lib/http-client.ts`](./client/src/lib/http-client.ts) lÃ­nea 105 fuerza `credentials: 'include'`
  - puede causar comportamiento inconsistente en CORS/cookies si el backend no usa cookies como mecanismo principal âœ… corregido: `http-client.ts` y `queryClient.ts` ya usan `same-origin` por defecto y dejan `credentials` como opt-in explicito
- [`client/src/pages/contacto.tsx`](./client/src/pages/contacto.tsx) y [`client/src/components/ui/newsletter-form.tsx`](./client/src/components/ui/newsletter-form.tsx)
  - muestran Ã©xito optimista antes de confirmar respuesta del backend
- [`scripts/smoke.mjs`](./scripts/smoke.mjs)
  - usa `.env` local si estÃ¡ presente y consulta Firestore real / SMTP real, por lo que no es un smoke aislado

### Low

- `console.log`/`console.debug` todavÃ­a presentes en config y utilidades
- encoding daÃ±ado en mÃºltiples archivos (`ÃƒÂ³`, `ÃƒÂ¡`, etc.), sÃ­ntoma de manejo inconsistente de charset
- README prÃ¡cticamente vacÃ­o
- `client/src/lib/firebase.ts` podÃ­a disparar `auth/invalid-api-key` cuando `vite.config.ts` leÃ­a `VITE_*` desde `client/` en lugar de la raÃ­z del repo âœ… corregido: `vite.config.ts` ahora usa `envDir: ".."` con `root: "./client"` y `firebase.ts` valida variables requeridas antes de inicializar Firebase

---

## Deuda TÃ©cnica

### 1. Archivos demasiado grandes

Frontend:

- `client/src/pages/servicios/posicionamiento-marketing.tsx`
- `client/src/pages/servicios/automatizacion-marketing.tsx`
- `client/src/pages/servicios/desarrollo-web.tsx`
- `client/src/pages/panel-usuario.tsx`
- `client/src/pages/consulta.tsx` âœ… corregido parcialmente: API directa movida a `features/proposals/services`

Backend:

- `server/src/controllers/public.controller.ts` âœ… corregido: descompuesto por dominio y retirado tras quedar sin consumidores

Esto indica:

- demasiadas responsabilidades por archivo
- baja reutilizaciÃ³n de lÃ³gica
- difÃ­cil testing unitario
- riesgo alto de regresiÃ³n al tocar cualquier feature

### 2. Capa UI violando frontera de datos

Hay imports directos de `backendApi` en componentes/pÃ¡ginas, por ejemplo:

- [`client/src/pages/contacto.tsx`](./client/src/pages/contacto.tsx) âœ… corregido parcialmente: API directa movida a `features/contact/services`
- [`client/src/pages/consulta.tsx`](./client/src/pages/consulta.tsx) âœ… corregido parcialmente: API directa movida a `features/proposals/services`
- [`client/src/pages/auth-verify.tsx`](./client/src/pages/auth-verify.tsx)
- [`client/src/components/ui/newsletter-form.tsx`](./client/src/components/ui/newsletter-form.tsx) âœ… corregido parcialmente: API directa movida a `features/newsletter/services`
- [`client/src/hooks/use-toast.ts`](./client/src/hooks/use-toast.ts) âœ… corregido: eliminado tras redirigir sus consumidores a `shared/ui/use-toast`
- [`client/src/hooks/use-mobile.tsx`](./client/src/hooks/use-mobile.tsx) âœ… corregido: eliminado tras redirigir sus consumidores a `core/hooks/use-mobile`
- [`client/src/hooks/use-intersection-observer.tsx`](./client/src/hooks/use-intersection-observer.tsx) âœ… corregido: eliminado tras redirigir sus consumidores a `core/hooks/use-intersection-observer`
- [`client/src/contexts/ThemeContext.tsx`](./client/src/contexts/ThemeContext.tsx) âœ… corregido: eliminado tras redirigir su consumidor a `core/theme/ThemeContext`
- [`client/src/components/sections/pricing-section.tsx`](./client/src/components/sections/pricing-section.tsx) âœ… corregido: runtime migrado a `features/payments/components/pricing-section.tsx`
- [`client/src/components/sections/contact-section.tsx`](./client/src/components/sections/contact-section.tsx) âœ… corregido: runtime migrado a `features/contact/components/contact-section.tsx`
- [`client/src/components/payment/payment-return-view.tsx`](./client/src/components/payment/payment-return-view.tsx) âœ… corregido: runtime migrado a `features/payments/components/payment-return-view.tsx`

Esto rompe el patrÃ³n indicado por la gobernanza del repo y acopla UI con transporte. âœ… corregido parcialmente: `testimonials`, `auth`, `contact`, `newsletter`, `payments`, `support`, `projects`, `users` y `proposals` ya migrados a `features/`; quedan remanentes legacy de composiciÃ³n/UI
Las `sections` restantes del landing (`hero`, `philosophy`, `services`, `process`, `tech`, `impact`, `comparison`, `showroom`) fueron re-auditadas y siguen temporales por formar parte del runtime estructural del home; no conviene moverlas antes de `Runtime shell` y `Pages finalization`. âœ… corregido parcialmente
El runtime principal ya fue reubicado a `client/src/app/App.tsx`; `client/src/main.tsx` consume esa implementaciÃ³n final y `client/src/App.tsx` fue retirado tras quedar sin consumidores. âœ… corregido
Los providers globales del runtime frontend ya fueron extraÃ­dos a `client/src/app/providers/AppProviders.tsx`, reduciendo acoplamiento en `App`. âœ… corregido
La tabla de rutas del runtime frontend ya fue extraÃ­da a `client/src/app/router/AppRoutes.tsx`, manteniendo paths y lazy loading sin cambios funcionales. âœ… corregido
Las pÃ¡ginas `pago-exitoso`, `pago-fallido` y `pago-pendiente` ya no forman parte estructural del router; el runtime consume directamente `features/payments/components/payment-return-view` y esos entrypoints legacy fueron retirados tras quedar sin consumidores. âœ… corregido
La pÃ¡gina `contacto` ya no forma parte estructural del router; el runtime consume directamente `features/contact/components/support-contact-page` y `client/src/pages/contacto.tsx` fue retirada tras quedar sin consumidores. âœ… corregido
La pÃ¡gina `auth-verify` ya no forma parte estructural del router; el runtime consume directamente `features/auth/components/auth-verify-page` y `client/src/pages/auth-verify.tsx` fue retirada tras quedar sin consumidores. âœ… corregido
La pÃ¡gina `consulta` ya no forma parte estructural del router; el runtime consume directamente `features/proposals/components/proposal-request-page`, el prefetch ya apunta a esa implementaciÃ³n final y `client/src/pages/consulta.tsx` fue retirada tras quedar sin consumidores. âœ… corregido
La pÃ¡gina `panel-usuario` ya no forma parte estructural del router ni del prefetch; el runtime consume directamente `features/users/components/user-dashboard-page` y `client/src/pages/panel-usuario.tsx` fue retirada tras quedar sin consumidores. âœ… corregido
La pÃ¡gina `home` sigue siendo runtime estructural del landing; hoy mezcla composiciÃ³n, scroll orchestration y lazy loading de sections temporales, por lo que no corresponde adelgazarla en Fase 4 sin definir antes el target final de `marketing-home`. âœ… corregido parcialmente
`client/src/App.tsx` ya no forma parte del bootstrap; `client/src/main.tsx` consume `client/src/app/App.tsx` como runtime final y el bloqueo del landing por su composiciÃ³n temporal en `components/sections/*` ya fue removido. âœ… corregido
La ruta `not-found` ya no depende de `client/src/pages/not-found.tsx`; `AppRoutes` consume `client/src/app/router/errors/not-found-page.tsx` como runtime final y el entrypoint legacy fue retirado. âœ… corregido
Las pÃ¡ginas legales `terminos-condiciones`, `politica-privacidad` y `politica-cookies` ya no dependen de `client/src/pages/*`; `AppRoutes` consume `client/src/app/router/legal/*` como runtime final y los entrypoints legacy fueron retirados. âœ… corregido
Las pÃ¡ginas de servicios `consultoria-estrategica`, `desarrollo-web`, `posicionamiento-marketing` y `automatizacion-marketing` ya no dependen de `client/src/pages/servicios/*`; `AppRoutes` consume `client/src/app/router/services/*` como runtime final y los entrypoints legacy fueron retirados. âœ… corregido
La pÃ¡gina `vacantes` ya no depende de `client/src/pages/vacantes.tsx`; `AppRoutes` y `route-prefetch` consumen `client/src/app/router/company/vacancies-page.tsx` como runtime final y el entrypoint legacy fue retirado. âœ… corregido
Las pÃ¡ginas `corporativos` y `ecommerce` ya no dependen de `client/src/pages/*`; `AppRoutes` consume `client/src/app/router/solutions/*` como runtime final y los entrypoints legacy fueron retirados. âœ… corregido
La pÃ¡gina `uxui` ya no depende de `client/src/pages/uxui.tsx`; `AppRoutes` consume `client/src/app/router/solutions/uxui-page.tsx` como runtime final y el entrypoint legacy fue retirado. âœ… corregido
La pÃ¡gina `equipo` ya no depende de `client/src/pages/equipo.tsx`; `AppRoutes` consume `client/src/app/router/company/team-page.tsx` como runtime final y el entrypoint legacy fue retirado. âœ… corregido
La pÃ¡gina `estudio` ya no depende de `client/src/pages/estudio.tsx`; `AppRoutes` consume `client/src/app/router/company/studio-page.tsx` como runtime final y el entrypoint legacy fue retirado. âœ… corregido
La pÃ¡gina `faq` ya no depende de `client/src/pages/faq.tsx`; `AppRoutes` consume `client/src/app/router/knowledge/faq-page.tsx` como runtime final y el entrypoint legacy fue retirado. âœ… corregido
La pÃ¡gina `tecnologias` ya no depende de `client/src/pages/tecnologias.tsx`; `AppRoutes` consume `client/src/app/router/knowledge/technologies-page.tsx` como runtime final y el entrypoint legacy fue retirado. âœ… corregido
Se auditÃ³ `marketing-home` y quedÃ³ trazado el mapa `responsabilidad -> destino`; el shell estructural del landing ya vive en `client/src/app/router/home/home-page.tsx` y las sections temporales quedaron clasificadas para migraciÃ³n por slices, no para limpieza directa. âœ… corregido
La navegaciï¿½n del landing (`location.search`, `location.hash`, `sectionRefs` y fallback scrolling) ya fue extraï¿½da desde `client/src/pages/home.tsx` hacia `features/marketing-home/hooks/use-home-section-navigation`, reduciendo acoplamiento sin alterar la UX del home. El anclaje con header fijo ya no corta secciones: `global-navbar` y `use-home-section-navigation` comparten `features/marketing-home/utils/scroll-to-home-section.ts`, y las secciones del landing ya exponen `scroll-margin-top` consistente. ? corregido
La `hero-section` del landing ya fue movida a `features/marketing-home/components/hero-section`; `home.tsx` consume la implementaciÃ³n final y `components/sections/hero-section.tsx` fue retirado tras quedar sin consumidores. âœ… corregido
La `philosophy-section` del landing ya fue movida a `features/marketing-home/components/philosophy-section`; `home.tsx` consume la implementaciÃ³n final y `components/sections/philosophy-section.tsx` fue retirado tras quedar sin consumidores. âœ… corregido
La `services-section` del landing ya fue movida a `features/marketing-home/components/services-section`; `home.tsx` consume la implementaciÃ³n final y `components/sections/services-section.tsx` fue retirado tras quedar sin consumidores. âœ… corregido
La `process-section` del landing ya fue movida a `features/marketing-home/components/process-section`; `home.tsx` consume la implementaciÃ³n final y `components/sections/process-section.tsx` fue retirado tras quedar sin consumidores. âœ… corregido
La `tech-section` del landing ya fue movida a `features/marketing-home/components/tech-section`; `home.tsx` consume la implementaciÃ³n final y `components/sections/tech-section.tsx` fue retirado tras quedar sin consumidores. âœ… corregido
La `impact-section` del landing ya fue movida a `features/marketing-home/components/impact-section`; `home.tsx` consume la implementaciÃ³n final y `components/sections/impact-section.tsx` fue retirado tras quedar sin consumidores. âœ… corregido
La `comparison-section` del landing ya fue movida a `features/marketing-home/components/comparison-section`; `home.tsx` consume la implementaciÃ³n final y `components/sections/comparison-section.tsx` fue retirado tras quedar sin consumidores. âœ… corregido
La `showroom-section` del landing ya fue movida a `features/marketing-home/components/showroom-section`; `home.tsx` consume la implementaciÃ³n final y `components/sections/showroom-section.tsx` fue retirado tras quedar sin consumidores. âœ… corregido
La pÃ¡gina `panel-usuario` concentraba orquestaciÃ³n funcional de perfil, seguridad, preferencias e imagen; ese frente ya quedÃ³ resuelto mediante descomposiciÃ³n y `user-dashboard-page.tsx` hoy funciona como orquestador con tabs y helpers extraÃ­dos. âœ… corregido

### 3. Backend tipo â€œGod controllerâ€

El antiguo `server/src/controllers/public.controller.ts` mezclaba: âœ… corregido

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

La separacion por dominio del antiguo God controller ya quedo resuelta a nivel de routing y modulos; la evolucion de servicios por dominio sigue siendo mejora continua, no bloqueo estructural de este frente. âœ… corregido

### 4. DuplicaciÃ³n de stacks y configuraciÃ³n

- dos `vite.config` âœ… corregido
- dos `netlify.toml` âœ… corregido
- backend Node + backend PHP + Cloud Function
- lÃ³gica Firebase en Node y en PHP

Estado: âœ… corregido parcialmente: `vite.config.ts`, `netlify.toml`, `tailwind.config.ts` y `postcss.config.js` de raÃ­z quedaron como Ãºnicas fuentes oficiales y los duplicados de `client/` fueron retirados; el estado parcial restante responde solo a superficies legacy aisladas (`legacy/` y `firebase-functions-contacto/`), no a configuraciÃ³n activa duplicada

Esto complica onboarding, incidentes y despliegue.

---

## Gobernanza del Proyecto

### Scripts rotos o inseguros

En [`package.json`](./package.json):

- lÃ­neas 16-17
  - `check-oauth` apunta a `scripts/check-google-oauth.js` inexistente
  - `fix-oauth` apunta a `scripts/fix-google-oauth.js` inexistente
- lÃ­nea 32
  - `setup:mp` apunta a `setup-mercado-pago.js` inexistente
- lÃ­nea 33
  - `deploy` ejecuta `git add . && git commit && git push`
  - esto no es un deploy enterprise; mezcla build con control de versiones y puede versionar basura accidental âœ… corregido parcialmente

### Quality gates incompletos

- CI valida frontend, pero no backend con TypeScript estricto âœ… corregido
- ESLint solo cubre `client/src` âœ… corregido
- no hay suite de tests unitarios/integraciÃ³n por dominio
- smoke test no estÃ¡ aislado de infraestructura real

### DocumentaciÃ³n insuficiente

- [`README.md`](./README.md) no sirve como entrada operativa
- no hay documento claro de arquitectura vigente vs legacy âœ… corregido parcialmente
- no hay inventario de componentes activos/inactivos

---

## Calidad General del CÃ³digo

### Puntos positivos

- uso de Zod en varios bordes HTTP del backend Node
- estructura de middlewares razonable en Express
- intento de observabilidad con request IDs y logger estructurado
- adopciÃ³n de React Query en parte de auth/testimonials

### Problemas de consistencia

- mezcla de espaÃ±ol, inglÃ©s y naming hÃ­brido
- mezcla de estrategias de acceso a datos âœ… corregido parcialmente
- mezcla de estilos de logging
- mezcla de flujos modernos con placeholders y stubs
- mezcla de arquitecturas activas y legacy en el mismo repo âœ… corregido parcialmente

---

## PreparaciÃ³n para Escalar

### Crecer en features

**Estado:** DÃ©bil

Bloqueantes:

- pÃ¡ginas monolÃ­ticas
- controller backend monolÃ­tico âœ… corregido
- duplicaciÃ³n de stacks
- falta de frontera clara por dominio âœ… corregido parcialmente

### Crecer en equipo

**Estado:** DÃ©bil

Bloqueantes:

- onboarding documental casi inexistente
- repo con ruido operativo alto
- difÃ­cil distinguir quÃ© cÃ³digo estÃ¡ vivo

### Crecer en trÃ¡fico

**Estado:** FrÃ¡gil

Bloqueantes:

- endpoints abiertos âœ… corregido
- dependencia parcial en filesystem local para logs e idempotencia fallback
- smoke/operaciÃ³n tocando infraestructura real
- control de auth activable por env, no necesariamente enforced por diseÃ±o âœ… corregido parcialmente

---

## Arquitectura Recomendada

### Objetivo

Consolidar un solo stack activo y volver explÃ­cito quÃ© queda deprecado.

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
    app/ âœ… corregido parcialmente
    core/ âœ… corregido parcialmente
      config/
      logger/
      auth/
      validation/
    modules/ âœ… corregido parcialmente
      contact/
      newsletter/
      payments/
      testimonials/
      users/
      support/
      projects/
    infrastructure/ âœ… corregido parcialmente
      firebase/
      mail/
      mercadopago/
```

### Decisiones recomendadas

- elegir **un** backend activo: Node/Express o PHP, no ambos âœ… corregido parcialmente: PHP aislado
- mover legacy a `legacy/` o eliminarlo âœ… corregido
- separar frontend por `features` âœ… corregido parcialmente: estructura preparada
- encapsular acceso a backend solo en hooks/services
- crear contratos tipados compartidos o al menos DTOs por mÃ³dulo
- sacar artefactos, binarios, reportes y secretos fuera del repo âœ… corregido parcialmente: builds/reportes/logs locales, tooling heredado y el archivo local de Firebase Admin ya fueron limpiados; siguen pendientes secretos sensibles dentro de `.env`

---

## Plan de Refactor

### Alta prioridad

1. Cerrar rutas sensibles con auth/autorizaciÃ³n real. âœ… corregido
2. Eliminar o aislar el stack PHP legacy. âœ… corregido
3. Corregir la cobertura de `tsc` y `eslint` para backend. âœ… corregido
4. Limpiar secretos, binarios, logs y builds del repo. âœ… corregido parcialmente
5. Corregir `Dockerfile.backend` y serving estÃ¡tico. âœ… corregido
6. Reemplazar hard delete por soft delete donde aplique. âœ… corregido

### Media prioridad

1. Particionar `public.controller.ts` por dominios. âœ… corregido
2. Mover acceso a API fuera de `pages/` y `components/`. âœ… corregido parcialmente: `testimonials`, `auth`, `contact`, `newsletter`, `payments`, `support`, `projects`, `users` y `proposals` ya migrados; wrappers legacy de auth y services ya fueron retirados o quedaron fuera del runtime directo
3. Depurar scripts rotos y remover `deploy` basado en `git add .`.
4. Consolidar `vite.config` y `netlify.toml`. âœ… corregido parcialmente: source of truth documentada y configs duplicadas marcadas deprecated
5. Revisar dependencias posiblemente no usadas y podar.

### Baja prioridad

1. Normalizar encoding y textos.
2. Reducir tamaÃ±o de pÃ¡ginas/componentes grandes.
3. Eliminar placeholders y UX no implementada del panel.
4. Reescribir README con arquitectura, setup y despliegue.

---

## ConclusiÃ³n

Tuwebai no estÃ¡ en estado caÃ³tico total, pero sÃ­ en una zona peligrosa: funciona por acumulaciÃ³n de soluciones, no por una arquitectura consolidada. La prioridad no deberÃ­a ser agregar mÃ¡s features; deberÃ­a ser **consolidar el sistema vigente, cerrar superficies expuestas y separar definitivamente lo activo de lo legacy**.

Si se corrigen primero seguridad, gobernanza de repo y consolidaciÃ³n de stack, el proyecto puede pasar de **Riesgoso** a **Aceptable** relativamente rÃ¡pido. Si no se hace, cualquier crecimiento va a aumentar tanto el costo de mantenimiento como la probabilidad de incidentes.

Nota de seguimiento:

- âœ… corregido parcialmente: client/index.html ya no carga Google Analytics ni AdSense en localhost, evitando pausas del runtime por excepciones de dsbygoogle.js durante desarrollo local.

- âœ… corregido: `client/src/pages/home.tsx` fue retirado tras mover el shell SEO y composiciÃ³n a `client/src/app/router/home/home-page.tsx`; la composiciÃ³n principal del landing vive en `features/marketing-home/components/marketing-home-page`.
- âœ… corregido: `client/src/pages/*` dejÃ³ de ser runtime activo y `client/src/app/router/` quedÃ³ normalizado por dominios semÃ¡nticos (`home`, `errors`, `company`, `knowledge`, `legal`, `services`, `solutions`).
- âœ… corregido: `client/src/components/route-wrapper.tsx` dejÃ³ de ser dependencia estructural del runtime; `AppRoutes` consume `client/src/app/router/lazy-route.tsx` y el wrapper legacy fue retirado.
- âœ… corregido: `client/src/app/App.tsx` y `client/src/app/router/lazy-route.tsx` ya consumen `client/src/shared/ui/{footer,toaster,skeleton}` como runtime final; dejaron de depender de wrappers equivalentes en `client/src/components/ui/*`.
- âœ… corregido: `client/src/app/router/solutions/*`, `client/src/features/proposals/components/proposal-request-page.tsx` y `client/src/features/contact/components/support-contact-page.tsx` ya consumen `client/src/shared/ui/{button,input,textarea,scroll-progress,whatsapp-button}`; los wrappers equivalentes en `client/src/components/ui/*` quedaron fuera de ese runtime activo.
- âœ… corregido: `client/src/features/contact/components/contact-section.tsx`, `client/src/features/testimonials/components/testimonials-section.tsx` y `client/src/features/payments/components/payment-error-dialog.tsx` ya consumen `client/src/shared/ui/{animated-shape,alert-dialog}`; los wrappers equivalentes en `client/src/components/ui/*` quedaron fuera de ese runtime activo.
- âœ… corregido: `client/src/app/router/home/home-page.tsx`, `client/src/app/router/company/studio-page.tsx`, `client/src/features/users/components/user-dashboard-page.tsx` y `client/src/features/auth/components/auth-verify-page.tsx` ya consumen `client/src/shared/ui/meta-tags.tsx`; `client/src/components/seo/meta-tags.tsx` quedÃ³ fuera del runtime activo.
- âœ… corregido: `client/src/features/users/components/user-dashboard-page.tsx` ya consume `client/src/shared/ui/whatsapp-button.tsx`; el wrapper equivalente en `client/src/components/ui/whatsapp-button.tsx` quedÃ³ fuera de ese runtime activo.
- âœ… corregido: `client/src/hooks/use-vacancies.ts` ya consume `client/src/shared/ui/use-toast`; `client/src/components/ui/use-toast/*` quedÃ³ fuera del runtime activo directo.
- âœ… corregido: `client/src/app/App.tsx` ya consume `client/src/shared/ui/skip-link.tsx`; `client/src/components/a11y/skip-link.tsx` quedÃ³ reducido a wrapper temporal de compatibilidad.
- âœ… corregido parcialmente: `client/src/shared/ui/command.tsx` ya concentra la implementaciÃ³n real; `client/src/components/ui/command.tsx` quedÃ³ reducido a wrapper temporal de compatibilidad.
- âœ… corregido parcialmente: `client/src/shared/ui/{form,calendar,carousel}.tsx` ya concentran la implementaciÃ³n real; `client/src/components/ui/{form,calendar,carousel}.tsx` quedaron reducidos a wrappers temporales de compatibilidad.
- âœ… corregido: `client/src/components/ui/{command,form,calendar,carousel}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedÃ³ como implementaciÃ³n final.
- âœ… corregido: `client/src/components/ui/{global-navbar,chart,aspect-ratio,input-otp}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; no correspondÃ­a mantenerlos como cÃ³digo muerto ni compatibilidad activa.
- âœ… corregido: `client/src/components/ui/{button,input,textarea,label,toast,toaster}` y `client/src/components/ui/use-toast/*` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedÃ³ como implementaciÃ³n final.
- âœ… corregido: `client/src/components/ui/{accordion,alert,alert-dialog,badge,card,checkbox}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedÃ³ como implementaciÃ³n final.
- âœ… corregido: `client/src/components/ui/{dialog,drawer,dropdown-menu,context-menu,popover,hover-card}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedÃ³ como implementaciÃ³n final.
- âœ… corregido: `client/src/components/ui/{animated-shape,avatar,breadcrumb,company-logo-slider,footer,loading-spinner}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` y `client/src/app/layout/*` quedaron como implementaciÃ³n final.
- âœ… corregido: `client/src/components/ui/{nav-dots,page-banner,pagination,particle-effect,progress,scroll-progress,separator,skeleton}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedÃ³ como implementaciÃ³n final.
- âœ… corregido: `client/src/components/ui/{collapsible,menubar,navigation-menu,radio-group,select,sheet}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedÃ³ como implementaciÃ³n final.
- âœ… corregido: `client/src/components/ui/{resizable,scroll-area,sidebar,slider,switch,table,tabs,toggle-group,toggle,tooltip,whatsapp-button}.tsx` fueron retirados tras confirmar ausencia de consumidores internos; `client/src/shared/ui/*` quedÃ³ como implementaciÃ³n final y `client/src/components/ui/*` dejÃ³ de participar del runtime frontend.
- âœ… corregido: `client/src/app/App.tsx` dejÃ³ de depender de `client/src/components/performance/*`; `ResourcePreload` y `MemoryManager` fueron reclasificados a `client/src/app/performance/*` como instrumentaciÃ³n propia del runtime de aplicaciÃ³n.
- âœ… corregido: `client/src/components/a11y/*` fue retirado tras confirmar ausencia de consumidores internos; `SkipLink` quedÃ³ consolidado en `client/src/shared/ui/skip-link.tsx` y el resto del paquete no participaba del runtime activo.
- âœ… corregido: `client/src/components/performance/*` fue retirado tras confirmar ausencia de consumidores internos; `ResourcePreload` y `MemoryManager` ya quedaron consolidados en `client/src/app/performance/*` y `DeferredContent`/`OptimizedImage` no participaban del runtime activo.
- âœ… corregido: `client/src/components/auth/{AdminRoute,DashboardRoute}.tsx` fue retirado tras confirmar ausencia de consumidores internos; la protecciÃ³n efectiva quedÃ³ resuelta en `features/*` y el paquete legacy dejÃ³ de participar del runtime frontend.
- âœ… corregido: la precondiciÃ³n de Fase 6 quedÃ³ satisfecha y la limpieza final de compatibilidad del runtime frontend quedÃ³ materializada sin consumidores legacy residuales.
- âœ… corregido: `package.json` dejÃ³ de exponer los scripts rotos `check-oauth`, `fix-oauth` y `setup:mp`; todos apuntaban a archivos inexistentes y agregaban ruido operativo sin valor de runtime.
- âœ… corregido: `package.json` dejÃ³ de exponer el script `deploy`, que mezclaba build con `git add/commit/push`; se retirÃ³ por no cumplir gobernanza enterprise ni trazabilidad operativa segura.
- âœ… corregido: `package.json` dejÃ³ de declarar dependencias sin referencias en el repo principal (`@emailjs/nodejs`, `@replit/vite-plugin-shadcn-theme-json`, `archiver`, `emailjs-com`, `extract-zip`, `highlight.js`, `image-size`, `input-otp`, `react-ga4`, `recharts`, `websocket`); se retiraron tras auditorÃ­a de uso real para reducir ruido y deuda de gobernanza.
- âœ… corregido: `package.json` dejÃ³ de declarar dependencias y tooling sin referencias en el repo principal (`express-static`, `puppeteer`, `nodemon`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-runtime-error-modal`); se retiraron tras auditorÃ­a de uso real en cÃ³digo, scripts y workflows.
- âœ… corregido: `package.json` dejÃ³ de declarar dependencias backend/infra sin consumidores detectables (`serve-static`, `passport-local`, `passport-google-oauth20`, `uuid`, `nanoid`, `sharp`, `ws`) junto con sus tipos asociados; se retiraron tras auditorÃ­a de uso real en cÃ³digo y configuraciÃ³n.
- âœ… corregido: `package.json` dejÃ³ de declarar dependencias sin consumidores detectables ni en runtime ni en configuraciÃ³n (`@sendgrid/mail` y `@jridgewell/trace-mapping`); se retiraron tras auditorÃ­a fina de cÃ³digo, scripts y configuraciÃ³n para seguir bajando riesgo de gobernanza.
- âœ… corregido: `package.json` ya no declara `ts-node`; no tenÃ­a consumidores en cÃ³digo, scripts ni configuraciÃ³n del repo y fue retirado tras auditorÃ­a fina de uso real.
- âœ… corregido: `scripts/smoke.mjs` dejÃ³ de heredar por defecto SMTP y Firebase Admin reales desde `.env`; ahora fuerza aislamiento con `DISABLE_SMTP_DELIVERY=true` y `DISABLE_FIREBASE_ADMIN=true`, con escape explÃ­cito vÃ­a `SMOKE_USE_REAL_SMTP=1` y `SMOKE_USE_REAL_FIREBASE=1` solo cuando se quiera probar infraestructura real.
- âœ… corregido: `firebase-functions-contacto/functions/src/index.ts` dejÃ³ de exponer `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID` y `EMAILJS_PRIVATE_KEY` hardcodeados; ahora exige configuraciÃ³n por entorno y queda explÃ­cito que ese subproyecto no debe versionar secretos en cÃ³digo.
- âœ… corregido: `legacy/php-api/webhooks/mercadopago.php` ahora valida el webhook con `validateMercadoPagoWebhook(...)` antes de procesarlo; el stack PHP legacy deja de aceptar notificaciones sin validaciÃ³n cuando existe `MERCADOPAGO_WEBHOOK_SECRET`.
- âœ… corregido: `legacy/php-api/config/firebase.php` ya no desactiva verificaciÃ³n TLS en cURL y dejÃ³ de caer a `VITE_FIREBASE_API_KEY` como bearer token para Firestore; el acceso legacy ahora falla cerrado si no puede obtener credenciales vÃ¡lidas.
- âœ… corregido: la re-auditorÃ­a arquitectÃ³nica confirmÃ³ que `legacy/` y `firebase-functions-contacto/` no participan del runtime ni de CI/CD principal; quedaron formalizados como superficies heredadas aisladas y congeladas fuera del stack Node activo.
- âœ… corregido: el workspace dejÃ³ de arrastrar artefactos generados ignorados (`dist/`, `dist-server/`, `logs/`, `.firebase/`, `client/dist`, `firebase-functions-contacto/functions/lib`, `ts_errors*.log`, reporte Lighthouse local); ya no suman ruido operativo sobre el estado real del repo.
- âœ… corregido: `.replit` fue retirado tras confirmar que solo describÃ­a workflows obsoletos de Replit y no tenÃ­a consumidores en cÃ³digo, scripts ni documentaciÃ³n operativa del stack actual.
- âœ… corregido: `php-temp/` fue retirado del workspace tras confirmar que era solo tooling local heredado sin integraciÃ³n con el runtime, CI/CD ni scripts activos del repo principal.
- âœ… corregido: `eslint.config.mjs` ahora expone `@typescript-eslint/no-explicit-any` en modo `error`; el repo ya no conserva `any` explÃ­citos ni `z.any()` y la deuda de tipado queda cerrada con enforcement real en lint.
- âœ… corregido: `README.md`, `docs/ARCHITECTURE.md`, `docs/CONFIGURATION.md` y el fallback visible de `client/src/features/marketing-home/components/marketing-home-page.tsx` ya no conservan texto roto por encoding heredado; la documentacion operativa base y el copy visible del landing quedaron legibles en ASCII estable.
- âœ… corregido parcialmente: el root ya no conserva duplicados binarios de frontend (`dashboardtuwebai.png`, `safespot.png`, `trading-tuwebai.png`, `image_perfil.jpg`) ni el residuo sin referencias `generated-icon.png`; los assets publicos canonicos quedan en `client/public/*` y el build los sigue emitiendo a `dist/` sin cambiar rutas.
- âœ… corregido: `docs/MARKETING_HOME_RESPONSIBILITY_MAP.md` y `docs/RESTRUCTURE_MAP.md` dejaron de formar parte del flujo operativo; ambas quedaron retiradas por ser mapas historicos 100% materializados y solo agregaban ruido documental.
- âœ… corregido parcialmente: la re-auditoria del root confirmo que las configs restantes en raiz (`vite.config.ts`, `netlify.toml`, `tailwind.config.ts`, `postcss.config.js`, `firebase.json`, `.lighthouserc.json`, `Dockerfile.*`, `docker-compose.yml`, `tsconfig*`) siguen siendo operativas o forman parte de workflows vigentes; no quedaron duplicados raiz muertos adicionales para retirar.
- âœ… corregido parcialmente: `dist/` y `logs/` siguen clasificados como ruido local ignorado del workspace; no se versionan y su limpieza no cambia el estado del repo, aunque en esta corrida el entorno bloqueo su borrado automatico.
- âœ… corregido: `docs/TECHNICAL_RISK_SCORE.md` fue re-auditado contra el estado real post-cierre de runtime, tipado y cleanup documental; `Mantenibilidad` bajÃ³ a `4/10` y `Deuda tecnica` a `5/10`, manteniÃ©ndose `Arquitectura` y `Gobernanza` en `4/10` y `Escalabilidad` en `5/10`.
- âœ… corregido: `client/src/features/auth/context/AuthContext.tsx`, `client/src/features/auth/hooks/use-auth-mutations.ts` y `client/src/features/auth/hooks/use-auth-queries.ts` ya no usan `Promise<any>`, `err: any` ni `oldData: any`; auth frontend quedÃ³ cerrado sin cambios funcionales y con enforcement de lint activo.
- âœ… corregido: `server/src/middlewares/firebase-auth.middleware.ts` ya no usa `(decoded as any)` ni `catch (error: any)`; ahora tipa `AuthUser` con `DecodedIdToken`, normaliza errores con `unknown` y mantiene el mismo contrato HTTP.
- âœ… corregido: `server/index.ts` ya no usa `(req.session as any)` en el logging de auth; la sesiÃ³n quedÃ³ tipada mediante augmentaciÃ³n mÃ­nima de `express-session` y `tsconfig.server.json` incorpora `server/**/*.d.ts`.
- âœ… corregido: `server/src/modules/users/controller.ts` ya no usa `catch (error: any)` ni `sort((a: any, b: any) => ...)`; el mÃ³dulo quedÃ³ tipado con documentos mÃ­nimos de `users`, `preferences` y `payments` sin alterar rutas ni respuestas.
- âœ… corregido: `server/src/modules/support/controller.ts` ya no usa `catch (error: any)` ni `sort((a: any, b: any) => ...)`; el mÃ³dulo quedÃ³ tipado con documentos mÃ­nimos de tickets y responses sin alterar rutas ni respuestas.
- âœ… corregido: `server/src/modules/testimonials/controller.ts` ya no usa `catch (error: any)` ni `sort((a: any, b: any) => ...)`; el mÃ³dulo quedÃ³ tipado con documentos mÃ­nimos de testimonios y actualizaciones sin alterar rutas ni respuestas.
- âœ… corregido: `server/src/modules/projects/controller.ts` ya no usa `catch (error: any)` ni `sort((a: any, b: any) => ...)`; el mÃ³dulo quedÃ³ tipado con documentos mÃ­nimos de proyectos y actualizaciones sin alterar rutas ni respuestas.
- âœ… corregido: `server/src/modules/contact/controller.ts` ya no usa `catch (error: any)`; el mÃ³dulo normaliza errores con `unknown` y `getErrorMessage(...)` sin alterar rutas ni respuestas de contacto, propuesta o aplicaciones.
- âœ… corregido: `server/src/modules/newsletter/controller.ts` ya no usa `catch (error: any)`; el mÃ³dulo normaliza errores con `unknown` y `getErrorMessage(...)` sin alterar rutas ni respuestas de suscripciÃ³n.
- âœ… corregido: `server/src/controllers/payment.controller.ts` ya no usa `catch (error: any)` ni `catch (apiError: any)`; el controller normaliza errores con `unknown`, preserva el tratamiento especial de `Plan invalido` y mantiene intactos los contratos HTTP y el flujo de webhooks.
- âœ… corregido: `server/src/controllers/contact.controller.ts` ya no usa `catch (error: any)`; el controller normaliza errores con `unknown` y `getErrorMessage(...)` sin alterar rutas ni respuestas de contacto, consulta o test SMTP.
- âœ… corregido: `server/src/services/webhook-idempotency.service.ts` ya no usa `catch (error: any)`; el servicio tipa errores como `unknown`, detecta cÃ³digos de Firestore/fs con narrowing local y mantiene intacta la estrategia de idempotencia con fallback a filesystem.
- âœ… corregido: `server/src/utils/logger.ts` ya no usa `writeLog(data: any)`; el utilitario acepta `unknown`, manteniendo intacta la serializaciÃ³n JSON y el contrato operativo de logging.
- âœ… corregido: `client/src/features/users/components/user-dashboard-page.tsx` ya no usa `catch (error: any)`; el panel normaliza errores con `unknown` y `getErrorMessage(...)` sin alterar flujos de perfil, contraseÃ±a, imagen ni logout.
- âœ… corregido: `client/src/app/performance/memory-manager.tsx` ya no usa `window.performance as any`; el runtime tipa la API de memoria del navegador con una extensiÃ³n local mÃ­nima sin alterar el monitoreo existente.
- âœ… corregido: `client/src/app/router/solutions/uxui-page.tsx` ya no usa `window as any` para `isUsingGlobalNav`; la pÃ¡gina tipa esa bandera con una extensiÃ³n mÃ­nima de `Window` sin alterar el runtime del navbar.
- âœ… corregido: `client/src/lib/performance.ts` ya no usa `entry: any` para CLS; el tracking tipa `layout-shift` con una extensiÃ³n mÃ­nima de `PerformanceEntry` sin alterar las mÃ©tricas reportadas.
- âœ… corregido: `client/src/types/index.d.ts` ya no usa `asNavFor?: any` en el shim de `react-slick`; el tipado externo quedÃ³ cerrado con `Slider | null` y el runtime activo del repo ya no conserva usos explÃ­citos de `any`.
- âœ… corregido: `server/src/schemas/api.schemas.ts` ya no usa `z.any()` en `ticket.responses` ni `project.phases`; los tickets quedaron validados con un schema abierto y consistente con el runtime real, y `phases` quedÃ³ como arreglo de objetos abiertos sin inventar un contrato mÃ¡s estricto del soportado hoy.
- âœ… corregido: auth ya sincroniza de forma canÃ³nica el avatar real de Google desde Firebase en `AuthContext` y `useGoogleLoginMutation`; las cuentas Google existentes refrescan `user.image` y el panel dejÃ³ de rehidratar fotos viejas desde `localStorage`, por lo que navbar, panel y consumidores globales vuelven a mostrar la foto real de la cuenta cuando corresponde.
- âœ… corregido: el resync de avatar Google ya no reutiliza ciegamente documentos histÃ³ricos de usuario devueltos por backend; auth recompone un `User` canÃ³nico desde Firebase antes del `PUT /api/users/:uid`, evitando que registros legacy incompletos degraden el payload o rompan la persistencia del avatar global.
- âœ… corregido: las cuentas Google ya no degradan `image` a vacÃ­o por snapshots transitorios; el source of truth del avatar prioriza `photoURL` real y conserva la Ãºltima imagen canÃ³nica si Firebase no la expone en ese instante.
- âœ… corregido: `server/src/middlewares/validate.middleware.ts` ya emite `users.upsert.validation_failed` con `uid`, `bodyKeys` e issues cuando falla la validaciÃ³n de `PUT /api/users/:uid`, dejando trazabilidad inmediata para futuros casos de avatar roto o payload invÃ¡lido.
- âœ… corregido: `client/src/shared/ui/whatsapp-button.tsx` ya usa el isotipo real de WhatsApp tambiÃ©n en el popup flotante y el nÃºmero canÃ³nico quedÃ³ centralizado en `client/src/shared/constants/contact.ts` como `5493571417960`, reemplazando hardcodes de `wa.me`, `tel:` y metadatos SEO en los consumers activos.
- Ã¢Å“â€¦ corregido: `docs/ARCHITECTURE.md` y `AGENTS.md` ya fijan que `ui-ux-pro-max-skill/` debe auditarse como referencia visual premium para cambios de UI/UX, pero siempre prevalece la identidad y la paleta visual de TuWeb.ai.
- âœ… corregido: el popup y el botÃ³n flotante de WhatsApp ya reutilizan el mismo SVG canÃ³nico desde `client/src/shared/ui/whatsapp-icon.tsx`, dejando una sola fuente visual para el isotipo en toda la app.
- âœ… corregido: los Ãºltimos hardcodes activos del telÃ©fono viejo quedaron retirados de `client/src/features/contact/components/contact-section.tsx` y `client/src/app/router/legal/privacy-policy-page.tsx`; ambos consumen ahora `TUWEBAI_WHATSAPP_DISPLAY` como fuente canÃ³nica global.
- âœ… corregido: el panel de usuario ya no expone cambio de tema claro/oscuro; `client/src/core/theme/ThemeContext.tsx` fija `dark` como tema canÃ³nico global y `/panel` deja el modo oscuro como identidad visual estable de TuWeb.ai.
- âœ… corregido: el avatar de cuentas Google ya no depende del render directo a `lh3.googleusercontent.com`; `server/src/modules/users/controller.ts` expone un proxy restringido a hosts de avatar de Google y `client/src/shared/ui/user-avatar.tsx` consume esa URL canÃ³nica en navbar y panel, con degradaciÃ³n controlada a iniciales si una carga puntual falla.
- âœ… corregido: el avatar Google no fallaba por base de datos sino por polÃ­tica global de `Origin`; `server/index.ts` ahora permite `GET /api/users/avatar` sin cabecera `Origin`, que es vÃ¡lido para cargas de `<img>`, y la ruta sigue blindada por whitelist estricta de hosts en el controller.
- âœ… corregido: `docs/PANEL_SETTINGS_REMEDIATION_PLAN.md` ya refleja el estado real del producto; `darkMode` e `language` quedaron cerrados como frentes descartados por decision de producto y el siguiente frente util del panel pasa a ser comunicaciones/copy.
- âœ… corregido: `/panel` ya no expone selector de idioma ni wiring parcial asociado; `client/src/app/providers/AppProviders.tsx` y `client/src/shared/ui/meta-tags.tsx` volvieron a idioma estable del producto para no reabrir una preferencia descartada.
- âœ… corregido: `/panel` ya no conserva UI residual de `Apariencia`; el tab de preferencias quedo reducido al frente real de comunicaciones y deja de mostrar contenido basura de tema/idioma ya descartados.
- âœ… corregido: la arquitectura de informacion del `/panel` ya quedo auditada en `docs/PANEL_INFORMATION_ARCHITECTURE_PLAN.md`; `Preferencias` se redefine como espacio de privacidad/experiencia/accesibilidad y cualquier nueva tab queda condicionada a dominio operativo real.
- âœ… corregido: la Fase 0 de `docs/PANEL_INFORMATION_ARCHITECTURE_PLAN.md` quedo cerrada; el `/panel` ya no acepta expansion de tabs o toggles sin efecto real y el siguiente frente util queda acotado a reemplazar `Comunicaciones` por preferencias con semantica operativa verdadera.

- âœ… corregido: la Fase 1 del plan de arquitectura del `/panel` ya quedo cerrada; `Comunicaciones` fue retirada del runtime porque solo exponia persistencia nominal sin comportamiento real y `Preferencias` deja de mostrar toggles fake.
- âœ… corregido: la Fase 2 del plan de arquitectura del `/panel` ya quedo cerrada; la tab generica `Preferencias` fue reemplazada en runtime por `Privacidad`, alineando la navegacion con controles sensibles reales y evitando mezclar ajustes decorativos con configuraciones de datos personales.
- âœ… corregido: el frontend ya no conserva infraestructura viva del viejo modelo `userPreferences`; `AuthContext`, query, mutation, servicios y tipos del cliente asociados a `/api/users/:uid/preferences` fueron retirados tras confirmar ausencia total de consumidores reales desde que el panel dejo de usar preferencias fake.
- âœ… corregido: el dominio `Privacidad` ya fue re-auditado de punta a punta y quedo bajado a `docs/PRIVACY_DOMAIN_IMPLEMENTATION_PLAN.md`; el plan separa `Privacidad` del contrato legacy `/api/users/:uid/preferences`, define un modelo propio y ordena la implementacion por fases chicas sin reabrir toggles descartados.
- âœ… corregido: la Fase 1 del dominio `Privacidad` ya quedo materializada sin reciclar `preferences`; `server/src/modules/users/routes.ts`, `server/src/modules/users/controller.ts` y `server/src/schemas/api.schemas.ts` ya exponen `GET/PUT /api/users/:uid/privacy` sobre `users/{uid}.privacy`, y el cliente ya tiene frontera propia en `client/src/features/users/{types,services,hooks}/privacy*`.
- âœ… corregido: `docs/PRIVACY_DOMAIN_IMPLEMENTATION_PLAN.md` ya no deja la Fase 1 en estado ambiguo; el diagnostico y el orden recomendado quedaron alineados al estado real del repo.
- âœ… corregido: la Fase 2 del dominio `Privacidad` ya quedo cerrada con cambios minimos y verificables; `client/src/features/users/components/privacy-tab.tsx` ya gobierna `profileEmailVisible` y `profileStatusVisible`, y el encabezado de `client/src/features/users/components/user-dashboard-page.tsx` oculta o muestra email y badge de estado segun la configuracion persistida del usuario.
- âœ… corregido: el `404` de los toggles de `Privacidad` no provenia del dominio nuevo sino del runtime local de desarrollo; `package.json` ahora levanta backend con `tsx watch server/index.ts` para no seguir sirviendo una version vieja del server, y `scripts/smoke.mjs` ya cubre `GET/PUT /api/users/:uid/privacy` para que una ruta nueva no vuelva a quedar fuera de los gates.
- âœ… corregido: la Fase 3 del dominio `Privacidad` ya quedo cerrada sin abrir deuda de enforcement; `client/src/features/users/components/privacy-tab.tsx` ya persiste `marketingConsent` y `analyticsConsent`, y el panel los presenta con copy legal alineado a `politica-privacidad` y `politica-cookies`.
- âœ… corregido: la UX interna de la tab `Privacidad` ya no apila bloques sensibles en una sola columna larga; `client/src/features/users/components/privacy-tab.tsx` ahora usa un sidebar interno por secciones y contenido exclusivo por panel para que `Visibilidad` y `Consentimientos` no queden visualmente pegados ni compitan entre si.
- âœ… corregido: la tab `Privacidad` ya no fuerza layout lateral antes de tiempo ni hereda `whitespace-nowrap` en sus secciones internas; `client/src/features/users/components/privacy-tab.tsx` ahora apila contenido hasta `1440px`, permite wrap real en los labels del sidebar y elimina copy tecnico innecesario para usuario final.
- âœ… corregido: la tab `Privacidad` ya no usa un pseudo-sidebar de tarjetas sueltas; `client/src/features/users/components/privacy-tab.tsx` ahora organiza la navegacion interna como centro de privacidad con grupos colapsables, chevron y subitems compactos, alineando mejor el panel con un patron enterprise de secciones sensibles.
- âœ… corregido: la Fase 4 del dominio `Privacidad` ya quedo cerrada con enforcement minimo real; `client/src/lib/analytics.ts` centraliza consentimiento y bloqueo de eventos, `client/src/app/App.tsx` ya condiciona inicializacion/pageviews al `analyticsConsent` persistido del usuario autenticado, y `client/index.html`, `client/src/lib/performance.ts`, `client/src/features/contact/components/contact-section.tsx` y `client/src/features/newsletter/components/newsletter-form.tsx` dejaron de disparar analitica por fuera de esa frontera.
- âœ… corregido: la Fase 5 del dominio `Privacidad` ya quedo cerrada con trazabilidad minima; `server/src/modules/users/controller.ts` ahora registra `users.privacy_updated` cuando cambia efectivamente la configuracion, incluyendo `uid`, `changedFields`, `updatedAt` y `updatedBy` sin persistir valores sensibles ni abrir todavia una tab `Actividad`.
- âœ… corregido: la Fase 6 del dominio `Privacidad` ya fue re-auditada y quedo diferida formalmente por decision de producto; el repo no tiene hoy dominio real para exportacion de datos, eliminacion de cuenta, centro de cookies full stack ni historial de actividad detallado, asi que el plan queda cerrado sin abrir deuda tecnica artificial.
- âœ… corregido: la documentacion operativa del panel y privacidad quedo realineada al estado actual del repo; `README.md`, `docs/PANEL_INFORMATION_ARCHITECTURE_PLAN.md` y `docs/PANEL_SETTINGS_REMEDIATION_PLAN.md` ya no presentan `Privacidad` como shell pendiente ni dejan `settings/preferences` como siguiente frente activo cuando ese trabajo ya quedo cerrado o diferido.
- âœ… corregido: `user-dashboard-page.tsx` ya quedo catalogado, planificado y descompuesto de punta a punta; `docs/USER_DASHBOARD_DECOMPOSITION_PLAN.md` cerro todas sus fases y el panel dejo de depender de un monolito critico para seguir evolucionando.
- âœ… corregido: la descomposicion de `user-dashboard-page.tsx` ya extrae `Perfil`, `Seguridad` e `Integraciones` a `client/src/features/users/components/{user-profile-tab,user-security-tab,user-integrations-tab}.tsx`, manteniendo el comportamiento del panel sin mezclar cambios funcionales.
- âœ… corregido: la Fase 5 de la descomposicion ya extrajo helpers puros del panel; `client/src/features/users/utils/user-dashboard-forms.ts` centraliza factories y validadores, evitando duplicacion de estado inicial y reglas embebidas en `user-dashboard-page.tsx`.
- âœ… corregido: la descomposicion estructural del panel ya quedo cerrada; `user-dashboard-page.tsx` funciona como orquestador, bajo a 348 lineas y las tabs principales ya viven en subcomponentes dedicados sin romper el comportamiento del panel.
- âœ… corregido: el hero comercial del home ya no depende de un typewriter con borrado letra por letra; `client/src/features/marketing-home/components/hero-section.tsx` ahora rota mensajes con transicion `fade out / fade in`, manteniendo dinamismo sin castigar lectura ni conversion.
- âœ… corregido: `client/src/features/marketing-home/components/philosophy-section.tsx` ya no expone un bloque abstracto de "transformacion digital global", "mision" o "vision"; la seccion ahora funciona como puente de confianza entre hero y servicios, con enfoque de trabajo y problemas reales de negocio.
- âœ… corregido: `client/src/features/marketing-home/components/services-section.tsx` ya no expone una lista amplia de consultoria, marketing y automatizacion como oferta principal; el home ahora jerarquiza solo sitios corporativos, e-commerce y sistemas web para negocios, alineando mejor posicionamiento y conversion.
- âœ… corregido: `client/src/features/marketing-home/components/showroom-section.tsx` y `client/src/features/testimonials/components/testimonials-section.tsx` ya no se apoyan en copy generico de portafolio o prueba social decorativa; ambos bloques refuerzan mejor credibilidad comercial con contexto de casos reales, valor de negocio y testimonios presentados como evidencia de confianza.
- ✅ corregido: `client/src/features/marketing-home/components/impact-section.tsx` ya no duplica los casos del showroom como "casos de exito" genericos; ahora funciona como bloque de confianza complementario, explicando que sostiene una solucion web profesional sin repetir pruebas ni reabrir dispersion narrativa.
- ✅ corregido: `client/src/features/marketing-home/components/process-section.tsx` ya no presenta SEO, PPC, marketing integral o "resultados medibles" como eje del home; ahora explica un metodo de trabajo enfocado en entender el negocio, definir la solucion correcta, ejecutar con criterio y dejar una base lista para crecer.
- ✅ corregido: `client/src/features/marketing-home/components/tech-section.tsx` ya no forma parte del landing principal; `marketing-home-page.tsx`, `use-home-section-navigation.ts` y la navegacion interna de `Inicio` en `global-navbar.tsx` retiraron `tech` del recorrido del home, dejando `Tecnologias` como pagina satelite accesible desde el header.
- ✅ corregido: `client/src/features/marketing-home/components/comparison-section.tsx` ya no usa tabs para `websites`, `marketing` y `automation`; ahora compara una solucion generica contra un proyecto web pensado para negocio, sin reabrir dispersion de oferta ni promesas fuera de foco.
- ✅ corregido: `client/src/features/marketing-home/components/comparison-section.tsx` ya no se presenta como una tabla plana y amontonada; el bloque ahora usa un board comparativo con mejor jerarquia, respiracion visual y version mobile separada, alineado al patron enterprise de comparativa editorial.
- ✅ corregido: `client/src/features/payments/components/pricing-section.tsx` ya no empuja planes cerrados mensuales ni checkout inmediato dentro de la home; ahora funciona como bloque consultivo de inversion orientativa, con rangos mas coherentes para proyectos web profesionales y un unico cierre hacia propuesta inicial.


- âœ… corregido: el detalle de proyectos del showroom ya no depende de un modal inline largo y ruidoso dentro de `client/src/features/marketing-home/components/showroom-section.tsx`; ahora usa `client/src/features/marketing-home/components/showroom-project-modal.tsx` y `showroom-types.ts` para presentar cada caso con mejor jerarquia, menos ruido visual y layout responsive mas ejecutivo.
- âœ… corregido: el modal de detalle del showroom ya no apaga el fondo con una capa gris pesada ni desperdicia media columna de preview; ahora mantiene backdrop blur mas liviano, presenta `Que necesitaba el cliente / Que resolvimos / Que aporta la solucion` debajo de la imagen, mueve las metricas al espacio util y elimina duplicacion de CTA superior para mejorar claridad y responsive.
- âœ… corregido: el modal del showroom ya no usa scroll interno ni card semitransparente; el scroll vuelve al overlay, el card recupera fondo solido y el backdrop deja de lavar la pagina completa, manteniendo un efecto flotante mas consistente con el landing y sin generar barra de scroll innecesaria cuando el contenido ya entra en viewport.
- âœ… corregido: el modal del showroom ya no obliga a cerrar y volver a abrir cada caso para compararlos; `showroom-section.tsx` ahora orquesta navegacion entre proyectos filtrados y `showroom-project-modal.tsx` reutiliza el mismo visor con `ArrowLeft`, `ArrowRight`, `Escape`, flechas laterales en desktop y controles compactos en mobile.
- âœ… corregido: la navegacion entre casos del showroom ya no duplica flechas dentro del card en desktop; el modal conserva controles compactos solo en mobile/tablet y deja la navegacion externa como patron principal de escritorio.





