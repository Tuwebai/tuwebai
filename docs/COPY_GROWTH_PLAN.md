# Copy Growth Plan TuWebAI

Fecha de plan: 2026-03-13

## Objetivo general

Reposicionar TuWebAI como servicio de desarrollo web profesional para negocios, mejorando claridad, confianza y conversion sin mezclar la marca con el producto Captiva.

## Definicion de marca

### Slogan institucional aprobado

`Disenamos el futuro de tu negocio`

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

## Fase 2. Redisenar hero para conversion

Estado:

- ✅ cerrada: el hero ya prioriza headline comercial, submensaje orientado a resultado, CTA principal a consulta, CTA secundario a proyectos y micro-senales de confianza arriba del fold

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
- los CTA distinguen cierre y exploracion
- se agregaron micro-senales de foco de oferta (`Sitios corporativos`, `E-commerce`, `Sistemas web`)
- la rotacion secundaria del hero ya no usa borrado letra por letra; ahora alterna frases con transicion `fade out / fade in`, manteniendo dinamismo sin castigar lectura ni conversion

## Fase 2.5. Reestructurar la seccion de filosofia

Estado:

- ✅ cerrada: `philosophy-section` ya no funciona como bloque abstracto de consultoria global; ahora conecta hero y servicios con un mensaje de enfoque, criterio de trabajo y problemas reales que TuWebAI resuelve

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

### Resultado implementado

- se retiro el discurso abstracto de "transformacion digital global", "mision", "vision" y "valores" genericos
- la seccion ahora explica como trabaja TuWebAI y por que ese enfoque le sirve a un negocio real
- el bloque derecho ya no enumera obstaculos vagos; ahora presenta problemas concretos que una web profesional ayuda a resolver
- el mensaje de la seccion refuerza confianza y prepara mejor el paso hacia servicios

## Fase 3. Reestructurar servicios

Estado:

- ✅ cerrada: `services-section` ya no presenta una lista amplia de consultoria, marketing y automatizacion; la oferta del home quedo reducida a sitios corporativos, e-commerce y sistemas web para negocios

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

### Resultado implementado

- la seccion del home ya no compite con una oferta dispersa ni mezcla consultoria estrategica, marketing y automatizacion como frentes principales
- la oferta visible del landing quedo simplificada a tres lineas claras: sitios corporativos, e-commerce y sistemas web para negocios
- el titulo y subtitulo de la seccion ahora refuerzan foco comercial y continuidad con hero + filosofia
- el CTA ya no suena generico; ahora empuja a un siguiente paso mas concreto (`Contar mi proyecto`)

## Fase 4. Mejorar CTA y camino a consulta

Estado:

- ✅ cerrada: el landing ya distingue mejor CTA de cierre y CTA de exploracion, reduciendo dispersion en el camino hacia `/consulta`

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

### Resultado implementado

- el CTA principal del hero ya abre el recorrido con `Contar mi proyecto`
- el CTA de scroll del hero orienta mejor la exploracion con `Conocer como trabajamos`
- showroom, comparativa, contacto y pricing ya empujan hacia una narrativa comercial mas consistente de proyecto, propuesta inicial y solucion a medida
- se redujo el uso de copy debil o repetitivo como `Solicitar una consulta`

## Fase 5. Fortalecer showroom, ejemplos y prueba social

Estado:

- ✅ cerrada: `showroom`, `showroom-project-modal`, `testimonials-section` e `impact-section` ya funcionan como una capa de credibilidad mas coherente y menos redundante dentro del landing

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
- [showroom-project-modal.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\showroom-project-modal.tsx)
- [testimonials-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\testimonials\components\testimonials-section.tsx)
- [impact-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\impact-section.tsx)

### Resultado implementado

- `showroom-section` ya no presenta los proyectos como una galeria generica; ahora se explica mejor el valor de negocio y el contexto de cada caso
- el modal de casos ya organiza la informacion como `Que necesitaba el cliente`, `Que resolvimos` y `Que aporta la solucion`
- el modal del showroom ya permite navegar entre proyectos sin cerrar y volver a abrir cada detalle, reduciendo friccion real en la exploracion
- `testimonials-section` ya no usa un titulo y subtitulo genericos; ahora introduce los testimonios como prueba de confianza vinculada a crecimiento, claridad y profesionalismo
- los estados vacios de testimonios dejaron de pedir accion artificial y ahora comunican el estado real sin sonar a placeholder de producto
- `impact-section` ya no repite casos del showroom ni usa lenguaje genérico de "casos de éxito"; ahora funciona como bloque de confianza que explica qué sostiene una solución web profesional

### Lo que sigue

- Fase 5 ya quedó cerrada.
- El siguiente frente del plan ya no pertenece a esta fase: antes de pricing, hace falta corregir proceso, retiro de tecnología de la home y comparativa.
- No conviene reabrir hero ni servicios antes de cerrar esas piezas intermedias del recorrido.

## Fase 6. Reposicionar proceso y retirar tecnologia de la home

Estado:

- ✅ cerrada: `process-section` ya presenta el metodo de trabajo como ejecucion seria de proyectos web y `tech-section` salio de la home para quedar sostenida solo por la pagina dedicada de tecnologias

### Objetivo

Convertir `process-section` en soporte del posicionamiento actual y retirar `tech-section` de la home para dejar `Tecnologias` como pagina satelite accesible desde el header.

### Impacto esperado

- mas continuidad narrativa despues de servicios
- menos contradiccion entre promesa comercial y bloques intermedios
- menos ruido tecnico en la home
- mayor claridad al separar vitrina de stack del recorrido comercial principal

### Riesgo de regresion

Medio-bajo.

### Archivos potencialmente afectados

- [process-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\process-section.tsx)
- [tech-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\tech-section.tsx)
- [global-navbar.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\layout\global-navbar.tsx)
- [technologies-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\knowledge\technologies-page.tsx)

### Decision de auditoria

- `tech-section` hoy funciona como vidriera de stack, no como bloque de venta
- la home ya ofrece acceso suficiente a `Tecnologias` desde el header
- existe una pagina dedicada en `/tecnologias` que puede absorber ese contenido con mejor contexto
- por eso, la direccion correcta no es reescribir esa seccion para la home sino retirarla del landing principal

### Hallazgos de re-auditoria

- `process-section` sigue hablando como si TuWebAI vendiera estrategia, marketing digital, SEO y PPC como frente principal
- `tech-section` sigue funcionando como vidriera de herramientas y rompe el foco comercial de la home, aun cuando ese contenido ya tiene mejor lugar en `/tecnologias`

### Trabajo previsto

- reescribir `process-section` como metodo de ejecucion de proyectos web serios
- retirar `tech-section` del landing principal y dejar la explicacion tecnica en la pagina `/tecnologias`
- bajar abstraccion y tecnicismo decorativo

### Resultado implementado

- `process-section` ya no vende estrategia, marketing, SEO o PPC como frente principal; ahora explica un metodo claro de trabajo orientado a negocio, ejecucion y base tecnica seria
- `tech-section` ya no forma parte del landing principal
- la navegacion por dots y la navegacion interna de `Inicio` en el header ya no listan `tech` como seccion del home
- `Tecnologias` queda sostenida como pagina satelite accesible desde el header, que es donde ese contenido aporta mas valor sin romper el recorrido comercial del landing

## Fase 7. Reestructurar comparativa

Estado:

- ✅ cerrada: `comparison-section` ya no mezcla desarrollo web, marketing y automatizacion; ahora funciona como una sola comparativa comercial entre solucion generica y proyecto web pensado para negocio

### Objetivo

Hacer que `comparison-section` refuerce conversion y diferenciacion sin mezclar marketing generico, automatizacion ni promesas fuera de foco.

### Impacto esperado

- mejor diferenciacion comercial
- menos contradiccion con el posicionamiento actual
- menos ruido en la parte media del landing

### Riesgo de regresion

Medio.

### Archivos potencialmente afectados

- [comparison-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\comparison-section.tsx)

### Hallazgos de re-auditoria

- `comparison-section` sigue comparando `websites`, `marketing` y `automation`, reabriendo la dispersion de oferta que ya se habia cerrado en servicios

### Trabajo previsto

- simplificar `comparison-section` a una comparativa enfocada en claridad, tiempos, mantenimiento y resultados
- evitar reabrir categorias o promesas que el landing ya saco de su foco principal

### Resultado implementado

- `comparison-section` ya no usa tabs para `websites`, `marketing` y `automation`
- la comparativa ahora se concentra en criterios utiles para un negocio: punto de partida, enfoque, implementacion, base para crecer y acompanamiento
- el bloque dejo de reabrir la dispersion de oferta que ya se habia corregido en servicios y proceso
- el CTA final conserva el recorrido hacia propuesta personalizada sin prometer categorias que el landing ya saco de foco

## Fase 8. Revisar pricing y oferta comercial

Estado:

- ✅ cerrada: `pricing-section` ya no funciona como pseudo-checkout ni como tabla de suscripción mensual; ahora orienta la conversación comercial con rangos de inversión y CTA único a propuesta

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

### Hallazgos de re-auditoría

- `pricing-section` empujaba una lectura de suscripción y checkout que chocaba con el resto del landing, ya orientado a proyectos web profesionales y propuestas a medida
- el bloque mezclaba referencia comercial con lógica de compra inmediata, generando ruido en leads B2B

### Resultado implementado

- la home dejó de empujar checkout inmediato desde `pricing-section`
- el bloque ahora presenta tres rangos consultivos: base web corporativa, proyecto comercial completo y solución a medida
- la sección explica qué variables mueven la propuesta final y deriva todo el cierre hacia `/consulta`
- el sistema de pagos real queda desacoplado de la home y no se toca en este slice
- Ruta 2 aplicada: la home mantiene USD como referencia comercial de alcance y `/consulta` ya aclara que, para Argentina, la propuesta final se cotiza y se cobra en pesos argentinos

## Fase 9. Optimizar contacto y paginas satelite para consistencia

Estado:

- pendiente

### Objetivo

Alinear contacto, paginas de soluciones, FAQ y soporte al mismo posicionamiento del landing.

### Impacto esperado

- mayor coherencia de marca
- menor contradiccion entre paginas
- mejor experiencia de exploracion

### Riesgo de regresion

Medio-bajo.

### Archivos potencialmente afectados

- [contact-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\contact\components\contact-section.tsx)
- [corporate-solutions-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\solutions\corporate-solutions-page.tsx)
- [ecommerce-solutions-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\solutions\ecommerce-solutions-page.tsx)
- [uxui-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\solutions\uxui-page.tsx)
- [faq-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\knowledge\faq-page.tsx)
- [support-contact-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\contact\components\support-contact-page.tsx)

### Hallazgos de re-auditoria

- `contact-section` ya mejoro sus CTA, pero todavia no fue re-trabajado completo desde expectativa, tono y cierre comercial
- las paginas satelite todavia no fueron revisadas de punta a punta bajo el nuevo posicionamiento

### Trabajo previsto

- bajar claims inflados
- reforzar enfoque en desarrollo web
- limpiar respuestas y mensajes que abren demasiado el abanico de servicios

## Estado real de cobertura del landing

### Secciones ya re-trabajadas con criterio comercial

- `hero-section`
- `philosophy-section`
- `services-section`
- CTA principales del landing
- `showroom-section`
- `showroom-project-modal`
- `testimonials-section`
- `impact-section`

### Secciones con trabajo parcial o pendiente

- `process-section`
- retiro de `tech-section` de la home
- `comparison-section`
- `pricing-section`
- `contact-section`

## Prioridad sugerida

Orden recomendado de ejecucion:

1. Fase 6
2. Fase 7
3. Fase 8
4. Fase 9

## KPI cualitativos a vigilar

### Nota operativa sobre Fase 8

- el cierre de pricing ya no debe leerse como "todo va a /consulta"
- los alcances base del home vuelven a checkout directo con Mercado Pago
- `Solución a medida` queda como único caso que deriva a propuesta personalizada
- la moneda visible y el cobro online quedan alineados en ARS para evitar fricción con mercado argentino

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
