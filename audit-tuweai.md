# Auditoría Técnica del Proyecto Tuwebai

## Resumen Ejecutivo

**Clasificación general:** Riesgoso

El proyecto tiene una base funcional y un frontend con bastante trabajo visual ya integrado, pero el repositorio presenta señales claras de crecimiento sin consolidación arquitectónica. Hoy conviven en el mismo repo:

- un frontend React/Vite en `client/`
- un backend Express/TypeScript en `server/`
- un stack PHP legacy en `api/` ✅ corregido: aislado en `legacy/php-api/`
- una Cloud Function separada en `firebase-functions-contacto/`
- artefactos compilados, binarios, reportes, logs y credenciales en raíz ✅ corregido parcialmente: builds/binarios/caches fuera del versionado; secretos locales aún presentes en workspace

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
├─ api/                            # Backend PHP legacy ✅ corregido: aislado en `legacy/php-api/`
├─ firebase/                       # Reglas/config Firestore
├─ firebase-functions-contacto/    # Cloud Function separada
├─ scripts/                        # Smoke/log scripts
├─ docs/                           # Auditorías y documentación
├─ dist/                           # Build frontend versionado
├─ dist-server/                    # Build backend versionado ✅ corregido: removido del versionado
├─ node_modules/                   # Dependencias instaladas dentro del repo
├─ php-temp/                       # Runtime PHP completo dentro del repo ✅ corregido: removido del versionado
└─ raíz                            # Configs, imágenes, reportes, secrets, logs ✅ corregido parcialmente
```

### Lectura arquitectónica

- No es un monorepo gobernado; es un repositorio único con múltiples stacks mezclados.
- Hay dos backends potenciales para varias capacidades: `server/` y `api/`. ✅ corregido parcialmente: PHP movido a `legacy/`
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

Existe [`firebase-service-account.json`](./firebase-service-account.json) en raíz. ✅ corregido parcialmente: sigue local, pero fuera del versionado y protegido por `.gitignore`

Además, el stack PHP legacy usa fallback explícito al archivo local: ✅ corregido parcialmente al aislarse el stack en `legacy/`

- [`api/config/firebase.php`](./api/config/firebase.php) línea 28
- [`api/config/firebase.php`](./api/config/firebase.php) línea 284

Aunque `.gitignore` lo ignora, su presencia física en el repo de trabajo es una mala práctica de alto riesgo y fomenta dependencia operativa en secretos locales. ✅ corregido parcialmente

### 5. ✅ Código legacy PHP con prácticas inseguras sigue coexistiendo

**Impacto:** A - Crítico

En [`api/config/firebase.php`](./api/config/firebase.php):

- línea 88: `CURLOPT_SSL_VERIFYPEER` en `false`
- línea 340: fallback a `VITE_FIREBASE_API_KEY` como token

En [`api/webhooks/mercadopago.php`](./api/webhooks/mercadopago.php):

- procesa pagos y notifica dashboard en paralelo al stack Node actual

Esto no solo es deuda técnica: es **riesgo activo** si ese código sigue desplegado o es reactivable. ✅ corregido parcialmente mediante aislamiento del stack

---

## Archivos Basura

### Safe to delete

- `generated-icon.png`
  - sin referencias detectadas
- `ts_errors.log`
  - sin referencias detectadas ✅ corregido parcialmente: sigue siendo local/ignorado
- `dist/`
  - artefacto compilado ✅ corregido parcialmente: ya estaba fuera del versionado
- `dist-server/`
  - artefacto compilado ✅ corregido
- `node_modules/`
  - dependencia instalada, no debe vivir en repo
- `logs/`
  - datos operativos locales ✅ corregido parcialmente: patrón protegido por `.gitignore`
- `php-temp/`
  - runtime/binarios de PHP, no corresponde versionarlo ✅ corregido

### Needs review

- `api/`
  - legacy serio; no eliminar sin confirmar despliegues activos ✅ corregido: aislado en `legacy/`
- `firebase-functions-contacto/functions/lib/`
  - build compilado dentro de subproyecto ✅ corregido
- `client/vite.config.ts`
  - configuración duplicada respecto a raíz ✅ corregido parcialmente: marcada deprecated
- `client/netlify.toml`
  - configuración duplicada respecto a raíz ✅ corregido parcialmente: marcada deprecated
- `tuweb-ai.com-20260305T235948.json`
  - reporte Lighthouse puntual; útil solo si se versiona deliberadamente ✅ corregido parcialmente: patrón ahora ignorado
- `.replit`
  - resto de entorno anterior; no integra con el stack vigente
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
El runtime principal ya fue reubicado a `client/src/app/App.tsx` y `client/src/App.tsx` quedó como bridge temporal controlado. ✅ corregido parcialmente
Los providers globales del runtime frontend ya fueron extraídos a `client/src/app/providers/AppProviders.tsx`, reduciendo acoplamiento en `App`. ✅ corregido parcialmente
La tabla de rutas del runtime frontend ya fue extraída a `client/src/app/router/AppRoutes.tsx`, manteniendo paths y lazy loading sin cambios funcionales. ✅ corregido parcialmente
Las páginas `pago-exitoso`, `pago-fallido` y `pago-pendiente` ya no forman parte estructural del router; el runtime consume directamente `features/payments/components/payment-return-view` y esas páginas quedan como entrypoints mínimos temporales. ✅ corregido parcialmente
La página `contacto` ya no forma parte estructural del router; el runtime consume directamente `features/contact/components/support-contact-page` y `client/src/pages/contacto.tsx` quedó como bridge mínimo temporal. ✅ corregido parcialmente
La página `auth-verify` ya no forma parte estructural del router; el runtime consume directamente `features/auth/components/auth-verify-page` y `client/src/pages/auth-verify.tsx` quedó como bridge mínimo temporal. ✅ corregido parcialmente
La página `consulta` ya no forma parte estructural del router; el runtime consume directamente `features/proposals/components/proposal-request-page` y `client/src/pages/consulta.tsx` quedó como bridge mínimo temporal. ✅ corregido parcialmente
La página `panel-usuario` ya no forma parte estructural del router ni del prefetch; el runtime consume directamente `features/users/components/user-dashboard-page` y `client/src/pages/panel-usuario.tsx` quedó como bridge mínimo temporal. ✅ corregido parcialmente
La página `home` sigue siendo runtime estructural del landing; hoy mezcla composición, scroll orchestration y lazy loading de sections temporales, por lo que no corresponde adelgazarla en Fase 4 sin definir antes el target final de `marketing-home`. ✅ corregido parcialmente
`client/src/App.tsx` ya quedó como bridge controlado hacia `app/App`, pero el router todavía depende de páginas institucionales y el landing sigue bloqueando la Fase 6 por su composición temporal en `components/sections/*`. ✅ corregido parcialmente
Se auditó `marketing-home` y quedó trazado el mapa `responsabilidad -> destino`; `home.tsx` sigue siendo shell estructural del landing y las sections temporales quedaron clasificadas para migración por slices, no para limpieza directa. ✅ corregido parcialmente
La navegación del landing (`location.search`, `location.hash`, `sectionRefs` y fallback scrolling) ya fue extraída desde `client/src/pages/home.tsx` hacia `features/marketing-home/hooks/use-home-section-navigation`, reduciendo acoplamiento sin alterar la UX del home. ✅ corregido parcialmente
La `hero-section` del landing ya fue movida a `features/marketing-home/components/hero-section`; `home.tsx` consume la implementación final y `components/sections/hero-section.tsx` quedó solo como wrapper temporal de compatibilidad. ✅ corregido parcialmente
La `philosophy-section` del landing ya fue movida a `features/marketing-home/components/philosophy-section`; `home.tsx` consume la implementación final y `components/sections/philosophy-section.tsx` quedó solo como wrapper temporal de compatibilidad. ✅ corregido parcialmente
La `services-section` del landing ya fue movida a `features/marketing-home/components/services-section`; `home.tsx` consume la implementación final y `components/sections/services-section.tsx` quedó solo como wrapper temporal de compatibilidad. ✅ corregido parcialmente
La `process-section` del landing ya fue movida a `features/marketing-home/components/process-section`; `home.tsx` consume la implementación final y `components/sections/process-section.tsx` quedó solo como wrapper temporal de compatibilidad. ✅ corregido parcialmente
La `tech-section` del landing ya fue movida a `features/marketing-home/components/tech-section`; `home.tsx` consume la implementación final y `components/sections/tech-section.tsx` quedó solo como wrapper temporal de compatibilidad. ✅ corregido parcialmente
La `impact-section` del landing ya fue movida a `features/marketing-home/components/impact-section`; `home.tsx` consume la implementación final y `components/sections/impact-section.tsx` quedó solo como wrapper temporal de compatibilidad. ✅ corregido parcialmente
La `comparison-section` del landing ya fue movida a `features/marketing-home/components/comparison-section`; `home.tsx` consume la implementación final y `components/sections/comparison-section.tsx` quedó solo como wrapper temporal de compatibilidad. ✅ corregido parcialmente
La `showroom-section` del landing ya fue movida a `features/marketing-home/components/showroom-section`; `home.tsx` consume la implementación final y `components/sections/showroom-section.tsx` quedó solo como wrapper temporal de compatibilidad. ✅ corregido parcialmente
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
- sacar artefactos, binarios, reportes y secretos fuera del repo ✅ corregido parcialmente

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
