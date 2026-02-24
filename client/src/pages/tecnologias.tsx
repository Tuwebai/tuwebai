import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedShape from '../components/ui/animated-shape';
import { technologies } from '../data/technologies';
import { Technology } from '../types/technologies';
import { FaStar, FaExternalLinkAlt, FaSearch } from 'react-icons/fa';

export default function Tecnologias() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filteredTechs, setFilteredTechs] = useState<Technology[]>(technologies);
  
  // Extraer categorías únicas
  const uniqueCategories = ['Todos', ...Array.from(new Set(technologies.map(tech => tech.category)))];
  
  // Filtrar tecnologías
  useEffect(() => {
    let filtered = technologies;
    
    // Filtrar por categoría
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(tech => tech.category === selectedCategory);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        tech => 
          tech.name.toLowerCase().includes(term) || 
          tech.description.toLowerCase().includes(term) ||
          tech.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredTechs(filtered);
  }, [selectedCategory, searchTerm]);

  // Renderizar estrellas para ratings
  const renderStars = (rating: number) => {
    const maxRating = 100;
    const starsCount = 5;
    const filledStars = Math.round((rating / maxRating) * starsCount);
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(starsCount)].map((_, i) => (
          <FaStar
            key={i}
            className={i < filledStars ? "text-yellow-400" : "text-gray-600"}
            size={14}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#0a0a0f] min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-1 pt-24 pb-16">
        <AnimatedShape type={1} className="top-[10%] right-[-150px]" delay={1} />
        <AnimatedShape type={2} className="bottom-[10%] left-[-100px]" delay={2} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 font-rajdhani"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Nuestras <span className="gradient-text">Tecnologías</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Dominamos las herramientas más potentes y modernas para desarrollar soluciones digitales de alto rendimiento.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filtros */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              {/* Filtro por categoría */}
              <div className="flex flex-col w-full md:w-auto">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Categoría</h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueCategories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                          : 'bg-[#121217] text-gray-300 hover:bg-[#1a1a23]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Buscador */}
              <div className="flex flex-col w-full md:w-auto">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Buscar</h3>
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Buscar tecnologías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#121217] border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Resultados */}
          {filteredTechs.length === 0 ? (
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
              <h3 className="text-xl font-medium text-gray-400 mb-2">No se encontraron tecnologías</h3>
              <p className="text-gray-500">
                No hay tecnologías que coincidan con tu búsqueda. Intenta con otros términos o filtros.
              </p>
            </div>
          ) : (
            <>
              {/* Tecnologías destacadas */}
              {selectedCategory === 'Todos' && filteredTechs.some(tech => tech.featured) && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold font-rajdhani mb-8 flex items-center">
                    <span className="w-6 h-6 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full mr-2"></span>
                    Tecnologías destacadas
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTechs
                      .filter(tech => tech.featured)
                      .slice(0, 6)
                      .map((tech, index) => (
                        <motion.div
                          key={tech.id}
                          className="bg-[#121217] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="p-6 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mr-4">
                                  <img 
                                    src={tech.logo} 
                                    alt={tech.name} 
                                    className="w-8 h-8 object-contain"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg text-white">{tech.name}</h3>
                                  <span className="text-xs text-gray-400">{tech.category}</span>
                                </div>
                              </div>
                              <a 
                                href={tech.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <FaExternalLinkAlt />
                              </a>
                            </div>
                            
                            <p className="text-gray-400 text-sm mb-4 flex-grow">
                              {tech.description}
                            </p>
                            
                            <div className="mt-auto space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Popularidad</span>
                                {renderStars(tech.popularity)}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Nuestro dominio</span>
                                {renderStars(tech.expertise)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Todas las tecnologías por categoría */}
              {uniqueCategories
                .filter(category => category !== 'Todos')
                .filter(category => 
                  selectedCategory === 'Todos' || category === selectedCategory
                )
                .map(category => {
                  const categoryTechs = filteredTechs.filter(tech => tech.category === category);
                  
                  if (categoryTechs.length === 0) return null;
                  
                  return (
                    <div key={category} className="mb-16">
                      <h2 className="text-2xl font-bold font-rajdhani mb-8 flex items-center">
                        <span className="w-6 h-6 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full mr-2"></span>
                        {category}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {categoryTechs.map((tech, index) => (
                          <motion.div
                            key={tech.id}
                            className="bg-[#121217] rounded-lg p-4 border border-gray-800 hover:border-[#00CCFF]/50 hover:-translate-y-1 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                          >
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center mr-3">
                                <img 
                                  src={tech.logo} 
                                  alt={tech.name} 
                                  className="w-6 h-6 object-contain"
                                />
                              </div>
                              <div>
                                <h3 className="font-bold text-sm text-white">{tech.name}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                  {renderStars(tech.expertise)}
                                </div>
                              </div>
                              <a 
                                href={tech.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-auto text-gray-500 hover:text-white transition-colors text-xs"
                              >
                                <FaExternalLinkAlt />
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-1">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-[#121217] rounded-xl p-8 border border-gray-800">
            <div className="text-center mb-8">
              <h2 className="font-rajdhani font-bold text-3xl mb-4 gradient-text">
                ¿Buscas desarrollar un proyecto con tecnologías específicas?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Contamos con experiencia en las tecnologías más demandadas del mercado. Cuéntanos tu proyecto y te ayudaremos a seleccionar la stack tecnológica ideal.
              </p>
            </div>
            
            <div className="flex justify-center">
              <Link 
                to="/consulta"
                className="px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30 transition-shadow flex items-center gap-2"
              >
                Solicitar asesoría tecnológica
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}