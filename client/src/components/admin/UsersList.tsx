import React, { useState } from 'react';
import { FaSearch, FaTrash, FaUser, FaUserCheck, FaAngleLeft, FaAngleRight, FaEdit, FaKey } from 'react-icons/fa';
import { users } from '../../data/admin';
import { User } from '../../types/admin';

const UsersList: React.FC = () => {
  const [allUsers] = useState<User[]>(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const usersPerPage = 10;
  
  // Filtrar usuarios por término de búsqueda y rol
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      roleFilter === 'all' ||
      (roleFilter === 'admin' && user.role === 'admin') ||
      (roleFilter === 'user' && user.role === 'user');
    
    return matchesSearch && matchesRole;
  });
  
  // Calcular páginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Formatear fecha
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Verificar usuario
  const handleVerifyUser = (userId: number) => {
    // En una implementación real, esto debería hacer una llamada a la API
    console.log(`Verificar usuario ${userId}`);
  };
  
  // Eliminar usuario
  const handleDeleteUser = (userId: number) => {
    // En una implementación real, esto debería hacer una llamada a la API
    console.log(`Eliminar usuario ${userId}`);
  };
  
  // Abrir modal para editar
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  
  // Restablecer contraseña
  const handleResetPassword = (userId: number) => {
    // En una implementación real, esto debería hacer una llamada a la API
    console.log(`Restablecer contraseña del usuario ${userId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow"
          >
            Añadir usuario
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-400">Filtrar por rol:</span>
        <div className="flex space-x-2">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm ${
              roleFilter === 'all'
                ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                : 'bg-[#1a1a23] text-gray-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-4 py-2 rounded-lg text-sm ${
              roleFilter === 'admin'
                ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                : 'bg-[#1a1a23] text-gray-400 hover:text-white'
            }`}
          >
            Administradores
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`px-4 py-2 rounded-lg text-sm ${
              roleFilter === 'user'
                ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
                : 'bg-[#1a1a23] text-gray-400 hover:text-white'
            }`}
          >
            Usuarios
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-[#121217] rounded-xl border border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr className="bg-[#1a1a23]">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Último acceso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#1a1a23] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.fullName} 
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#1a1a23] flex items-center justify-center text-gray-400">
                            <FaUser />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.fullName}</div>
                        <div className="text-sm text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-900/20 text-purple-400' 
                        : 'bg-blue-900/20 text-blue-400'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(user.lastLogin?.toString())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isVerified ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'
                    }`}>
                      {user.isVerified ? 'Verificado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#252530] transition-colors"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      {!user.isVerified && (
                        <button 
                          onClick={() => handleVerifyUser(user.id)}
                          className="p-1 rounded text-gray-400 hover:text-green-500 hover:bg-[#252530] transition-colors"
                          title="Verificar"
                        >
                          <FaUserCheck />
                        </button>
                      )}
                      <button 
                        onClick={() => handleResetPassword(user.id)}
                        className="p-1 rounded text-gray-400 hover:text-[#00CCFF] hover:bg-[#252530] transition-colors"
                        title="Restablecer contraseña"
                      >
                        <FaKey />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-[#252530] transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredUsers.length > usersPerPage && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
            <div className="text-sm text-gray-400">
              Mostrando {indexOfFirstUser + 1} - {Math.min(indexOfLastUser, filteredUsers.length)} de {filteredUsers.length} usuarios
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

      {/* Modal de edición de usuario */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121217] rounded-xl border border-gray-800 shadow-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Editar usuario</h3>
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
                  <label className="block text-sm text-gray-400 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    defaultValue={selectedUser.fullName}
                    className="w-full px-4 py-2 bg-[#1a1a23] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nombre de usuario</label>
                  <input
                    type="text"
                    defaultValue={selectedUser.username}
                    className="w-full px-4 py-2 bg-[#1a1a23] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={selectedUser.email}
                    className="w-full px-4 py-2 bg-[#1a1a23] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rol</label>
                  <select
                    defaultValue={selectedUser.role}
                    className="w-full px-4 py-2 bg-[#1a1a23] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="verified"
                  defaultChecked={selectedUser.isVerified}
                  className="rounded bg-[#1a1a23] border-gray-800 text-[#00CCFF] focus:ring-[#00CCFF] focus:ring-opacity-25"
                />
                <label htmlFor="verified" className="ml-2 text-sm text-gray-300">
                  Usuario verificado
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-[#1a1a23] border border-gray-700 text-white rounded-lg hover:bg-[#252530] transition-colors"
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white rounded-lg hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;