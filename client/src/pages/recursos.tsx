import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaFileExcel, FaFileArchive, FaVideo, FaDownload, FaSearch } from 'react-icons/fa';
import { resources } from '../data/resources';
import { Resource } from '../types/resources';
import AnimatedShape from '../components/ui/animated-shape';

export default function Recursos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources);

  // Extraer categorías y tipos únicos
  const uniqueCategories = ['Todos', ...Array.from(new Set(resources.map(r => r.category)))];
  const uniqueTypes = ['Todos', ...Array.from(new Set(resources.map(r => r.type)))];

  // Función para obtener icono según tipo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FaFilePdf className="text-red-500" />;
      case 'XLSX':
        return <FaFileExcel className="text-green-500" />;
      case 'ZIP':
        return <FaFileArchive className="text-yellow-500" />;
      case 'MP4':
        return <FaVideo className="text-blue-500" />;
      default:
        return <FaDownload className="text-gray-400" />;
    }
  };

  // Filtrar recursos
  useEffect(() => {
    let filtered = resources;
    
    // Filtrar por categoría
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }
    
    // Filtrar por tipo
    if (selectedType !== 'Todos') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        resource => 
          resource.title.toLowerCase().includes(term) || 
          resource.description.toLowerCase().includes(term) ||
          resource.category.toLowerCase().includes(term) ||
          resource.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredResources(filtered);
  }, [selectedCategory, selectedType, searchTerm]);

  // Handle download
  const handleDownload = (resource: Resource) => {
    console.log(`Descargando ${resource.title}`);
    // En una implementación real, aquí se haría la petición al servidor
    // o se redirigiría al archivo para descarga
    // window.open(resource.file, '_blank');
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
              Recursos <span className="gradient-text">Gratuitos</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Descarga guías, plantillas y recursos para potenciar tu presencia digital.
              Material exclusivo creado por nuestro equipo de expertos.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filtros */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
              {/* Filtro por categoría */}
              <div className="flex flex-col">
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
              
              {/* Filtro por tipo */}
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Tipo de archivo</h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueTypes.map((type, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                          : 'bg-[#121217] text-gray-300 hover:bg-[#1a1a23]'
                      }`}
                    >
                      {type !== 'Todos' && (
                        <span>{getTypeIcon(type)}</span>
                      )}
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Buscador */}
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Buscar</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar recursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-[#121217] border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Resultados de búsqueda */}
          {filteredResources.length === 0 ? (
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
              <h3 className="text-xl font-medium text-gray-400 mb-2">No se encontraron recursos</h3>
              <p className="text-gray-500">
                No hay recursos que coincidan con tu búsqueda. Intenta con otros términos o filtros.
              </p>
            </div>
          ) : (
            <>
              {/* Recursos destacados */}
              {filteredResources.some(r => r.featured) && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold font-rajdhani mb-8 flex items-center">
                    <span className="w-6 h-6 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full mr-2"></span>
                    Recursos destacados
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources
                      .filter(resource => resource.featured)
                      .slice(0, 3)
                      .map((resource, index) => (
                        <motion.div
                          key={resource.id}
                          className="bg-[#121217] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="h-48 relative overflow-hidden">
                            <img 
                              src={resource.image} 
                              alt={resource.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121217] to-transparent opacity-60"></div>
                            <div className="absolute top-4 left-4 px-2 py-1 bg-[#00CCFF]/20 backdrop-blur-sm rounded-lg text-[#00CCFF] text-xs">
                              {resource.type}
                            </div>
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#121217]/70 backdrop-blur-sm flex items-center justify-center">
                              <span className="text-xl">
                                {getTypeIcon(resource.type)}
                              </span>
                            </div>
                          </div>
                          <div className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm px-3 py-1 bg-[#00CCFF]/10 text-[#00CCFF] rounded-full">
                                {resource.category}
                              </span>
                              <span className="text-xs text-gray-400">
                                {resource.date}
                              </span>
                            </div>
                            <h3 className="font-rajdhani font-bold text-xl mb-2 text-white">
                              {resource.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 flex-grow">
                              {resource.description}
                            </p>
                            <div className="mt-auto">
                              {resource.tags && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {resource.tags.slice(0, 3).map((tag, idx) => (
                                    <span 
                                      key={idx}
                                      className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                  {resource.tags.length > 3 && (
                                    <span className="text-xs text-gray-500 px-1">+{resource.tags.length - 3}</span>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400 flex items-center">
                                  <FaDownload className="mr-1" /> {resource.downloadCount} descargas
                                </span>
                                <button 
                                  className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white text-sm font-medium transform hover:scale-105 transition-transform"
                                  onClick={() => handleDownload(resource)}
                                >
                                  Descargar
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Todos los recursos */}
              <div>
                <h2 className="text-2xl font-bold font-rajdhani mb-8 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full mr-2"></span>
                  {selectedCategory === 'Todos' ? 'Todos los recursos' : `Recursos de ${selectedCategory}`} 
                  {filteredResources.length > 0 && (
                    <span className="ml-2 text-sm text-gray-400">({filteredResources.length})</span>
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      className="bg-[#121217] rounded-xl overflow-hidden shadow-md border border-gray-800 hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <div className="p-5 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex flex-col">
                            <span className="text-sm px-2 py-0.5 bg-[#00CCFF]/10 text-[#00CCFF] rounded-full text-xs mb-2">
                              {resource.category}
                            </span>
                            <span className="text-xs text-gray-400">
                              {resource.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-[#1a1a23] px-2 py-1 rounded text-gray-300">
                              {resource.type}
                            </span>
                            <span className="text-xl">
                              {getTypeIcon(resource.type)}
                            </span>
                          </div>
                        </div>
                        <h3 className="font-rajdhani font-bold text-lg mb-2 text-white">
                          {resource.title}
                        </h3>
                        <p className="text-gray-400 text-xs mb-4 line-clamp-2 flex-grow">
                          {resource.description}
                        </p>
                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-xs text-gray-400">
                            <FaDownload className="inline mr-1" /> {resource.downloadCount}
                          </span>
                          <button 
                            className="px-3 py-1.5 bg-[#1a1a23] border border-[#00CCFF]/30 rounded-lg text-[#00CCFF] text-xs hover:bg-[#252530] transition-colors flex items-center gap-1"
                            onClick={() => handleDownload(resource)}
                          >
                            <FaDownload /> Descargar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
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
                ¿Necesitas recursos personalizados?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Si buscas recursos a medida para tu proyecto, contáctanos y crearemos exactamente lo que necesitas.
              </p>
            </div>
            
            <div className="flex justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30 transition-shadow flex items-center gap-2">
                Solicitar recurso personalizado
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}