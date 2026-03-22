# Performance Audit TuWebAI

Fecha: 18 de marzo de 2026  
URL auditada: `https://tuweb-ai.com`  
Alcance: producción pública + revisión del repositorio local

## 1. Resumen ejecutivo

El problema original de lentitud de `tuweb-ai.com` no estaba en el backend ni en el TTFB del HTML. La causa principal era el arranque de una SPA pública demasiado pesada para una home de marketing:

- home CSR-only
- fallback fullscreen bloqueante
- demasiado JavaScript en el critical path
- assets fingerprinted sin cache immutable
- terceros cargando demasiado temprano
- auth/Firebase y secciones secundarias compitiendo en la carga inicial

Durante esta fase ya se aplicaron mitigaciones reales en el repositorio. El estado actual quedó mejor, pero todavía no alcanza un nivel enterprise definitivo hasta deployar los cambios más recientes y completar la separación fuerte entre shell público y shell privado.

## 2. Métricas observadas

## Producción auditada antes de los fixes

Medición de red directa:

- HTML TTFB: `~0.33 s`
- HTML total: `~0.33 s`
- JS principal TTFB: `~0.33 s`
- JS principal total: `~0.43 s`

Conclusión:

- el origin no explicaba por sí solo la sensación de `10 s`

Medición de navegador automatizado en frío:

- FCP: `~21.27 s`
- LCP: `~22.69 s`
- Load event end: `~21.52 s`
- TBT aproximado: `~33 ms`
- CLS: `0`
- DOM size: `982`
- Requests: `56`

Lectura:

- el cuello no era bloqueo extremo de CPU
- el problema era espera antes de contenido útil

Payload observado en producción:

- JS requests: `35`
- JS decoded: `~1.66 MB`
- CSS decoded: `~108 KB`
- imágenes decoded: `~262 KB`
- third-party decoded: `~737 KB`

## Estado actual del build local después de los slices

Build local validado el 18 de marzo de 2026:

- `assets/index-*.js`: `~209 KB`
- `assets/footer-*.js`: `~12 KB` ahora separado del chunk base
- `assets/firebase-*.js`: `~428 KB`
- `assets/radix-*.js`: `~355 KB`
- `assets/motion-*.js`: `~157 KB`
- home prerenderizada en `dist/index.html`
- blog prerenderizado en `dist/blog/*`

Conclusión:

- el shell público mejoró
- siguen existiendo dependencias pesadas que todavía elevan el costo total de la SPA

## 3. Diagnóstico técnico

### 3.1 Render inicial de la home

Antes:

- la home entregaba HTML base sin contenido útil real
- el usuario dependía del boot de React para ver algo sustancial
- el fallback inicial ocupaba toda la pantalla y amplificaba la sensación de sitio clavado

Estado actual del repo:

- [OK] Mitigado parcialmente: el fallback fullscreen fue reemplazado por contenido HTML útil
- [OK] Corregido: la build ahora prerenderiza `/` con React real y entrega HTML de la app en `dist/index.html`

Estado pendiente:

- falta deployar esta versión para que producción pública refleje el prerender nuevo
- todavía no hay SSR verdadero; hoy el sitio sigue siendo una SPA hidratada encima de HTML prerenderizado estático

### 3.2 Bundle y grafo de JavaScript

Hallazgo:

- la landing pública comparte runtime con features más complejas del producto
- persisten chunks pesados asociados a `firebase`, `@radix-ui` y `framer-motion`

Impacto:

- mayor costo de parse, compile y boot
- peor sensibilidad en dispositivos lentos o redes inestables

Estado actual:

- [OK] Mitigado parcialmente: footer movido a lazy chunk
- [OK] Mitigado parcialmente: varias secciones del home y UI flotante ya no montan en el primer render
- [OK] Mitigado parcialmente: el navbar público ya no depende de `framer-motion` para el menú mobile
- [OK] Mitigado parcialmente en repo: `page-banner`, `nav-dots` y `company-logo-slider` ya no dependen de `framer-motion`
- [OK] Mitigado parcialmente en repo: `whatsapp-button` ya no depende de `framer-motion`
- [OK] Mitigado parcialmente en repo: `testimonials-section` y `testimonial-form` ya no dependen de `framer-motion`
- [OK] Mitigado parcialmente en repo: `showroom-section` ya no depende de `framer-motion` y su modal quedó diferido en un chunk lazy propio
- [OK] Mitigado parcialmente en repo: pricing y errores de pago públicos ya no dependen de `Dialog`/`AlertDialog` de Radix
- [OK] Mitigado parcialmente en repo: el shell ya separa la ejecución pública vs autenticada para analytics y privacidad
- [OK] Corregido en repo: el shell autenticado ya vive en un entry diferido (`authenticated-app-root`) y deja de contaminar el bundle público base
- pendiente: seguir reduciendo dependencias del shell base ahora que la separación de providers entre experiencias públicas y privadas quedó resuelta

### 3.3 Auth/Firebase en tráfico anónimo

Hallazgo original:

- la home pública arrastraba inicialización temprana de auth/firestore

Estado actual del repo:

- [OK] Mitigado parcialmente: auth en páginas públicas se inicializa en `idle` o primera interacción

Pendiente:

- [OK] Mitigado parcialmente en repo: las rutas públicas ya no ejecutan hooks de auth/privacidad dentro del shell principal
- [OK] Corregido en repo: el árbol público ya no monta `AuthProvider` por defecto
- [OK] Corregido en repo: el login público monta auth sólo bajo demanda cuando se abre el modal
- [OK] Corregido en repo: la navbar pública ya no depende del provider pesado de auth para renderizar el estado anónimo inicial
- pendiente: seguir bajando el costo del shell público ahora que auth dejó de entrar al bootstrap anónimo

### 3.4 Caché de assets

Hallazgo original:

- producción servía assets fingerprinted con `Cache-Control: public,max-age=0,must-revalidate`

Impacto:

- revalidación innecesaria
- repeat views lentas para JS/CSS ya versionados

Estado actual del repo:

- [OK] Corregido: `netlify.toml` ya define cache immutable para assets fingerprinted
- [OK] Corregido: `client/public/_headers` refuerza la política de cache en Netlify

Pendiente:

- falta deploy para que esto impacte en producción pública

### 3.5 Terceros en el camino crítico

Hallazgo original:

- AdSense, Analytics y otros terceros agregaban ruido de red demasiado temprano

Estado actual del repo:

- [OK] Mitigado parcialmente: AdSense dejó de cargarse globalmente y ahora se inyecta sólo en rutas de blog
- [OK] Mitigado parcialmente: Analytics se difiere a `idle` o primera interacción en páginas públicas

Pendiente:

- revisar si la home principal realmente necesita analytics tan temprano aun diferido
- seguir reduciendo terceros o efectos no esenciales del shell público

### 3.6 Testimonios y secciones secundarias

Hallazgo original:

- el home hacía fetch remoto de testimonios en el primer render
- varias secciones no críticas competían con el arranque

Estado actual del repo:

- [OK] Corregido: testimonios se cargan al acercarse al viewport
- [OK] Mitigado: varias secciones del home se muestran diferidas en `idle` o por intención de usuario

Resultado:

- menos trabajo de red en el arranque inicial
- menor competencia por ancho de banda y parse temprano

### 3.7 Render blocking y fuentes

Hallazgo:

- Google Fonts entraba como dependencia externa del render

Estado:

- [OK] Corregido en repo: `Inter` y `Rajdhani` ahora están self-hosted en `client/public/fonts`
- [OK] Corregido en repo: se removieron los enlaces a `fonts.googleapis.com` y `fonts.gstatic.com` del `head`
- [OK] Corregido en repo: se agregaron preloads mínimos a fuentes locales con `font-display: swap`

Impacto:

- moderado
- no era la causa raíz principal, pero sí sumaba latencia perceptible y dependencia de terceros

## 4. Root Cause

**ROOT CAUSE:**

La causa raíz del problema era una homepage de marketing montada como SPA pesada, sin HTML útil inicial suficiente y con demasiadas responsabilidades cargando demasiado temprano.

Eso combinaba:

1. dependencia del boot del cliente para mostrar contenido útil
2. fallback fullscreen que hacía más visible cualquier demora
3. bundle y shell público con demasiadas responsabilidades compartidas
4. assets hashados sin cache immutable
5. terceros y fetches secundarios entrando demasiado pronto

## 5. Correcciones aplicadas en el repositorio

### Alta prioridad ya implementada

- [OK] Cache immutable para assets fingerprinted en `netlify.toml`
- [OK] `_headers` de Netlify para reforzar cache de assets estáticos
- [OK] Fallback inicial del documento reemplazado por contenido HTML útil
- [OK] Home prerenderizada en build mediante `scripts/prerender-home-app.tsx`
- [OK] Blog prerenderizado y sitemap generado en build
- [OK] Testimonios fuera del critical path inicial
- [OK] Auth/Firebase diferido en páginas públicas
- [OK] AdSense removido del bootstrap global y limitado al blog
- [OK] Analytics diferido en páginas públicas
- [OK] Footer extraído a chunk lazy
- [OK] Estilos editoriales del blog extraídos a `blog-pages.css` lazy, bajando `index.css` a ~110.93 kB
- [OK] `npm run perf:budget` vuelve a pasar con `entry-css` dentro de budget
- [OK] La librería virtual del blog ahora separa índice liviano y detalle completo
- [OK] `/blog` deja de cargar el contenido completo de todos los artículos y resuelve un `blog-page-*.js` de ~9.91 kB
- [OK] `ImpactSection`, `PricingSection` y `ContactSection` del home ya no dependen de `framer-motion`; sus reveals quedaron en CSS + `IntersectionObserver`
- [OK] El costo de `motion-*` sigue mitigado parcialmente porque todavía hay otras rutas públicas que conservan imports de `framer-motion`

### Mejora lograda

- el usuario ya no depende tanto de una pantalla vacía o de un spinner fullscreen
- la build entrega HTML real en `/` y `/blog/*`
- el shell compartido pesa menos que antes
- el waterfall inicial quedó más limpio

## 6. Riesgos y límites actuales

Aunque la mejora es real, todavía quedan límites para considerarlo enterprise grade completo:

- la home ya no depende de un prerender editorial manual; ahora hidrata sobre markup React real generado en build
- `firebase`, `radix` y `motion` siguen siendo chunks relevantes
- shell público y privado todavía comparten demasiada infraestructura
- falta deploy para validar impacto en producción real
- la auditoría original de producción no refleja todavía el estado nuevo porque el dominio público aún no fue actualizado con este build

## 7. Plan de corrección recomendado

### Alta prioridad

#### A. Deploy inmediato de esta versión

Problema:

- varias mejoras ya existen en repo pero todavía no están en producción

Impacto:

- permite medir mejora real en Core Web Vitals y waterfall público

Solución técnica:

- deployar esta build
- validar `dist/index.html`, cache headers y carga real en producción

#### B. Separar shell público del shell autenticado

Problema:

- el home sigue compartiendo demasiada infraestructura con panel/auth

Impacto:

- reduce JS inicial y trabajo innecesario para tráfico anónimo

Solución técnica:

- mover `AuthProvider` y lógica asociada a un shell privado
- dejar un shell público más liviano para marketing, blog y contenido

#### C. Reducir dependencias del shell base

Problema:

- `firebase`, `radix` y `motion` siguen representando costo importante

Impacto:

- menor parse/compile
- menor riesgo de boot lento

Solución técnica:

- auditar qué componentes del home necesitan realmente `motion`
- [OK] Corregido en repo: `global-navbar` ya no arrastra `framer-motion` para la navegación mobile
- revisar si parte de `radix` puede quedar fuera del shell público
- evitar arrastrar módulos privados o modales no esenciales al arranque inicial

### Media prioridad

#### D. Self-host de fuentes

Problema:

- Google Fonts era una dependencia externa del render

Solución técnica:

- [OK] Corregido en repo: `Inter` y `Rajdhani` ahora se sirven desde `client/public/fonts`
- [OK] Corregido en repo: `font-display: swap`
- [OK] Corregido en repo: preload sólo de variantes necesarias

#### E. Refinar el prerender de la home

Problema:

- [OK] Corregido en repo: la home ya se prerenderiza desde el árbol real de React y no desde un fallback editorial manual

Solución técnica:

- evolucionar a un pipeline de SSR/SSG más formal o a un prerender más cercano al árbol real
- mantener metadata y schema en build como fuente de verdad

### Optimización futura

#### F. Performance budgets

Definir objetivos explícitos:

- JS inicial público `< 250 KB gzip`
- requests iniciales `< 25`
- LCP objetivo `< 2.5 s`
- TBT `< 200 ms`

#### G. Reemplazo o reducción de librerías pesadas

- revisar `react-slick` y dependencias de testimonios
- revisar animaciones costosas del home
- revisar uso completo de `@radix-ui` en experiencia pública

## 8. Veredicto actual

El sitio no era lento por backend. Era lento por arquitectura de frontend y estrategia de entrega.

Después de los slices aplicados, el repositorio quedó en una posición mucho mejor:

- la home ya se prerenderiza
- el critical path público está más limpio
- auth, ads, analytics y testimonios ya no compiten igual que antes
- los assets ya están listos para cache immutable
- las fuentes ya no dependen de Google Fonts en el render inicial

Veredicto técnico:

- **sí hubo una corrección real de la causa principal en el repo**
- **todavía falta deploy y una separación pública/privada más fuerte para hablar de nivel enterprise completo**

## 9. Próximo paso recomendado

Orden recomendado:

1. deployar esta versión
2. medir Lighthouse y waterfall reales en producción
3. separar shell público vs privado
4. reducir chunks `firebase`, `radix` y `motion` del arranque público
5. seguir expandiendo prerender a más páginas públicas de negocio
