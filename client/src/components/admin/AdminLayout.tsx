import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaEnvelope, 
  FaUsers, 
  FaFileAlt, 
  FaNewspaper, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaBell
} from 'react-icons/fa';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaHome /> },
    { path: '/admin/contacts', label: 'Contactos', icon: <FaEnvelope /> },
    { path: '/admin/consultations', label: 'Consultas', icon: <FaFileAlt /> },
    { path: '/admin/users', label: 'Usuarios', icon: <FaUsers /> },
    { path: '/admin/newsletter', label: 'Newsletter', icon: <FaNewspaper /> },
    { path: '/admin/analytics', label: 'Analíticas', icon: <FaChartBar /> },
    { path: '/admin/settings', label: 'Configuración', icon: <FaCog /> },
  ];

  const handleLogout = () => {
    // Implementación del logout (llamada a la API, limpiar el estado, etc.)
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#121217] text-white">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0f] shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link to="/admin" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-transparent bg-clip-text">
              TuWeb.ai
            </span>
            <span className="ml-2 text-sm text-gray-400">Admin</span>
          </Link>
          <button 
            className="p-1 rounded-md md:hidden focus:outline-none focus:ring-1 focus:ring-[#00CCFF]"
            onClick={toggleSidebar}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 text-white border-l-4 border-[#00CCFF]'
                  : 'text-gray-400 hover:bg-[#1a1a23] hover:text-white'
              }`}
            >
              <span className="mr-3 text-lg">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 text-gray-400 hover:bg-[#1a1a23] hover:text-white"
          >
            <span className="mr-3 text-lg">
              <FaSignOutAlt />
            </span>
            Cerrar sesión
          </button>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" 
                alt="Admin" 
                className="w-8 h-8 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium">Administrador</p>
                <p className="text-xs text-gray-500">admin@tuwebai.com</p>
              </div>
            </div>
            <button 
              onClick={toggleDarkMode} 
              className="p-1 rounded-full bg-[#1a1a23] text-gray-400 hover:text-white focus:outline-none"
            >
              {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-[#121217] border-b border-gray-800 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button 
                className="p-2 rounded-md md:hidden focus:outline-none focus:ring-1 focus:ring-[#00CCFF]"
                onClick={toggleSidebar}
              >
                <FaBars className="w-5 h-5" />
              </button>
              <h1 className="ml-4 text-xl font-semibold">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-[#1a1a23] text-gray-400 hover:text-white relative">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center">
                <img 
                  src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" 
                  alt="Admin" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2 text-sm font-medium">Administrador</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0f] p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;