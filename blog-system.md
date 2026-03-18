# Blog System

## Como funciona

El blog de TuWeb.ai usa contenido fuente en `docs-blogs/`, lo carga automaticamente desde Vite mediante un modulo virtual y lo prerenderiza en build para SEO.

Flujo:

1. Crear o editar un archivo `.md` dentro de `docs-blogs/`
2. Vite detecta automaticamente el cambio en desarrollo o build
3. El plugin `tuwebai-blog-content` en `vite.config.ts` lee todos los markdown de `docs-blogs/`
4. `scripts/blog-content-utils.mjs` parsea frontmatter opcional, genera slug desde el nombre del archivo, arma metadata SEO y convierte el contenido a HTML
5. `scripts/prerender-blog-pages.mjs` genera `/blog`, `/blog/:slug` y `sitemap.xml` reales dentro de `dist/`
6. Las rutas `/blog` y `/blog/:slug` consumen ese catalogo sin archivos generados ni comandos manuales

## Estructura del sistema

- `docs-blogs/`
  Contenido fuente en Markdown
- `scripts/blog-content-utils.mjs`
  Parser y normalizacion del contenido
- `scripts/prerender-blog-pages.mjs`
  Prerender estatico del blog y sitemap automatico
- `vite.config.ts`
  Plugin que publica automaticamente los articulos
- `client/src/features/blog/types`
  Contratos tipados del dominio
- `client/src/features/blog/services`
  Acceso al catalogo de articulos
- `client/src/features/blog/hooks`
  Adaptadores para la UI
- `client/src/features/blog/components`
  Pantallas y render del blog
- `client/src/app/router/blog`
  Entradas de routing

## Como agregar nuevos articulos

1. Crear un nuevo archivo `.md` en `docs-blogs/`
2. Asegurarse de que el archivo tenga un H1 unico al inicio
3. El slug se genera automaticamente desde el nombre del archivo
4. Si queres metadata exacta, agregar frontmatter al inicio
5. Si no hay frontmatter, el sistema usa fallbacks automaticos
6. Si queres aportar keywords SEO sin frontmatter, incluirlas dentro del bloque final de especificaciones entre comillas
7. En desarrollo el articulo aparece solo; en build queda prerenderizado automaticamente
8. Verificar el resultado en `/blog` y en `/blog/[slug]`

### Frontmatter soportado

```md
---
title: Titulo SEO o editorial
seoTitle: Variante exacta para title tag
description: Meta description controlada
excerpt: Resumen para la lista del blog
publishedAt: 2026-03-18T00:00:00.000Z
updatedAt: 2026-03-18T00:00:00.000Z
keywords: keyword 1, keyword 2, keyword 3
ogImage: https://tuweb-ai.com/imagen-social.png
noindex: false
---
```

## Reglas de contenido

- No modificar el markdown fuente desde la UI
- Mantener una sola idea principal por articulo
- Usar H2 claros y orientados a intencion de busqueda
- Incluir CTA y enlaces internos del sitio cuando corresponda

## Notas operativas

- No existe comando de sincronizacion manual para publicar articulos
- El sistema no agrega dependencias nuevas para parsear markdown
- El render del blog es estatico y no hace fetch en runtime
- Si entra un archivo nuevo en `docs-blogs/`, Vite fuerza recarga y lo publica automaticamente
- En `build`, el HTML del blog queda prerenderizado con metadata especifica para crawlers
- `dist/sitemap.xml` se genera automaticamente desde la misma fuente de contenido
- El host canonico del sitio y del blog es `https://tuweb-ai.com`

## Checklist Search Console

1. Deployar la version nueva del sitio
2. Verificar que `https://tuweb-ai.com/sitemap.xml` cargue en produccion y liste `/blog` y `/blog/{slug}`
3. Verificar que `https://tuweb-ai.com/robots.txt` apunte a `https://tuweb-ai.com/sitemap.xml`
4. En Google Search Console, dentro de la propiedad de `tuweb-ai.com`, enviar solo `sitemap.xml`
5. No enviar `/blog/sitemaps.xml` porque no es un sitemap valido
6. Una vez enviado, usar "Inspeccion de URL" para pedir indexacion de `/blog` y de los articulos mas importantes
