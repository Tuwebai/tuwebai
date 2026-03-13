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

- ✅ cerrada: hero principal, fallback del home y metadata SEO ya fueron alineados al posicionamiento de desarrollo web profesional para negocios

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

### Resultado implementado

- headline principal del home alineado a desarrollo web profesional para negocios
- fallback del hero alineado al mismo mensaje
- title, description y keywords SEO del home actualizados al posicionamiento correcto
- retiro del mensaje excesivamente amplio de "agencia digital", "marketing digital" y "consultoria gratuita" en la metadata principal

### Lo que sigue

- Fase 2 toma este nuevo posicionamiento como base
- el siguiente frente ya no es definir que vende TuWebAI, sino mejorar la conversion del hero sin volver a abrir dispersion

## Fase 2. Rediseñar hero para conversion

Estado:

- ✅ cerrada: el hero ya prioriza headline comercial, submensaje orientado a resultado, CTA principal a consulta, CTA secundario a proyectos y microseñales de confianza arriba del fold

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

### Resultado implementado

- el hero paso de una presentacion institucional a una pieza de venta mas clara
- la jerarquia ahora prioriza servicio, resultado y siguiente paso
- los CTA ya distinguen cierre (`Solicitar diagnostico gratuito`) y exploracion (`Ver proyectos reales`)
- se agregaron microseñales de foco de oferta (`Sitios corporativos`, `E-commerce`, `Sistemas web`)
- la rotacion secundaria del hero ya no usa borrado letra por letra; ahora alterna frases con transicion `fade out / fade in`, manteniendo dinamismo sin castigar lectura ni conversion

### Lo que sigue

- Fase 3 debe tomar este hero como base para simplificar la arquitectura de oferta
- no conviene tocar `nav-dots` antes de revisar servicios y CTA del home

## Fase 2.5. Reestructurar la seccion de filosofia

Estado:

- ✅ cerrada: `philosophy-section` ya no funciona como bloque abstracto de consultoria global; ahora conecta hero y servicios con un mensaje de enfoque, criterio de trabajo y problemas reales que TuWebAI resuelve.

### Objetivo

Convertir la seccion de filosofia en un puente de confianza entre el hero comercial y la oferta concreta de servicios.

### Impacto esperado

- menos dispersion narrativa despues del hero
- mas continuidad entre propuesta de valor y oferta
- mayor sensacion de criterio profesional antes de llegar a servicios

### Riesgo de regresion

Bajo.

### Archivos potencialmente afectados

- [philosophy-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\philosophy-section.tsx)
- [COPY_GROWTH_PLAN.md](c:\Users\juan\Documents\Proyectos\Tuwebai\docs\COPY_GROWTH_PLAN.md)

### Resultado implementado

- se retiro el discurso abstracto de "transformacion digital global", "mision", "vision" y "valores" genericos
- la seccion ahora explica como trabaja TuWebAI y por que ese enfoque le sirve a un negocio real
- el bloque derecho ya no enumera obstaculos vagos; ahora presenta problemas concretos que una web profesional ayuda a resolver
- el mensaje de la seccion refuerza confianza y prepara mejor el paso hacia servicios

### Lo que sigue

- Fase 3 debe tomar esta nueva seccion como puente narrativo entre hero y oferta
- con hero + filosofia ya alineados, el siguiente frente correcto es simplificar servicios

## Fase 3. Reestructurar servicios

Estado:

- ✅ cerrada: `services-section` ya no presenta una lista amplia de consultoria, marketing y automatizacion; la oferta del home quedo reducida a sitios corporativos, e-commerce y sistemas web para negocios.

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

### Resultado implementado

- la seccion del home ya no compite con una oferta dispersa ni mezcla consultoria estrategica, marketing y automatizacion como frentes principales
- la oferta visible del landing quedo simplificada a tres lineas claras: sitios corporativos, e-commerce y sistemas web para negocios
- el titulo y subtitulo de la seccion ahora refuerzan foco comercial y continuidad con hero + filosofia
- el CTA ya no suena generico; ahora empuja a un siguiente paso mas concreto (`Contar mi proyecto`)

## Fase 4. Mejorar CTA y camino a consulta

Estado:

- ✅ cerrada: el landing ya distingue mejor CTA de cierre (`Contar mi proyecto`, `Pedir propuesta personalizada`, `Quiero una propuesta inicial`) y CTA de exploracion (`Ver proyectos reales`, `Conocer como trabajamos`), reduciendo dispersion en el camino hacia `/consulta`

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

### Resultado implementado

- el CTA principal del hero ya no compite con otros cierres ambiguos; ahora abre el recorrido con `Contar mi proyecto`
- el CTA de scroll del hero ya no usa un verbo generico; ahora orienta mejor la exploracion con `Conocer como trabajamos`
- showroom, comparativa, contacto y pricing ya empujan hacia una misma narrativa comercial de proyecto, propuesta inicial y solucion a medida
- se redujo el uso de copy debil o repetitivo como `Solicitar una consulta` y `Consultar planes personalizados`

### Lo que sigue

- Fase 5 debe reforzar credibilidad del recorrido con mejores casos, contexto y prueba social
- no conviene abrir nuevos CTA antes de consolidar showroom y testimonios

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

1. Fase 5
2. Fase 6
3. Fase 7

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
