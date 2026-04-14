# Cómo mejorar la velocidad de tu web (sin saber programar)

**La velocidad de carga es el factor de UX con mayor impacto directo en conversión. Y hay cosas concretas que podés hacer vos mismo para mejorarla sin tocar una línea de código.**

Cada segundo adicional de tiempo de carga reduce la tasa de conversión entre un 4% y un 20%, dependiendo del rubro. En mobile — donde llega más del 60% del tráfico en Argentina — el impacto es todavía mayor.

La buena noticia: muchos de los problemas de velocidad más frecuentes tienen solución sin necesidad de saber programar.

---

## Paso 1 — Medí en qué estado está tu web ahora

Antes de hacer nada, necesitás saber cuál es el punto de partida. Dos herramientas gratuitas:

**Google PageSpeed Insights** (pagespeed.web.dev): pegás la URL de tu web y te da un score del 0 al 100 para desktop y mobile, con una lista de los problemas específicos que están afectando la velocidad. La lista se divide en "oportunidades" (las más impactantes) y "diagnósticos".

**GTmetrix** (gtmetrix.com): análisis más detallado que PageSpeed, con waterfall de carga que muestra exactamente qué elementos tardan más.

Hacé el análisis en mobile, no solo en desktop. Las diferencias pueden ser grandes y mobile es el que importa más para la mayoría de los negocios.

---

## Los problemas más frecuentes y cómo resolverlos sin código

### Imágenes demasiado pesadas (el problema más común)

Las imágenes son responsables del 50% al 80% del peso de carga de la mayoría de las webs de PyMEs. Fotos tomadas con cámara de alta resolución cargadas directamente al sitio sin ninguna optimización son el problema número uno.

**Qué hacer:**

**Reducir el tamaño de las imágenes antes de subirlas.** Herramientas gratuitas online: Squoosh (squoosh.app), TinyPNG (tinypng.com), Compressor.io. Una foto de 4 MB puede bajar a 200 KB sin pérdida visible de calidad para pantalla.

**Dimensiones correctas.** Si la imagen se va a mostrar en un espacio de 800px de ancho, no tiene sentido subir una imagen de 4000px de ancho. Redimensioná antes de comprimir.

**Formato WebP.** WebP es un formato de imagen más eficiente que JPEG o PNG para web. Squoosh permite convertir a WebP directamente.

Si tu web está en WordPress, plugins como Smush o ShortPixel pueden optimizar automáticamente las imágenes que ya están subidas y las nuevas que agregues.

### Hosting lento

El servidor donde está alojada tu web tiene un impacto directo en la velocidad. Hostings compartidos baratos (en servidores sobrecargados con cientos de webs) generan tiempos de respuesta lentos que ninguna otra optimización puede compensar completamente.

**Cómo identificarlo en PageSpeed:** si el tiempo hasta el primer byte (TTFB - Time to First Byte) es mayor a 600ms, el hosting es probablemente el cuello de botella.

**Qué hacer:** si estás en un hosting muy económico, considera migrar a uno de mejor performance. En Argentina y LATAM, opciones como SiteGround, Netlify (para sitios estáticos) o Render ofrecen mejor performance que los hostings compartidos de bajo costo.

### Sin caché configurada

El caché permite que el navegador del usuario guarde localmente ciertos archivos de tu web (imágenes, CSS, JavaScript) para no tener que descargarlos de nuevo en cada visita. Sin caché correctamente configurada, cada visita descarga todo desde cero.

Si tu web está en WordPress, plugins como WP Rocket (pago) o W3 Total Cache (gratuito) configuran el caché correctamente con pocos clics.

### Scripts de terceros que bloquean la carga

Google Tag Manager, Google Analytics, chatbots, widgets de redes sociales, herramientas de heatmap — cada servicio externo que cargás en tu web agrega tiempo de carga. Algunos se cargan de forma que bloquean el renderizado de la página.

**Qué hacer sin código:** si usás Google Tag Manager, revisá que todos los scripts estén configurados para cargarse de forma diferida (no bloqueante). Eliminá cualquier widget o script de tercero que no uses activamente.

---

## Los cambios con mayor impacto por tiempo invertido

Si solo podés hacer una cosa: **optimizá las imágenes**. Es la intervención con mayor impacto potencial y la más accesible sin conocimientos técnicos.

Si podés hacer dos: **verificá el hosting**. Un cambio de hosting puede mejorar el score de PageSpeed en 20 o 30 puntos sin cambiar nada más en el sitio.

Si podés hacer tres: **configurá el caché** con un plugin si usás WordPress.

---

## Cuándo necesitás ayuda técnica

Hay problemas de velocidad que requieren intervención técnica: código JavaScript que bloquea el renderizado, CSS no usado que se carga en todas las páginas, falta de lazy loading en elementos complejos, configuraciones avanzadas de servidor.

PageSpeed te va a indicar si estos problemas existen y qué impacto tienen. Si el problema está ahí pero está más allá de lo que podés resolver solo, es un buen argumento para hablar con el proveedor que hizo tu web.

*En TuWebAI todos los proyectos pasan por optimización de performance con Lighthouse > 90 antes del lanzamiento. Si tu web tiene problemas de velocidad que estás queriendo resolver, empezamos con un diagnóstico. [Pedí el tuyo →](/diagnostico-gratuito)*
