import React, { useState } from 'react';
import { FaSearch, FaTrash, FaAngleLeft, FaAngleRight, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { newsletters } from '../../data/admin';
import { Newsletter } from '../../types/admin';

const NewsletterList: React.FC = () => {
  const [allNewsletters] = useState<Newsletter[]>(newsletters);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const newslettersPerPage = 10;
  
  // Filtrar newsletters por término de búsqueda y estado
  const filteredNewsletters = allNewsletters.filter(newsletter => {
    const matchesSearch = 
      newsletter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (newsletter.name && newsletter.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      newsletter.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && newsletter.active) ||
      (statusFilter === 'inactive' && !newsletter.active);
    
    return matchesSearch && matchesStatus;
  });
  
  // Calcular páginación
  const indexOfLastNewsletter = currentPage * newslettersPerPage;
  const indexOfFirstNewsletter = indexOfLastNewsletter - newslettersPerPage;
  const currentNewsletters = filteredNewsletters.slice(indexOfFirstNewsletter, indexOfLastNewsletter);
  const totalPages = Math.ceil(filteredNewsletters.length / newslettersPerPage);
  
  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Toggle estado (activo/inactivo)
  const handleToggleStatus = (newsletterId: number) => {
    // En una implementación real, esto debería hacer una llamada a la API
    console.log(`Cambiar estado del suscriptor ${newsletterId}`);
  };
  
  // Eliminar suscriptor
  const handleDelete = (newsletterId: number) => {
    // En una implementación real, esto debería hacer una llamada a la API
    console.log(`Eliminar suscriptor ${newsletterId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Newsletter</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar suscriptores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-400">Filtrar por estado:</span>
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm ${
              statusFilter === 'all'
                ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                : 'bg-[#1a1a23] text-gray-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm ${
              statusFilter === 'active'
                ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                : 'bg-[#1a1a23] text-gray-400 hover:text-white'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-4 py-2 rounded-lg text-sm ${
              statusFilter === 'inactive'
                ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                : 'bg-[#1a1a23] text-gray-400 hover:text-white'
            }`}
          >
            Inactivos
          </button>
        </div>
      </div>

      {/* Tabla de suscriptores */}
      <div className="bg-[#121217] rounded-xl border border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr className="bg-[#1a1a23]">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fuente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {currentNewsletters.map((newsletter) => (
                <tr key={newsletter.id} className="hover:bg-[#1a1a23] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {newsletter.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {newsletter.name || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {newsletter.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(newsletter.createdAt.toString())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      newsletter.active ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                    }`}>
                      {newsletter.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleToggleStatus(newsletter.id)}
                        className={`p-1 rounded ${
                          newsletter.active 
                            ? 'text-green-500 hover:text-gray-400' 
                            : 'text-gray-500 hover:text-green-500'
                        } hover:bg-[#252530] transition-colors`}
                        title={newsletter.active ? 'Desactivar' : 'Activar'}
                      >
                        {newsletter.active ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(newsletter.id)}
                        className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-[#252530] transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentNewsletters.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No se encontraron suscriptores
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredNewsletters.length > newslettersPerPage && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
            <div className="text-sm text-gray-400">
              Mostrando {indexOfFirstNewsletter + 1} - {Math.min(indexOfLastNewsletter, filteredNewsletters.length)} de {filteredNewsletters.length} suscriptores
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded bg-[#1a1a23] text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaAngleLeft />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`w-8 h-8 rounded ${
                      currentPage === pageNumber
                        ? 'bg-[#00CCFF] text-white'
                        : 'bg-[#1a1a23] text-gray-400 hover:text-white'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded bg-[#1a1a23] text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121217] rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-2">Total de suscriptores</h3>
          <p className="text-3xl font-bold text-white">{allNewsletters.length}</p>
        </div>
        <div className="bg-[#121217] rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-2">Suscriptores activos</h3>
          <p className="text-3xl font-bold text-green-400">
            {allNewsletters.filter(n => n.active).length}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {Math.round((allNewsletters.filter(n => n.active).length / allNewsletters.length) * 100)}% del total
          </p>
        </div>
        <div className="bg-[#121217] rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-2">Origen principal</h3>
          <p className="text-3xl font-bold text-[#00CCFF]">
            {(() => {
              const sources = allNewsletters.map(n => n.source);
              const sourceCounts = sources.reduce((acc, source) => {
                acc[source] = (acc[source] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);
              
              // Encontrar la fuente con más suscriptores
              let maxSource = '';
              let maxCount = 0;
              
              Object.entries(sourceCounts).forEach(([source, count]) => {
                if (count > maxCount) {
                  maxSource = source;
                  maxCount = count;
                }
              });
              
              return maxSource;
            })()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterList;