import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import PageBanner from '../components/ui/page-banner';

export default function PoliticaPrivacidad() {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad | TuWeb.ai</title>
        <meta name="description" content="Política de privacidad y tratamiento de datos personales de TuWeb.ai" />
      </Helmet>

      <PageBanner 
        title="Política de Privacidad" 
        subtitle="Información sobre el tratamiento de tus datos personales"
      />

      <section className="py-16 bg-[#080810]">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2>Política de Privacidad</h2>
            <p>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h3>1. Responsable del Tratamiento</h3>
            <p>
              El responsable del tratamiento de los datos personales que facilites a través de este sitio web es <strong>TuWeb.ai</strong>, 
              con correo electrónico tuwebai@gmail.com y teléfono +54 357 141 6044.
            </p>

            <h3>2. Finalidad del Tratamiento</h3>
            <p>Tratamos tus datos personales con las siguientes finalidades:</p>
            <ul>
              <li>Gestionar el registro de usuario y mantener la relación contractual.</li>
              <li>Atender las consultas, solicitudes o peticiones que realices a través de nuestros formularios de contacto.</li>
              <li>Enviarte información comercial sobre nuestros productos y servicios, siempre que hayas consentido previamente.</li>
              <li>Analizar tu navegación en el sitio web para mejorar nuestros servicios y mostrarte publicidad adaptada a tus intereses.</li>
              <li>Cumplir con obligaciones legales.</li>
            </ul>

            <h3>3. Legitimación</h3>
            <p>
              La base legal para el tratamiento de tus datos es la siguiente:
            </p>
            <ul>
              <li>La ejecución de la relación contractual cuando contratas alguno de nuestros servicios.</li>
              <li>Tu consentimiento expreso para enviar comunicaciones comerciales.</li>
              <li>El interés legítimo para enviar información sobre productos similares a los contratados.</li>
              <li>El cumplimiento de obligaciones legales.</li>
            </ul>

            <h3>4. Conservación de los Datos</h3>
            <p>
              Conservaremos tus datos mientras se mantenga la relación contractual y, posteriormente, durante los plazos legalmente establecidos 
              para atender posibles responsabilidades.
            </p>
            <p>
              En el caso de los datos tratados con fines comerciales, los conservaremos hasta que solicites su supresión.
            </p>

            <h3>5. Destinatarios</h3>
            <p>
              Tus datos podrán ser comunicados a:
            </p>
            <ul>
              <li>Administraciones Públicas cuando exista una obligación legal.</li>
              <li>Encargados del tratamiento necesarios para la prestación de los servicios.</li>
              <li>Plataformas tecnológicas que nos prestan servicios, algunas de las cuales pueden estar ubicadas fuera del Espacio Económico Europeo, 
                  pero con las garantías adecuadas.</li>
            </ul>

            <h3>6. Derechos</h3>
            <p>
              Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando un correo electrónico 
              a hola@tuweb.ai, acompañando copia de tu DNI o documento identificativo equivalente.
            </p>
            <p>
              También tienes derecho a presentar una reclamación ante la Dirección Nacional de Protección de Datos Personales (DNPDP) de Argentina.
            </p>

            <h3>7. Medidas de Seguridad</h3>
            <p>
              Hemos adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de tus datos personales y evitar 
              su alteración, pérdida, tratamiento o acceso no autorizado.
            </p>

            <h3>8. Uso de Cookies</h3>
            <p>
              Utilizamos cookies propias y de terceros para mejorar nuestros servicios y mostrarte publicidad relacionada con tus preferencias 
              mediante el análisis de tus hábitos de navegación. Puedes obtener más información en nuestra 
              <a href="/politica-cookies" className="text-[#00CCFF] hover:text-[#9933FF]"> Política de Cookies</a>.
            </p>

            <h3>9. Cambios en la Política de Privacidad</h3>
            <p>
              Nos reservamos el derecho a modificar la presente Política de Privacidad en cualquier momento. Los cambios entrarán en vigor 
              desde el momento en que se publiquen en el sitio web, siendo tu responsabilidad consultarla periódicamente.
            </p>

            <h3>10. Contacto</h3>
            <p>
              Si tienes cualquier duda sobre nuestra Política de Privacidad, puedes contactar con nosotros a través del 
              correo electrónico hola@tuweb.ai.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}