# Pricing Optimization Plan TuWebAI

Fecha: 2026-03-14

## Objetivo

Optimizar la sección de pricing y el flujo de checkout para aumentar conversión sin cambiar modelo de negocio ni tocar backend o integraciones de pago.

## Fase 1 — Mejoras visuales

### Objetivo

Hacer que el plan recomendado destaque y que la jerarquía de lectura sea inmediata.

### Impacto esperado

- mejor diferenciación del plan recomendado
- menor tiempo de decisión
- menos abandono antes del CTA

### Riesgo de regresión

Bajo.

### Archivos afectados

- `client/src/features/payments/components/pricing-section.tsx`

## Fase 2 — Mejoras de copy

### Objetivo

Reemplazar títulos genéricos por copy orientado a resultado y dejar explícita la entrega estimada.

### Impacto esperado

- claridad comercial
- mejor autoselección del plan

### Riesgo de regresión

Bajo.

### Archivos afectados

- `client/src/features/payments/components/pricing-section.tsx`

## Fase 3 — Mejora del checkout (UI)

### Objetivo

Incorporar un pre‑checkout con resumen antes de redirigir a Mercado Pago.

### Impacto esperado

- más confianza antes del pago
- menos abandono por duda

### Riesgo de regresión

Medio‑bajo.

### Archivos afectados

- `client/src/features/payments/components/pricing-section.tsx`

## Fase 4 — Confianza adicional

### Objetivo

Agregar mensajes breves de seguridad y método de pago bajo cada CTA.

### Impacto esperado

- mayor percepción de confianza
- menor fricción al pagar

### Riesgo de regresión

Bajo.

### Archivos afectados

- `client/src/features/payments/components/pricing-section.tsx`
