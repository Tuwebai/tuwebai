NOTA DE CONTEXTO

Este documento corresponde a una auditoria historica hecha sobre una version publicada anterior de TuWeb.ai.

Uso recomendado:

- sirve como insumo estrategico e historico
- no reemplaza los documentos operativos actuales
- debe leerse junto con:
  - `docs/COPY_AUDIT_TUWEBAI.md`
  - `docs/COPY_GROWTH_PLAN.md`
  - `docs/COPY_REWRITE_PROPOSAL.md`

Estado del documento al 2026-03-13:

- parcialmente vigente
- varias observaciones siguen siendo utiles como diagnostico inicial
- otras ya quedaron corregidas en el repo actual

Resumen rapido de vigencia:

- ya corregido:
  - hero sin propuesta de valor clara
  - exceso de dispersion en servicios
  - CTA demasiado ambiguos en el landing
  - showroom y testimonios demasiado decorativos
  - typewriter lento del hero
- sigue siendo una advertencia util:
  - revisar si `nav-dots` ayuda o distrae al embudo
  - seguir fortaleciendo pricing y prueba social
  - mantener separacion semantica entre TuWebAI y Captiva
- desalineado con la estrategia actual:
  - referencias a "landing pages para negocios locales" como eje principal de TuWebAI

---
Auditoría del sitio TuWeb.ai
1. Diagnóstico general del sitio

El sitio actual tiene un diseño oscuro y moderno y usa un estilo de presentación de pantalla completa con navegación vertical. Se percibe como una agencia digital que ofrece servicios de desarrollo web y marketing, pero la propuesta concreta se entiende recién después de desplazarse.
El encabezado (hero) sólo muestra el logotipo TuWeb.ai sin ningún enunciado de valor ni explicación; el visitante necesita desplazarse para descubrir la oferta. Las secciones posteriores enumeran los servicios, describen su proceso de trabajo, presentan un portafolio, planes de precios, casos de éxito, un breve testimonio, un formulario de consulta gratuita y un pie de página con enlaces. A pesar de la buena estética, el sitio presenta confusión en el posicionamiento, falta de claridad en el mensaje y un flujo poco orientado a la conversión.

2. Qué se entiende bien y qué no

Lo que se entiende bien

Servicios principales: La sección “Soluciones Digitales para tu Éxito” explica cuatro áreas de trabajo: consultoría estratégica, desarrollo web, posicionamiento/marketing y automatización de marketing. Cada tarjeta detalla beneficios concretos: análisis de modelos de negocio y estrategias digitales, diseño de sitios rápidos y optimizados para SEO, campañas SEO/SEM y optimización de conversión, e implementación de procesos de marketing automation
tuweb-ai.com
.

Proceso de trabajo: La sección “El Proceso de Trabajo” enumera cinco etapas (análisis y diagnóstico, diseño de estrategia, implementación, monitoreo y resultados medibles) que muestran un enfoque estructurado para proyectos
tuweb-ai.com
.

Tecnologías: Se presentan las tecnologías dominadas (React, Next.js, Vite, Tailwind, Node.js y Express) con iconos, demostrando conocimientos técnicos
tuweb-ai.com
.

Planes y precios: La sección de planes muestra tres opciones (Básico, Profesional y Enterprise) con precios mensuales y características específicas como número de páginas, SEO, CMS y automatización. La propuesta del plan profesional incluye 10 páginas, estrategia SEO completa, panel de administración y marketing por email
tuweb-ai.com
.

Llamada a la acción final: Hay un formulario de consulta gratuita que explica los beneficios de la llamada (diagnóstico personalizado, identificación de oportunidades, plan de acción, estimación de ROI) y ofrece contacto por WhatsApp
tuweb-ai.com
.

Lo que no se entiende bien

Propuesta de valor inmediata: El hero carece de un título y sub‑título claros. Según las mejores prácticas de UX, los usuarios forman una impresión en milisegundos y el área inicial debe comunicar la propuesta de valor y un CTA de forma concisa. El mensaje “Soluciones Digitales para tu Éxito” es genérico; no explica qué problema resuelve la agencia, para quién es ni qué resultados puede lograr.

Quién es el cliente ideal: No queda claro si la agencia está dirigida a startups, negocios locales, empresas medianas o e‑commerce. Las tarjetas de servicios usan términos amplios (“tu negocio”, “estrategias digitales”), pero no se segmenta el público objetivo.

Beneficios diferenciadores: Aunque se listan servicios, no se destacan ventajas competitivas (por ejemplo, especialización en industrias locales, tiempos de entrega rápidos, garantías de resultados o precios competitivos). Tampoco se apoyan en pruebas sociales (solo hay un testimonio breve).

Relación entre las secciones: El sitio mezcla el portafolio y los planes de precios sin construir un relato. Los visitantes pasan de ver servicios a un showroom virtual, luego a planes y casos de éxito, pero sin un vínculo narrativo ni transiciones claras.

3. Principales errores estratégicos

Falta de posicionamiento claro en el hero: La ausencia de un título que responda “¿qué hacemos?”, “¿para quién?” y “¿qué beneficio obtiene?” impide que el visitante entienda el servicio en los primeros segundos. Un estudio de Omniconvert recuerda que el hero debe transmitir la propuesta de valor y el CTA en segundos para evitar tasas de rebote elevadas.

Mensaje genérico y orientado a la agencia, no al cliente: El copy se centra en la agencia (“Soluciones digitales…”, “herramientas de venta”) en lugar de enfocarse en el problema del cliente o en los resultados que obtendrá. Según Alf Design Group, un valor de propuesta efectivo debe responder a quién está dirigido, qué problema resuelve y qué beneficio concreto genera.

Navegación confusa: El menú principal muestra enlaces genéricos (Inicio, Corporativos, UX/UI, E-commerce, Tecnologías, FAQ) que no reflejan las cuatro áreas de servicios ni facilitan al usuario encontrar lo que necesita. La barra vertical de navegación con puntos es poco intuitiva y no indica las secciones.

Uso excesivo de secciones sin cohesión: La presencia de un showroom de proyectos mezclados (e‑commerce, SaaS, seguridad ciudadana), un listado de tecnologías y una sección de casos aislados rompe el hilo del recorrido. La home parece una mezcla de portfolio, tienda de productos y página de agencia genérica. No está claro si el foco es vender landing pages para negocios locales, ofrecer servicios de desarrollo a medida o comercializar templates.

Escasa prueba social y credibilidad: Solo se muestra un testimonio breve de un cliente y dos casos de éxito con descripciones muy resumidas. No hay logos de clientes, métricas de resultados (porcentaje de aumento de conversiones, ventas logradas) ni estudios de caso detallados que respalden la autoridad de la agencia.

Formularios y CTAs con fricción: El formulario de consulta pide nombre completo, email y un mensaje amplio; podrían simplificarse los campos o guiar al usuario con preguntas cerradas. CXL señala que reducir la complejidad del formulario incrementa la probabilidad de conversión, aunque hay que mantener los campos que aporten valor. Además, hay múltiples CTAs (“Consultanos”, “Solicitar una consulta”, “Solicitar plan”, “Solicitar consulta gratuita”) que compiten entre sí y pueden dispersar al visitante.

Poca optimización para nichos locales: Si el objetivo es captar negocios locales (gimnasios, clínicas dentales, estudios de estética, abogados), la web no contiene contenido específico para estos segmentos (por ejemplo, ejemplos de landing pages para gimnasios, estadísticas de resultados en clínicas, etc.).

4. Qué confunde al visitante

Hero sin explicación: Al ingresar al sitio, el visitante solo ve el logo y un botón de “Descubrir”. No hay mensaje explicativo ni CTA evidente; el usuario debe desplazarse sin saber qué encontrar.

Ambigüedad en los servicios: El texto “Soluciones Digitales para tu Éxito” sugiere consultoría global, pero el usuario luego encuentra un showroom con un panel de trading, un proyecto de seguridad ciudadana y una tienda de perfumes
tuweb-ai.com
; esto genera dudas sobre si es una agencia de producto propio, un marketplace o un estudio de desarrollo sin especialización.

Planes de precios fuera de contexto: Se presentan planes con valores mensuales altos en pesos argentinos sin explicar si son suscripciones, mantenimiento o proyectos únicos. Tampoco se aclara si incluyen la creación de landing pages “optimizadas para consultas” (objetivo central del negocio del usuario) o servicios de marketing permanente.

Casos de éxito y testimonios limitados: Hay dos casos con descripciones generales y un único testimonio breve; esto reduce la confianza y puede hacer pensar que la agencia tiene poca experiencia.

Falta de segmentación por público: No se menciona para qué industrias se adaptan las soluciones, ni se muestran ejemplos específicos. Esto contradice la idea de que la oferta está “enfocada en landing pages para negocios locales”.

5. Qué partes del sitio funcionan

Estética y coherencia visual: El diseño es moderno, con buena tipografía y uso de espacio. La sección de servicios resume claramente las cuatro áreas principales con iconos y bullets
tuweb-ai.com
.

Proceso de trabajo estructurado: La sección del proceso muestra un enfoque paso a paso que facilita la percepción de profesionalismo y metodología
tuweb-ai.com
.

Presentación de planes: La sección de precios utiliza tarjetas comparativas con listas de prestaciones claras y destaca visualmente el plan “Profesional” como opción recomendada
tuweb-ai.com
.

Formas de contacto variadas: Se ofrece un formulario, WhatsApp, teléfono y correo electrónico; esto da flexibilidad al visitante para comunicarse
tuweb-ai.com
.

Pie de página con enlaces útiles: El footer incluye servicios, enlaces a preguntas frecuentes y datos de contacto básicos
tuweb-ai.com
.

6. Qué partes deberían eliminarse

Showroom virtual en la home: El showroom con proyectos diversos genera ruido en la página de inicio. Mostrar proyectos tan distintos (perfumería, seguridad ciudadana, trading) desvía la atención y resta coherencia a la propuesta de “landing pages para negocios locales”. El portfolio debe estar en una sección separada o en subpáginas.

Barra vertical con puntos: La navegación vertical no aporta valor; es poco intuitiva y puede confundir al usuario. Es preferible una navegación clásica con anclajes claros.

Sección de tecnologías extensa: Mostrar todas las tecnologías puede interesar a perfiles técnicos, pero no a un cliente que busca resultados. Esta sección podría simplificarse o trasladarse a la página “Tecnologías” para liberar espacio en la home.

Testimonio único: Un único testimonio sin contexto aporta poca credibilidad y puede eliminarse o reemplazarse por un bloque de logos de clientes o más testimonios breves.

7. Qué partes deberían rediseñarse

Hero section: Debe incluir una propuesta de valor clara con un título específico (qué ofrece la agencia), un subtítulo que amplíe la información (para quién está dirigida la oferta y qué problema resuelve) y un CTA principal. Las investigaciones indican que una propuesta de valor única y clara en el hero evita confusión y mejora la conversión. También es clave que en menos de 3 segundos el visitante entienda qué hace la empresa.

Navegación y estructura: La navegación debe rediseñarse agrupando servicios bajo categorías lógicas (por ejemplo, “Servicios” con submenús “Landing Pages”, “SEO & SEM”, “Automatización” y “Consultoría”). Eliminar elementos irrelevantes como “Política de privacidad” en la barra principal.

Planes de precios: Clarificar qué incluye cada plan, cuál es el resultado que promete (cantidad de leads, mejoras de conversión), la duración y qué pasa después del pago inicial. Incluir preguntas frecuentes sobre los planes y justificar la inversión.

Formulario de consulta: Simplificar los campos pidiendo sólo nombre, correo y un dropdown para seleccionar el tipo de negocio (gimnasio, clínica dental, etc.). CXL muestra que reducir la fricción de los formularios aumenta la probabilidad de conversión, siempre que se conserven los campos relevantes. Una opción es ofrecer un paso inicial sencillo y solicitar más datos en una segunda etapa tras el contacto.

Casos de éxito: Ampliar cada caso con métricas (incremento de leads, porcentaje de aumento de ventas, tiempo de implementación) y testimonios más extensos. Añadir logos o imágenes de los clientes para reforzar la confianza.

8. Qué partes deberían agregarse

Segmentación por nichos: Crear secciones específicas para cada tipo de negocio objetivo (gimnasios, clínicas dentales, abogados, estéticas, detallado automotor, etc.). Cada sección debería incluir ejemplos de landing pages, problemas comunes del nicho y resultados de campañas anteriores.

Prueba social robusta: Incluir testimonios en video o citas con nombre y foto, logos de clientes y métricas de resultados (“+50% de consultas para clínica X en 3 meses”). Esto responde a la recomendación de utilizar pruebas sociales en la hero o en la mitad superior de la página para generar confianza.

Indicadores de confianza: Agregar badges de garantías (“Satisfacción garantizada”, “Más de X proyectos entregados”), certificaciones (Google Partner, Meta Ads) o alianzas estratégicas.

Recursos educativos: Añadir un blog o sección de recursos con artículos sobre optimización de conversión, marketing local y diseño de landing pages. Estos contenidos educan a los clientes, posicionan a la agencia como autoridad y ayudan al SEO.

FAQ orientado a resultados: Incorporar preguntas frecuentes que respondan dudas típicas: tiempos de entrega, herramientas utilizadas, qué se espera del cliente, costos adicionales, etc.

CTA coherente: Mantener un único CTA primario (“Solicitar consulta gratuita”) y secundario (“Ver ejemplos de landing pages”). Evitar tener múltiples botones con mensajes distintos.

9. Nueva estructura recomendada para la home

Una estructura orientada a conversión y claridad podría ser:

Hero

Título claro: ejemplo: “Landing pages que convierten visitantes en clientes para tu negocio local”.

Subtítulo: explica para qué tipo de negocios (gimnasios, clínicas, estudios de estética, despachos legales) y qué problema resuelve (generar más consultas y ventas).

CTA único: “Agenda tu consulta gratuita” o “Solicita tu landing page” con contraste fuerte.

Elemento de prueba social: logos de clientes o una breve métrica (p. ej., “+120 proyectos entregados”).

Beneficios / valor diferencial

Tres o cuatro bloques que presenten ventajas únicas (por ejemplo, “Optimización para captar consultas”, “Implementación rápida en 10 días”, “Integración con tus herramientas de marketing”, “Soporte continuo”).

Para cada bloque, incluir un beneficio tangible y un icono.

Servicios o soluciones

Explicar las ofertas (Landing pages, SEO/SEM, Automations, Consultoría) con enlaces a páginas de detalle.

Asociar cada servicio con los nichos específicos y los resultados que han logrado.

Proceso de trabajo simplificado

Representar el paso a paso (diagnóstico → estrategia personalizada → desarrollo → optimización → resultados) en un diagrama o línea temporal; incluir breves descripciones y destacar el valor aportado en cada fase
tuweb-ai.com
.

Prueba social

Testimonios en carrusel con foto, cargo y resultados cuantitativos.

Logos de clientes y datos de éxito.

Casos de éxito / portfolio

Seleccionar 3‑4 proyectos relevantes (preferiblemente del nicho objetivo) y describir el desafío, la solución y el resultado (métricas).

Incluir enlace “Ver más casos” hacia una página de portfolio completa.

Planes y precios

Mostrar paquetes orientados a landing pages o campañas de captación.

Explicar qué incluye cada plan (número de landing pages, optimización SEO, configuración de anuncios) y el valor que generará.

Destacar un plan recomendado y añadir preguntas frecuentes relacionadas.

CTA final y contacto

Repetir la propuesta de “Consulta gratuita” reforzando el beneficio de obtener un diagnóstico y plan personalizado.

Incluir formulario simplificado, opciones de WhatsApp y teléfono.

Añadir badges de seguridad (protección de datos, uso responsable de información) para aumentar la confianza.

Footer completo

Mantener la estructura actual, pero añadir enlaces a recursos, artículos y páginas legales de manera organizada.

10. Cómo debería organizarse la jerarquía de secciones

Identidad clara: El encabezado y la navegación deben dejar claro que la página es de una agencia especializada en landing pages para negocios locales y marketing digital.

Problema y solución: Inmediatamente después del hero, explicar el problema de los clientes (poca generación de consultas, mala conversión, falta de presencia online) y cómo la agencia lo resuelve.

Beneficios y servicios: Presentar beneficios tangibles antes que características. Agrupar los servicios bajo categorías ordenadas y usar subpáginas para ampliar la información.

Proceso y prueba social: Mostrar el método de trabajo seguido de casos de éxito y testimonios, demostrando resultados reales y autoridad.

Planes y contacto: Ubicar los planes de precios antes de la sección de contacto, para que el visitante vea alternativas y decida si solicitar la consulta.

Contenido de soporte: Incluir recursos (blog, FAQs) en la parte inferior o en el pie de página para visitantes que necesiten más información.

11. Recomendaciones para que el sitio comunique mejor el valor de la agencia

Refinar la propuesta de valor en el hero: Utilizar el marco propuesto por Alf Design Group — “Producto” + “Audiencia” + “Problema” + “Solución” + “Beneficio”. Por ejemplo: “Creamos landing pages optimizadas para gimnasios, clínicas y estudios de estética que multiplican tus consultas en un 30% mediante estrategias de marketing digital.”

Enfatizar resultados: Incluir métricas o porcentajes (por ejemplo, “+50% de leads en 2 meses”) en secciones de servicios y casos de éxito; esto ayuda a conectar con los resultados deseados por los usuarios.

Usar lenguaje orientado al cliente: Cambiar frases centradas en la agencia (“soluciones digitales”, “herramientas de venta”) por mensajes centrados en el cliente y sus objetivos (“Consigue más clientes”, “Incrementa tus citas”).

Simplificar CTAs y formularios: Limitar el número de CTAs a uno principal y uno secundario; usar botones con verbos claros (“Agenda tu consulta”, “Ver planes”) y simplificar formularios pidiendo únicamente datos esenciales.

Añadir pruebas sociales visibles: Colocar logos de clientes y testimonios con resultados en el hero o cerca de los CTAs. La presencia de testimonios y datos concretos aumenta la confianza y puede impulsar la conversión.

Optimización móvil y velocidad: Asegurarse de que el hero cargue rápido y sea responsive, ya que más del 60 % del tráfico procede de dispositivos móviles y los usuarios abandonan sitios que tardan más de 3 segundos en cargar.

Crear contenido educativo: Publicar artículos o guías sobre estrategias de captación para negocios locales, SEO local y automatización. Esto atraerá tráfico orgánico, posicionará a la agencia como experta y nutrirá a los leads.

12. Resumen final con las mejoras prioritarias

Reformular completamente el hero con un título claro, subtítulo y CTA que comuniquen de inmediato la propuesta de valor: creación de landing pages y campañas de marketing para negocios locales que generen clientes y ventas.

Definir y destacar el público objetivo, adaptando el contenido y ejemplos a gimnasios, clínicas dentales, estudios de estética, abogados y otros negocios locales.

Estructurar la página de inicio siguiendo un recorrido lógico: propuesta de valor → beneficios clave → servicios → proceso de trabajo → prueba social → planes → CTA final.

Eliminar o trasladar el showroom virtual y la sección de tecnologías a páginas específicas; estos elementos no aportan claridad a la propuesta inicial y distraen al usuario.

Rediseñar el formulario de consulta simplificando los campos y añadiendo filtros de tipo de negocio para personalizar la respuesta.

Agregar testimonios, casos de éxito con métricas y logos de clientes para aumentar la credibilidad.

Optimizar CTAs y navegación, evitando duplicar mensajes y ofreciendo un menú que guíe a los visitantes a servicios, portafolio, planes y recursos.

Incorporar contenido educativo y FAQs que respondan preguntas frecuentes y muestren expertise.

Priorizar velocidad y experiencia móvil, siguiendo las recomendaciones de diseño y carga rápida para mejorar la retención y la conversión.

Implementando estas mejoras, TuWeb.ai puede pasar de ser una web visualmente atractiva pero poco clara a convertirse en una plataforma orientada a la conversión, que comunique su especialización en la creación de landing pages para negocios locales y demuestre resultados tangibles.

