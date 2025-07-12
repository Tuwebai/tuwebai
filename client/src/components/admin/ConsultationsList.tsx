import React, { useState } from 'react';
import { FaCheck, FaSearch, FaEye, FaTrash, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { consultations } from '../../data/admin';
import { Consultation } from '../../types/admin';

const ConsultationsList: React.FC = () => {
  const [allConsultations] = useState<Consultation[]>(consultations);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const consultationsPerPage = 10;
  
  // Filtrar consultas por término de búsqueda
  const filteredConsultations = allConsultations.filter(consultation => 
    consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.projectType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calcular páginación
  const indexOfLastConsultation = currentPage * consultationsPerPage;
  const indexOfFirstConsultation = indexOfLastConsultation - consultationsPerPage;
  const currentConsultations = filteredConsultations.slice(indexOfFirstConsultation, indexOfLastConsultation);
  const totalPages = Math.ceil(filteredConsultations.length / consultationsPerPage);
  
  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Marcar como procesado
  const handleMarkAsProcessed = (consultationId: number) => {
    // En una implementación real, esto debería hacer una llamada a la API
    console.log(`Marcar como procesada la consulta ${consultationId}`);
  };
  
  // Eliminar consulta
  const handleDelete = (consultationId: number) => {
    // En una implementación real, esto debería hacer una llamada a la API
    console.log(`Eliminar la consulta ${consultationId}`);
  };
  
  // Abrir modal para ver detalles
  const openConsultationDetails = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsModalOpen(true);
  };
  
  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedConsultation(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Consultas</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar consultas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Tabla de consultas */}
      <div className="bg-[#121217] rounded-xl border border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr className="bg-[#1a1a23]">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Negocio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Proyecto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Presupuesto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {currentConsultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-[#1a1a23] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium text-white">{consultation.name}</div>
                    <div className="text-gray-400 text-xs">{consultation.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {consultation.business}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {consultation.projectType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {consultation.budget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      consultation.processed ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'
                    }`}>
                      {consultation.processed ? 'Procesado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openConsultationDetails(consultation)}
                        className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#252530] transition-colors"
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      {!consultation.processed && (
                        <button 
                          onClick={() => handleMarkAsProcessed(consultation.id)}
                          className="p-1 rounded text-gray-400 hover:text-green-500 hover:bg-[#252530] transition-colors"
                          title="Marcar como procesado"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(consultation.id)}
                        className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-[#252530] transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentConsultations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No se encontraron consultas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredConsultations.length > consultationsPerPage && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
            <div className="text-sm text-gray-400">
              Mostrando {indexOfFirstConsultation + 1} - {Math.min(indexOfLastConsultation, filteredConsultations.length)} de {filteredConsultations.length} consultas
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

      {/* Modal de detalles de la consulta */}
      {isModalOpen && selectedConsultation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121217] rounded-xl border border-gray-800 shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Detalles de la consulta</h3>
              <button 
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-[#1a1a23] text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Nombre</h4>
                  <p className="text-white">{selectedConsultation.name}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Email</h4>
                  <p className="text-white">{selectedConsultation.email}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Teléfono</h4>
                  <p className="text-white">{selectedConsultation.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Fecha</h4>
                  <p className="text-white">{formatDate(selectedConsultation.createdAt.toString())}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Negocio</h4>
                  <p className="text-white">{selectedConsultation.business}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Tipo de proyecto</h4>
                  <p className="text-white">{selectedConsultation.projectType}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Presupuesto</h4>
                  <p className="text-white">{selectedConsultation.budget}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Plazo</h4>
                  <p className="text-white">{selectedConsultation.deadline}</p>
                </div>
              </div>
              
              {selectedConsultation.serviceDetails && selectedConsultation.serviceDetails.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Servicios solicitados</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedConsultation.serviceDetails.map((service, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-[#1a1a23] rounded-full text-sm text-gray-300"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedConsultation.sections && selectedConsultation.sections.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Secciones solicitadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedConsultation.sections.map((section, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-[#1a1a23] rounded-full text-sm text-gray-300"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Mensaje</h4>
                <div className="bg-[#1a1a23] rounded-lg p-4 text-gray-300">
                  {selectedConsultation.message}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end space-x-3">
              {!selectedConsultation.processed && (
                <button
                  onClick={() => handleMarkAsProcessed(selectedConsultation.id)}
                  className="px-4 py-2 bg-[#1a1a23] border border-gray-700 text-white rounded-lg hover:bg-[#252530] transition-colors"
                >
                  Marcar como procesado
                </button>
              )}
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white rounded-lg hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsList;