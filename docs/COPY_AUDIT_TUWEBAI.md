# Copy Audit TuWebAI

Fecha de auditoria: 2026-03-13

## Resumen ejecutivo

El sitio de TuWebAI hoy comunica una mezcla de:

- desarrollo web profesional
- consultoria estrategica
- marketing digital
- automatizacion
- agencia generalista

Eso diluye el posicionamiento y complica la conversion.

El problema principal no es falta de volumen de contenido, sino falta de foco. La home y varias paginas de soluciones intentan vender demasiadas cosas a la vez. El resultado es:

- propuesta de valor poco especifica
- diferenciacion debil frente a agencias generales
- CTA correctos pero dispersos
- prueba social insuficiente o poco creible
- lenguaje con promesas grandes sin suficiente evidencia

Para vender mejor desarrollo web profesional para negocios, TuWebAI debe pasar de "agencia digital amplia" a "partner de desarrollo web que crea sitios y sistemas web que ayudan a vender, operar y escalar".

## Alcance auditado

Se auditaron, sin modificar codigo:

- [marketing-home-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\marketing-home-page.tsx)
- [home-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\home\home-page.tsx)
- [hero-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\hero-section.tsx)
- [services-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\services-section.tsx)
- [comparison-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\comparison-section.tsx)
- [showroom-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\showroom-section.tsx)
- [pricing-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\payments\components\pricing-section.tsx)
- [contact-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\contact\components\contact-section.tsx)
- [testimonials-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\testimonials\components\testimonials-section.tsx)
- [corporate-solutions-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\solutions\corporate-solutions-page.tsx)
- [faq-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\knowledge\faq-page.tsx)
- [global-navbar.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\layout\global-navbar.tsx)
- [AppRoutes.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\AppRoutes.tsx)

## Posicionamiento actual

### Lo que hoy parece prometer el sitio

En su estado actual, TuWebAI parece ser:

- una agencia de marketing digital
- una consultora comercial
- una empresa de automatizacion
- una agencia web
- una empresa de desarrollo de software

Todo eso a la vez.

### Problema de posicionamiento

El negocio real que queres vender para TuWebAI es:

- desarrollo web profesional para negocios
- sitios web profesionales
- sistemas web para empresas

Pero la home actual abre con una idea mucho mas amplia:

- "Asesoria Comercial Digital para Empresas de Alto Rendimiento"

Eso no dice con claridad:

- que producto se vende
- para quien se vende
- que problema concreto resuelve
- por que elegir TuWebAI en vez de una agencia cualquiera

### Posicionamiento recomendado

TuWebAI debe posicionarse como:

**servicio de desarrollo web profesional para negocios que necesitan una presencia digital seria, rapida y preparada para vender o escalar operaciones**

No como:

- landing builder
- agencia generalista de marketing
- estudio creativo sin foco comercial

Captiva queda como producto separado para landing pages orientadas a conversion.

## Estructura actual de paginas y embudo

### Home

La home actual sigue esta secuencia:

1. Hero institucional
2. Filosofia
3. Servicios
4. Proceso
5. Tecnologia
6. Comparacion
7. Showroom
8. Pricing
9. Logos
10. Impacto
11. Testimonios
12. Contacto

Es un recorrido largo, con bastante contenido, pero no siempre en el mejor orden de venta.

### Rutas publicas relevantes

Desde [AppRoutes.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\AppRoutes.tsx), el sitio expone:

- `/`
- `/corporativos`
- `/uxui`
- `/ecommerce`
- `/consulta`
- `/servicios/consultoria-estrategica`
- `/servicios/desarrollo-web`
- `/servicios/posicionamiento-marketing`
- `/servicios/automatizacion-marketing`
- `/faq`
- `/tecnologias`
- `/equipo`
- `/estudio`

Esto confirma otra vez que hoy el producto se ve mas amplio que el foco deseado.

## Hallazgos por elemento

### 1. Hero principal

Archivo auditado:
- [hero-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\hero-section.tsx)

Estado actual:

- marca clara
- visual fuerte
- buena presencia
- copy principal ambiguo
- animacion rotativa con mensajes heterogeneos

Problemas:

- "Asesoria Comercial Digital" no posiciona claramente desarrollo web
- "Empresas de Alto Rendimiento" es aspiracional pero poco especifico
- el typewriter agrega dispersion:
  - estrategias comerciales
  - digitalizacion
  - automatizacion
  - soluciones integrales
- no hay problema concreto visible en el primer scroll
- no hay resultado de negocio claro

Impacto:

- baja claridad inicial
- baja autoseleccion del cliente ideal
- mas friccion para convertir trafico frio

### 2. Seccion de servicios

Archivo auditado:
- [services-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\services-section.tsx)

Estado actual:

- lista cuatro servicios
- mezcla consultoria, desarrollo, marketing y automatizacion
- CTA a consulta

Problemas:

- el sitio quiere vender desarrollo web, pero presenta un menu de agencia integral
- "Desarrollo Web Profesional" incluso menciona "landing pages de alto impacto", lo que invade el territorio de Captiva
- demasiados frentes compiten entre si
- no queda claro cual es el core offer

Impacto:

- ruido de decision
- posicionamiento debil
- mas dificil construir especializacion percibida

### 3. Seccion de comparacion

Archivo auditado:
- [comparison-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\comparison-section.tsx)

Estado actual:

- tablas comparativas por desarrollo web, marketing y automatizacion

Problemas:

- incluye promesas demasiado agresivas o poco creibles:
  - soporte 24/7
  - garantia de resultados
  - optimizacion semanal
  - IA detallada
- mezcla categorias que vuelven a abrir el problema de foco
- la comparacion parece autodeclarativa y no apoyada por evidencia
- el CTA es correcto, pero llega despues de una tabla pesada

Impacto:

- erosiona credibilidad
- puede sonar a promesa inflada

### 4. Showroom / ejemplos

Archivo auditado:
- [showroom-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\marketing-home\components\showroom-section.tsx)

Estado actual:

- hay portfolio visual
- hay modal con detalles
- hay links externos

Fortalezas:

- esta seccion si ayuda a vender
- baja friccion para explorar
- da soporte visual a la propuesta

Problemas:

- falta explicar por que cada caso es relevante para un negocio
- faltan resultados mas concretos y creibles
- varios resultados son vagos:
  - "Visibilidad 360"
  - "Operaciones 24/7"
  - "Comunidad activa"
- el CTA final vuelve a consulta generica, no a un argumento mas orientado a venta

Impacto:

- hay portfolio, pero no termina de funcionar como prueba comercial fuerte

### 5. Pricing

Archivo auditado:
- [pricing-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\payments\components\pricing-section.tsx)

Estado actual:

- tres planes
- mensualidad
- checkout directo

Problemas:

- para servicios web profesionales, el pricing tan cerrado puede generar desconfianza si no se explica alcance, tiempos, condiciones y que es recurrente
- mezcla "sitio web" con "plan mensual" sin suficiente contexto
- puede sentirse producto cerrado en vez de servicio profesional
- hay riesgo de friccion temprana: pedir checkout antes de consolidar valor

Impacto:

- puede bajar conversion en trafico frio B2B
- puede atraer leads no calificados o desconfiados

### 6. Testimonios

Archivo auditado:
- [testimonials-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\testimonials\components\testimonials-section.tsx)

Fortalezas:

- existe prueba social
- hay formulario para sumar testimonios

Problemas:

- la calidad de la prueba depende de contenido cargado, no de un framework de credibilidad fuerte
- faltan marcadores de autoridad:
  - rubro
  - tipo de proyecto
  - resultado concreto
  - nombre y cargo mas robustos
- "Lo que dicen quienes ya han confiado en nosotros" es correcto pero generico

Impacto:

- ayuda, pero no cierra confianza por si sola

### 7. Contacto y CTA

Archivo auditado:
- [contact-section.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\features\contact\components\contact-section.tsx)

Fortalezas:

- CTA claro
- formulario simple
- canal directo por WhatsApp

Problemas:

- el lenguaje sigue siendo muy consultivo y general
- "consulta estrategica gratuita" no necesariamente conecta con alguien que busca desarrollo web
- "Estimacion de resultados potenciales y ROI esperado" promete demasiado para un contacto inicial
- los beneficios de la consulta podrian ser mas concretos y menos grandilocuentes

Impacto:

- el CTA funciona, pero no optimiza la expectativa correcta del lead

### 8. FAQ

Archivo auditado:
- [faq-page.tsx](c:\Users\juan\Documents\Proyectos\Tuwebai\client\src\app\router\knowledge\faq-page.tsx)

Fortalezas:

- cubre objeciones reales
- tiene informacion util

Problemas:

- refuerza la dispersion del negocio
- mezcla desarrollo web, SEO, marketing y mantenimiento
- algunas respuestas pueden sonar demasiado cerradas o comerciales
- puede consolidar la percepcion de agencia integral, no de especialista en desarrollo web

## Problemas criticos del copy

### 1. Falta de propuesta de valor clara

Hoy no se puede resumir el sitio en una frase simple y fuerte. El mensaje dominante no dice:

- hacemos sitios y sistemas web para negocios
- para empresas que necesitan vender mejor o digitalizar procesos
- con foco en velocidad, conversion y profesionalismo

### 2. Copy generico o demasiado amplio

Ejemplos de problemas repetidos:

- "soluciones integrales"
- "transformamos tu negocio"
- "maximizar tu negocio digital"
- "alto rendimiento"

Son frases comunes en agencias y consultoras, pero no diferencian.

### 3. Exceso de servicios listados

El sitio hoy vende demasiadas cosas a la vez:

- consultoria
- desarrollo
- SEO
- SEM
- automatizacion
- email marketing
- CRM

Eso resta foco a la oferta principal.

### 4. Mezcla de TuWebAI y Captiva por semantica

Aunque Captiva no aparezca como marca en la home, algunas frases de TuWebAI pisan territorio de landing/conversion como producto. Eso debilita la separacion estrategica entre ambos productos.

### 5. Credibilidad tensionada por promesas

Hay claims que necesitan evidencia o deben bajarse:

- soporte 24/7
- garantia de resultados
- reportes en tiempo real
- resultados comparativos muy amplios
- ROI esperado en una consulta gratuita

## Problemas de claridad del mensaje

- no queda claro que el core es desarrollo web profesional
- no queda claro para que tipo de empresa es ideal
- no queda claro si se vende servicio, producto o suscripcion
- no queda claro que diferencia a TuWebAI de una agencia tradicional
- el lenguaje alterna entre marca premium, consultora y agencia full service

## Problemas de conversion

- CTA principal correcto pero poco cualificado
- hero no filtra bien al lead correcto
- pricing puede generar friccion prematura
- showroom existe, pero le falta framework comercial
- testimonios ayudan, pero no construyen suficiente autoridad
- demasiadas secciones antes de llegar a una propuesta compacta y orientada a negocio

## Posicionamiento recomendado para TuWebAI

### Definicion corta

TuWebAI es un servicio de desarrollo web profesional para negocios que necesitan una presencia digital seria, rapida y preparada para vender o escalar operaciones.

### Que hace

Diseña y desarrolla:

- sitios web profesionales
- webs corporativas
- e-commerce
- sistemas y paneles web para negocios

### Para quien es

- empresas
- negocios en crecimiento
- marcas que necesitan una web profesional y confiable
- equipos que necesitan digitalizar procesos o vender mejor online

### Que problema resuelve

- sitios lentos o poco profesionales
- presencia digital que no transmite confianza
- web que no convierte
- operaciones dispersas sin sistema web propio

### Que lo diferencia

- foco en desarrollo web profesional, no en plantillas genericas
- enfoque comercial y no solo visual
- combinacion de velocidad, UX y estructura orientada a conversion
- capacidad de construir desde webs corporativas hasta sistemas web

## Conclusiones

El sitio ya tiene base visual, portfolio y suficiente volumen para vender mejor. El problema no es falta de contenido; es falta de foco narrativo.

La prioridad no deberia ser agregar mas secciones. Deberia ser:

1. clarificar la oferta principal
2. ordenar la jerarquia del mensaje
3. bajar la dispersion de servicios
4. reforzar credibilidad
5. hacer que cada CTA responda a una oferta clara

Si se ejecuta bien, el sitio puede pasar de "agencia digital amplia" a "servicio de desarrollo web profesional con argumento comercial fuerte".
