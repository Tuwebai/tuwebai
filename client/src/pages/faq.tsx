import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedShape from '../components/ui/animated-shape';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// Tipo para las categorías de preguntas
type FAQCategory = 'general' | 'servicios' | 'desarrollo' | 'marketing' | 'precios';

// Tipo para las preguntas relacionadas
interface RelatedQuestion {
  id: number;
  question: string;
}

// Tipo para las preguntas frecuentes
interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: FAQCategory;
  helpfulCount?: number;
  notHelpfulCount?: number;
  relatedQuestions?: RelatedQuestion[];
  keywords?: string[];
}

// Lista de preguntas frecuentes
const faqs: FAQ[] = [
  {
    id: 1,
    question: "¿Qué servicios ofrece TuWeb.ai?",
    answer: "En TuWeb.ai ofrecemos una solución integral que incluye consultoría estratégica, desarrollo web profesional, posicionamiento y marketing digital, y automatización de marketing. Nuestro enfoque se centra en crear soluciones digitales que no solo se vean bien, sino que generen resultados medibles para tu negocio.",
    category: 'general',
    helpfulCount: 78,
    notHelpfulCount: 4,
    keywords: ['servicios', 'consultoría', 'desarrollo web', 'marketing', 'automatización'],
    relatedQuestions: [
      { id: 2, question: "¿Cómo funciona el proceso de trabajo con TuWeb.ai?" },
      { id: 8, question: "¿Cuáles son sus tarifas o precios?" }
    ]
  },
  {
    id: 2,
    question: "¿Cómo funciona el proceso de trabajo con TuWeb.ai?",
    answer: "Nuestro proceso comienza con un análisis y diagnóstico inicial de tu situación actual, seguido por el diseño de una estrategia personalizada. Luego pasamos a la fase de implementación y ejecución, donde desarrollamos las soluciones acordadas. Durante todo el proceso realizamos un monitoreo constante y ajustes para optimizar los resultados, finalizando con reportes detallados y recomendaciones específicas para seguir creciendo.",
    category: 'general',
    helpfulCount: 63,
    notHelpfulCount: 2,
    keywords: ['proceso', 'metodología', 'análisis', 'estrategia', 'implementación', 'resultados'],
    relatedQuestions: [
      { id: 1, question: "¿Qué servicios ofrece TuWeb.ai?" },
      { id: 12, question: "¿Ofrecen garantías de resultados?" }
    ]
  },
  {
    id: 3,
    question: "¿Cuánto tiempo toma desarrollar un sitio web o landing page?",
    answer: "Los tiempos de desarrollo varían según la complejidad del proyecto. En general, una landing page puede estar lista en 1-2 semanas, un sitio corporativo en 4-6 semanas, y un e-commerce o plataforma más compleja puede requerir de 8-12 semanas. Durante nuestra consulta inicial, te proporcionaremos un cronograma detallado específico para tu proyecto.",
    category: 'desarrollo',
    helpfulCount: 92,
    notHelpfulCount: 5,
    keywords: ['tiempo', 'desarrollo', 'landing page', 'sitio web', 'e-commerce', 'cronograma'],
    relatedQuestions: [
      { id: 4, question: "¿Qué plataformas y tecnologías utilizan para el desarrollo web?" },
      { id: 8, question: "¿Cuáles son sus tarifas o precios?" }
    ]
  },
  {
    id: 4,
    question: "¿Qué plataformas y tecnologías utilizan para el desarrollo web?",
    answer: "Trabajamos con diversas tecnologías modernas según las necesidades específicas de cada proyecto, incluyendo React, Next.js, WordPress, Shopify para e-commerce, y otras soluciones personalizadas. Seleccionamos la tecnología más adecuada basándonos en tus objetivos comerciales, requisitos técnicos y presupuesto.",
    category: 'desarrollo',
    helpfulCount: 85,
    notHelpfulCount: 3,
    keywords: ['tecnologías', 'plataformas', 'react', 'wordpress', 'shopify', 'e-commerce'],
    relatedQuestions: [
      { id: 3, question: "¿Cuánto tiempo toma desarrollar un sitio web o landing page?" },
      { id: 10, question: "¿Puedo actualizar el contenido de mi sitio yo mismo?" }
    ]
  },
  {
    id: 5,
    question: "¿Ofrecen servicios de mantenimiento después del lanzamiento?",
    answer: "Sí, ofrecemos planes de mantenimiento mensuales que incluyen actualizaciones de seguridad, copias de seguridad, monitoreo de rendimiento, soporte técnico y un número determinado de horas para pequeños cambios o mejoras. Estos planes son opcionales pero altamente recomendados para mantener tu sitio seguro, actualizado y funcionando óptimamente.",
    category: 'servicios',
    helpfulCount: 57,
    notHelpfulCount: 2,
    keywords: ['mantenimiento', 'soporte', 'actualizaciones', 'seguridad', 'rendimiento'],
    relatedQuestions: [
      { id: 1, question: "¿Qué servicios ofrece TuWeb.ai?" },
      { id: 8, question: "¿Cuáles son sus tarifas o precios?" }
    ]
  },
  {
    id: 6,
    question: "¿Cómo miden el éxito de sus estrategias de marketing?",
    answer: "Definimos KPIs específicos alineados con tus objetivos de negocio, que pueden incluir conversiones, leads generados, coste por adquisición, retorno de inversión, posicionamiento en buscadores, tráfico cualificado, etc. Utilizamos herramientas avanzadas de analytics para seguir estos KPIs y proporcionamos informes detallados y transparentes que muestran claramente el impacto de nuestras estrategias.",
    category: 'marketing',
    helpfulCount: 47,
    notHelpfulCount: 1,
    keywords: ['kpi', 'analítica', 'medición', 'estrategia', 'conversiones', 'roi'],
    relatedQuestions: [
      { id: 7, question: "¿Cuánto tiempo se tarda en ver resultados con el SEO?" },
      { id: 11, question: "¿Qué plataforma de automatización recomiendan?" }
    ]
  },
  {
    id: 7,
    question: "¿Cuánto tiempo se tarda en ver resultados con el SEO?",
    answer: "El SEO es una estrategia a medio-largo plazo. Generalmente, comenzarás a ver mejoras en el tráfico y posicionamiento en un periodo de 3-6 meses, aunque esto puede variar según la competitividad de tu sector, el estado actual de tu sitio web, y la agresividad de la estrategia implementada. No obstante, solemos conseguir algunas 'victorias rápidas' en las primeras semanas que generan mejoras iniciales.",
    category: 'marketing',
    helpfulCount: 103,
    notHelpfulCount: 8,
    keywords: ['seo', 'posicionamiento', 'resultados', 'tráfico', 'buscadores', 'tiempo'],
    relatedQuestions: [
      { id: 6, question: "¿Cómo miden el éxito de sus estrategias de marketing?" },
      { id: 12, question: "¿Ofrecen garantías de resultados?" }
    ]
  },
  {
    id: 8,
    question: "¿Cuáles son sus tarifas o precios?",
    answer: "Nuestras tarifas varían según el alcance y complejidad de cada proyecto. Ofrecemos soluciones personalizadas que se adaptan a diferentes presupuestos y necesidades. Para recibir un presupuesto detallado adaptado a tu situación específica, te recomendamos solicitar una consulta gratuita donde analizaremos tus necesidades y te proporcionaremos una propuesta personalizada.",
    category: 'precios',
    helpfulCount: 125,
    notHelpfulCount: 15,
    keywords: ['tarifas', 'precios', 'presupuesto', 'consulta', 'propuesta'],
    relatedQuestions: [
      { id: 1, question: "¿Qué servicios ofrece TuWeb.ai?" },
      { id: 5, question: "¿Ofrecen servicios de mantenimiento después del lanzamiento?" }
    ]
  },
  {
    id: 9,
    question: "¿Trabajan con clientes internacionales?",
    answer: "Sí, trabajamos con clientes de América Latina, Europa y Norteamérica. Nuestro equipo está habituado a trabajar de forma remota y tenemos experiencia en proyectos internacionales. Nos adaptamos a diferentes zonas horarias para garantizar una comunicación fluida durante todo el proyecto.",
    category: 'general',
    helpfulCount: 42,
    notHelpfulCount: 0,
    keywords: ['clientes', 'internacional', 'remoto', 'zonas horarias', 'comunicación'],
    relatedQuestions: [
      { id: 2, question: "¿Cómo funciona el proceso de trabajo con TuWeb.ai?" },
      { id: 1, question: "¿Qué servicios ofrece TuWeb.ai?" }
    ]
  },
  {
    id: 10,
    question: "¿Puedo actualizar el contenido de mi sitio yo mismo?",
    answer: "Absolutamente. Todos nuestros sitios incluyen un panel de administración intuitivo que te permite actualizar el contenido, añadir páginas, publicar artículos de blog y gestionar otros aspectos de tu sitio sin conocimientos técnicos. Además, proporcionamos capacitación completa para que te sientas cómodo administrando tu sitio.",
    category: 'desarrollo',
    helpfulCount: 87,
    notHelpfulCount: 2,
    keywords: ['actualizar', 'contenido', 'panel', 'administración', 'capacitación'],
    relatedQuestions: [
      { id: 4, question: "¿Qué plataformas y tecnologías utilizan para el desarrollo web?" },
      { id: 5, question: "¿Ofrecen servicios de mantenimiento después del lanzamiento?" }
    ]
  },
  {
    id: 11,
    question: "¿Qué plataforma de automatización recomiendan?",
    answer: "La elección de la plataforma adecuada depende de diversos factores como el tamaño de tu empresa, industria, presupuesto, objetivos y complejidad de tus procesos. Trabajamos con HubSpot, ActiveCampaign, Mailchimp, Zapier, entre otras. Durante nuestra consulta inicial, analizamos tus necesidades específicas para recomendarte la solución más adecuada.",
    category: 'marketing',
    helpfulCount: 53,
    notHelpfulCount: 3,
    keywords: ['automatización', 'plataforma', 'hubspot', 'activecampaign', 'mailchimp', 'zapier'],
    relatedQuestions: [
      { id: 6, question: "¿Cómo miden el éxito de sus estrategias de marketing?" },
      { id: 1, question: "¿Qué servicios ofrece TuWeb.ai?" }
    ]
  },
  {
    id: 12,
    question: "¿Ofrecen garantías de resultados?",
    answer: "Aunque no podemos garantizar resultados específicos debido a la variabilidad en los mercados y la implementación, sí ofrecemos una garantía de satisfacción. Si no estás satisfecho con la calidad de nuestro trabajo, trabajaremos contigo hasta que lo estés. Además, nuestro historial de casos de éxito demuestra nuestra capacidad para generar resultados significativos para nuestros clientes.",
    category: 'servicios',
    helpfulCount: 68,
    notHelpfulCount: 7,
    keywords: ['garantía', 'resultados', 'satisfacción', 'calidad', 'casos de éxito'],
    relatedQuestions: [
      { id: 2, question: "¿Cómo funciona el proceso de trabajo con TuWeb.ai?" },
      { id: 7, question: "¿Cuánto tiempo se tarda en ver resultados con el SEO?" }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory | 'todas'>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState<FAQ[]>(faqs);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [faqsState, setFaqsState] = useState<{[key: number]: FAQ}>(
    faqs.reduce((acc, faq) => ({...acc, [faq.id]: faq}), {})
  );
  const [votedFaqs, setVotedFaqs] = useState<{[key: number]: 'helpful' | 'not-helpful' | null}>({});
  const [showThanks, setShowThanks] = useState<{[key: number]: boolean}>({});
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Filtrar FAQs basado en categoría y búsqueda
  useEffect(() => {
    let filtered = Object.values(faqsState);
    
    // Filtrar por categoría
    if (activeCategory !== 'todas') {
      filtered = filtered.filter(faq => faq.category === activeCategory);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        faq => {
          const questionMatch = faq.question.toLowerCase().includes(term);
          const answerMatch = faq.answer.toLowerCase().includes(term);
          const keywordsMatch = faq.keywords?.some(keyword => 
            keyword.toLowerCase().includes(term)
          ) || false;
          
          return questionMatch || answerMatch || keywordsMatch;
        }
      );
    }
    
    setFilteredFAQs(filtered);
  }, [activeCategory, searchTerm, faqsState]);
  
  // Toggle para expandir/colapsar preguntas
  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  // Manejar votos de si la respuesta fue útil o no
  const handleVote = (faqId: number, helpful: boolean) => {
    // Si ya votó, no permitir votar de nuevo
    if (votedFaqs[faqId]) {
      toast({
        title: "Ya has votado esta pregunta",
        description: "Solo puedes votar una vez por pregunta. Gracias por tu feedback.",
        variant: "default",
      });
      return;
    }
    
    // Actualizar contadores
    const faq = faqsState[faqId];
    const updatedFaq = helpful
      ? { ...faq, helpfulCount: (faq.helpfulCount || 0) + 1 }
      : { ...faq, notHelpfulCount: (faq.notHelpfulCount || 0) + 1 };
    
    // Actualizar estado
    setFaqsState(prev => ({
      ...prev,
      [faqId]: updatedFaq
    }));
    
    // Marcar como votado
    setVotedFaqs(prev => ({
      ...prev,
      [faqId]: helpful ? 'helpful' : 'not-helpful'
    }));
    
    // Mostrar mensaje de agradecimiento
    setShowThanks(prev => ({
      ...prev,
      [faqId]: true
    }));
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setShowThanks(prev => ({
        ...prev,
        [faqId]: false
      }));
    }, 3000);
  };
  
  // Expandir preguntas relacionadas
  const expandRelatedQuestion = (id: number) => {
    setExpandedId(id);
    
    // Scroll to that question
    const element = document.getElementById(`faq-${id}`);
    if (element) {
      // Add some offset to account for the header
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  return (
    <main className="bg-[#0a0a0f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-1 pt-24 pb-16">
        <AnimatedShape type={1} className="top-[10%] right-[-150px]" delay={1} />
        <AnimatedShape type={2} className="bottom-[10%] left-[-100px]" delay={2} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al inicio
              </Link>
              
              <h1 className="font-rajdhani font-bold text-4xl md:text-6xl mb-6">
                <span className="gradient-text">Preguntas Frecuentes</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Respuestas a las preguntas más comunes sobre nuestros servicios. 
                Si no encuentras lo que buscas, contáctanos directamente.
              </p>
              
              <div className="relative max-w-md mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar preguntas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#121217]/70 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Categorías de FAQ */}
          <div className="mb-12 flex justify-center">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveCategory('todas')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'todas'
                    ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                    : 'bg-[#121217] text-gray-300 hover:bg-[#1a1a23]'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setActiveCategory('general')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'general'
                    ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                    : 'bg-[#121217] text-gray-300 hover:bg-[#1a1a23]'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveCategory('servicios')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'servicios'
                    ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                    : 'bg-[#121217] text-gray-300 hover:bg-[#1a1a23]'
                }`}
              >
                Servicios
              </button>
              <button
                onClick={() => setActiveCategory('desarrollo')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'desarrollo'
                    ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                    : 'bg-[#121217] text-gray-300 hover:bg-[#1a1a23]'
                }`}
              >
                Desarrollo Web
              </button>
              <button
                onClick={() => setActiveCategory('marketing')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'marketing'
                    ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                    : 'bg-[#121217] text-gray-300 hover:bg-[#1a1a23]'
                }`}
              >
                Marketing
              </button>
              <button
                onClick={() => setActiveCategory('precios')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'precios'
                    ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                    : 'bg-[#121217] text-gray-300 hover:bg-[#1a1a23]'
                }`}
              >
                Precios
              </button>
            </div>
          </div>
          
          {/* Lista de FAQs */}
          <div className="max-w-3xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-16">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-400 mb-2">No se encontraron resultados</h3>
                <p className="text-gray-500">
                  No hay preguntas que coincidan con tu búsqueda. Intenta con otros términos o categorías.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    id={`faq-${faq.id}`}
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-[#121217] rounded-xl overflow-hidden border border-gray-800"
                  >
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-6 h-6 flex items-center justify-center text-2xl font-medium text-[#00CCFF]">
                            ?
                          </div>
                          {/* Indicador de popularidad */}
                          {faq.helpfulCount && faq.helpfulCount > 80 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00CCFF] rounded-full border border-[#121217]"></div>
                          )}
                        </div>
                        <h3 className="font-medium text-white">{faq.question}</h3>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 flex-shrink-0 text-gray-400 transform transition-transform ${
                          expandedId === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <AnimatePresence>
                      {expandedId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4">
                            <div className="border-t border-gray-800 pt-4 text-gray-300">
                              {faq.answer}
                            </div>
                            
                            {/* Preguntas relacionadas */}
                            {faq.relatedQuestions && faq.relatedQuestions.length > 0 && (
                              <div className="mt-6 pt-4 border-t border-gray-800">
                                <h4 className="text-white font-medium mb-3">Preguntas relacionadas:</h4>
                                <div className="space-y-2">
                                  {faq.relatedQuestions.map(relatedQ => (
                                    <button
                                      key={relatedQ.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        expandRelatedQuestion(relatedQ.id);
                                      }}
                                      className="w-full text-left px-3 py-2 bg-[#1a1a23] hover:bg-[#222233] rounded-md text-sm text-gray-300 flex items-center gap-2 transition-colors"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00CCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                      </svg>
                                      {relatedQ.question}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Feedback section */}
                            <div className="mt-6 pt-4 border-t border-gray-800">
                              <AnimatePresence>
                                {showThanks[faq.id] ? (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center py-2"
                                  >
                                    <p className="text-[#00CCFF] font-medium">¡Gracias por tu feedback!</p>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                  >
                                    <p className="text-sm text-gray-400">¿Te ha resultado útil esta respuesta?</p>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleVote(faq.id, true);
                                        }}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                          votedFaqs[faq.id] === 'helpful'
                                            ? 'bg-[#00CCFF]/20 text-[#00CCFF] border border-[#00CCFF]/30'
                                            : 'bg-[#1a1a23] text-gray-300 hover:bg-[#1f1f29] border border-transparent'
                                        }`}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905C11 5.37 10.5 7 9 8.5 7.5 10 7 10.5 5.5 12.5l-.5.5" />
                                        </svg>
                                        <span>Sí</span>
                                        {faq.helpfulCount !== undefined && faq.helpfulCount > 0 && (
                                          <span className="ml-1 text-xs opacity-70">({faq.helpfulCount})</span>
                                        )}
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleVote(faq.id, false);
                                        }}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                          votedFaqs[faq.id] === 'not-helpful'
                                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                            : 'bg-[#1a1a23] text-gray-300 hover:bg-[#1f1f29] border border-transparent'
                                        }`}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-2.415.5-4.116 2-5.616 1.5-1.5 2.833-1.583 3.5-3.5l.5-.5" />
                                        </svg>
                                        <span>No</span>
                                        {faq.notHelpfulCount !== undefined && faq.notHelpfulCount > 0 && (
                                          <span className="ml-1 text-xs opacity-70">({faq.notHelpfulCount})</span>
                                        )}
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            
                            {/* Tags/keywords */}
                            {faq.keywords && faq.keywords.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {faq.keywords.map((keyword, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-[#1a1a23] rounded-md text-xs text-gray-400"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-1">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-[#121217] rounded-xl p-8 border border-gray-800">
            <div className="text-center mb-8">
              <h2 className="font-rajdhani font-bold text-3xl mb-4 gradient-text">
                ¿No encuentras la respuesta que buscas?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Estamos aquí para ayudarte. Contáctanos directamente y resolveremos todas tus dudas.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/consulta"
                className="px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium text-center shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30"
              >
                Solicitar consulta gratuita
              </a>
              <a
                href="mailto:hola@tuweb.ai"
                className="px-6 py-3 bg-[#1a1a23] border border-gray-700 rounded-lg text-white font-medium text-center hover:bg-[#1f1f29] transition-colors"
              >
                Enviar email
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}