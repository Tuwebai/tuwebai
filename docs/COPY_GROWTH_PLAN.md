# Copy Growth Plan TuWebAI

Fecha de plan: 2026-03-13

## Objetivo general

Reposicionar TuWebAI como servicio de desarrollo web profesional para negocios, mejorando claridad, confianza y conversion sin mezclar la marca con el producto Captiva.

## Definicion de marca

### Slogan institucional aprobado

`Diseñamos el futuro de tu negocio`

### Criterio de uso

- funciona como slogan de marca
- no reemplaza la propuesta de valor comercial
- debe convivir con un headline claro sobre desarrollo web profesional para negocios
- conviene usarlo en hero, footer, bloques institucionales y piezas de marca, no como unica explicacion del servicio

## Principios de ejecucion

- cambios por fases chicas
- sin mezclar refactor estructural con reescritura masiva
- primero home y oferta principal
- despues soluciones, prueba social y conversion
- siempre validar consistencia entre posicionamiento, CTA y paginas internas

## Fase 1. Clarificar propuesta de valor

Estado:

- ✅ corregido: hero principal, fallback del home y metadata SEO ya fueron alineados al posicionamiento de desarrollo web profesional para negocios

### Objetivo

Definir y reflejar una propuesta de valor unica y directa para TuWebAI.

### Impacto esperado

- mas claridad en trafico frio
- mejor autoseleccion del lead
- menos confusion entre desarrollo web, marketing y landing pages

### Riesgo de regresion

Bajo.

### Archivos potencialmente afectados

- [home-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\home\home-page.tsx)
- [hero-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\hero-section.tsx)
- [meta-tags.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\shared\ui\meta-tags.tsx)

### Trabajo previsto

- redefinir headline principal
- redefinir subheadline
- ajustar SEO title y meta description
- eliminar frases demasiado amplias o consultivas

## Fase 2. Rediseñar hero para conversion

### Objetivo

Convertir el hero en una pieza de venta clara y orientada a negocio.

### Impacto esperado

- mejor comprension en primeros 5 segundos
- mejor retencion inicial
- CTA mas coherente

### Riesgo de regresion

Medio-bajo.

### Archivos potencialmente afectados

- [hero-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\hero-section.tsx)
- [marketing-home-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\marketing-home-page.tsx)

### Trabajo previsto

- cambiar typewriter por mensaje mas estable o menos disperso
- incorporar problema + resultado
- alinear CTA principal y CTA secundario
- sumar microprueba social o dato de confianza arriba del fold

## Fase 3. Reestructurar servicios

### Objetivo

Reducir dispersion de oferta y priorizar el core de desarrollo web.

### Impacto esperado

- posicionamiento mas fuerte
- menor ruido de decision
- mejor lectura comercial

### Riesgo de regresion

Medio.

### Archivos potencialmente afectados

- [services-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\services-section.tsx)
- [corporate-solutions-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\solutions\corporate-solutions-page.tsx)
- [ecommerce-solutions-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\solutions\ecommerce-solutions-page.tsx)
- [uxui-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\solutions\uxui-page.tsx)
- [global-navbar.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\layout\global-navbar.tsx)

### Trabajo previsto

- pasar de lista amplia de servicios a arquitectura de oferta mas simple
- jerarquizar:
  - webs corporativas
  - e-commerce
  - sistemas web
- dejar marketing y automatizacion como capacidades secundarias o complementarias

## Fase 4. Mejorar CTA y camino a consulta

### Objetivo

Hacer que cada CTA responda a una oferta clara y a una expectativa realista.

### Impacto esperado

- mas conversion a consulta
- mejor calidad de lead
- menos friccion entre secciones

### Riesgo de regresion

Bajo.

### Archivos potencialmente afectados

- [services-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\services-section.tsx)
- [comparison-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\comparison-section.tsx)
- [showroom-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\showroom-section.tsx)
- [contact-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\contact\components\contact-section.tsx)
- [proposal-request-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\proposals\components\proposal-request-page.tsx)

### Trabajo previsto

- unificar lenguaje de CTA
- separar CTA de exploracion y CTA de cierre
- mejorar copy de consulta
- alinear beneficios prometidos con lo que realmente entrega la consulta

## Fase 5. Fortalecer showroom, ejemplos y prueba social

### Objetivo

Convertir portfolio y testimonios en evidencia de venta, no solo en contenido bonito.

### Impacto esperado

- mayor confianza
- mayor credibilidad
- mejor soporte al cierre

### Riesgo de regresion

Bajo.

### Archivos potencialmente afectados

- [showroom-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\showroom-section.tsx)
- [testimonials-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\testimonials\components\testimonials-section.tsx)
- [corporate-solutions-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\solutions\corporate-solutions-page.tsx)

### Trabajo previsto

- reescribir casos con formato problema -> solucion -> resultado
- reemplazar metricas vagas por resultados mas creibles
- fortalecer testimonios con contexto
- sumar prueba social institucional si existe

## Fase 6. Revisar pricing y oferta comercial

### Objetivo

Decidir si el pricing actual ayuda o perjudica la conversion del servicio.

### Impacto esperado

- mejor consistencia entre servicio y modelo comercial
- menos friccion B2B
- mejor cierre en leads de mayor valor

### Riesgo de regresion

Medio.

### Archivos potencialmente afectados

- [pricing-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\payments\components\pricing-section.tsx)
- [payment-return-view.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\payments\components\payment-return-view.tsx)
- [proposal-request-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\proposals\components\proposal-request-page.tsx)

### Trabajo previsto

- re-evaluar si conviene mostrar precios fijos en home
- decidir si la home debe vender consulta o checkout
- separar mejor servicios cerrados de soluciones a medida

## Fase 7. Optimizar paginas satelite para consistencia

### Objetivo

Alinear paginas de soluciones, FAQ y contacto al mismo posicionamiento.

### Impacto esperado

- mayor coherencia de marca
- menor contradiccion entre paginas
- mejor experiencia de exploracion

### Riesgo de regresion

Medio-bajo.

### Archivos potencialmente afectados

- [corporate-solutions-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\solutions\corporate-solutions-page.tsx)
- [ecommerce-solutions-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\solutions\ecommerce-solutions-page.tsx)
- [uxui-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\solutions\uxui-page.tsx)
- [faq-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\knowledge\faq-page.tsx)
- [support-contact-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\contact\components\support-contact-page.tsx)

### Trabajo previsto

- bajar claims inflados
- reforzar enfoque en desarrollo web
- limpiar respuestas y mensajes que abren demasiado el abanico de servicios

## Prioridad sugerida

Orden recomendado de ejecucion:

1. Fase 1
2. Fase 2
3. Fase 3
4. Fase 4
5. Fase 5
6. Fase 6
7. Fase 7

## KPI cualitativos a vigilar

- claridad del mensaje principal
- coherencia entre home y paginas satelite
- consistencia de CTA
- credibilidad de claims
- facilidad para entender que vende TuWebAI

## Criterio de exito

El trabajo de copy se considerara bien encaminado cuando una persona nueva pueda responder en menos de 10 segundos:

- que hace TuWebAI
- para quien es
- por que sirve
- que paso debe dar despues
