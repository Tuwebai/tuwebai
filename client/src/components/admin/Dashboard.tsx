import React from 'react';
import { FaUsers, FaEnvelope, FaFileAlt, FaNewspaper, FaDownload } from 'react-icons/fa';
import { dashboardStats } from '../../data/admin';

const Dashboard: React.FC = () => {
  const stats = dashboardStats;

  // Formato de fechas para el dashboard
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="text-sm text-gray-400">
          Última actualización: {new Date().toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Usuarios registrados" 
          value={stats.totalUsers} 
          icon={<FaUsers className="text-blue-500" />} 
          change={"+12%"} 
          trend="up"
          color="blue"
        />
        <StatCard 
          title="Contactos" 
          value={stats.totalContacts} 
          icon={<FaEnvelope className="text-purple-500" />} 
          change={"+8%"} 
          trend="up"
          color="purple"
        />
        <StatCard 
          title="Consultas" 
          value={stats.totalConsultations} 
          icon={<FaFileAlt className="text-green-500" />} 
          change={"+15%"} 
          trend="up"
          color="green"
        />
        <StatCard 
          title="Suscriptores" 
          value={stats.activeNewsletterSubscribers} 
          icon={<FaNewspaper className="text-yellow-500" />} 
          secondaryValue={`${Math.round((stats.activeNewsletterSubscribers / stats.totalNewsletterSubscribers) * 100)}% activos`}
          color="yellow"
        />
        <StatCard 
          title="Descargas" 
          value={stats.resourceDownloads} 
          icon={<FaDownload className="text-red-500" />} 
          change={"+32%"} 
          trend="up"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos contactos */}
        <div className="bg-[#121217] rounded-xl border border-gray-800 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="font-semibold">Últimos contactos</h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Asunto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {stats.recentContacts.map((contact) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <a href="/admin/contacts" className="text-[#00CCFF] text-sm hover:underline">
                Ver todos los contactos
              </a>
            </div>
          </div>
        </div>

        {/* Últimas consultas */}
        <div className="bg-[#121217] rounded-xl border border-gray-800 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="font-semibold">Últimas consultas</h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Proyecto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Presupuesto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {stats.recentConsultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-[#1a1a23] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-medium text-white">{consultation.name}</div>
                        <div className="text-gray-400 text-xs">{consultation.business}</div>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <a href="/admin/consultations" className="text-[#00CCFF] text-sm hover:underline">
                Ver todas las consultas
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  secondaryValue?: string;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  trend, 
  secondaryValue,
  color
}) => {
  // Función para obtener color según la tendencia
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-400';
  };

  // Función para obtener el gradiente según el color
  const getGradient = () => {
    switch (color) {
      case 'blue': return 'from-blue-900/20 to-transparent';
      case 'green': return 'from-green-900/20 to-transparent';
      case 'red': return 'from-red-900/20 to-transparent';
      case 'yellow': return 'from-yellow-900/20 to-transparent';
      case 'purple': return 'from-purple-900/20 to-transparent';
      default: return 'from-gray-900/20 to-transparent';
    }
  };

  return (
    <div className={`bg-[#121217] rounded-xl border border-gray-800 shadow-sm overflow-hidden`}>
      <div className={`px-6 py-5 bg-gradient-to-br ${getGradient()}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <h4 className="text-2xl font-bold mt-1">{value.toLocaleString()}</h4>
            {secondaryValue && (
              <p className="text-xs text-gray-400 mt-1">{secondaryValue}</p>
            )}
            {change && (
              <p className={`text-xs mt-1 ${getTrendColor()}`}>
                {change} {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''}
              </p>
            )}
          </div>
          <div className="p-3 rounded-full bg-[#1a1a23]">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;