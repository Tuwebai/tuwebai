import { useEffect, useState } from 'react';
import PageBanner from '@/shared/ui/page-banner';
import MetaTags from '@/shared/ui/meta-tags';
import {
  TUWEBAI_WHATSAPP_DISPLAY,
  TUWEBAI_EMAIL,
  TUWEBAI_SITE_FULL_URL,
} from '@/shared/constants/contact';
import { 
  ChevronRight, 
  UserCheck, 
  Target, 
  Scale, 
  Archive, 
  Network, 
  Shield, 
  Lock, 
  Cookie, 
  History, 
  Mail 
} from 'lucide-react';

const TOC_ITEMS = [
  { id: 'responsable', label: '1. Responsable del Tratamiento', icon: UserCheck },
  { id: 'finalidad', label: '2. Finalidad del Tratamiento', icon: Target },
  { id: 'legitimacion', label: '3. Legitimación', icon: Scale },
  { id: 'conservacion', label: '4. Conservación de los Datos', icon: Archive },
  { id: 'destinatarios', label: '5. Destinatarios', icon: Network },
  { id: 'derechos', label: '6. Derechos', icon: Shield },
  { id: 'seguridad', label: '7. Medidas de Seguridad', icon: Lock },
  { id: 'cookies', label: '8. Uso de Cookies', icon: Cookie },
  { id: 'cambios', label: '9. Modificaciones', icon: History },
  { id: 'contacto', label: '10. Contacto', icon: Mail },
];

/**
 * Hook para detectar la sección activa en el viewport
 */
function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>('');

  // Sync initial param from URL on mount only
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sectionId = params.get('section_id');

    if (sectionId && sectionIds.includes(sectionId)) {
      setActiveId(sectionId);
      // Timeout para dejar que React dibuje el DOM antes de medir top
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

export default function PrivacyPolicyPage() {
  const { activeId: activeSectionId, setActiveId } = useActiveSection(TOC_ITEMS.map((i) => i.id));

  const handleScrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // UI instantánea en TOC y URL
    setActiveId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('section_id', id);
    window.history.pushState({}, '', url);

    const element = document.getElementById(id);
    if (element) {
      // Offset de 120px para no quedar tapado por Navbar Global fijo
      const absoluteTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: absoluteTop - 120, behavior: 'smooth' });
    }
  };

  return (
    <>
      <MetaTags
        title="Política de Privacidad"
        description="Conocé cómo TuWebAI recopila, usa y protege tus datos personales al navegar o contratar nuestros servicios."
        keywords="política de privacidad, protección de datos, tratamiento de datos personales, TuWebAI"
        url={`${TUWEBAI_SITE_FULL_URL}/politica-privacidad`}
        ogType="website"
      />

      {/* Native Scroll Wrapper */}
      <div className="bg-[#080810] min-h-screen">
        <PageBanner
          title="Política de Privacidad"
          subtitle="Información sobre el tratamiento de tus datos personales"
        />

        <div className="container mx-auto px-4 lg:px-8 py-16 max-w-[1280px]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative items-start">
            
            {/* T.O.C (Table of Contents) - Sidebar */}
            <aside className="w-full lg:w-80 shrink-0 border border-white/10 bg-[#080810]/50 rounded-2xl lg:sticky lg:top-32 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto z-20 custom-scrollbar shadow-xl backdrop-blur-md">
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

            {/* Panel Interactivo de Contenido */}
            <main className="flex-1 w-full relative">
              <div className="w-full max-w-[820px] mx-auto pb-32 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
                <div className="text-gray-400 text-sm mb-12 pb-6 border-b border-white/10">
                  Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

              {/* Secciones */}
              <div className="space-y-16 text-gray-300 leading-relaxed text-[17px]">
                
                <section id="responsable" className="scroll-mt-32">
                  <h2 className="text-2xl font-semibold text-white mb-6">1. Responsable del Tratamiento</h2>
                  <p>
                    El responsable del tratamiento de los datos personales que facilites a través de este sitio web es <strong className="text-white">TuWeb.ai</strong>, 
                    con correo electrónico <a href={`mailto:${TUWEBAI_EMAIL}`} className="text-[#00CCFF] hover:underline">{TUWEBAI_EMAIL}</a> y teléfono {TUWEBAI_WHATSAPP_DISPLAY}.
                  </p>
                </section>

                <section id="finalidad" className="scroll-mt-32">
                  <h2 className="text-2xl font-semibold text-white mb-6">2. Finalidad del Tratamiento</h2>
                  <p className="mb-4">Tratamos tus datos personales con las siguientes finalidades:</p>
                  <ul className="list-disc pl-6 space-y-3 marker:text-[#00CCFF]">
                    <li>Gestionar el registro de usuario y mantener la relación contractual.</li>
                    <li>Atender las consultas, solicitudes o peticiones que realices a través de nuestros formularios de contacto o asistencia.</li>
                    <li>Enviarte información administrativa y comercial sobre nuestros productos y servicios (siempre que hayas consentido previamente).</li>
                    <li>Analizar tu navegación en el sitio web de forma agregada para salvaguardar la experiencia de usuario y mejorar nuestros servicios técnicos.</li>
                    <li>Cumplir estrictamente con obligaciones y requerimientos legales aplicables.</li>
                  </ul>
                </section>

                <section id="legitimacion" className="scroll-mt-32">
                  <h2 className="text-2xl font-semibold text-white mb-6">3. Legitimación</h2>
                  <p className="mb-4">
                    La base legal que nos ampara para ejecutar el tratamiento de tus datos es la siguiente:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 marker:text-[#00CCFF]">
                    <li><strong>Ejecución de contrato:</strong> Inevitable y necesaria para mantener la relación contractual cuando contratas alguno de nuestros servicios SaaS o desarrollos a medida.</li>
                    <li><strong>Consentimiento expreso:</strong> Obtenido mediante checkbox explícitos para suscribirte a nuestros boletines.</li>
                    <li><strong>Interés legítimo:</strong> Para procesar respuestas técnicas, prevenir fraudes y auditar la seguridad de la plataforma.</li>
                    <li><strong>Cumplimiento normativo:</strong> Retención de registros básicos ante obligaciones legales.</li>
                  </ul>
                </section>

                <section id="conservacion" className="scroll-mt-32">
                  <h2 className="text-2xl font-semibold text-white mb-6">4. Conservación de los Datos</h2>
                  <p className="mb-4">
                    Tus datos serán conservados de forma segura durante el tiempo estrictamente necesario mientras se mantenga tu 
                    relación activa y contractual con nuestros servicios (ej. tu membresía en la plataforma SaaS).
                  </p>
                  <p>
                    Una vez revocada esa relación o solicitada la baja técnica, pasaremos a bloquear tus datos y los resguardaremos 
                    únicamente durante los plazos legalmente establecidos (y no operables transaccionalmente) para atender 
                    eventuales requerimientos judiciales o fiscales. Cumplido este plazo de ley, se aplicará destrucción 
                    y pseudonimización irrecuperable.
                  </p>
                </section>

                <section id="destinatarios" className="scroll-mt-32">
                  <h2 className="text-2xl font-semibold text-white mb-6">5. Destinatarios</h2>
                  <p className="mb-4">
                    Bajo ningún pretexto, modelo de negocio o compensación, mercantilizamos tus datos con agencias de marketing 
                    u otros terceros. Solo podrán ser comunicados temporalmente bajo secreto profesional a:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 marker:text-[#00CCFF]">
                    <li>Proveedores de infraestructura cloud encargados del tratamiento, en nuestro caso Supabase y otros servicios técnicos equivalentes con estándares de seguridad y certificaciones internacionales.</li>
                    <li>Administraciones Públicas, tribunales o fuerzas y cuerpos de seguridad exclusivamente cuando exista un mandato u obligación imperativa legalmente constituida.</li>
                  </ul>
                </section>

                <section id="derechos" className="scroll-mt-32">
                  <h2 className="text-2xl font-semibold text-white mb-6">6. Derechos</h2>
                  <p className="mb-4">
                    Garantizamos tus derechos plenos sobre tus datos. Tienes potestad de ejercer: <strong>acceso, rectificación, supresión ("derecho al olvido"), 
                    oposición, limitación del tratamiento y portabilidad.</strong>
                  </p>
                  <p className="mb-4">
                    Inicia cualquiera de estos trámites enviando un correo a <a href={`mailto:${TUWEBAI_EMAIL}`} className="text-[#00CCFF] hover:underline">{TUWEBAI_EMAIL}</a>.
                    Para validar tu identidad y por seguridad (previniendo ingeniería social), requeriremos adjuntar prueba de identidad.
                  </p>
                  <p>
                    Si consideras que vulneramos algún principio, también tienes el derecho legal inalienable a presentar una reclamación directa 
                    ante la <em>Dirección Nacional de Protección de Datos Personales (DNPDP)</em> de la República Argentina o tu organismo regulador equivalente.
                  </p>
                </section>

                <section id="seguridad" className="scroll-mt-32">
                  <h2 className="text-2xl font-semibold text-white mb-6">7. Medidas de Seguridad</h2>
                  <p>
                    Hemos adoptado medidas técnicas y auditorías de seguridad constantes a nivel "Enterprise" para proteger nuestra arquitectura Cloud, 
                    el transporte de información (TLS estricto end-to-end), validaciones cross-origin y mitigaciones anti-inyección, blindando la integridad 
                    de tus datos y repeliendo accesos, alteraciones o divulgaciones no autorizadas en cumplimiento con los estándares de diseño moderno.
                  </p>
                </section>

                <section id="cookies" className="scroll-mt-32">
                  <h2 className="text-2xl font-semibold text-white mb-6">8. Uso de Cookies</h2>
                  <p>
                    Utilizamos cookies propias con propósitos meramente funcionales/técnicos, vitales para el funcionamiento del "Dashboard" (gestión de sesiones 
                    estrictas Auth y seguridad CSRF). Nunca inyectamos rastreadores de huella (fingerprinting) oscuros.
                    Puedes obtener el desglose detallado navegando a nuestra
                    <a href="/politica-cookies" className="text-[#00CCFF] hover:underline ml-1">Política de Cookies</a>.
                  </p>
                </section>

                <section id="cambios" className="scroll-mt-32">
                  <h2 className="text-2xl font-semibold text-white mb-6">9. Modificaciones a la Política</h2>
                  <p>
                    Nos reservamos el derecho a modificar la presente política para alinearla al pulso de los cambios normativos internacionales, 
                    o reflejar una mejora de nuestra arquitectura y protección. Los cambios entrarán en vigencia efectiva desde el momento 
                    en que se desplieguen y publiquen en este sitio web.
                  </p>
                </section>

                <section id="contacto" className="scroll-mt-32">
                  <h2 className="text-2xl font-semibold text-white mb-6">10. Contacto</h2>
                  <p>
                    ¿Alguna duda o inquietud específica sobre tus datos que no cubrímos aquí? Contacta al equipo técnico marcando el asunto 
                    como "Privacidad" a través de <a href={`mailto:${TUWEBAI_EMAIL}`} className="text-[#00CCFF] hover:underline">{TUWEBAI_EMAIL}</a> 
                    y nuestro equipo responsable en protección de datos auditará el caso.
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
