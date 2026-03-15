import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import PageBanner from '@/shared/ui/page-banner';
import { TUWEBAI_EMAIL } from '@/shared/constants/contact';
import { 
  ChevronRight, 
  Cookie, 
  ShieldCheck, 
  ExternalLink, 
  Settings, 
  Table as TableIcon, 
  RefreshCw, 
  Mail 
} from 'lucide-react';

const TOC_ITEMS = [
  { id: 'definicion', label: '1. ¿Qué son las cookies?', icon: Cookie },
  { id: 'tipos', label: '2. Tipos de cookies', icon: Settings },
  { id: 'terceros', label: '3. Cookies de terceros', icon: ShieldCheck },
  { id: 'administracion', label: '4. Cómo administrarlas', icon: ExternalLink },
  { id: 'listado', label: '5. Cookies utilizadas', icon: TableIcon },
  { id: 'cambios', label: '6. Modificaciones', icon: RefreshCw },
  { id: 'contacto', label: '7. Contacto', icon: Mail },
];

/**
 * Hook para detectar la sección activa en el viewport con offset para Navbar
 */
function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>('');

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

export default function PoliticaCookies() {
  const { activeId: activeSectionId, setActiveId } = useActiveSection(TOC_ITEMS.map((i) => i.id));

  const handleScrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
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
      <Helmet>
        <title>Política de Cookies | TuWeb.ai</title>
        <meta name="description" content="Información sobre las cookies utilizadas en el sitio web de TuWeb.ai" />
      </Helmet>

      <div className="bg-[#080810] min-h-screen">
        <PageBanner 
          title="Política de Cookies" 
          subtitle="Información técnica sobre el uso de cookies en nuestra web"
        />

        <div className="container mx-auto px-4 lg:px-8 py-16 max-w-[1280px]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative items-start">
            
            {/* Sidebar TOC */}
            <aside className="w-full lg:w-80 shrink-0 border border-white/10 bg-[#080810]/50 rounded-2xl lg:sticky lg:top-32 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto z-20 custom-scrollbar shadow-xl backdrop-blur-md">
              <div className="p-6">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  Contenido
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

            {/* Main Content */}
            <main className="flex-1 w-full relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[820px] mx-auto pb-32"
              >
                <div className="text-gray-400 text-sm mb-12 pb-6 border-b border-white/10">
                  Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                <div className="space-y-16 text-gray-300 leading-relaxed text-[17px]">
                  
                  <section id="definicion" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">1. ¿Qué son las cookies?</h2>
                    <p>
                      Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo. 
                      Se utilizan de forma generalizada para que los sitios web funcionen adecuadamente, 
                      proporcionando información técnica a los propietarios y permitiendo reconocer tu dispositivo 
                      para recordar preferencias de navegación.
                    </p>
                  </section>

                  <section id="tipos" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">2. Tipos de cookies que utilizamos</h2>
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#00CCFF] rounded-full"></span>
                          Técnicas o necesarias
                        </h4>
                        <p>
                          Vitales para la navegación y seguridad. Permiten controlar el tráfico, identificar sesiones y acceder 
                          a áreas restringidas de la plataforma SaaS.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#00CCFF] rounded-full"></span>
                          Preferencias o personalización
                        </h4>
                        <p>
                          Permiten recordar información como el idioma o el tema (Dark/Light mode) para mejorar tu experiencia individual.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#00CCFF] rounded-full"></span>
                          Analíticas o de medición
                        </h4>
                        <p>
                          Utilizadas para cuantificar la actividad del sitio e introducir mejoras basadas en el análisis de datos de uso.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section id="terceros" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">3. Cookies de terceros</h2>
                    <p>
                      En algunas secciones instalamos cookies de terceros para gestionar servicios externos (ej. Google Analytics). 
                      Estas cookies permiten auditar el rendimiento de nuestras herramientas de forma agregada.
                    </p>
                  </section>

                  <section id="administracion" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">4. Cómo administrar las cookies</h2>
                    <p className="mb-6">
                      Puedes permitir, bloquear o eliminar las cookies configurando las opciones de tu navegador:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647?hl=es' },
                        { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias' },
                        { name: 'Safari', url: 'https://support.apple.com/es-es/guide/safari/sfri11471/mac' },
                        { name: 'Microsoft Edge', url: 'https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' }
                      ].map((browser) => (
                        <li key={browser.name}>
                          <a 
                            href={browser.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
                          >
                            <span className="text-gray-300 group-hover:text-white">{browser.name}</span>
                            <ExternalLink className="w-4 h-4 text-[#00CCFF]" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section id="listado" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">5. Cookies utilizadas en nuestra plataforma</h2>
                    <div className="overflow-x-auto border border-white/10 rounded-2xl">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 border-b border-white/10">
                          <tr>
                            <th className="px-6 py-4 font-semibold text-white">Nombre</th>
                            <th className="px-6 py-4 font-semibold text-white">Tipo</th>
                            <th className="px-6 py-4 font-semibold text-white">Finalidad</th>
                            <th className="px-6 py-4 font-semibold text-white">Duración</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {[
                            { name: 'session', type: 'Técnica', goal: 'Mantenimiento de sesión', duration: 'Sesión' },
                            { name: '_ga', type: 'Analítica', goal: 'Google Analytics', duration: '2 años' },
                            { name: '_gid', type: 'Analítica', goal: 'Distinguir usuarios', duration: '24 horas' },
                            { name: 'theme', type: 'Personalización', goal: 'Preferencias de tema', duration: '1 año' }
                          ].map((cookie) => (
                            <tr key={cookie.name} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-mono text-[#00CCFF]">{cookie.name}</td>
                              <td className="px-6 py-4 text-gray-400">{cookie.type}</td>
                              <td className="px-6 py-4 text-gray-300">{cookie.goal}</td>
                              <td className="px-6 py-4 text-gray-400">{cookie.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section id="cambios" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">6. Modificaciones</h2>
                    <p>
                      Actualizamos esta política periódicamente para reflejar mejoras técnicas o cambios normativos. 
                      Recomendamos revisarla frecuentemente para estar informado.
                    </p>
                  </section>

                  <section id="contacto" className="scroll-mt-32">
                    <h2 className="text-2xl font-semibold text-white mb-6">7. Contacto</h2>
                    <p>
                      Si tienes dudas sobre nuestra política técnica de cookies, puedes contactar al equipo en 
                      <a href={`mailto:${TUWEBAI_EMAIL}`} className="text-[#00CCFF] hover:underline ml-1">
                        {TUWEBAI_EMAIL}
                      </a>.
                    </p>
                  </section>
                  
                </div>
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
