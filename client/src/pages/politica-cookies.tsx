import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import PageBanner from '../components/ui/page-banner';

export default function PoliticaCookies() {
  return (
    <>
      <Helmet>
        <title>Política de Cookies | TuWeb.ai</title>
        <meta name="description" content="Información sobre las cookies utilizadas en el sitio web de TuWeb.ai" />
      </Helmet>

      <PageBanner 
        title="Política de Cookies" 
        subtitle="Información sobre el uso de cookies en nuestra web"
      />

      <section className="py-16 bg-[#080810]">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2>Política de Cookies</h2>
            <p>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h3>1. ¿Qué son las cookies?</h3>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web que visitas colocan en tu ordenador. Se utilizan de forma generalizada 
              para que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio. 
              Las cookies permiten a un sitio web reconocer tu dispositivo y recordar información sobre tu visita (por ejemplo, tu idioma preferido, 
              tamaño de fuente y otras preferencias).
            </p>

            <h3>2. Tipos de cookies que utilizamos</h3>
            <p>En nuestro sitio web utilizamos los siguientes tipos de cookies:</p>

            <h4>2.1. Cookies técnicas o necesarias</h4>
            <p>
              Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las 
              diferentes opciones o servicios que en ella existan como, por ejemplo, controlar el tráfico y la comunicación de datos, identificar 
              la sesión, acceder a partes de acceso restringido, recordar los elementos que integran un pedido, realizar el proceso de compra de un 
              pedido, realizar la solicitud de inscripción o participación en un evento, utilizar elementos de seguridad durante la navegación, 
              almacenar contenidos para la difusión de vídeos o sonido o compartir contenidos a través de redes sociales.
            </p>

            <h4>2.2. Cookies de preferencias o personalización</h4>
            <p>
              Son aquellas que permiten recordar información para que el usuario acceda al servicio con determinadas características que pueden 
              diferenciar su experiencia de la de otros usuarios, como, por ejemplo, el idioma, el número de resultados a mostrar cuando el usuario 
              realiza una búsqueda, el aspecto o contenido del servicio en función del tipo de navegador a través del cual el usuario accede al 
              servicio o de la región desde la que accede al servicio, etc.
            </p>

            <h4>2.3. Cookies analíticas o de medición</h4>
            <p>
              Son aquellas que permiten al responsable de las mismas el seguimiento y análisis del comportamiento de los usuarios de los sitios web 
              a los que están vinculadas, incluida la cuantificación de los impactos de los anuncios. La información recogida mediante este tipo 
              de cookies se utiliza en la medición de la actividad de los sitios web, aplicación o plataforma, con el fin de introducir mejoras en 
              función del análisis de los datos de uso que hacen los usuarios del servicio.
            </p>

            <h4>2.4. Cookies de publicidad comportamental</h4>
            <p>
              Son aquellas que almacenan información del comportamiento de los usuarios obtenida a través de la observación continuada de sus 
              hábitos de navegación, lo que permite desarrollar un perfil específico para mostrar publicidad en función del mismo.
            </p>

            <h3>3. Cookies de terceros</h3>
            <p>
              En algunas páginas de nuestro sitio web se pueden instalar cookies de terceros que permiten gestionar y mejorar los servicios que 
              éstos ofrecen. Un ejemplo de este uso son los enlaces a las redes sociales que permiten compartir nuestros contenidos.
            </p>

            <h3>4. ¿Cómo administrar las cookies?</h3>
            <p>
              Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador. 
              En caso de que no permitas la instalación de cookies es posible que no puedas acceder a algunas de las funcionalidades del sitio web.
            </p>
            <p>
              A continuación, te ofrecemos enlaces para gestionar y controlar las cookies en los principales navegadores:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noopener noreferrer" className="text-[#00CCFF] hover:text-[#9933FF]">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-[#00CCFF] hover:text-[#9933FF]">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#00CCFF] hover:text-[#9933FF]">Safari</a></li>
              <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#00CCFF] hover:text-[#9933FF]">Microsoft Edge</a></li>
            </ul>

            <h3>5. Cookies utilizadas en nuestro sitio web</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border border-gray-700 px-4 py-2">Nombre</th>
                  <th className="border border-gray-700 px-4 py-2">Tipo</th>
                  <th className="border border-gray-700 px-4 py-2">Propietario</th>
                  <th className="border border-gray-700 px-4 py-2">Finalidad</th>
                  <th className="border border-gray-700 px-4 py-2">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-700 px-4 py-2">session</td>
                  <td className="border border-gray-700 px-4 py-2">Técnica</td>
                  <td className="border border-gray-700 px-4 py-2">Propia</td>
                  <td className="border border-gray-700 px-4 py-2">Mantenimiento de la sesión del usuario</td>
                  <td className="border border-gray-700 px-4 py-2">Sesión</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2">_ga</td>
                  <td className="border border-gray-700 px-4 py-2">Analítica</td>
                  <td className="border border-gray-700 px-4 py-2">Google Analytics</td>
                  <td className="border border-gray-700 px-4 py-2">Distinguir usuarios únicos</td>
                  <td className="border border-gray-700 px-4 py-2">2 años</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2">_gid</td>
                  <td className="border border-gray-700 px-4 py-2">Analítica</td>
                  <td className="border border-gray-700 px-4 py-2">Google Analytics</td>
                  <td className="border border-gray-700 px-4 py-2">Distinguir usuarios</td>
                  <td className="border border-gray-700 px-4 py-2">24 horas</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2">_gat</td>
                  <td className="border border-gray-700 px-4 py-2">Analítica</td>
                  <td className="border border-gray-700 px-4 py-2">Google Analytics</td>
                  <td className="border border-gray-700 px-4 py-2">Limitar el porcentaje de solicitudes</td>
                  <td className="border border-gray-700 px-4 py-2">1 minuto</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2">theme</td>
                  <td className="border border-gray-700 px-4 py-2">Personalización</td>
                  <td className="border border-gray-700 px-4 py-2">Propia</td>
                  <td className="border border-gray-700 px-4 py-2">Almacenar preferencias de tema (claro/oscuro)</td>
                  <td className="border border-gray-700 px-4 py-2">1 año</td>
                </tr>
              </tbody>
            </table>

            <h3>6. Cambios en la política de cookies</h3>
            <p>
              Es posible que actualicemos la Política de Cookies de nuestro sitio web, por ello le recomendamos revisar esta política cada vez 
              que acceda a nuestro sitio web con el objetivo de estar adecuadamente informado sobre cómo y para qué usamos las cookies.
            </p>

            <h3>7. Contacto</h3>
            <p>
              Si tienes cualquier duda sobre nuestra Política de Cookies, puedes contactar con nosotros a través del 
              correo electrónico hola@tuweb.ai.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}