import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedShape from '../components/ui/animated-shape';
import { useApplyVacancy } from '@/hooks/use-vacancies';

// Tipo para las vacantes
interface Vacancy {
  id: string;
  title: string;
  department: string;
  type: 'Full-time' | 'Part-time' | 'Freelance';
  location: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary?: string;
  isActive: boolean;
}

// Datos de las vacantes
const vacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Desarrollador Full-Stack Senior',
    department: 'Desarrollo',
    type: 'Full-time',
    location: 'Remoto',
    experience: '3+ años',
    description: 'Buscamos un desarrollador Full-Stack Senior para liderar proyectos web complejos y mentorizar al equipo junior. Trabajarás con tecnologías modernas como React, Node.js, TypeScript y Firebase.',
    requirements: [
      'Experiencia sólida en React, Node.js y TypeScript',
      'Conocimientos avanzados de bases de datos (Firebase, MongoDB)',
      'Experiencia con arquitecturas escalables',
      'Capacidad de liderazgo y mentoría',
      'Inglés intermedio-avanzado'
    ],
    benefits: [
      'Salario competitivo',
      'Horario flexible',
      'Trabajo remoto 100%',
      'Capacitación continua',
      'Proyectos desafiantes',
      'Crecimiento profesional'
    ],
    salary: 'USD 3,000 - 5,000',
    isActive: true
  },
  {
    id: '2',
    title: 'Diseñador UX/UI',
    department: 'Diseño',
    type: 'Full-time',
    location: 'Remoto',
    experience: '2+ años',
    description: 'Únete a nuestro equipo de diseño para crear experiencias digitales excepcionales. Trabajarás en proyectos de e-commerce, sitios corporativos y aplicaciones web.',
    requirements: [
      'Experiencia en diseño de interfaces web',
      'Dominio de Figma, Adobe XD o Sketch',
      'Conocimientos de UX y metodologías de investigación',
      'Portfolio con proyectos web',
      'Creatividad y atención al detalle'
    ],
    benefits: [
      'Salario competitivo',
      'Herramientas de diseño premium',
      'Libertad creativa',
      'Proyectos diversos',
      'Capacitación en nuevas tecnologías'
    ],
    salary: 'USD 2,500 - 4,000',
    isActive: true
  },
  {
    id: '3',
    title: 'Especialista en Marketing Digital',
    department: 'Marketing',
    type: 'Part-time',
    location: 'Remoto',
    experience: '1+ año',
    description: 'Ayúdanos a posicionar nuestros proyectos y clientes en el mundo digital. Manejarás estrategias de SEO, publicidad digital y redes sociales.',
    requirements: [
      'Experiencia en SEO y SEM',
      'Conocimientos de Google Ads y Facebook Ads',
      'Manejo de herramientas de analytics',
      'Creatividad para contenido',
      'Resultados medibles'
    ],
    benefits: [
      'Horario flexible',
      'Proyectos variados',
      'Comisión por resultados',
      'Capacitación continua',
      'Trabajo remoto'
    ],
    salary: 'USD 1,500 - 2,500',
    isActive: true
  }
];

// Tipo para las aplicaciones
interface Application {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  portfolio: string;
  message: string;
  resume?: File;
}

export default function Vacantes() {
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [application, setApplication] = useState<Application>({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    portfolio: '',
    message: ''
  });
  const applyVacancy = useApplyVacancy();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplication(prev => ({
        ...prev,
        resume: e.target.files![0]
      }));
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVacancy) return;

    try {
      await applyVacancy.mutateAsync({
        application: application,
        vacancy: selectedVacancy
      });

      setShowApplicationForm(false);
      setApplication({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        portfolio: '',
        message: ''
      });
    } catch (error) {
      // Error handling is centralized in the hook
    }
  };

  const openApplicationForm = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setApplication(prev => ({
      ...prev,
      position: vacancy.title
    }));
    setShowApplicationForm(true);
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
                <span className="gradient-text">Únete a Nuestro Equipo</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Buscamos talentos apasionados por la tecnología y la innovación. 
                Forma parte de un equipo que crea experiencias digitales excepcionales.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vacancies Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-rajdhani font-bold text-3xl md:text-4xl mb-4 gradient-text">
              Posiciones Abiertas
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Descubre las oportunidades que tenemos para ti. Cada posición ofrece 
              crecimiento profesional y proyectos desafiantes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {vacancies.filter(v => v.isActive).map((vacancy, index) => (
              <motion.div
                key={vacancy.id}
                className="bg-[#121217] rounded-xl p-6 border border-gray-800 hover:border-[#00CCFF]/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-rajdhani font-bold text-2xl text-white mb-2">
                      {vacancy.title}
                    </h3>
                    <p className="text-[#00CCFF] font-medium">{vacancy.department}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    vacancy.type === 'Full-time' ? 'bg-green-500/20 text-green-400' :
                    vacancy.type === 'Part-time' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {vacancy.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vacancy.location}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    {vacancy.experience}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {vacancy.description}
                </p>
                
                {vacancy.salary && (
                  <div className="mb-4">
                    <span className="text-[#00CCFF] font-medium">Salario: {vacancy.salary}</span>
                  </div>
                )}
                
                <button
                  onClick={() => openApplicationForm(vacancy)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-all"
                >
                  Aplicar ahora
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#0c0c14]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-rajdhani font-bold text-3xl md:text-4xl mb-4 gradient-text">
              ¿Por qué trabajar con nosotros?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Ofrecemos un ambiente de trabajo dinámico y oportunidades de crecimiento profesional.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-rajdhani font-bold text-xl mb-2 text-white">Horario Flexible</h3>
              <p className="text-gray-300">
                Trabaja desde donde quieras y en el horario que mejor se adapte a tu estilo de vida.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-rajdhani font-bold text-xl mb-2 text-white">Proyectos Innovadores</h3>
              <p className="text-gray-300">
                Trabaja en proyectos desafiantes que utilizan las últimas tecnologías del mercado.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-rajdhani font-bold text-xl mb-2 text-white">Crecimiento Continuo</h3>
              <p className="text-gray-300">
                Acceso a capacitaciones, conferencias y recursos para tu desarrollo profesional.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplicationForm && selectedVacancy && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowApplicationForm(false)}
          >
            <motion.div
              className="bg-[#121217] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-rajdhani font-bold text-2xl text-white">
                    Aplicar a: {selectedVacancy.title}
                  </h2>
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={application.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#1a1a23] border border-gray-700 rounded-lg text-white focus:border-[#00CCFF] focus:outline-none transition-colors"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={application.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#1a1a23] border border-gray-700 rounded-lg text-white focus:border-[#00CCFF] focus:outline-none transition-colors"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={application.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1a1a23] border border-gray-700 rounded-lg text-white focus:border-[#00CCFF] focus:outline-none transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Años de experiencia *
                      </label>
                      <select
                        name="experience"
                        value={application.experience}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#1a1a23] border border-gray-700 rounded-lg text-white focus:border-[#00CCFF] focus:outline-none transition-colors"
                      >
                        <option value="">Selecciona tu experiencia</option>
                        <option value="0-1">0-1 año</option>
                        <option value="1-3">1-3 años</option>
                        <option value="3-5">3-5 años</option>
                        <option value="5+">5+ años</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Portfolio/Website
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={application.portfolio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a23] border border-gray-700 rounded-lg text-white focus:border-[#00CCFF] focus:outline-none transition-colors"
                      placeholder="https://tuportfolio.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CV/Resume
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 bg-[#1a1a23] border border-gray-700 rounded-lg text-white focus:border-[#00CCFF] focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00CCFF] file:text-white hover:file:bg-[#9933FF]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mensaje (opcional)
                    </label>
                    <textarea
                      name="message"
                      value={application.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#1a1a23] border border-gray-700 rounded-lg text-white focus:border-[#00CCFF] focus:outline-none transition-colors resize-none"
                      placeholder="Cuéntanos por qué te interesa esta posición..."
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={applyVacancy.isPending}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applyVacancy.isPending ? 'Enviando...' : 'Enviar aplicación'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-6 py-3 bg-[#1a1a23] border border-gray-700 rounded-lg text-white font-medium hover:bg-[#1f1f29] transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
