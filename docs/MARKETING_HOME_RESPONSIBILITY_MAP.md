# Mapa de Responsabilidades de Marketing Home

## Objetivo

Registrar el estado real de `client/src/pages/home.tsx` y de `client/src/components/sections/*` antes de iniciar la migración de `marketing-home`.

Este documento no mueve código.  
Solo delimita responsabilidades y destino arquitectónico.

## Home

Archivo auditado:

- `client/src/pages/home.tsx`

### Responsabilidad actual: shell de página

Incluye:

- `MetaTags`
- `main`
- composición general del landing
- `Suspense` principal

Destino recomendado:

- se mantiene temporalmente en `pages/home.tsx`
- al final debe quedar como shell delgada

### Responsabilidad actual: navegación por secciones

Incluye:

- `useLocation`
- lectura de `location.search`
- lectura de `location.hash`
- `sections`
- `sectionRefs`
- `setSectionRef`
- `scrollToSection`
- fallback de scroll con `window.scrollTo` y `scrollIntoView`

Destino recomendado:

- `client/src/features/marketing-home/hooks/use-home-section-navigation.ts`

Riesgo:

- alto

Motivo:

- controla deep links y comportamiento visible del landing

### Responsabilidad actual: composición lazy del landing

Incluye:

- `HeroSection`
- `PhilosophySection`
- `ServicesSection`
- `ProcessSection`
- `TechSection`
- `ComparisonSection`
- `ShowroomSection`
- `ImpactSection`
- `CompanyLogoSlider`
- `TestimonialsSection`
- `ContactSection`
- `PricingSection`

Destino recomendado:

- sections de marketing: `features/marketing-home/components/*`
- sections de negocio ya migradas: se mantienen en sus features actuales
- utilitarios shared: se mantienen en `shared/ui`

## Sections del landing

### `hero-section.tsx`

Responsabilidad:

- hero principal del landing
- depende de `setRef`

Destino:

- `features/marketing-home/components/hero-section.tsx`

Riesgo:

- medio

### `philosophy-section.tsx`

Responsabilidad:

- sección de narrativa comercial
- usa `AnimatedShape`
- usa `useIntersectionObserver`

Destino:

- `features/marketing-home/components/philosophy-section.tsx`

Riesgo:

- medio

### `services-section.tsx`

Responsabilidad:

- sección de servicios del landing
- usa `useIntersectionObserver`

Destino:

- `features/marketing-home/components/services-section.tsx`

Riesgo:

- medio

### `process-section.tsx`

Responsabilidad:

- explicación del proceso comercial
- usa `useIntersectionObserver`

Destino:

- `features/marketing-home/components/process-section.tsx`

Riesgo:

- medio

### `tech-section.tsx`

Responsabilidad:

- exhibición de stack/tecnologías
- usa `useIntersectionObserver`

Destino:

- `features/marketing-home/components/tech-section.tsx`

Riesgo:

- medio

### `impact-section.tsx`

Responsabilidad:

- métricas/impacto del landing
- usa `useIntersectionObserver`

Destino:

- `features/marketing-home/components/impact-section.tsx`

Riesgo:

- medio

### `comparison-section.tsx`

Responsabilidad:

- comparativa comercial del landing
- usa `useIntersectionObserver`

Destino:

- `features/marketing-home/components/comparison-section.tsx`

Riesgo:

- medio

### `showroom-section.tsx`

Responsabilidad:

- showcase de proyectos dentro del landing
- coupling semántico con proyectos, pero hoy sigue siendo sección de marketing-home

Destino:

- `features/marketing-home/components/showroom-section.tsx`

Riesgo:

- medio/alto

Motivo:

- tiene cercanía conceptual con `projects`, pero el runtime actual todavía lo usa como sección del landing

## Shared y Features ya estabilizadas

No corresponde mover en esta fase:

- `features/contact/components/contact-section.tsx`
- `features/testimonials/components/testimonials-section.tsx`
- `features/payments/components/pricing-section.tsx`
- `shared/ui/company-logo-slider.tsx`
- `shared/ui/nav-dots.tsx`
- `shared/ui/scroll-progress.tsx`
- `shared/ui/whatsapp-button.tsx`

## Orden recomendado

1. extraer hook de navegación del landing
2. mover `hero-section`
3. mover `philosophy-section`
4. mover `services-section`
5. mover `process-section`
6. mover `tech-section`
7. mover `impact-section`
8. mover `comparison-section`
9. mover `showroom-section`
10. adelgazar `home.tsx`

## Conclusión

La Fase 0 queda cerrada con este mapa:

- `home.tsx` no debe moverse todavía
- primero debe salir la navegación del landing a un hook de `marketing-home`
- después recién corresponde mover sections una por una
