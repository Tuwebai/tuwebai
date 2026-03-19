import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  TUWEBAI_EMAIL,
  TUWEBAI_WHATSAPP_DISPLAY,
  TUWEBAI_WHATSAPP_URL,
} from '@/shared/constants/contact';
import '@/app/router/services/service-detail-page.css';

type StrategyTabId = 'strategy' | 'acquisition' | 'automation' | 'faq';

const tabLabels: Array<{ id: StrategyTabId; label: string }> = [
  { id: 'strategy', label: 'Estrategia y diagnostico' },
  { id: 'acquisition', label: 'Posicionamiento y adquisicion' },
  { id: 'automation', label: 'Automatizacion comercial' },
  { id: 'faq', label: 'Preguntas frecuentes' },
];

export default function DigitalStrategyPage() {
  const [activeTab, setActiveTab] = useState<StrategyTabId>('strategy');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="service-detail-page">
      <section className="service-detail-hero bg-gradient-1">
        <div className="service-detail-hero-inner container mx-auto px-4">
          <div className="service-detail-hero-stack">
            <Link to="/" className="service-detail-back-link">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al inicio
            </Link>

            <h1 className="mb-6 font-rajdhani text-4xl font-bold md:text-6xl">
              <span className="gradient-text">Estrategia Digital y Automatizacion</span>
            </h1>

            <p className="mb-10 text-xl text-gray-300">
              Unificamos diagnostico, posicionamiento, captacion y automatizacion en una sola hoja de ruta
              orientada a ventas, no a vanity metrics.
            </p>

            <a href="/consulta" className="service-detail-primary-cta">
              Solicitar diagnostico
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="service-detail-sidebar">
                <h2 className="mb-6 font-rajdhani text-2xl font-bold gradient-text">
                  Alcance del servicio
                </h2>

                <ul className="space-y-4">
                  {tabLabels.map((tab) => (
                    <li
                      key={tab.id}
                      className={`service-detail-sidebar-item ${activeTab === tab.id ? 'service-detail-sidebar-item--active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <div className="font-medium">{tab.label}</div>
                    </li>
                  ))}
                </ul>

                <div className="service-detail-sidebar-help">
                  <div className="mb-2 font-medium text-[#00CCFF]">Necesitas revisar un caso real?</div>
                  <p className="mb-4 text-sm text-gray-400">
                    Armamos una recomendacion priorizada segun tu etapa, canal comercial y nivel de madurez digital.
                  </p>
                  <a href="/consulta" className="service-detail-sidebar-link">
                    Pedir consulta
                  </a>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              {activeTab === 'strategy' && (
                <div className="service-detail-card">
                  <h2 className="mb-6 font-rajdhani text-3xl font-bold gradient-text">
                    Estrategia y diagnostico
                  </h2>

                  <p className="mb-6 text-gray-300">
                    Empezamos por diagnosticar el negocio, la propuesta de valor, la captura actual de demanda
                    y los cuellos de botella del sitio. El objetivo no es producir mas canales, sino definir
                    que conviene corregir primero para que la web y el marketing trabajen como sistema.
                  </p>

                  <div className="mb-8 grid gap-6 md:grid-cols-2">
                    <div className="service-detail-feature-card service-detail-feature-card--cyan">
                      <h3 className="mb-3 font-rajdhani text-xl font-bold">Diagnostico de conversion</h3>
                      <p className="text-gray-400">
                        Revisamos propuesta, jerarquia, confianza, friccion comercial y calidad de los CTAs.
                      </p>
                    </div>

                    <div className="service-detail-feature-card service-detail-feature-card--purple">
                      <h3 className="mb-3 font-rajdhani text-xl font-bold">Mapa de adquisicion</h3>
                      <p className="text-gray-400">
                        Detectamos de donde conviene captar trafico y que canal requiere una landing o flujo propio.
                      </p>
                    </div>

                    <div className="service-detail-feature-card service-detail-feature-card--cyan">
                      <h3 className="mb-3 font-rajdhani text-xl font-bold">Prioridades de implementacion</h3>
                      <p className="text-gray-400">
                        Ordenamos acciones por impacto, esfuerzo y dependencia tecnica para que el plan sea ejecutable.
                      </p>
                    </div>

                    <div className="service-detail-feature-card service-detail-feature-card--purple">
                      <h3 className="mb-3 font-rajdhani text-xl font-bold">Enfoque comercial</h3>
                      <p className="text-gray-400">
                        Bajamos todo a consultas, demos, leads calificados o ventas, segun el modelo de negocio.
                      </p>
                    </div>
                  </div>

                  <div className="service-detail-highlight-box">
                    <h3 className="mb-3 font-rajdhani text-xl font-bold">Cuando conviene este servicio</h3>
                    <ul className="space-y-2 text-gray-200">
                      <li>Tu sitio recibe visitas pero no genera consultas consistentes.</li>
                      <li>Tu equipo tiene varias acciones de marketing, pero sin una prioridad clara.</li>
                      <li>Necesitas decidir entre arreglar la web, mejorar captacion o automatizar seguimiento.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'acquisition' && (
                <div className="service-detail-card">
                  <h2 className="mb-6 font-rajdhani text-3xl font-bold gradient-text">
                    Posicionamiento y adquisicion
                  </h2>

                  <p className="mb-8 text-gray-300">
                    La adquisicion no se trabaja como una lista de canales. La definimos en funcion del negocio,
                    la demanda existente y la claridad de la oferta. Cuando tiene sentido, combinamos SEO,
                    landings de captacion, pauta y optimizacion de conversion.
                  </p>

                  <div className="space-y-8">
                    <div className="flex">
                      <div className="service-detail-step-badge">1</div>
                      <div className="ml-4">
                        <h3 className="mb-2 font-rajdhani text-xl font-bold">SEO orientado a negocio</h3>
                        <p className="text-gray-400">
                          Atacamos arquitectura, contenido y paginas de entrada que puedan traer demanda util, no solo trafico.
                        </p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="service-detail-step-badge">2</div>
                      <div className="ml-4">
                        <h3 className="mb-2 font-rajdhani text-xl font-bold">Landing y pauta con coherencia</h3>
                        <p className="text-gray-400">
                          Si hay pauta, alineamos anuncio, promesa, contenido y CTA para evitar fuga de conversion.
                        </p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="service-detail-step-badge">3</div>
                      <div className="ml-4">
                        <h3 className="mb-2 font-rajdhani text-xl font-bold">Medicion y ajuste</h3>
                        <p className="text-gray-400">
                          Definimos metricas de calidad comercial para decidir si conviene escalar, corregir o cortar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'automation' && (
                <div className="service-detail-card">
                  <h2 className="mb-6 font-rajdhani text-3xl font-bold gradient-text">
                    Automatizacion comercial
                  </h2>

                  <p className="mb-6 text-gray-300">
                    Automatizamos solo lo que ya tiene sentido comercial. Primero definimos eventos, handoffs,
                    seguimiento y criterios de calificacion. Despues conectamos formularios, CRM, email y mensajes
                    para que el sistema no dependa de tareas manuales repetitivas.
                  </p>

                  <div className="mb-8 grid gap-6 md:grid-cols-2">
                    <div className="service-detail-feature-card service-detail-feature-card--cyan">
                      <h3 className="mb-3 font-rajdhani text-xl font-bold">Nurturing y seguimiento</h3>
                      <p className="text-gray-400">
                        Secuencias utiles para leads nuevos, recontacto y continuidad sin perder contexto comercial.
                      </p>
                    </div>

                    <div className="service-detail-feature-card service-detail-feature-card--purple">
                      <h3 className="mb-3 font-rajdhani text-xl font-bold">CRM e integraciones</h3>
                      <p className="text-gray-400">
                        Conectamos formularios, email, automatizaciones y CRM para que el dato no se fragmente.
                      </p>
                    </div>

                    <div className="service-detail-feature-card service-detail-feature-card--cyan">
                      <h3 className="mb-3 font-rajdhani text-xl font-bold">Lead scoring operativo</h3>
                      <p className="text-gray-400">
                        Priorizamos oportunidades segun señales reales de interes y potencial de cierre.
                      </p>
                    </div>

                    <div className="service-detail-feature-card service-detail-feature-card--purple">
                      <h3 className="mb-3 font-rajdhani text-xl font-bold">Automatizacion sin ruido</h3>
                      <p className="text-gray-400">
                        Evitamos secuencias infladas o spam. El foco es velocidad de respuesta y claridad comercial.
                      </p>
                    </div>
                  </div>

                  <div className="service-detail-highlight-box">
                    <h3 className="mb-3 font-rajdhani text-xl font-bold">Entregables tipicos</h3>
                    <ul className="space-y-2 text-gray-200">
                      <li>Mapa de flujo de leads y handoffs.</li>
                      <li>Definicion de eventos, estados y reglas de seguimiento.</li>
                      <li>Recomendacion de stack y secuencia priorizada de implementacion.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="service-detail-card">
                  <h2 className="mb-6 font-rajdhani text-3xl font-bold gradient-text">
                    Preguntas frecuentes
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 font-rajdhani text-xl font-bold">Esto reemplaza desarrollo web?</h3>
                      <p className="text-gray-400">
                        No. Lo complementa. Si el diagnostico muestra que la web es el cuello principal, bajamos una hoja de ruta
                        coordinada con desarrollo, contenido y conversion.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-rajdhani text-xl font-bold">Trabajan SEO, pauta y automatizacion juntos?</h3>
                      <p className="text-gray-400">
                        Si hace sentido para el caso. La idea no es vender tres frentes separados, sino integrar lo necesario
                        para mejorar la captacion y el seguimiento.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-rajdhani text-xl font-bold">Como se inicia?</h3>
                      <p className="text-gray-400">
                        Con una consulta corta para entender etapa, canal principal y objetivo comercial. Desde ahi definimos si
                        conviene auditoria, implementacion o un plan por fases.
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 rounded-xl border border-white/10 bg-[#0f1420] p-6">
                    <h3 className="mb-3 font-rajdhani text-2xl font-bold text-white">Contacto directo</h3>
                    <div className="space-y-2 text-gray-300">
                      <p>
                        WhatsApp:{' '}
                        <a className="text-[#00CCFF] hover:text-white" href={TUWEBAI_WHATSAPP_URL} target="_blank" rel="noreferrer">
                          {TUWEBAI_WHATSAPP_DISPLAY}
                        </a>
                      </p>
                      <p>
                        Email:{' '}
                        <a className="text-[#00CCFF] hover:text-white" href={`mailto:${TUWEBAI_EMAIL}`}>
                          {TUWEBAI_EMAIL}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
