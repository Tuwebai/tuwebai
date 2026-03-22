import { Link } from 'react-router-dom';

import AnimatedShape from '@/shared/ui/animated-shape';
import MetaTags from '@/shared/ui/meta-tags';
import RevealBlock from '@/shared/ui/reveal-block';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { TUWEBAI_SITE_FULL_URL, TUWEBAI_WHATSAPP_URL } from '@/shared/constants/contact';

const PROCESS_PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/proceso`;
const PROCESS_WHATSAPP_URL = `${TUWEBAI_WHATSAPP_URL}?text=${encodeURIComponent(
  'Hola Juanchi, vengo de la página de Proceso y quiero contarte mi proyecto.',
)}`;
const PROCESS_HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo trabajamos en TuWebAI',
  description: 'Proceso de 5 etapas para desarrollar un proyecto web profesional',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Consulta inicial',
      text: 'Una llamada de 20 a 30 minutos para entender el proyecto.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Propuesta y alcance',
      text: 'Propuesta escrita con precio cerrado y cronograma.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Diseño y desarrollo',
      text: 'Construcción completa del proyecto en 2 a 4 semanas según tipo.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Revisión y ajustes',
      text: 'Una ronda de revisión completa incluida en todos los planes.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Lanzamiento y entrega',
      text: 'Deploy en producción y entrega de todos los accesos al cliente.',
    },
  ],
};

interface ProcessTimelineItem {
  step: string;
  title: string;
  duration: string;
  summary: string;
  whatHappens: string;
  whatWeDo: string;
  whatYouNeed: string;
  deliverable: string;
  highlight?: boolean;
}

const PROCESS_TIMELINE: ProcessTimelineItem[] = [
  {
    step: '01',
    title: 'Consulta inicial',
    duration: '1 día',
    summary: 'Una llamada o chat de 20 a 30 minutos para entender el proyecto.',
    whatHappens:
      'Nos contás qué necesita tu negocio, qué problemas tenés hoy y qué esperás del proyecto.',
    whatWeDo:
      'Escuchamos, preguntamos lo que falta y evaluamos si realmente podemos ayudarte.',
    whatYouNeed: 'Solo tu tiempo y claridad sobre el objetivo principal del proyecto.',
    deliverable: 'Confirmación de si avanzamos y por qué sí o por qué no.',
  },
  {
    step: '02',
    title: 'Propuesta y alcance',
    duration: '1 a 2 días',
    summary: 'Definimos exactamente qué vamos a construir, cuánto cuesta y cuándo lo tenés.',
    whatHappens:
      'Todo queda por escrito: alcance, límites del proyecto, precio cerrado y tiempos reales.',
    whatWeDo:
      'Documentamos alcance, cronograma y precio sin estimaciones vagas ni promesas abiertas.',
    whatYouNeed: 'Revisar la propuesta y confirmar o ajustar antes de arrancar.',
    deliverable: 'Propuesta comercial escrita con alcance, precio y cronograma.',
  },
  {
    step: '03',
    title: 'Diseño y desarrollo',
    duration: '2 a 4 semanas',
    summary: 'Arranca el trabajo real: diseño, código, integraciones y analytics desde el día 1.',
    whatHappens:
      'Construimos el proyecto completo: interfaz, frontend, backend si aplica, contenido e integraciones.',
    whatWeDo:
      'Diseñamos y desarrollamos en una sola mano, con un punto de revisión intermedio para validar la dirección.',
    whatYouNeed:
      'Entregar textos, fotos y logo dentro de los primeros 3 días. Sin contenido no hay avance.',
    deliverable: 'Sitio funcional listo para revisión completa.',
    highlight: true,
  },
  {
    step: '04',
    title: 'Revisión y ajustes',
    duration: '3 a 5 días',
    summary: 'Revisás el sitio completo y consolidamos una ronda de cambios dentro del alcance.',
    whatHappens:
      'Nos marcás los ajustes necesarios con criterio de negocio y cerramos la versión final.',
    whatWeDo:
      'Implementamos la ronda de revisión incluida. Si algo queda fuera del alcance, te avisamos antes.',
    whatYouNeed:
      'Revisar con criterio: objetivo, recorrido del usuario, formularios y coherencia comercial.',
    deliverable: 'Sitio aprobado por el cliente, listo para lanzar.',
  },
  {
    step: '05',
    title: 'Lanzamiento y entrega',
    duration: '1 día',
    summary: 'Publicamos el sitio y te entregamos el control total.',
    whatHappens:
      'Hacemos deploy en producción, chequeamos mobile y desktop, y liberamos todos los accesos.',
    whatWeDo:
      'Entregamos hosting, dominio, código fuente y analytics para que no dependas de nosotros.',
    whatYouNeed: 'Validar que los accesos queden recibidos y que el sitio ya está online.',
    deliverable: 'Sitio live y todos los accesos en tus manos.',
  },
];

const CLIENT_REQUIREMENTS = [
  {
    title: 'El contenido a tiempo',
    description:
      'Textos, fotos y logo en los primeros 3 días. Sin contenido no podemos avanzar y el tiempo del proyecto corre igual.',
  },
  {
    title: 'Feedback claro y oportuno',
    description:
      'Cuando te mostramos avances, necesitamos respuesta en menos de 48 horas. El feedback vago sin una dirección concreta no nos permite mejorar nada.',
  },
  {
    title: 'Una sola voz',
    description:
      'Si hay más de una persona tomando decisiones del lado del cliente, definan internamente quién aprueba antes de enviarnos feedback. Los cambios de dirección a último momento tienen costo adicional.',
  },
];

const PROCESS_FAQS = [
  {
    value: 'faq-1',
    question: '¿Qué pasa si quiero cambiar algo que ya estaba aprobado?',
    answer:
      'Los cambios dentro del alcance definido en la propuesta están incluidos en la ronda de revisión. Si el cambio implica rehacer algo ya aprobado o agregar funcionalidad nueva, te avisamos el costo antes de hacerlo. Nunca facturamos extras sin avisarte primero.',
  },
  {
    value: 'faq-2',
    question: '¿Necesito tener todo el contenido antes de arrancar?',
    answer:
      'No necesitás tenerlo antes de firmar. Pero sí necesitás tenerlo listo en los primeros 3 días de iniciado el proyecto. Si el contenido llega tarde, la fecha de entrega se corre la misma cantidad de días.',
  },
  {
    value: 'faq-3',
    question: '¿Puedo pedir cambios después del lanzamiento?',
    answer:
      'Sí. Tenemos planes de mantenimiento mensual para clientes que necesitan actualizaciones frecuentes. Para cambios puntuales, los cotizamos por separado según el alcance.',
  },
  {
    value: 'faq-4',
    question: '¿Qué pasa si el diseño inicial no me convence?',
    answer:
      'Una ronda de revisión completa está incluida en todos los planes. Si después de esa ronda el diseño sigue sin convencerte, lo rehacemos sin costo adicional. Es parte de nuestro compromiso.',
  },
];

export default function ProcessPage() {
  return (
    <>
      <MetaTags
        title="Proceso de Trabajo | TuWebAI - Cómo Construimos tu Proyecto Web"
        description="Conocé las 5 etapas del proceso de TuWebAI: consulta, propuesta, desarrollo, revisión y lanzamiento. Tiempos reales, entregables concretos y sin sorpresas al final."
        keywords="proceso de trabajo TuWebAI, cómo trabajamos en TuWebAI, etapas proyecto web, desarrollo web Argentina, entregables proyecto web"
        url={PROCESS_PAGE_URL}
        ogType="website"
        structuredData={PROCESS_HOWTO_SCHEMA}
      />

      <main className="min-h-screen bg-[#0a0a0f] text-gray-300">
        <section className="relative overflow-hidden bg-gradient-1 pb-20 pt-28 sm:pb-24 sm:pt-32">
          <AnimatedShape type={1} className="right-[-140px] top-[12%]" delay={1} />
          <AnimatedShape type={2} className="bottom-[8%] left-[-120px]" delay={2} />

          <div className="container relative z-10 mx-auto px-4">
            <RevealBlock
              hiddenClassName="opacity-0 translate-y-8"
              visibleClassName="opacity-100 translate-y-0"
              durationMs={700}
            >
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                <div className="mb-5 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-300">
                  Cómo trabajamos
                </div>

                <h1 className="max-w-4xl font-rajdhani text-4xl font-bold leading-[0.98] text-white sm:text-5xl md:text-6xl">
                  Sin reuniones infinitas.
                  <br />
                  <span className="gradient-text">Sin sorpresas al final.</span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                  Un proceso claro de 5 etapas desde el primer mensaje hasta que tenés el control
                  total de tu sitio.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={PROCESS_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,204,255,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Contar mi proyecto
                  </a>
                  <Link
                    to="/?section=showroom"
                    className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-[#DCE7FF] transition-colors duration-200 hover:border-[#00CCFF]/45 hover:text-white"
                  >
                    Ver proyectos reales
                  </Link>
                </div>
              </div>
            </RevealBlock>
          </div>
        </section>

        <section className="bg-[#0a0a0f] py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <RevealBlock className="text-center">
                <p className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-300">
                  Línea de tiempo
                </p>
                <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  Qué pasa en cada etapa, cuánto tarda y qué te llevás.
                </h2>
              </RevealBlock>

              <div className="mt-12 space-y-5">
                {PROCESS_TIMELINE.map((item, index) => (
                  <RevealBlock key={item.step} delayMs={index * 80}>
                    <article
                      className={`relative overflow-hidden rounded-2xl border p-6 sm:p-7 ${
                        item.highlight
                          ? 'border-cyan-400/30 bg-[linear-gradient(180deg,rgba(12,20,37,0.94)_0%,rgba(16,16,28,0.98)_100%)] shadow-[0_20px_60px_rgba(0,204,255,0.08)]'
                          : 'border-white/5 bg-[#12121f]'
                      }`}
                    >
                      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-8">
                        <div className="lg:border-r lg:border-white/10 lg:pr-6">
                          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                            Etapa {item.step}
                          </p>
                          <h3 className="mt-3 font-rajdhani text-3xl font-bold text-white">
                            {item.title}
                          </h3>
                          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-gray-400">
                            Duración
                          </p>
                          <p className="mt-1 text-base font-medium text-gray-200">{item.duration}</p>
                        </div>

                        <div className="space-y-5">
                          <p className="text-base leading-7 text-gray-200 sm:text-lg">
                            {item.summary}
                          </p>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-xl border border-white/6 bg-white/[0.03] p-4">
                              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                                Qué pasa
                              </p>
                              <p className="mt-3 text-sm leading-7 text-gray-300">
                                {item.whatHappens}
                              </p>
                            </div>

                            <div className="rounded-xl border border-white/6 bg-white/[0.03] p-4">
                              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                                Qué hacemos nosotros
                              </p>
                              <p className="mt-3 text-sm leading-7 text-gray-300">
                                {item.whatWeDo}
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
                            <div className="rounded-xl border border-white/6 bg-white/[0.03] p-4">
                              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                                Qué necesitás vos
                              </p>
                              <p className="mt-3 text-sm leading-7 text-gray-300">
                                {item.whatYouNeed}
                              </p>
                            </div>

                            <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] p-4">
                              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                                Entregable
                              </p>
                              <p className="mt-3 text-sm leading-7 text-gray-200">
                                {item.deliverable}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0f0f1a] py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <RevealBlock>
                <div className="lg:sticky lg:top-28">
                  <p className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-300">
                    Lo que necesitamos de vos
                  </p>
                  <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                    Para que el proyecto salga bien, necesitamos estas tres cosas de tu parte.
                  </h2>
                </div>
              </RevealBlock>

              <div className="space-y-4">
                {CLIENT_REQUIREMENTS.map((item, index) => (
                  <RevealBlock key={item.title} delayMs={index * 90}>
                    <article className="rounded-2xl border border-white/6 bg-[#12121f] p-6 sm:p-7">
                      <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                        Punto {index + 1}
                      </p>
                      <h3 className="mt-3 font-rajdhani text-2xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-base leading-7 text-gray-300">{item.description}</p>
                    </article>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0a0a0f] py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <RevealBlock className="text-center">
                <p className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-300">
                  Preguntas frecuentes del proceso
                </p>
                <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  Las dudas que aparecen antes de contratar.
                </h2>
              </RevealBlock>

              <RevealBlock delayMs={90}>
                <div className="mt-12 rounded-2xl border border-white/6 bg-[#12121f] p-3 sm:p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {PROCESS_FAQS.map((faq) => (
                      <AccordionItem key={faq.value} value={faq.value} className="border-white/8 px-2">
                        <AccordionTrigger className="py-5 text-left font-rajdhani text-xl font-bold text-white hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-5 text-base leading-7 text-gray-300">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </RevealBlock>
            </div>
          </div>
        </section>

        <section className="bg-[#0f0f1a] py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <RevealBlock className="mx-auto max-w-4xl text-center">
              <p className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-300">
                Cierre
              </p>
              <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                ¿Listo para arrancar?
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                La consulta inicial es siempre sin cargo. Te contamos si tu proyecto encaja con lo
                que hacemos y cómo.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={PROCESS_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,204,255,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Contar mi proyecto
                </a>
                <Link
                  to="/?section=showroom"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-[#DCE7FF] transition-colors duration-200 hover:border-[#00CCFF]/45 hover:text-white"
                >
                  Ver proyectos reales
                </Link>
              </div>
            </RevealBlock>
          </div>
        </section>
      </main>
    </>
  );
}
