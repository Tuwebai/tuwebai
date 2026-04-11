import { useEffect, useState } from 'react';
import PageBanner from '@/shared/ui/page-banner';
import MetaTags from '@/shared/ui/meta-tags';
import { TUWEBAI_SITE_FULL_URL, TUWEBAI_SITE_URL } from '@/shared/constants/contact';
import { 
  ChevronRight, 
  Info, 
  Target, 
  UserCheck, 
  FileText, 
  CreditCard, 
  Shield, 
  Clock, 
  Scale, 
  AlertCircle, 
  Lock 
} from 'lucide-react';

const TOC_ITEMS = [
  { id: 'informacion-general', label: '1. Información General', icon: Info },
  { id: 'objeto', label: '2. Objeto del Sitio Web', icon: Target },
  { id: 'registro', label: '3. Registro de Usuario', icon: UserCheck },
  { id: 'contratacion', label: '4. Proceso de Contratación', icon: FileText },
  { id: 'pagos', label: '5. Precios y Forma de Pago', icon: CreditCard },
  { id: 'propiedad', label: '6. Propiedad Intelectual', icon: Shield },
  { id: 'duracion', label: '7. Duración y Terminación', icon: Clock },
  { id: 'legislacion', label: '8. Legislación y Jurisdicción', icon: Scale },
  { id: 'nulidad', label: '9. Nulidad e Ineficacia', icon: AlertCircle },
  { id: 'proteccion-datos', label: '10. Protección de Datos', icon: Lock },
];

/**
 * Hook para detectar la sección activa en el viewport
 */
function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>('');

  // Sincronización inicial con URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sectionId = params.get('section_id');

    if (sectionId && sectionIds.includes(sectionId)) {
      setActiveId(sectionId);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const absoluteTop = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: absoluteTop - 120, behavior: 'instant' });
        }
      }, 100);
    } else if (sectionIds.length > 0) {
      setActiveId(sectionIds[0]);
    }
  }, [sectionIds]);

  return { activeId, setActiveId };
}

export default function TerminosCondiciones() {
  const sectionIds = TOC_ITEMS.map((item) => item.id);
  const { activeId: activeSectionId, setActiveId } = useActiveSection(sectionIds);

  const handleScrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // UI instantánea
    setActiveId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('section_id', id);
    window.history.pushState({}, '', url);

    const element = document.getElementById(id);
    if (element) {
      const absoluteTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: absoluteTop - 120, behavior: 'smooth' });
    }
  };

  return (
    <>
      <MetaTags
        title="Términos y Condiciones"
        description="Leé las condiciones de uso, contratación, pagos y propiedad intelectual que rigen los servicios de TuWebAI."
        keywords="términos y condiciones, contratación web, pagos TuWebAI, propiedad intelectual"
        url={`${TUWEBAI_SITE_FULL_URL}/terminos-condiciones`}
        ogType="website"
      />

      {/* Native Scroll Wrapper */}
      <div className="page-shell-surface min-h-screen text-white">
        <PageBanner 
          title="Términos y Condiciones" 
          subtitle="Conocé los términos y condiciones que rigen nuestros servicios"
        />

        <div className="container mx-auto px-4 lg:px-8 py-16 max-w-[1280px]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative items-start">
            
            {/* T.O.C (Table of Contents) - Sidebar */}
            <aside className="w-full lg:w-80 shrink-0 rounded-2xl border border-white/10 bg-slate-950/35 lg:sticky lg:top-32 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto z-20 custom-scrollbar shadow-xl backdrop-blur-md">
              <div className="p-6">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  Contenido del documento
                </h3>
                <nav className="flex flex-col gap-1">
                  {TOC_ITEMS.map((item) => {
                    const isActive = activeSectionId === item.id;
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => handleScrollTo(item.id, e)}
                        className={`group flex items-center min-h-[44px] px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          isActive
                            ? 'bg-[#00CCFF]/10 text-[#00CCFF] font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#00CCFF]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                          <span className="leading-snug truncate whitespace-normal">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4 ml-1 shrink-0 opacity-70" />}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Panel de Contenido */}
            <main className="flex-1 w-full relative">
              <div className="w-full max-w-[820px] mx-auto pb-32 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
                <div className="text-gray-400 text-sm mb-12 pb-6 border-b border-white/10 border-dashed">
                  Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                <div className="space-y-16 text-gray-300 leading-relaxed text-[17px]">
                  
                  <section id="informacion-general" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">1. Información General</h2>
                    <p className="mb-4">
                      El presente documento establece las Condiciones Generales de Contratación que regulan el uso del sitio web 
                      <strong className="text-[#00CCFF]"> {TUWEBAI_SITE_URL}</strong> (en adelante, "el Sitio Web") propiedad de TuWeb.ai (en adelante, "la Empresa").
                    </p>
                    <p>
                      La utilización del Sitio Web atribuye la condición de Usuario del mismo e implica la aceptación plena y sin reservas de todas y cada una 
                      de las disposiciones incluidas en estas Condiciones Generales de Contratación.
                    </p>
                  </section>

                  <section id="objeto" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">2. Objeto del Sitio Web</h2>
                    <p>
                      El Sitio Web tiene como objeto proporcionar información sobre los servicios ofrecidos por la Empresa, así como permitir la contratación 
                      de dichos servicios a través del mismo. Nuestra arquitectura se enfoca en la transparencia y eficiencia en la entrega de soluciones digitales.
                    </p>
                  </section>

                  <section id="registro" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">3. Registro de Usuario</h2>
                    <p className="mb-4">
                      Para acceder a determinados servicios es necesario que el Usuario se registre mediante la creación de una cuenta de Usuario, 
                      facilitando la información personal necesaria según se indica en el formulario de registro correspondiente.
                    </p>
                    <p>
                      El Usuario se compromete a proporcionar información veraz, exacta y completa. La Empresa se reserva 
                      el derecho a suspender o cancelar aquellos registros cuyos datos no sean veraces o contravengan la seguridad del sistema.
                    </p>
                  </section>

                  <section id="contratacion" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">4. Proceso de Contratación</h2>
                    <p className="mb-4">
                      Para la contratación de los servicios, el Usuario deberá seguir las indicaciones que se le muestren en pantalla y aceptar la compra mediante el cumplimiento de las indicaciones que aparezcan en pantalla.
                    </p>
                    <p>
                      La contratación finaliza con el pago del servicio seleccionado. La confirmación de la contratación se comunicará mediante el envío de un correo electrónico a la dirección facilitada por el Usuario, enviando un audit-trail de la transacción.
                    </p>
                  </section>

                  <section id="pagos" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">5. Precios y Forma de Pago</h2>
                    <p className="mb-4">
                      Los precios de los servicios se indican en pesos argentinos ($) e incluyen el Impuesto al Valor Agregado (IVA) y cualquier otro impuesto aplicable.
                    </p>
                    <p>
                      El pago se realiza mediante transferencia bancaria, Mercado Pago, o efectivo. Para proyectos de escala enterprise, se requiere un 50% de adelanto. Ofrecemos planes de financiación para proyectos que superen los $500.000.
                    </p>
                  </section>

                  <section id="propiedad" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">6. Propiedad Intelectual e Industrial</h2>
                    <p>
                      Todos los contenidos del Sitio Web (textos, fotografías, tecnología, códigos fuente, etc.) son propiedad intelectual de la Empresa o de terceros. No se entienden cedidos al Usuario ninguno de los derechos de explotación reconocidos por la normativa vigente, salvo aquellos estrictamente necesarios para el uso del servicio.
                    </p>
                  </section>

                  <section id="duracion" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">7. Duración y Terminación</h2>
                    <p>
                      La prestación de los servicios tiene una duración indefinida en principio. No obstante, la Empresa queda autorizada para terminar o suspender la prestación de los servicios en cualquier momento, respetando siempre los compromisos contractuales vigentes y la integridad de los datos de los usuarios.
                    </p>
                  </section>

                  <section id="legislacion" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">8. Legislación Aplicable y Jurisdicción</h2>
                    <p>
                      Las presentes Condiciones se regirán por la legislación argentina. Para la resolución de controversias, las partes se someten expresamente a los Juzgados y Tribunales de la Ciudad de Buenos Aires, Argentina.
                    </p>
                  </section>

                  <section id="nulidad" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">9. Nulidad e Ineficacia</h2>
                    <p>
                      Si cualquier cláusula fuese declarada nula o ineficaz, tal nulidad afectará tan solo a dicha disposición, manteniéndose la vigencia del resto de las Condiciones Generales de Contratación.
                    </p>
                  </section>

                  <section id="proteccion-datos" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">10. Protección de Datos</h2>
                    <p>
                      El tratamiento de los datos personales se rige por nuestra <a href="/politica-privacidad" className="text-[#00CCFF] hover:underline">Política de Privacidad</a>. El uso de este Sitio Web implica el consentimiento para el tratamiento de dicha información según los estándares de seguridad M12 definidos en nuestra arquitectura.
                    </p>
                  </section>

                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
