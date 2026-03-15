# Decisión Técnica: Service Worker

**Fecha:** 2026-03-14  
**Responsable:** Staff Frontend Performance Engineer  

## 1. Auditoría del estado actual

### Arquitectura y navegación
- Frontend SPA con Vite + React.
- Routing con `react-router-dom` y `LazyRoute` para rutas no críticas.
- Landing y páginas informativas conviven con rutas autenticadas (panel).

### Caching y CDN
- Netlify con `Cache-Control` explícito solo para `/image_perfil.jpg`.
- Firebase Hosting con rewrite a `/index.html` (SPA).
- No hay estrategia de caching global para assets estáticos en headers.

### Service Worker / PWA
- Existe `manifest.json` (PWA básica).
- No hay service worker registrado ni assets pre-cacheados.

### Recursos críticos
- Google Fonts cargadas desde `fonts.googleapis.com` y `fonts.gstatic.com`.
- Preconnect y preload ya aplicados en `index.html`.

### Impacto esperado
- El sitio es mayormente informativo y depende de contenido actualizado.
- La parte autenticada (panel) consume APIs y contenido sensible.

## 2. Decisión técnica

**Decisión:** **NO implementar service worker en este momento.**

## 3. Justificación

- El beneficio de offline cache para una web principalmente informativa es limitado.
- Riesgo alto de servir contenido stale en rutas sensibles (panel, autenticación).
- No existen headers de cache global ni versión de assets establecida para invalidación segura.
- Se requiere una estrategia de versionado e invalidación más robusta antes de introducir SW.

## 4. Condiciones para re-evaluar

Implementar SW solo si:
- Se define estrategia de versionado de assets (hash + cache busting).
- Se segmenta claramente contenido público vs autenticado.
- Se requiere experiencia offline real (p. ej. panel o contenidos consultables sin conexión).

## 5. Próximos pasos recomendados (si se habilita)

1. Diseñar estrategia de cache `stale-while-revalidate` solo para assets estáticos.
2. Excluir rutas autenticadas y APIs.
3. Implementar registro condicional por entorno.
4. Definir políticas de invalidación por versión.

