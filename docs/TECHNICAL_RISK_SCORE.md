# Technical Risk Score

Fecha de auditoria: 2026-03-12

Escala usada:

- `1` = riesgo bajo
- `10` = riesgo alto

Este score se calculo sobre el estado real del repo auditado localmente, tomando como evidencia:

- estructura actual del repositorio
- estado del runtime frontend y backend
- deuda residual visible en codigo y documentacion
- scripts y dependencias declaradas en `package.json`
- validaciones ejecutadas: `npm run check`, `npm run lint`, `npm run build`, `npm run smoke`

## Resultado

| Dimension | Score | Lectura |
| --- | --- | --- |
| Arquitectura | 4/10 | Riesgo medio-bajo controlado |
| Mantenibilidad | 5/10 | Riesgo medio |
| Deuda tecnica | 6/10 | Riesgo medio |
| Escalabilidad | 6/10 | Riesgo medio |
| Gobernanza de dependencias | 7/10 | Riesgo medio-alto |

## Evidencia auditada

### Estado operativo real

- `npm run check` paso correctamente.
- `npm run lint` paso correctamente.
- `npm run build` paso correctamente.
- `npm run smoke` paso correctamente en las corridas mas recientes.
- el smoke sigue tocando Firebase y SMTP reales, con warnings de credenciales SMTP invalidas.

### Estado estructural del frontend

- `client/src/pages/*` ya no forma parte del runtime activo.
- `client/src/app/App.tsx` es el runtime principal.
- `client/src/app/router/` ya esta agrupado por dominios semanticos.
- `client/src/components/*` ya no participa del runtime frontend; `ui`, `a11y`, `performance` y `auth` fueron retirados tras quedar sin consumidores.
- `client/src/app/App.tsx` ya consume `@/app/performance` y `@/shared/ui/skip-link` como destino final.
- ya fueron retirados wrappers muertos en `client/src/components/ui/`:
  - `command`
  - `form`
  - `calendar`
  - `carousel`
  - `global-navbar`
  - `chart`
  - `aspect-ratio`
  - `input-otp`
- ya no quedan imports internos a `@/components/ui/*` detectados en `client/src`

### Estado estructural del backend y repo

- sigue coexistiendo codigo legacy y multistack en el repo:
  - `api/`
  - `legacy/`
  - `firebase-functions-contacto/`
- siguen presentes artefactos o residuos operativos en workspace:
  - `dist/`
  - `dist-server/`
  - `logs/`
  - `node_modules/`
  - `php-temp/`
  - `firebase-service-account.json`
- el archivo `firebase-service-account.json` sigue existiendo fisicamente en raiz, aunque este protegido por ignore.

### Gobernanza operativa y dependencias

- los scripts rotos `check-oauth`, `fix-oauth` y `setup:mp` ya fueron retirados.
- el script `deploy` inseguro ya fue retirado.
- siguen declaradas dependencias con gobernanza debil o sospecha de uso dudoso:
  - `express-static`
  - siguen quedando dependencias para revisar con auditoria fina, pero ya se retiro un lote sin referencias en repo principal

### Señales de deuda tecnica en codigo

- siguen existiendo usos de `any` en frontend y backend.
- ejemplos detectados:
  - `server/src/utils/logger.ts`
  - `server/src/middlewares/firebase-auth.middleware.ts`
  - `server/src/modules/users/controller.ts`
  - `server/src/modules/testimonials/controller.ts`
  - `client/src/features/auth/context/AuthContext.tsx`
  - `client/src/features/auth/hooks/use-auth-mutations.ts`
  - `client/src/features/users/components/user-dashboard-page.tsx`
- siguen existiendo superficies legacy y compatibilidades temporales documentadas.

## Analisis por dimension

### 1. Arquitectura — 5/10

Razon del score:

- la direccion arquitectonica ya es correcta
- el runtime principal ya no depende de `pages/`
- `app/router` ya esta consolidado por dominios
- `shared/ui` ya absorbio gran parte del UI comun

Riesgo residual:

- siguen coexistiendo `api/`, `legacy/` y `firebase-functions-contacto/`
- no toda la frontera final `app/core/features/shared` esta cerrada

Lectura:

No esta en zona critica, pero tampoco esta completamente cerrada.

### 2. Mantenibilidad — 6/10

Razon del score:

- hay bastante mas orden que al inicio del rediseño
- los paths estructurales principales ya son mas legibles
- existe trazabilidad documental fuerte

Riesgo residual:

- ya no quedan remanentes activos en `components/*`, pero el repo todavia conserva ruido operativo y stacks paralelos
- el repo mantiene ruido operativo en raiz
- hay naming mixto, encoding inconsistente y partes con acoplamiento historico
- la documentacion operativa es amplia, pero todavia requiere consolidacion final

Lectura:

La mantenibilidad mejoro mucho, pero todavia exige contexto experto para tocar ciertas zonas sin riesgo.

### 3. Deuda tecnica — 7/10

Razon del score:

- hay deuda residual relevante, aunque ya no sea caotica
- siguen existiendo `any`, residuos legacy y deuda de gobernanza operativa fuera del runtime principal

Riesgo residual:

- siguen existiendo piezas del repo todavia no clasificadas definitivamente fuera del runtime principal
- queda deuda de limpieza en artefactos, secretos locales y dependencias restantes

Lectura:

La deuda ya esta identificada y cercada, pero todavia pesa operativamente.

### 4. Escalabilidad — 7/10

Razon del score:

- el sistema esta bastante mejor preparado para crecer en estructura que antes
- la evidencia operativa mejoro, pero el smoke sigue dependiendo de infraestructura real

Riesgo residual:

- dependencia de Firebase y SMTP reales en pruebas de smoke
- repo aun multistack
- faltan pruebas mas aisladas por dominio

Lectura:

Puede crecer, pero todavia con riesgo de fragilidad operativa y de onboarding.

### 5. Gobernanza de dependencias — 8/10

Razon del score:

- sigue siendo la dimension mas debil
- ya fueron retirados scripts inexistentes y el `deploy` inseguro
- todavia hay dependencias sospechosas, redundantes o con uso incierto
- la presencia fisica de secretos locales en workspace sigue siendo una mala señal de gobernanza

Lectura:

No significa que el runtime este roto, pero si que la disciplina operativa del repo todavia no esta al nivel enterprise final.

## Conclusiones

Estado general:

- el proyecto ya no esta en rojo arquitectonico
- el trabajo grueso de reorganizacion ya se hizo
- el mayor riesgo actual ya no viene de `pages/` ni del router
- el mayor riesgo viene de pruebas operativas no aisladas, stacks paralelos y gobernanza de dependencias restantes

Prioridades para bajar el score real:

1. estabilizar y aislar `smoke`
2. seguir podando dependencias dudosas con auditoria de uso real
3. revisar artefactos sensibles y ruido operativo en raiz
4. consolidar o aislar stacks paralelos (`api/`, `legacy/`, `firebase-functions-contacto/`)
5. seguir reduciendo usos de `any`
