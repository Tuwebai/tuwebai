import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import PageBanner from '../components/ui/page-banner';

export default function TerminosCondiciones() {
  return (
    <>
      <Helmet>
        <title>Términos y Condiciones | TuWeb.ai</title>
        <meta name="description" content="Términos y condiciones de uso de los servicios de TuWeb.ai" />
      </Helmet>

      <PageBanner 
        title="Términos y Condiciones" 
        subtitle="Conoce los términos y condiciones que rigen nuestros servicios"
      />

      <section className="py-16 bg-[#080810]">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2>Condiciones Generales de Contratación</h2>
            <p>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h3>1. Información General</h3>
            <p>
              El presente documento establece las Condiciones Generales de Contratación que regulan el uso del sitio web 
              <strong> www.tuweb.ai</strong> (en adelante, "el Sitio Web") propiedad de TuWeb.ai (en adelante, "la Empresa").
            </p>
            <p>
              La utilización del Sitio Web atribuye la condición de Usuario del mismo e implica la aceptación plena y sin reservas de todas y cada una 
              de las disposiciones incluidas en estas Condiciones Generales de Contratación.
            </p>

            <h3>2. Objeto del Sitio Web</h3>
            <p>
              El Sitio Web tiene como objeto proporcionar información sobre los servicios ofrecidos por la Empresa, así como permitir la contratación 
              de dichos servicios a través del mismo.
            </p>

            <h3>3. Registro de Usuario</h3>
            <p>
              Para acceder a determinados servicios es necesario que el Usuario se registre mediante la creación de una cuenta de Usuario, 
              facilitando la información personal necesaria según se indica en el formulario de registro correspondiente.
            </p>
            <p>
              El Usuario se compromete a proporcionar información veraz, exacta y completa, así como a mantenerla actualizada. La Empresa se reserva 
              el derecho a suspender o cancelar aquellos registros cuyos datos no sean veraces.
            </p>

            <h3>4. Proceso de Contratación</h3>
            <p>
              Para la contratación de los servicios ofrecidos en el Sitio Web, el Usuario deberá seguir las indicaciones que se le muestren en pantalla 
              y aceptar la compra mediante el cumplimiento de las indicaciones que aparezcan en pantalla.
            </p>
            <p>
              La contratación finaliza con el pago del servicio seleccionado. La confirmación de la contratación por parte de la Empresa se comunicará 
              mediante el envío de un correo electrónico a la dirección facilitada por el Usuario.
            </p>

            <h3>5. Precios y Forma de Pago</h3>
            <p>
              Los precios de los servicios que se ofrecen a través del Sitio Web son los que se indican en el mismo en euros (€) e incluyen el 
              Impuesto sobre el Valor Añadido (IVA) y cualquier otro impuesto que fuera de aplicación.
            </p>
            <p>
              El pago de los servicios se realizará mediante las formas de pago indicadas en el Sitio Web en el momento de la contratación.
            </p>

            <h3>6. Propiedad Intelectual e Industrial</h3>
            <p>
              Todos los contenidos del Sitio Web, entendiendo por estos a título meramente enunciativo los textos, fotografías, gráficos, imágenes, 
              iconos, tecnología, software, links y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente, son 
              propiedad intelectual de la Empresa o de terceros, sin que puedan entenderse cedidos al Usuario ninguno de los derechos de explotación 
              reconocidos por la normativa vigente en materia de propiedad intelectual sobre los mismos.
            </p>

            <h3>7. Duración y Terminación</h3>
            <p>
              La prestación de los servicios y/o productos ofrecidos en el Sitio Web tiene, en principio, una duración indefinida. La Empresa, 
              no obstante, queda autorizada para terminar o suspender la prestación de los servicios en cualquier momento, sin perjuicio de lo que 
              se hubiere dispuesto al respecto en las correspondientes Condiciones Particulares.
            </p>

            <h3>8. Legislación Aplicable y Jurisdicción</h3>
            <p>
              Las presentes Condiciones Generales de Contratación se regirán por la legislación española.
            </p>
            <p>
              Para la resolución de todas las controversias o cuestiones relacionadas con el presente Sitio Web o de las actividades en él desarrolladas, 
              será de aplicación la legislación española, a la que se someten expresamente la Empresa y los Usuarios, siendo competentes para la resolución 
              de todos los conflictos derivados o relacionados con su uso los Juzgados y Tribunales más cercanos a la sede de la Empresa.
            </p>

            <h3>9. Nulidad e Ineficacia de las Cláusulas</h3>
            <p>
              Si cualquier cláusula incluida en estas Condiciones Generales de Contratación fuese declarada, total o parcialmente, nula o ineficaz, 
              tal nulidad o ineficacia afectará tan sólo a dicha disposición o a la parte de la misma que resulte nula o ineficaz, subsistiendo las 
              Condiciones Generales de Contratación en todo lo demás, teniéndose tal disposición, o la parte de la misma que resultase afectada, por no puesta.
            </p>

            <h3>10. Protección de Datos</h3>
            <p>
              La información o datos personales que el Usuario facilite a la Empresa serán tratados con arreglo a lo establecido en la Política de 
              Privacidad. Al hacer uso de este Sitio Web el Usuario consiente el tratamiento de dicha información y datos y declara que toda la 
              información o datos que facilita son veraces y se corresponden con la realidad.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}