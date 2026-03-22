# Production Performance Forensic Audit

## Executive Summary

La lentitud persistente de TuWeb.ai en producción no proviene de una sola falla aislada. La causa raíz real es una combinación de arquitectura de arranque compartida, estrategia de prerender parcial y carga de runtime demasiado pesada para rutas públicas.

Hallazgo principal:

- todas las rutas públicas comparten un boot de SPA costoso
- la home, además, venía con prerender React no determinista y hoy depende de remount en cliente
- la home disparaba carga de secciones diferidas por cualquier interacción del usuario, no por necesidad real de viewport
- algunas secciones diferidas terminan tocando un backend en Render, cuyo cold start agrava la latencia percibida

Conclusión técnica:

- el problema no es exclusivamente Netlify
- no es exclusivamente Render
- no es exclusivamente React
- es la combinación de:
  - shell público global pesado
  - bundle inicial grande
  - home prerenderizada pero no realmente hidratable
  - lazy loading mal gatillado
  - dependencias diferidas que tocan backend dormido

## Current Symptoms

Síntomas observados y consistentes con el código actual:

- la home puede verse rápida una vez y lenta en otro refresh
- el problema se percibe peor en producción que en desarrollo
- la lentitud no se limita a `/`
- puede afectar entrada directa desde Google o subpáginas
- hubo errores de hidratación en producción (`React #418` y `#423`) ya mitigados con remount de la home
- luego de eliminar esos errores, persiste latencia intermitente al refrescar o interactuar

## Scope of Investigation

La auditoría cubrió:

- arquitectura de frontend y backend
- entrypoints y providers globales
- rutas públicas y privadas
- configuración de Vite y Netlify
- build de producción actual
- prerender de home y blog
- shell compartido entre rutas
- carga de analytics, auth, scripts de terceros y llamadas a backend
- estrategia de cache y entrega de assets
- diferencias estructurales entre dev y producción

## Repo Architecture Findings

### Stack y arquitectura

- frontend: React 18 + Vite + React Router
- backend: Express + esbuild
- estado/query: TanStack Query
- UI: Tailwind + Radix UI + framer-motion + react-slick
- auth y datos cliente: Firebase
- newsletter/transaccional: backend + Brevo SMTP/API
- hosting esperado:
  - frontend en Netlify
  - backend en Render

### Entry points

Frontend:

- `client/src/main.tsx`
- `client/src/app/App.tsx`
- `client/src/app/providers/AppProviders.tsx`
- `client/src/app/router/AppRoutes.tsx`

Backend:

- `server/index.ts`

Build:

- `vite.config.ts`
- `scripts/prerender-blog-pages.mjs`

### Routing

- `AppRoutes` define una SPA con `/` sin lazy route
- la mayoría de subrutas públicas y privadas entran por `lazy(() => import(...))`
- todas las rutas públicas comparten el mismo shell:
  - `GlobalNavbar`
  - `Footer`
  - `Toaster`
  - `ThemeProvider`
  - `LoginModalProvider`
  - analytics diferido

### Separación público / privado

Hay separación parcial:

- rutas `/panel` y `/auth/*` usan shell autenticado
- rutas públicas usan shell público

Pero el boot base sigue siendo compartido en exceso:

- router
- query client
- shell visual
- footer con newsletter
- modales/login runtime
- analytics

### Providers globales y global shell

En producción pública se monta:

- `ThemeProvider`
- `LoginModalProvider mountAuthProvider`
- `GlobalNavbar`
- `Footer`
- `Toaster`
- `MemoryManager`
- `ResourcePreload`
- `ThirdPartyScriptManager`

Esto significa que incluso una subpágina pública simple carga el mismo armazón global antes de entrar a su contenido específico.

## Production vs Development Differences

### WHY DEV IS FAST BUT PROD IS NOT

No se está ejecutando el mismo runtime.

En `dev`:

- Vite sirve módulos por demanda
- no existe el mismo HTML final de `dist`
- la home no entra por el mismo flujo de prerender de producción
- no hay CDN ni revalidación de HTML
- el backend local no sufre cold starts
- la red es local y de muy baja latencia

En `prod`:

- Netlify entrega HTML estático prerenderizado
- el navegador debe bajar y ejecutar el bundle principal completo para bootear la SPA
- la home llegó a hidratar distinto y hoy hace remount limpio
- rutas y secciones diferidas dependen de chunks reales optimizados
- algunas secciones terminan tocando un backend en Render
- el comportamiento de caché HTML vs assets sí importa

En otras palabras: el código fuente es el mismo, pero el modo de ejecución no.

### Diferencias relevantes encontradas

- producción usa prerender de home y blog
- la home prerenderizada no era hidratable de forma estable
- hoy `/` hace remount en cliente para evitar mismatch
- eso elimina errores, pero mantiene costo de boot
- el build final tiene chunks pesados que en dev no se perciben igual
- hay lazy sections que en producción descargan JS real y pueden tocar backend real

## Build and Bundle Findings

### Build actual de producción

Script relevante:

- `npm run build:frontend`
  - `vite build`
  - `node scripts/prerender-blog-pages.mjs`

### Chunking actual

Vite manualChunks separa:

- Firebase
- framer-motion
- Radix por paquete

Además, `modulePreload.resolveDependencies` filtra:

- `firebase-*`
- `motion-*`
- `radix-*`

Esto ayuda a que no se preloaded esas dependencias pesadas, pero no elimina su costo cuando la ruta o la interacción las dispara.

### Bundle findings del build actual

Pesos observados en el build actual:

- `assets/firebase--UcyTVOC.js` → `427.60 kB`
- `assets/index-DheDPmxL.js` → `342.77 kB`
- `assets/blog.service-DE7dLpHF.js` → `288.23 kB`
- `assets/radix-react-primitive-CPELuhQL.js` → `286.36 kB`
- `assets/motion-CAfZVDSc.js` → `157.19 kB`
- `assets/proposal-request-page-BvD_BM6N.js` → `137.92 kB`
- `assets/index-myknMlZ3.css` → `120.52 kB`
- `assets/marketing-positioning-page-DfboGo6J.js` → `117.59 kB`
- `assets/marketing-automation-page-mCRga-UT.js` → `117.50 kB`
- `assets/web-development-page-CgvpZ6px.js` → `103.26 kB`
- `assets/testimonials-section-BOLfApyQ.js` → `93.55 kB`

### Top módulos / dependencias costosas

Los principales contaminantes del ecosistema público son:

- `framer-motion`
- `@radix-ui/*`
- `react-slick` + `slick-carousel`
- `react-helmet`
- bundle shell `index-*`

Firebase sigue existiendo como chunk grande, pero el code splitting actual evita que contamine directamente el preload inicial de home. No es el principal responsable del first paint público.

### Rutas que arrastran código que no deberían

Hallazgo estructural:

- todas las rutas públicas arrastran el mismo shell global
- el shell arrastra `GlobalNavbar`, `Footer`, `Toaster`, analytics y proveedores
- incluso rutas con contenido estático siguen necesitando bootear el `index` principal

Esto hace que:

- la carga base de `/`
- una subpágina de servicio
- una ruta legal
- una entrada directa desde Google

compartan una penalización inicial similar, aunque su contenido sea distinto.

## Runtime Findings

### Home runtime

La home monta:

- hero con `framer-motion` y `react-scroll`
- filosofía, servicios y proceso
- floating UI diferida
- secciones pesadas lazy:
  - showroom
  - pricing
  - impact
  - testimonials
  - contact

### Hallazgo crítico ya corregido

Antes, `MarketingHomePage` disparaba esas secciones diferidas:

- al `scroll`
- al `pointerdown`
- al `keydown`

Eso significaba que un simple click o gesto podía disparar de golpe descarga de múltiples chunks pesados.

Ese comportamiento era un factor directo de la percepción de “a veces se clava cuando hago click o refresco”.

Ahora fue corregido para usar un gate por `IntersectionObserver`, es decir:

- las secciones se cargan por proximidad real al viewport
- no por cualquier intención de usuario

### Home prerender

La home ya no usa prerender React real en build. La estrategia actual es:

- HTML estático inicial desde `client/index.html`
- montaje limpio en cliente desde `main.tsx`

Problema encontrado:

- el árbol no era totalmente determinista entre SSR y cliente
- esto producía `React #418 / #423`

Mitigación aplicada:

- se eliminó el prerender React completo de la home del pipeline de build
- la home usa una sola estrategia estable: shell HTML estático + montaje cliente
- ya no existe una rama especial de hidratación/remount solo para `/`

Esto elimina el error de producción, pero introduce una realidad importante:

- la home depende del boot JS para entrar al modo interactivo
- por eso el peso del runtime sigue importando

### Requests y servicios

No se observan requests de backend estrictamente bloqueantes para el above-the-fold público en el primer paint.

Pero sí hay un factor secundario importante:

- `TestimonialsSection` usa `useTestimonials`
- `getAllTestimonials()` llama al backend
- el hook se activa cuando la sección entra en viewport

Si el backend en Render está dormido:

- esa parte de la página puede quedarse esperando
- y el usuario lo percibe como lentitud “intermitente”

### Third-party scripts

Analytics:

- GA se carga diferido con `runWhenIdle` o por intención del usuario
- no bloquea el HTML inicial

Adsense:

- solo se considera en `/blog` y `/blog/:slug`
- además se difiere

Conclusión:

- third-party scripts existen
- pero no son el principal cuello de botella del arranque global actual

## Route-Level Findings

### `/`

Es la ruta con mayor complejidad:

- prerender de home
- remount en cliente
- hero con motion
- varias secciones lazy
- shell global compartido
- footer y newsletter

Es la ruta más sensible y la que más exhibe los defectos estructurales del boot público.

### Subpáginas públicas

Aunque no cargan el hero, comparten:

- `index-*` principal
- shell global
- navbar
- footer
- analytics diferido
- providers

Eso explica por qué una subpágina también puede sentirse lenta aunque el problema se asocie visualmente a la home.

### Blog

El blog está prerenderizado como HTML estático.

Puntos buenos:

- contenido SEO-friendly ya está en HTML
- no depende de fetch inicial para pintar el artículo

Punto estructural:

- igual carga el runtime SPA general al arrancar
- además en blog puede entrar Adsense diferido

### Formularios

Newsletter, contacto y otros formularios no explican el first paint, pero sí pueden empeorar interacciones posteriores si el backend tarda o si Render hace cold start.

## External Services Impact

### Firebase

Impacto:

- chunk separado grande
- no bloquea directamente el primer paint público si no se toca auth runtime

Estado:

- no es causa raíz principal del lag inicial
- sí es una deuda de peso estructural

### Auth

Estado actual:

- el shell público ya no monta `AuthProvider` global de forma base
- `LoginModalProvider` sí sigue presente

Impacto:

- menor que antes
- no aparece como causa raíz principal del problema actual

### Analytics

Estado:

- diferido por idle/intención
- no bloqueante para first paint

Impacto:

- secundario

### Brevo / newsletter

Impacto:

- no interviene en el render inicial público
- afecta flujos de envío, no first load

### Render backend

Impacto real:

- factor secundario muy importante para rutas/secciones que terminan pidiendo backend desde visitante anónimo
- especialmente cuando Render entra en cold start

### COMMON PERFORMANCE DENOMINATOR ACROSS ROUTES

El denominador común de las rutas lentas es:

1. boot de SPA compartido y pesado
2. shell público global montado en todas las rutas
3. `index-*` principal grande
4. CSS global amplio
5. dependencia del runtime cliente incluso cuando el HTML ya está prerenderizado

En la home, además:

6. remount del prerender
7. carga diferida de secciones pesadas
8. llamadas posteriores a backend desde secciones públicas

## Cache / CDN / Asset Delivery Findings

### Estado actual

Configuración observada:

- HTML: `Cache-Control: public, max-age=0, must-revalidate`
- assets fingerprinted: `Cache-Control: public, max-age=31536000, immutable`

Eso está bien conceptualmente.

### Hallazgos

Positivos:

- assets bajo `/assets/*` son cacheables e inmutables
- HTML quedó configurado para revalidación
- no hay service worker registrado
- fuentes son locales, no de Google Fonts

Limitaciones:

- no hay control explícito de compresión desde repo; depende de Netlify
- no hay evidencia en repo de Brotli/Gzip personalizado
- rutas root como imágenes sueltas no siempre usan fingerprinting estricto

### CACHE / CDN / ASSET DELIVERY FINDINGS

Hallazgo principal de cache:

- la estrategia actual de headers es razonable y no aparece como causa raíz principal de la lentitud persistente

Hallazgo secundario:

- una cache vieja de HTML sí pudo explicar incoherencias previas de chunks o hidratación
- pero después de normalizar headers, ese punto queda como contribuyente menor, no como raíz actual

## Root Cause Analysis

### 1. Symptoms

- lentitud intermitente en producción
- no reproducible igual en dev
- afecta home y subrutas
- refresh duro inconsistente
- sensación de “a veces rápido, a veces clavado”

### 2. Confirmed Findings

- todas las rutas públicas comparten un shell global costoso
- el bundle principal público sigue siendo grande (`~343 kB`)
- la home estaba prerenderizada con árbol no determinista
- para evitar mismatch, hoy la home hace remount cliente
- la home disparaba lazy sections pesadas por cualquier interacción
- algunas secciones públicas llaman a backend en Render
- Render puede agravar la latencia cuando esas secciones se activan

### 3. False Leads / Non-root issues

No son la raíz principal:

- `VITE_API_URL` con `/api` al final
- Brevo / newsletter SMTP
- third-party scripts como causa central del first paint
- service worker
- Netlify como único culpable
- Firebase como causa única del arranque público

### 4. Primary Root Cause

La causa raíz primaria es:

**un boot de SPA público demasiado pesado y compartido entre rutas, combinado con una home prerenderizada que no pudo mantenerse hidratable y hoy depende de remount cliente para estabilizarse.**

Eso obliga a que:

- el HTML inicial exista
- pero la experiencia real dependa de descargar, parsear y montar un runtime grande

### 5. Secondary Contributing Factors

- lazy loading mal gatillado en home
- secciones diferidas demasiado pesadas
- fetch de testimonios contra backend en Render
- cold starts del backend
- CSS global relativamente grande
- shell compartido en rutas que podrían ser mucho más livianas

### 6. Why Previous Fixes Were Insufficient

Los fixes previos fueron correctos, pero insuficientes porque atacaban síntomas o subproblemas:

- cache headers
- hydration mismatch
- shells lazy
- motion en algunos widgets
- Radix en algunos flujos
- newsletter y SMTP

Eso mejoró partes del sistema, pero no eliminó el patrón común:

- **demasiado código compartido en el arranque público**
- **home con estrategia híbrida prerender + remount**
- **carga diferida mal orquestada**

### 7. Exact Remediation Strategy

La estrategia correcta es:

1. reducir el shell público compartido
2. eliminar dependencias no críticas del critical path público
3. dejar la home con una estrategia consistente:
   - o prerender realmente hidratable
   - o estática + islands/client mounts bien definidos
4. convertir las secciones pesadas de home en carga progresiva real por viewport
5. sacar cualquier fetch público no crítico del flujo inicial o de los primeros segundos de interacción
6. medir producción real después de cada fase

## Why Previous Fixes Did Not Fully Solve It

Porque el problema de fondo no era un único bug:

- arreglar la hidratación quitó errores, pero no el costo de boot
- arreglar cache HTML quitó incoherencias, pero no el peso del runtime
- mover scripts de terceros fuera del critical path ayudó, pero el shell público siguió siendo grande
- separar partes de auth redujo infraestructura innecesaria, pero no resolvió la estrategia general de render público

En resumen:

- los fixes anteriores mejoraron estabilidad
- pero no completaron la simplificación arquitectónica del arranque público

## Enterprise Remediation Plan

### Phase 0 — Safety / Baseline

#### Item 0.1

- problema: no hay baseline formal de producción por ruta
- impacto: se corrigen síntomas sin comparar mejora real
- evidencia: el problema se percibe “a veces sí, a veces no”
- corrección exacta:
  - registrar TTFB, FCP, LCP y tiempo a interacción en `/`, una subpágina, un artículo y `/blog`
  - medir cold y warm cache
- riesgo: bajo
- prioridad: crítica
- validación:
  - misma matriz de escenarios antes y después de cada fase

Estado actual:

- [x] baseline inicial incorporado al repo con `npm run perf:baseline`
- [x] snapshot persistido en `outputs/performance-baseline/latest.json`
- [x] resumen legible persistido en `outputs/performance-baseline/latest.md`
- [x] evidencia real de produccion capturada el `2026-03-19T21:13:28.019Z`
- [x] cold HTML TTFB observado por ruta:
  - `/` -> `254.18 ms`
  - `/blog` -> `449.43 ms`
  - `/blog/landing-page-negocios-locales` -> `496.46 ms`
  - `/servicios/desarrollo-web` -> `289.68 ms`
- [x] warm HTML TTFB observado por ruta:
  - `/` -> `51.14 ms`
  - `/blog` -> `229.79 ms`
  - `/blog/landing-page-negocios-locales` -> `237.60 ms`
  - `/servicios/desarrollo-web` -> `49.48 ms`
- [x] anomalia detectada en entrega de assets: `index-myknMlZ3.css` con cold TTFB `706.67 ms` y `age: 0` en `/`

#### Item 0.2

- problema: Render introduce latencia intermitente en rutas/secciones con fetch
- impacto: distorsiona percepción de performance
- evidencia: secciones públicas tocan backend y Render ya mostró timeouts/cold behavior
- corrección exacta:
  - separar performance de frontend puro vs dependencia backend
  - medir con backend despierto y dormido
- riesgo: bajo
- prioridad: alta
- validación:
  - comparar load con backend caliente vs frío

Estado actual:

- [x] baseline separa frontend y backend
- [x] mide `cold` y `warm` sobre `frontendBaseUrl` y `/api/health`
- [x] deja evidencia de headers de caché y tiempos de TTFB por ruta
- [x] backend `GET /api/health` medido:
  - cold -> `388.58 ms`
  - warm -> `260.28 ms`
- [x] la evidencia inicial muestra que el backend en estado saludable no explica por si solo los picos de `450-500 ms` del HTML publico

### Phase 1 — Critical fixes

#### Item 1.1

- problema: shell público sigue demasiado grande
- impacto: todas las rutas públicas pagan boot cost alto
- evidencia: `index-*` ~343 kB y shell compartido en todas las rutas
- corrección exacta:
  - dividir shell público mínimo vs shell extendido
  - sacar de arranque global cualquier componente no crítico para todas las rutas
- riesgo: medio
- prioridad: crítica
- validación:
  - bajar tamaño del `index-*`
  - revisar que rutas públicas básicas arranquen con menos JS

Estado actual:

- [x] el formulario de newsletter del footer ya no entra en el arranque global del shell publico
- [x] `Footer` ahora difiere `NewsletterForm` por proximidad al viewport
- [x] el shell compartido conserva layout y funcionalidad visual, pero reduce codigo inicial innecesario en rutas anonimas
- [x] `App.tsx` ya no importa hooks de auth/privacidad en el arranque publico; el shell autenticado se movio a `authenticated-app-root`
- [x] el arbol publico ya no monta `AuthProvider` por defecto; `GlobalNavbar` usa estado anonimo liviano y el login monta auth solo al abrir el modal lazy
- [x] efecto medido en build local:
  - `index-*` bajo de `342.77 kB` a `307.58 kB`
  - `newsletter-form-*` quedo aislado en un chunk propio de `3.91 kB`
  - `authenticated-app-root-*` quedo aislado en un chunk propio de `5.24 kB`
  - `login-modal-root-*` quedo aislado en un chunk propio de `25.96 kB`

#### Item 1.2

- problema: la home hoy usa prerender + remount
- impacto: elimina mismatch, pero mantiene costo extra y complejidad
- evidencia: `main.tsx` remonta `/` en cliente
- corrección exacta:
  - elegir una sola estrategia estable:
    - home estática no hidratada con islands, o
    - home realmente hidratable quitando motion/scroll/head no determinista del árbol SSR
- riesgo: medio
- prioridad: crítica
- validación:
  - sin errores de hidratación
  - sin blank/flicker perceptible
  - TTI menor

Estado actual:

- [x] se eliminó el prerender React completo de la home del pipeline de build
- [x] `main.tsx` quedó simplificado a un único montaje cliente
- [x] la estrategia de home ahora es explícita y consistente: shell HTML estático + arranque cliente

#### Item 1.3

- problema: secciones públicas que llaman backend para contenido no crítico
- impacto: latencia intermitente por cold start
- evidencia: testimonios públicos consumen backend desde home
- corrección exacta:
  - prerenderizar testimonios aprobados como snapshot estático o virtual module
  - o mover esa carga fuera del recorrido inicial/anónimo
- riesgo: medio
- prioridad: crítica
- validación:
  - home no depende de backend para contenido editorial de prueba social

Estado actual:

- [x] la home pública ya no monta `TestimonialsSection`
- [x] `MarketingHomePage` dejó de cargar el chunk de testimonios en el recorrido anónimo
- [x] la navegación de secciones del home ya no publica ni espera el ancla `testimonials`
- [x] el módulo live de testimonios sigue disponible fuera de la home, por lo que el cambio queda aislado al path público crítico

### Phase 2 — Structural fixes

#### Item 2.1

- problema: hero y secciones superiores siguen usando motion pesado
- impacto: mayor parse/execute cost en home
- evidencia: `motion-*` ~157 kB
- corrección exacta:
  - reducir `framer-motion` en above-the-fold
  - reemplazar animaciones ornamentales por CSS cuando no aporten valor funcional
- riesgo: medio
- prioridad: alta
- validación:
  - chunk de motion menor o totalmente diferido

Estado actual:

- [x] `HeroSection` ya no usa `framer-motion` en el above-the-fold del home
- [x] el texto rotativo y la flecha de scroll quedaron resueltos con estado local y transiciones CSS nativas
- [x] el hero conserva estructura, copy y CTA, pero elimina `LazyMotion`, `AnimatePresence` y `m.*` del arranque superior
- [x] `ImpactSection`, `PricingSection` y `ContactSection` ya no dependen de `framer-motion` para reveals y hover ornamentales
- [x] esas tres secciones del home mantienen `IntersectionObserver` y transiciones CSS locales, sin tocar checkout ni envíos del formulario
- [x] `ShowroomSection` ya no importa `framer-motion` en scroll; sus reveals y hover quedaron en CSS/transiciones locales
- [x] `ShowroomProjectModal` pasó a `lazy`, aislando el detalle interactivo en `showroom-project-modal-*` (~21.02 kB)
- [x] el chunk `showroom-section-*` bajó de ~36.96 kB a ~16.91 kB y deja de pagar el modal en el recorrido del home
- [x] la validación funcional quedó verde (`npm run check`, `lint`, `build`, `smoke` y `perf:budget`)
- [x] el chunk `motion-*` todavía no baja porque siguen existiendo otras rutas públicas que lo importan, así que este punto queda mitigado parcialmente y no cerrado del todo

#### Item 2.2

- problema: CSS global amplio
- impacto: penalización compartida en todas las rutas
- evidencia: `index.css` final ~120.52 kB
- corrección exacta:
  - revisar utilidades globales, estilos de componentes legacy y CSS importado por sliders
  - partir estilos de features que no son críticas
- riesgo: medio
- prioridad: alta
- validación:
  - reducción medible del CSS principal

Estado actual:

- [x] los estilos de Slick Carousel ya no viven en `index.css`
- [x] las reglas de Slick quedaron aisladas en el módulo de testimonios
- [x] el import directo a `slick-carousel/slick.css` fue reemplazado por un subset local mínimo
- [x] se limpió un bloque duplicado de utilidades globales (`bg-glass`, `glass-panel`, `modal-overlay`) que estaba inflando el CSS base
- [x] el shell compartido de `web-development-page` y `strategic-consulting-page` salió a un stylesheet lazy propio
- [x] parte de los gradientes, sidebars, CTAs y cards de esas rutas ya no contaminan el CSS público compartido
- [x] `proposal-request-page` ya mueve header, frame, card, feedback y CTA principal a un stylesheet lazy propio
- [x] `ecommerce-solutions-page` ya mueve header, grilla de beneficios, featured card, tags y CTAs a un stylesheet lazy propio
- [x] el build ahora emite `ecommerce-solutions-page-*.css` (~4.42 kB) y `index.css` bajó a ~120.56 kB
- [x] `uxui-page` ya mueve header, hero, cards de servicios, cards de proceso y CTA final a un stylesheet lazy propio
- [x] el build ahora emite `uxui-page-*.css` (~6.65 kB), `uxui-page-*` bajó a ~48.10 kB e `index.css` bajó a ~119.64 kB
- [x] se podaron rutas satÃ©lite sin exposiciÃ³n pÃºblica real: `/equipo`, `/estudio` y `/vacantes`
- [x] tambiÃ©n se eliminÃ³ el prefetch de `/vacantes`, reduciendo superficie pÃºblica y mantenimiento innecesario
- [x] se eliminÃ³ `/comparativas`, que sÃ³lo sobrevivÃ­a en footer y no formaba parte del discurso comercial principal

- [x] `/servicios/consultoria-estrategica`, `/servicios/posicionamiento-marketing` y `/servicios/automatizacion-marketing` se consolidaron en `/servicios/estrategia-digital`
- [x] las tres URLs viejas ahora redirigen a la ruta consolidada, reduciendo superficie publica, CSS duplicado y mantenimiento
- [x] se retiraron `/tecnologias` y `/servicios/estrategia-digital` del recorrido publico principal
- [x] las URLs viejas del bloque de marketing ahora redirigen a `/consulta`, preservando continuidad comercial sin mantener landings de bajo valor
- [x] `/blog` y `/blog/:slug` ya mueven sus superficies visuales especificas a `features/blog/components/blog-pages.css`, evitando que cards editoriales, pills y prose arbitraria sigan contaminando `index.css`
- [x] el build ahora emite `blog-pages-*.css` (~4.63 kB) y `index.css` bajó a ~110.93 kB
- [x] `npm run perf:budget` vuelve a pasar con `entry-css` dentro del budget (`108.33 KiB / max 110.84 KiB`)

#### Item 2.3

- problema: prerender del blog y subpáginas sigue cargando runtime SPA completo
- impacto: el HTML ayuda a SEO, pero no minimiza el boot cliente
- evidencia: todos cargan `index-*`
- [x] la librería editorial virtual se separó en `virtual:blog-posts-index` y `virtual:blog-posts-full`
- [x] `/blog` ya no arrastra `html`, `markdown` ni `headings` completos de todos los artículos en su JS inicial
- [x] el listado del blog ahora resuelve un `blog-page-*.js` liviano (~9.91 kB) y comparte `blog-pages-*.js` (~43.20 kB)
- [x] el detalle pesado queda aislado en `blog-article-page-*.js` (~274.52 kB) y no contamina la ruta de listado
- corrección exacta:
  - evaluar islands o entradas públicas más delgadas
  - o shell específico para blog/legal con menos código compartido
- riesgo: medio/alto
- prioridad: media
- validación:
  - artículo/blog con menor JS inicial

### Phase 3 — Hardening and verification

Estado actual:

- [x] el prerender de `/blog` y `/blog/:slug` ya no deja el `script type="module"` directo al entrypoint principal
- [x] las pÃ¡ginas prerenderizadas del blog ahora difieren el bootstrap SPA a `requestIdleCallback` o a la primera interacciÃ³n
- [x] el HTML del blog conserva CSS y metadatos, pero evita descargar y ejecutar `index-*` en el primer paint
- [x] la navegación interna, canónicos y emails ya apuntan a `/blog/` para evitar el redirect interno `/blog -> /blog/`

#### Item 3.1

- problema: performance dependiente de interacción y red real
- impacto: regresiones silenciosas
- evidencia: el problema persistió a través de múltiples fixes parciales
- corrección exacta:
  - agregar budget de build
  - reportar chunks > umbral
  - checklist post-deploy
- riesgo: bajo
- prioridad: alta
- validación:
  - budgets fallando en CI cuando reaparece contaminación del entrypoint

Estado actual:

- [x] se agregÃ³ `scripts/perf-budget.mjs` para validar budgets del build sobre `dist/assets`
- [x] se agregÃ³ `npm run perf:budget` en `package.json`
- [x] el budget controla `index-*.js`, `index-*.css`, `motion-*`, `radix-react-primitive-*` y `firebase--*`
- [x] la selecciÃ³n de artefactos usa el build mÃ¡s reciente, evitando falsos positivos por archivos viejos en `dist`

#### Item 3.2

- problema: no hay validación productiva continua por escenarios
- impacto: se arregla una ruta y se rompe otra
- evidencia: síntomas compartidos entre rutas
- corrección exacta:
  - matriz de validación por cold load, reload, navegación interna y acceso directo
- riesgo: bajo
- prioridad: alta
- validación:
  - checklist estable después de cada deploy

Estado actual:

- [x] se agregÃ³ `scripts/perf-verify-production.mjs` para ejecutar una matriz productiva por escenarios
- [x] se agregÃ³ `npm run perf:verify` en `package.json`
- [x] la matriz cubre cold/warm load, acceso directo a rutas pÃºblicas, continuidad de rutas legacy y salud del backend
- [x] el reporte se guarda en `outputs/performance-baseline/verification-matrix.{json,md}`

 - [x] se agrego instrumentacion RUM propia para la primera navegacion real del usuario
 - [x] el cliente ahora envia un beacon a `/api/performance/beacon` con TTFB, DOM, paints y recursos lentos
 - [x] el backend clasifica y loguea `frontend.navigation_sample` y `frontend.navigation_slow` para separar latencia de documento, assets y runtime

## Validation Checklist

### Cold load

- abrir `/` en incógnito sin caché
- medir tiempo hasta primer contenido visible
- medir tiempo hasta interacción usable

### Hard refresh

- hacer `Ctrl+F5` en `/`
- repetir en una subpágina pública
- verificar que no vuelva la descarga agresiva por click

### Navegación interna

- navegar desde `/` a una subpágina de servicio
- volver a `/`
- verificar que no haya picos de carga injustificados

### Acceso directo a subpáginas

- abrir una URL de servicio directa
- abrir un artículo del blog directo
- abrir `/faq` directo

### Acceso desde Google

- simular landing directa en artículo o subpágina
- verificar si el shell público sigue pagando el mismo costo

### Primera visita sin caché

- medir bundles descargados
- verificar TTFB, FCP, LCP

### Segunda visita con caché

- verificar que HTML se revalida y assets permanezcan cacheados
- confirmar que no se redescargan chunks fingerprinted innecesariamente

### Mobile

- probar 4G / throttling
- repetir `/`, subpágina y artículo
- observar lag tras click o scroll temprano

### Desktop

- repetir con conexión estable
- confirmar mejora de parse/execute y tiempo de boot

### Conexiones lentas

- probar con throttling
- verificar impacto de `index-*`, `motion-*`, CSS y cualquier lazy section

## Final Conclusion

- [x] se identificÃ³ que `POST /newsletter` estaba acoplado al envio SMTP de confirmacion y podia amplificar la latencia del backend frio en Render
- [x] el controlador de newsletter ahora responde despues de persistir y deriva confirmacion, welcome y baja a envio en background con logs

La lentitud persistente en producción de TuWeb.ai no se explica por un único bug ya corregible con un parche menor.

La causa raíz verdadera es estructural:

- shell público compartido demasiado pesado
- runtime SPA inicial costoso para todas las rutas
- home prerenderizada pero no plenamente hidratable
- carga diferida mal orquestada
- secciones públicas que todavía dependen de backend para contenido no crítico

Los fixes previos fueron correctos pero parciales. Quitaron errores concretos, no la combinación de factores que sostiene la lentitud.

La remediación definitiva exige:

1. reducir drásticamente el shell público común
2. estabilizar la estrategia de render de la home
3. sacar dependencias remotas no críticas del flujo anónimo
4. volver a medir producción real por escenarios

Veredicto final:

- el problema es real
- la raíz es una combinación de frontend boot architecture + render strategy + runtime orchestration
- ya hay evidencia suficiente para dejar de atacar síntomas y pasar a una remediación estructural por fases
