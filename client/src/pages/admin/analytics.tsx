import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { dashboardStats } from '../../data/admin';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminAnalyticsPage: React.FC = () => {
  const stats = dashboardStats;
  
  // Datos para gráfico de pastel de fuentes de newsletter
  const newsletterSourcesData = [
    { name: 'Homepage', value: 42 },
    { name: 'Blog', value: 28 },
    { name: 'Footer', value: 15 },
    { name: 'Popup', value: 10 },
    { name: 'Recursos', value: 5 },
  ];
  
  // Colores para el gráfico de pastel
  const COLORS = ['#00CCFF', '#9933FF', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Datos para gráfico de barras de descargas por tipo de recurso
  const resourceDownloadsData = [
    { name: 'PDF', downloads: 583 },
    { name: 'Plantillas', downloads: 327 },
    { name: 'Infografías', downloads: 164 },
    { name: 'Guías', downloads: 121 },
    { name: 'Webinars', downloads: 48 },
  ];

  // Datos para los visitantes por página
  const pageViewsData = [
    { name: 'Home', views: 4287 },
    { name: 'Servicios', views: 2853 },
    { name: 'Blog', views: 1962 },
    { name: 'Recursos', views: 1547 },
    { name: 'Contacto', views: 876 },
    { name: 'Consulta', views: 642 },
    { name: 'Tecnologías', views: 532 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analíticas</h2>
          <div className="flex space-x-4">
            <select className="px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white">
              <option value="30">Últimos 30 días</option>
              <option value="60">Últimos 60 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="180">Últimos 6 meses</option>
              <option value="365">Último año</option>
            </select>
          </div>
        </div>

        {/* Gráficos de contactos y consultas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#121217] rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4">Contactos recibidos</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.contactsPerDay}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00CCFF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00CCFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                  <XAxis dataKey="date" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a23', borderColor: '#374151', color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="Contactos" 
                    stroke="#00CCFF" 
                    fillOpacity={1} 
                    fill="url(#colorContacts)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-[#121217] rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4">Consultas de proyectos</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.consultationsPerDay}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9933FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9933FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                  <XAxis dataKey="date" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a23', borderColor: '#374151', color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="Consultas" 
                    stroke="#9933FF" 
                    fillOpacity={1} 
                    fill="url(#colorConsultations)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráficos adicionales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#121217] rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4">Fuentes de suscriptores</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={newsletterSourcesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {newsletterSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a23', borderColor: '#374151', color: '#fff' }}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-[#121217] rounded-xl border border-gray-800 p-6 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Descargas por tipo de recurso</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resourceDownloadsData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a23', borderColor: '#374151', color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="downloads" name="Descargas" fill="#00CCFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Visitas por página */}
        <div className="bg-[#121217] rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Visitas por página</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pageViewsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                <XAxis type="number" tick={{ fill: '#9ca3af' }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af' }} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a23', borderColor: '#374151', color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="views" name="Visitas" fill="#9933FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;