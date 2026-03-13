# TUWEBAI

Repositorio principal del stack activo de Tuwebai.

## Stack actual

- frontend React + Vite en `client/`
- backend Node + Express + TypeScript en `server/`
- legado aislado en `legacy/`
- subproyecto heredado congelado en `firebase-functions-contacto/`

## Comandos principales

- `npm run dev`
- `npm run check`
- `npm run lint`
- `npm run build`
- `npm run smoke`

## Documentacion operativa

- `docs/ARCHITECTURE.md`
- `docs/CONFIGURATION.md`
- `docs/ENTERPRISE_RESTRUCTURE_PLAN.md`
- `docs/UI_RUNTIME_FINALIZATION_PLAN.md`
- `docs/FINAL_RUNTIME_SUBSTITUTION_PLAN.md`
- `docs/PRIVACY_DOMAIN_IMPLEMENTATION_PLAN.md`
- `docs/PANEL_INFORMATION_ARCHITECTURE_PLAN.md`
- `docs/USER_DASHBOARD_DECOMPOSITION_PLAN.md`
- `docs/TECHNICAL_RISK_SCORE.md`
- `audit-tuweai.md`

## Regla operativa

El codigo activo debe respetar la arquitectura `app/core/features/shared` en frontend y `app/core/modules/infrastructure/shared` en backend, manteniendo `legacy/` fuera del runtime principal.
