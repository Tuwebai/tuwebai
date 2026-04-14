# Qué es Google Analytics y cómo leerlo si no sos técnico

**Google Analytics tiene fama de ser complicado. No lo es si sabés qué mirar y qué ignorar. Esta guía te da exactamente eso.**

Si tenés una web, tenés (o deberías tener) Google Analytics. Es la herramienta gratuita de Google que registra todo lo que pasa en tu sitio: quién entra, de dónde vienen, qué páginas visitan, cuánto tiempo se quedan y qué acciones toman.

El problema es que Google Analytics 4 — la versión actual — tiene cientos de métricas y decenas de reportes. Para un dueño de negocio que no es analista de datos, abrir el dashboard puede ser abrumador.

Este artículo te dice qué mirar, qué significa y cómo usarlo para tomar decisiones.

---

## Las 5 métricas que importan para un dueño de negocio

### 1. Usuarios activos

Cuántas personas distintas visitaron tu sitio en un período determinado. Es el punto de partida: cuánta gente llegó.

**Cómo leerlo:** si tus usuarios activos crecen mes a mes, algo está funcionando (SEO, publicidad, referencias). Si caen, algo cambió — puede ser estacional, puede ser un problema técnico, puede ser que dejaste de publicar contenido.

### 2. Fuentes de tráfico (Acquisition)

De dónde vienen esas personas. Las principales:
- **Organic Search:** llegaron desde Google sin publicidad paga
- **Direct:** escribieron tu URL directamente o tienen un bookmark
- **Social:** llegaron desde redes sociales
- **Paid Search:** llegaron desde Google Ads u otra publicidad paga
- **Referral:** llegaron desde otro sitio que linkea al tuyo

**Cómo usarlo:** si el 90% de tu tráfico es directo, tenés un problema de visibilidad — nadie te encuentra buscando. Si el tráfico orgánico crece, el SEO está funcionando.

### 3. Tasa de engagement (antes tasa de rebote)

En GA4, el engagement rate mide el porcentaje de sesiones donde el usuario interactuó con la página (scroll, clic, tiempo en página). Lo opuesto al rebote.

Un engagement rate por encima del 60% para una web de servicios es saludable. Por debajo del 40% es señal de que las personas llegan y se van rápido, lo que puede indicar que el contenido no es relevante para quien llega.

### 4. Páginas más visitadas

Qué páginas ven más las personas. Esto te dice qué contenido genera interés y qué páginas nadie visita (y quizás deberías mejorar o promover más).

### 5. Conversiones

El número más importante. Cuántas veces se realizaron las acciones que definiste como objetivo: formulario enviado, clic en WhatsApp, descarga de material, turno agendado.

Si las conversiones no están configuradas, GA4 te muestra tráfico sin contexto. Es como saber cuánta gente entró a tu local pero no saber cuántos compraron.

---

## Cómo acceder a estas métricas en GA4

**Informes > Adquisición > Descripción general de la adquisición:** muestra las fuentes de tráfico.

**Informes > Participación > Páginas y pantallas:** muestra las páginas más visitadas.

**Informes > Participación > Eventos:** muestra los eventos registrados (incluyendo conversiones si están configuradas).

**Inicio (Home):** el resumen ejecutivo con las métricas principales del período seleccionado.

---

## La configuración mínima que necesitás tener

Para que GA4 sea útil, necesitás tener configurados los eventos de conversión específicos de tu negocio. Por defecto, GA4 registra visitas y algunas interacciones básicas, pero no sabe qué es "éxito" para tu negocio.

Los eventos mínimos que deberían estar configurados: formulario enviado, clic en WhatsApp, clic en número de teléfono (si aplica). Si no están, hablá con quien te hizo la web — es una configuración que lleva una hora y cambia completamente la utilidad de los datos.

*En TuWebAI configuramos GA4 con eventos de conversión en todos los proyectos y lo conectamos con Pulse para que puedas ver tus métricas clave sin necesidad de saber navegar Analytics. [Hablemos de tu proyecto →](/consulta)*
