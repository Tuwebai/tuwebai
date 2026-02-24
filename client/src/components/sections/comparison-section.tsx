import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';


interface ComparisonSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ComparisonSection({ setRef }: ComparisonSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: subtitleRef, hasIntersected: subtitleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: tableRef, hasIntersected: tableVisible } = useIntersectionObserver<HTMLDivElement>();
  
  const [activeTab, setActiveTab] = useState<'websites' | 'marketing' | 'automation'>('websites');
  
  // Set the ref for the parent component
  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } }
  };

  // Función para renderizar contenido específico de cada pestaña
  const renderTabContent = () => {
    if (activeTab === 'websites') {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-[#121217] rounded-tl-lg">Características</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider bg-[#121217]">Agencias tradicionales</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-[#00CCFF] uppercase tracking-wider bg-[#121217] font-bold rounded-tr-lg">TuWeb.ai</th>
              </tr>
            </thead>
            <tbody className="bg-[#0c0c12] divide-y divide-gray-800">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Tiempo de entrega</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">8-12 semanas</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">4-6 semanas</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Optimización SEO</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Básica o no incluida</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Incluida en todos los planes</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Velocidad de carga</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Variable (3-5s)</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Optimizada (&lt;2s)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Diseño responsive</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-[#00CCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Panel de administración</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Opcional con costo extra</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Incluido sin costo</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Certificado SSL</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Pago anual adicional</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Incluido gratuitamente</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Enfoque en conversión</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Limitado</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Prioritario en el diseño</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14] rounded-bl-lg">Soporte técnico</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Horario limitado</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217] rounded-br-lg">Disponible 24/7</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (activeTab === 'marketing') {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-[#121217] rounded-tl-lg">Características</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider bg-[#121217]">Agencias tradicionales</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-[#00CCFF] uppercase tracking-wider bg-[#121217] font-bold rounded-tr-lg">TuWeb.ai</th>
              </tr>
            </thead>
            <tbody className="bg-[#0c0c12] divide-y divide-gray-800">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Estrategia personalizada</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Genérica por industria</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Totalmente personalizada</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Análisis de competencia</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Básico</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Exhaustivo y detallado</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Optimización continua</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Mensual</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Semanal</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Creación de contenido</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Limitada</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Ilimitada en planes premium</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Reporting en tiempo real</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-[#00CCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Reuniones de estrategia</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Mensuales</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Semanales o quincenales</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Integración multicanal</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Limitada</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Completa y sincronizada</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14] rounded-bl-lg">Garantía de resultados</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Raramente ofrecida</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217] rounded-br-lg">Incluida en todos los planes</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-[#121217] rounded-tl-lg">Características</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider bg-[#121217]">Soluciones estándar</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-[#00CCFF] uppercase tracking-wider bg-[#121217] font-bold rounded-tr-lg">TuWeb.ai</th>
              </tr>
            </thead>
            <tbody className="bg-[#0c0c12] divide-y divide-gray-800">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Implementación</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Genérica</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Personalizada</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Integraciones</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Limitadas</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Múltiples plataformas</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Workflows personalizados</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Básicos</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Avanzados y complejos</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Segmentación avanzada</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-[#00CCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Automatización de CRM</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Módulo adicional</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Incluido</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Email marketing avanzado</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Limitado</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Completo</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14]">Análisis de rendimiento</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Básico</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217]">Detallado con inteligencia artificial</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 bg-[#0c0c14] rounded-bl-lg">Soporte técnico</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-400">Por email o ticket</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white bg-[#121217] rounded-br-lg">Atención personalizada 24/7</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <section 
      id="comparison" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative py-20"
      style={{ background: 'linear-gradient(180deg, #121217 0%, #0a0a0f 100%)' }}
    >
      
      <div className="container mx-auto px-4 z-10">
        <motion.div 
          ref={titleRef}
          className="text-center"
          initial="hidden"
          animate={titleVisible ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h2 className="font-rajdhani font-bold text-3xl md:text-5xl mb-4">
            <span className="gradient-text gradient-border inline-block pb-2">¿Por Qué Elegirnos?</span>
          </h2>
        </motion.div>
        
        <motion.div 
          ref={subtitleRef}
          className="text-center mb-10"
          initial="hidden"
          animate={subtitleVisible ? "visible" : "hidden"}
          variants={subtitleVariants}
        >
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comparamos nuestras soluciones con las alternativas tradicionales para que puedas ver la diferencia.
          </p>
        </motion.div>
        
        {/* Tabs de selección */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-[#121217] rounded-full">
            <button
              onClick={() => setActiveTab('websites')}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                activeTab === 'websites' 
                  ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Desarrollo Web
            </button>
            <button
              onClick={() => setActiveTab('marketing')}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                activeTab === 'marketing' 
                  ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Marketing Digital
            </button>
            <button
              onClick={() => setActiveTab('automation')}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                activeTab === 'automation' 
                  ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Automatización
            </button>
          </div>
        </div>
        
        {/* Tabla comparativa */}
        <motion.div 
          ref={tableRef}
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate={tableVisible ? "visible" : "hidden"}
          variants={tableVariants}
        >
          {renderTabContent()}
          
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-6">
              * La comparación se basa en el análisis de servicios similares en el mercado. Los resultados pueden variar según el caso específico.
            </p>
            <motion.a 
              href="/consulta" 
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Solicitar propuesta personalizada
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}