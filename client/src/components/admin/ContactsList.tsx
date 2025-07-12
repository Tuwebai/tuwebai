import React, { useState } from 'react';
import { FaCheck, FaSearch, FaEye, FaTrash, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { contacts } from '../../data/admin';
import { Contact } from '../../types/admin';

const ContactsList: React.FC = () => {
  const [allContacts] = useState<Contact[]>(contacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contactsPerPage = 10;
  
  // Filtrar contactos por término de búsqueda
  const filteredContacts = allContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calcular páginación
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  
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
  
  // Marcar como leído
  const handleMarkAsRead = (contactId: number) => {
    // En una implementación real, esto debería hacer una llamada a la API
    console.log(`Marcar como leído el contacto ${contactId}`);
  };
  
  // Eliminar contacto
  const handleDelete = (contactId: number) => {
    // En una implementación real, esto debería hacer una llamada a la API
    console.log(`Eliminar el contacto ${contactId}`);
  };
  
  // Abrir modal para ver detalles
  const openContactDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };
  
  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contactos</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar contactos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Tabla de contactos */}
      <div className="bg-[#121217] rounded-xl border border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr className="bg-[#1a1a23]">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Asunto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {currentContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-[#1a1a23] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium text-white">{contact.name}</div>
                    <div className="text-gray-400 text-xs">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {contact.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(contact.createdAt.toString())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contact.read ? 'bg-green-900/20 text-green-400' : 'bg-blue-900/20 text-blue-400'
                    }`}>
                      {contact.read ? 'Leído' : 'No leído'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openContactDetails(contact)}
                        className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#252530] transition-colors"
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      {!contact.read && (
                        <button 
                          onClick={() => handleMarkAsRead(contact.id)}
                          className="p-1 rounded text-gray-400 hover:text-green-500 hover:bg-[#252530] transition-colors"
                          title="Marcar como leído"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(contact.id)}
                        className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-[#252530] transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                    No se encontraron contactos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredContacts.length > contactsPerPage && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
            <div className="text-sm text-gray-400">
              Mostrando {indexOfFirstContact + 1} - {Math.min(indexOfLastContact, filteredContacts.length)} de {filteredContacts.length} contactos
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

      {/* Modal de detalles del contacto */}
      {isModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121217] rounded-xl border border-gray-800 shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Detalles del contacto</h3>
              <button 
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-[#1a1a23] text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Nombre</h4>
                  <p className="text-white">{selectedContact.name}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Email</h4>
                  <p className="text-white">{selectedContact.email}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Teléfono</h4>
                  <p className="text-white">{selectedContact.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Fecha</h4>
                  <p className="text-white">{formatDate(selectedContact.createdAt.toString())}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Asunto</h4>
                <p className="text-white font-medium">{selectedContact.subject}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Mensaje</h4>
                <div className="bg-[#1a1a23] rounded-lg p-4 text-gray-300">
                  {selectedContact.message}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end space-x-3">
              {!selectedContact.read && (
                <button
                  onClick={() => handleMarkAsRead(selectedContact.id)}
                  className="px-4 py-2 bg-[#1a1a23] border border-gray-700 text-white rounded-lg hover:bg-[#252530] transition-colors"
                >
                  Marcar como leído
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

export default ContactsList;