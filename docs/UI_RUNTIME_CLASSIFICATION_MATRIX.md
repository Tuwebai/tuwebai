# Matriz de Clasificación de Runtime UI

## Estado

Entregable de la Fase 0 de [UI_RUNTIME_FINALIZATION_PLAN.md](c:/Users/juan/Documents/Proyectos/Tuwebai/docs/UI_RUNTIME_FINALIZATION_PLAN.md).

Propósito:

- clasificar `client/src/components/ui/*`
- clasificar `client/src/components/sections/*`
- definir destino recomendado
- registrar riesgo antes de cualquier movimiento

Regla de esta fase:

- no mover archivos
- no cambiar imports
- no alterar runtime

## Clasificación `components/ui`

| Archivo actual | Destino recomendado | Clasificación | Riesgo | Motivo |
|---|---|---|---|---|
| `client/src/components/ui/button.tsx` | `client/src/shared/ui/button.tsx` | `shared/ui` | Bajo | primitive reusable sin dominio ✅ corregido parcialmente |
| `client/src/components/ui/input.tsx` | `client/src/shared/ui/input.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/textarea.tsx` | `client/src/shared/ui/textarea.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/label.tsx` | `client/src/shared/ui/label.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/checkbox.tsx` | `client/src/shared/ui/checkbox.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/radio-group.tsx` | `client/src/shared/ui/radio-group.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/select.tsx` | `client/src/shared/ui/select.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/switch.tsx` | `client/src/shared/ui/switch.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/slider.tsx` | `client/src/shared/ui/slider.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/input-otp.tsx` | `client/src/shared/ui/input-otp.tsx` | `shared/ui` | Bajo | primitive reusable |
| `client/src/components/ui/card.tsx` | `client/src/shared/ui/card.tsx` | `shared/ui` | Bajo | contenedor reusable ✅ corregido parcialmente |
| `client/src/components/ui/badge.tsx` | `client/src/shared/ui/badge.tsx` | `shared/ui` | Bajo | UI reusable ✅ corregido parcialmente |
| `client/src/components/ui/avatar.tsx` | `client/src/shared/ui/avatar.tsx` | `shared/ui` | Bajo | UI reusable ✅ corregido parcialmente |
| `client/src/components/ui/alert.tsx` | `client/src/shared/ui/alert.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/alert-dialog.tsx` | `client/src/shared/ui/alert-dialog.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/dialog.tsx` | `client/src/shared/ui/dialog.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/drawer.tsx` | `client/src/shared/ui/drawer.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/sheet.tsx` | `client/src/shared/ui/sheet.tsx` | `shared/ui` | Bajo | primitive reusable |
| `client/src/components/ui/popover.tsx` | `client/src/shared/ui/popover.tsx` | `shared/ui` | Bajo | primitive reusable |
| `client/src/components/ui/hover-card.tsx` | `client/src/shared/ui/hover-card.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/dropdown-menu.tsx` | `client/src/shared/ui/dropdown-menu.tsx` | `shared/ui` | Bajo | primitive reusable |
| `client/src/components/ui/context-menu.tsx` | `client/src/shared/ui/context-menu.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/navigation-menu.tsx` | `client/src/shared/ui/navigation-menu.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/menubar.tsx` | `client/src/shared/ui/menubar.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/accordion.tsx` | `client/src/shared/ui/accordion.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/collapsible.tsx` | `client/src/shared/ui/collapsible.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/tabs.tsx` | `client/src/shared/ui/tabs.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/toggle.tsx` | `client/src/shared/ui/toggle.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/toggle-group.tsx` | `client/src/shared/ui/toggle-group.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/tooltip.tsx` | `client/src/shared/ui/tooltip.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/breadcrumb.tsx` | `client/src/shared/ui/breadcrumb.tsx` | `shared/ui` | Bajo | reusable navigation helper ✅ corregido parcialmente |
| `client/src/components/ui/pagination.tsx` | `client/src/shared/ui/pagination.tsx` | `shared/ui` | Bajo | reusable navigation helper ✅ corregido parcialmente |
| `client/src/components/ui/table.tsx` | `client/src/shared/ui/table.tsx` | `shared/ui` | Bajo | reusable data UI ✅ corregido parcialmente |
| `client/src/components/ui/chart.tsx` | `client/src/shared/ui/chart.tsx` | `shared/ui` | Medio | reusable pero revisar dependencias visuales |
| `client/src/components/ui/carousel.tsx` | `client/src/shared/ui/carousel.tsx` | `shared/ui` | Medio | reusable con comportamiento visual |
| `client/src/components/ui/calendar.tsx` | `client/src/shared/ui/calendar.tsx` | `shared/ui` | Medio | reusable con dependencia externa |
| `client/src/components/ui/form.tsx` | `client/src/shared/ui/form.tsx` | `shared/ui` | Medio | shared pero muy conectado al sistema de forms |
| `client/src/components/ui/command.tsx` | `client/src/shared/ui/command.tsx` | `shared/ui` | Medio | shared con composición compleja |
| `client/src/components/ui/resizable.tsx` | `client/src/shared/ui/resizable.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/scroll-area.tsx` | `client/src/shared/ui/scroll-area.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/progress.tsx` | `client/src/shared/ui/progress.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/separator.tsx` | `client/src/shared/ui/separator.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/skeleton.tsx` | `client/src/shared/ui/skeleton.tsx` | `shared/ui` | Bajo | primitive reusable ✅ corregido parcialmente |
| `client/src/components/ui/loading-spinner.tsx` | `client/src/shared/ui/loading-spinner.tsx` | `shared/ui` | Bajo | visual helper reusable ✅ corregido parcialmente |
| `client/src/components/ui/toast.tsx` | `client/src/shared/ui/toast.tsx` | `shared/ui` | Bajo | sistema UI transversal ✅ corregido parcialmente |
| `client/src/components/ui/toaster.tsx` | `client/src/shared/ui/toaster.tsx` | `shared/ui` | Bajo | sistema UI transversal ✅ corregido parcialmente |
| `client/src/components/ui/use-toast/index.ts` | `client/src/shared/ui/use-toast/index.ts` | `shared/ui` | Medio | hook visual transversal, requiere movimiento coordinado ✅ corregido parcialmente |
| `client/src/components/ui/animated-shape.tsx` | `client/src/shared/ui/animated-shape.tsx` | `shared/ui` | Bajo | visual decorativo reusable ✅ corregido parcialmente |
| `client/src/components/ui/page-banner.tsx` | `client/src/shared/ui/page-banner.tsx` | `shared/ui` | Bajo | reusable de páginas internas ✅ corregido parcialmente |
| `client/src/components/ui/scroll-progress.tsx` | `client/src/shared/ui/scroll-progress.tsx` | `shared/ui` | Bajo | helper visual global ✅ corregido parcialmente |
| `client/src/components/ui/nav-dots.tsx` | `client/src/shared/ui/nav-dots.tsx` | `shared/ui` | Medio | reusable pero acoplado al home por props/scroll ✅ corregido parcialmente |
| `client/src/components/ui/particle-effect.tsx` | `client/src/shared/ui/particle-effect.tsx` | `shared/ui` | Bajo | decorativo reusable ✅ corregido parcialmente |
| `client/src/components/ui/whatsapp-button.tsx` | `client/src/shared/ui/whatsapp-button.tsx` | `shared/ui` | Bajo | CTA transversal ✅ corregido parcialmente |
| `client/src/components/ui/company-logo-slider.tsx` | `client/src/shared/ui/company-logo-slider.tsx` | `shared/ui` | Medio | reusable visual, revisar coupling de assets ✅ corregido parcialmente |
| `client/src/components/ui/footer.tsx` | `client/src/shared/ui/footer.tsx` | `shared/ui` | Medio | layout global, mover junto con shell ✅ corregido parcialmente |
| `client/src/components/ui/global-navbar.tsx` | `client/src/app/layout/global-navbar.tsx` | `app` | Alto | shell global del runtime, no es shared genérico |
| `client/src/components/ui/sidebar.tsx` | `client/src/shared/ui/sidebar.tsx` | `shared/ui` | Medio | UI reusable, revisar dependencias internas ✅ corregido parcialmente |

## Clasificación `components/sections`

| Archivo actual | Destino recomendado | Clasificación | Riesgo | Motivo |
|---|---|---|---|---|
| `client/src/components/sections/hero-section.tsx` | `client/src/features/marketing-home/components/hero-section.tsx` o mantener temporal | `temporal` | Alto | sección principal del home, mezcla layout y narrativa |
| `client/src/components/sections/philosophy-section.tsx` | `client/src/features/marketing-home/components/philosophy-section.tsx` o mantener temporal | `temporal` | Alto | sección de landing, no es shared puro ni domain feature transaccional |
| `client/src/components/sections/services-section.tsx` | `client/src/features/marketing-home/components/services-section.tsx` o mantener temporal | `temporal` | Alto | sección de landing con contenido de negocio transversal |
| `client/src/components/sections/process-section.tsx` | `client/src/features/marketing-home/components/process-section.tsx` o mantener temporal | `temporal` | Medio | sección narrativa del home |
| `client/src/components/sections/tech-section.tsx` | `client/src/features/marketing-home/components/tech-section.tsx` o mantener temporal | `temporal` | Medio | sección de marketing técnico |
| `client/src/components/sections/impact-section.tsx` | `client/src/features/marketing-home/components/impact-section.tsx` o mantener temporal | `temporal` | Medio | sección narrativa del home |
| `client/src/components/sections/comparison-section.tsx` | `client/src/features/marketing-home/components/comparison-section.tsx` o mantener temporal | `temporal` | Medio | sección de comparación de oferta |
| `client/src/components/sections/showroom-section.tsx` | `client/src/features/projects/components/showroom-section.tsx` o `features/marketing-home/components` | `temporal` | Alto | roza dominio proyectos pero hoy está integrada al home |

## Decisiones Operativas

### Mover primero

- todo `shared/ui` de bajo riesgo
- `footer`
- `page-banner`
- `animated-shape`
- `scroll-progress`
- primitives Radix/UI

### Mover después

- `global-navbar`
- `company-logo-slider`
- `nav-dots`
- `sidebar`

### Mantener temporalmente

- `components/sections/*`
- cualquier sección del home que todavía sea parte del ensamblado principal del landing

## Riesgos Principales

1. Mover `global-navbar` junto con `App.tsx` en el mismo commit.
2. Mover `sections/*` del home sin primero definir si viven en `features/marketing-home` o si siguen temporales.
3. Cambiar imports de primitives shared junto con reestructuración del router.

## Recomendación de Ejecución

1. Fase 1A:
   mover primitives y UI reusable de bajo riesgo a `shared/ui`
2. Fase 1B:
   mover layout helpers shared (`footer`, `page-banner`, `animated-shape`, `scroll-progress`)
3. Fase 2:
   decidir target final para `sections/*`
4. Fase 3:
   mover `App.tsx`, `global-navbar` y providers al árbol `app/`
