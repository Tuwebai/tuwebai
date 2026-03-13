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
| Mantenibilidad | 4/10 | Riesgo medio-bajo controlado |
| Deuda tecnica | 5/10 | Riesgo medio controlado |
| Escalabilidad | 5/10 | Riesgo medio controlado |
| Gobernanza de dependencias | 4/10 | Riesgo medio-bajo controlado |

## Evidencia auditada

### Estado operativo real

- `npm run check` paso correctamente.
- `npm run lint` paso correctamente.
- `npm run build` paso correctamente.
- `npm run smoke` paso correctamente en las corridas mas recientes.
- el smoke ya corre aislado por defecto de Firebase Admin y SMTP reales; solo usa infraestructura real con opt-in explicito.

### Estado estructural del frontend

- `client/src/pages/*` ya no forma parte del runtime activo.
- `client/src/app/App.tsx` es el runtime principal.
- `client/src/app/router/` ya esta agrupado por dominios semanticos.
- `client/src/components/*` ya no participa del runtime frontend; `ui`, `a11y`, `performance` y `auth` fueron retirados tras quedar sin consumidores.
- `client/src/app/App.tsx` ya consume `@/app/performance` y `@/shared/ui/skip-link` como destino final.
- ya no quedan imports internos a `@/components/ui/*` detectados en `client/src`.

### Estado estructural del backend y repo

- sigue coexistiendo codigo legacy y multistack en el repo:
  - `legacy/`
  - `firebase-functions-contacto/`
- `firebase-functions-contacto/` no participa del runtime ni de CI/CD principal, pero sigue siendo un subproyecto versionado con deploy manual propio.
- en workspace siguen presentes artefactos locales esperables como `node_modules/`.
- el archivo `firebase-service-account.json` ya fue retirado del workspace; la arquitectura actual no lo requiere porque el server soporta `FIREBASE_SERVICE_ACCOUNT_JSON` y `applicationDefault()`.
- `.replit` y `php-temp/` ya fueron retirados del workspace tras confirmarse como tooling local legado sin consumidores ni integracion operativa.

### Gobernanza operativa y dependencias

- los scripts rotos `check-oauth`, `fix-oauth` y `setup:mp` ya fueron retirados.
- el script `deploy` inseguro ya fue retirado.
- se retiraron varios lotes de dependencias sin referencias en repo principal.
- todavia quedan algunas dependencias para revisar con auditoria fina antes de considerar la gobernanza cerrada, pero el lote ambiguo ya siguio bajando con la salida de `ts-node`.

### Senales de deuda tecnica en codigo

- ya no quedan usos explicitos de `any` en runtime frontend/backend ni en soporte tipado auditado del repo.
- ya no quedan usos de `any` explicito ni `z.any()` en el codigo auditado del repo.
- `@typescript-eslint/no-explicit-any` ya quedo en modo `error`, por lo que la deuda de tipado cerrada ya no puede reingresar silenciosamente.
- siguen existiendo superficies legacy y compatibilidades temporales documentadas fuera del runtime principal.

## Analisis por dimension

### 1. Arquitectura - 4/10

Razon del score:

- la direccion arquitectonica ya es correcta
- el runtime principal ya no depende de `pages/`
- `app/router` ya esta consolidado por dominios
- `shared/ui` ya absorbio la UI comun relevante

Riesgo residual:

- siguen coexistiendo `legacy/` y `firebase-functions-contacto/`
- no toda la frontera final `app/core/features/shared` esta cerrada como arquitectura documental consolidada

Lectura:

No esta en zona critica, pero tampoco esta completamente cerrada.

### 2. Mantenibilidad - 4/10

Razon del score:

- hay bastante mas orden que al inicio del rediseño
- los paths estructurales principales ya son mas legibles
- existe trazabilidad documental fuerte
- `README.md`, `ARCHITECTURE.md` y `CONFIGURATION.md` ya quedaron legibles y utilizables como base operativa

Riesgo residual:

- el repo todavia conserva stacks paralelos y algo de ruido operativo en raiz
- sigue habiendo naming mixto y acoplamiento historico en zonas no criticas
- la documentacion operativa aun puede consolidarse mejor

Lectura:

La mantenibilidad ya no esta en zona media-alta; hoy el principal costo viene de superficies heredadas y no del runtime principal.

### 3. Deuda tecnica - 5/10

Razon del score:

- la deuda residual sigue siendo real, aunque ya no es caotica
- la limpieza estructural gruesa ya quedo ejecutada y el runtime principal ya no arrastra compatibilidad legacy activa
- la deuda de tipado explicita ya quedo cerrada

Riesgo residual:

- siguen existiendo piezas del repo fuera del runtime principal que requieren cierre o aislamiento final
- queda deuda de limpieza en variables sensibles locales y dependencias restantes
- el stack `legacy/php-api` ya fue endurecido en puntos criticos, pero sigue siendo superficie heredada fuera de la gobernanza principal

Lectura:

La deuda ya esta identificada y cercada, pero todavia pesa operativamente por el multistack y la gobernanza restante.

### 4. Escalabilidad - 5/10

Razon del score:

- el sistema esta bastante mejor preparado para crecer en estructura que antes
- la evidencia operativa mejoro y el smoke ya no depende por defecto de infraestructura real

Riesgo residual:

- todavia faltan pruebas mas aisladas por dominio mas alla del smoke
- el repo sigue siendo multistack

Lectura:

Puede crecer con menos fragilidad operativa que antes, aunque todavia requiere limpieza estructural adicional.

### 5. Gobernanza de dependencias - 4/10

Razon del score:

- ya fueron retirados scripts inexistentes y el `deploy` inseguro
- ya fueron retirados varios lotes de dependencias sin referencias en repo principal, incluyendo `ts-node`
- la gobernanza mejoro de forma visible frente al estado inicial

Riesgo residual:

- todavia hay dependencias sospechosas o con uso incierto que merecen auditoria fina
- siguen existiendo variables sensibles locales y subproyectos paralelos con gobernanza separada

Lectura:

La gobernanza ya no esta en zona roja, pero tampoco quedo cerrada.

## Conclusiones

Estado general:

- el proyecto ya no esta en rojo arquitectonico
- el trabajo grueso de reorganizacion ya se hizo
- el mayor riesgo actual ya no viene de `pages/`, `components/` ni de la deuda de tipado
- el mayor riesgo viene de stacks paralelos, variables sensibles locales y gobernanza de dependencias restantes

Prioridades para bajar el score real:

1. seguir podando dependencias dudosas con auditoria de uso real
2. revisar variables sensibles locales y terminar de externalizarlas a secret managers donde corresponda
3. consolidar o aislar stacks paralelos (`legacy/`, `firebase-functions-contacto/`)
4. consolidar la documentacion operativa e historica final
5. sostener el enforcement de `no-explicit-any` y evitar regresion de tipado
