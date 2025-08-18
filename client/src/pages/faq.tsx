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

// Lista de preguntas frecuentes basadas en experiencia real
const faqs: FAQ[] = [
  {
    id: 1,
    question: "¿Cuánto cuesta desarrollar un sitio web en TuWeb.ai?",
    answer: "Nuestros precios en pesos argentinos son: Plan Básico desde $299.000/mes (landing page o sitio simple), Plan Profesional desde $499.000/mes (sitio corporativo completo). Para e-commerce y proyectos complejos, el precio se determina según las funcionalidades específicas. Todos los precios incluyen hosting, dominio, SSL y panel de administración. Ofrecemos consulta gratuita para evaluar tu proyecto específico.",
    category: 'precios',
    helpfulCount: 156,
    notHelpfulCount: 12,
    keywords: ['precios', 'pesos argentinos', 'planes', 'hosting', 'dominio', 'consulta'],
    relatedQuestions: [
      { id: 2, question: "¿Qué incluye cada plan de desarrollo web?" },
      { id: 8, question: "¿Ofrecen financiamiento o cuotas?" }
    ]
  },
  {
    id: 2,
    question: "¿Qué incluye cada plan de desarrollo web?",
    answer: "Plan Básico ($299.000/mes): Landing page o sitio web de hasta 5 páginas, diseño responsive, SEO básico, panel de administración, hosting y dominio por 1 año. Plan Profesional ($499.000/mes): Sitio web completo de hasta 10 páginas, e-commerce básico, SEO avanzado, integración con redes sociales, analytics, certificado SSL, hosting premium y soporte técnico prioritario.",
    category: 'servicios',
    helpfulCount: 134,
    notHelpfulCount: 8,
    keywords: ['planes', 'inclusiones', 'páginas', 'e-commerce', 'seo', 'hosting'],
    relatedQuestions: [
      { id: 1, question: "¿Cuánto cuesta desarrollar un sitio web en TuWeb.ai?" },
      { id: 5, question: "¿Ofrecen servicios de mantenimiento después del lanzamiento?" }
    ]
  },
  {
    id: 3,
    question: "¿Cuánto tiempo tardan en desarrollar mi sitio web?",
    answer: "Basándonos en nuestros proyectos reales: Landing page simple (5-7 días), Sitio corporativo (2-3 semanas), E-commerce básico (3-4 semanas), Plataforma compleja (6-8 semanas). Estos tiempos incluyen diseño, desarrollo, pruebas y lanzamiento. Para proyectos urgentes, ofrecemos servicio express con costo adicional del 30%.",
    category: 'desarrollo',
    helpfulCount: 98,
    notHelpfulCount: 6,
    keywords: ['tiempo', 'desarrollo', 'landing page', 'e-commerce', 'urgente', 'express'],
    relatedQuestions: [
      { id: 4, question: "¿Qué tecnologías usan para el desarrollo?" },
      { id: 9, question: "¿Puedo ver el progreso de mi proyecto?" }
    ]
  },
  {
    id: 4,
    question: "¿Qué tecnologías usan para el desarrollo?",
    answer: "Utilizamos React y Next.js para sitios web modernos y rápidos, WordPress para proyectos que requieren CMS flexible, y Shopify para e-commerce. Nuestro stack incluye TypeScript, Tailwind CSS, Firebase para backend, y herramientas como Vercel para hosting. Elegimos la tecnología según tus necesidades específicas y presupuesto.",
    category: 'desarrollo',
    helpfulCount: 87,
    notHelpfulCount: 4,
    keywords: ['react', 'next.js', 'wordpress', 'shopify', 'typescript', 'firebase'],
    relatedQuestions: [
      { id: 3, question: "¿Cuánto tiempo tardan en desarrollar mi sitio web?" },
      { id: 10, question: "¿Puedo actualizar el contenido de mi sitio yo mismo?" }
    ]
  },
  {
    id: 5,
    question: "¿Ofrecen mantenimiento después del lanzamiento?",
    answer: "Sí, ofrecemos planes de mantenimiento mensuales: Básico ($50.000/mes): Actualizaciones de seguridad, backup semanal, soporte por email. Profesional ($100.000/mes): Todo lo anterior + monitoreo 24/7, actualizaciones de contenido (hasta 5 horas/mes), soporte telefónico prioritario. Premium ($200.000/mes): Mantenimiento completo + mejoras continuas.",
    category: 'servicios',
    helpfulCount: 76,
    notHelpfulCount: 3,
    keywords: ['mantenimiento', 'planes', 'soporte', 'backup', 'actualizaciones'],
    relatedQuestions: [
      { id: 1, question: "¿Cuánto cuesta desarrollar un sitio web en TuWeb.ai?" },
      { id: 2, question: "¿Qué incluye cada plan de desarrollo web?" }
    ]
  },
  {
    id: 6,
    question: "¿Cómo miden el éxito de sus estrategias de marketing?",
    answer: "Utilizamos Google Analytics 4, Google Search Console y herramientas específicas para cada canal. Medimos: Tráfico orgánico (SEO), Conversiones y leads (Google Ads), Engagement en redes sociales, ROI de campañas. Proporcionamos reportes mensuales con métricas específicas como: aumento de tráfico, posiciones en Google, leads generados, y conversiones.",
    category: 'marketing',
    helpfulCount: 65,
    notHelpfulCount: 2,
    keywords: ['analytics', 'seo', 'google ads', 'roi', 'reportes', 'métricas'],
    relatedQuestions: [
      { id: 7, question: "¿Cuánto tiempo se tarda en ver resultados con el SEO?" },
      { id: 11, question: "¿Qué plataformas de marketing digital usan?" }
    ]
  },
  {
    id: 7,
    question: "¿Cuánto tiempo se tarda en ver resultados con el SEO?",
    answer: "Basándonos en nuestros casos reales: Mejoras iniciales en 2-4 semanas, posicionamiento estable en 3-6 meses. Para sitios nuevos: Primeras posiciones en 4-8 semanas. Para sitios existentes: Mejoras significativas en 2-3 meses. Factores que afectan: competitividad del sector, estado actual del sitio, y agresividad de la estrategia.",
    category: 'marketing',
    helpfulCount: 112,
    notHelpfulCount: 9,
    keywords: ['seo', 'tiempo', 'resultados', 'posicionamiento', 'competitividad'],
    relatedQuestions: [
      { id: 6, question: "¿Cómo miden el éxito de sus estrategias de marketing?" },
      { id: 12, question: "¿Ofrecen garantías de resultados?" }
    ]
  },
  {
    id: 8,
    question: "¿Ofrecen financiamiento o cuotas?",
    answer: "Sí, ofrecemos opciones de pago flexibles: 50% al inicio del proyecto y 50% al finalizar, o 3 cuotas sin interés (33% al inicio, 33% a la mitad del proyecto, 34% al finalizar). Para proyectos grandes, podemos estructurar pagos en más cuotas. Todos los pagos se realizan por transferencia bancaria o Mercado Pago.",
    category: 'precios',
    helpfulCount: 143,
    notHelpfulCount: 11,
    keywords: ['financiamiento', 'cuotas', 'pagos', 'mercado pago', 'transferencia'],
    relatedQuestions: [
      { id: 1, question: "¿Cuánto cuesta desarrollar un sitio web en TuWeb.ai?" },
      { id: 2, question: "¿Qué incluye cada plan de desarrollo web?" }
    ]
  },
  {
    id: 9,
    question: "¿Puedo ver el progreso de mi proyecto?",
    answer: "Sí, utilizamos Trello para que puedas ver el progreso en tiempo real. Te damos acceso a un tablero donde ves cada etapa: Diseño, Desarrollo, Pruebas, Lanzamiento. También programamos reuniones semanales por Zoom para revisar avances y recibir tu feedback. Siempre puedes contactarnos por WhatsApp para consultas urgentes.",
    category: 'general',
    helpfulCount: 89,
    notHelpfulCount: 2,
    keywords: ['progreso', 'trello', 'reuniones', 'zoom', 'whatsapp', 'feedback'],
    relatedQuestions: [
      { id: 2, question: "¿Qué incluye cada plan de desarrollo web?" },
      { id: 3, question: "¿Cuánto tiempo tardan en desarrollar mi sitio web?" }
    ]
  },
  {
    id: 10,
    question: "¿Puedo actualizar el contenido de mi sitio yo mismo?",
    answer: "Sí, todos nuestros sitios incluyen panel de administración intuitivo. Te capacitamos durante 1 hora para que puedas: Actualizar textos e imágenes, Agregar productos (en e-commerce), Crear nuevas páginas, Gestionar blog, Modificar menús. También ofrecemos soporte técnico por WhatsApp para resolver dudas rápidas.",
    category: 'desarrollo',
    helpfulCount: 94,
    notHelpfulCount: 3,
    keywords: ['panel', 'administración', 'capacitación', 'soporte', 'whatsapp'],
    relatedQuestions: [
      { id: 4, question: "¿Qué tecnologías usan para el desarrollo?" },
      { id: 5, question: "¿Ofrecen mantenimiento después del lanzamiento?" }
    ]
  },
  {
    id: 11,
    question: "¿Qué plataformas de marketing digital usan?",
    answer: "Google Ads para publicidad de búsqueda y display, Facebook/Instagram Ads para redes sociales, Google Analytics 4 para medición, Google Search Console para SEO, Mailchimp para email marketing, y herramientas específicas según el proyecto. Todas las campañas se optimizan semanalmente basándonos en datos reales de rendimiento.",
    category: 'marketing',
    helpfulCount: 71,
    notHelpfulCount: 4,
    keywords: ['google ads', 'facebook ads', 'analytics', 'mailchimp', 'optimización'],
    relatedQuestions: [
      { id: 6, question: "¿Cómo miden el éxito de sus estrategias de marketing?" },
      { id: 7, question: "¿Cuánto tiempo se tarda en ver resultados con el SEO?" }
    ]
  },
  {
    id: 12,
    question: "¿Ofrecen garantías de resultados?",
    answer: "Ofrecemos garantía de satisfacción: Si no estás conforme con el resultado final, trabajamos sin costo adicional hasta que lo estés. Para SEO y marketing: Garantizamos mejoras medibles en 6 meses o te devolvemos el 50% del pago. Para desarrollo web: Garantía de funcionamiento por 3 meses post-lanzamiento.",
    category: 'servicios',
    helpfulCount: 82,
    notHelpfulCount: 6,
    keywords: ['garantía', 'satisfacción', 'devolución', 'funcionamiento', 'mejoras'],
    relatedQuestions: [
      { id: 1, question: "¿Cuánto cuesta desarrollar un sitio web en TuWeb.ai?" },
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