import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaSave, FaUndo, FaKey, FaDatabase, FaEnvelope, FaFileAlt, FaToggleOn, FaCog } from 'react-icons/fa';

const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'storage' | 'notifications' | 'appearance'>('general');

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Configuración</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 mb-6 md:mb-0 md:mr-8">
            <div className="bg-[#121217] rounded-xl border border-gray-800 p-4">
              <div className="space-y-1">
                <TabButton 
                  active={activeTab === 'general'} 
                  onClick={() => setActiveTab('general')}
                  icon={<FaCog />}
                  label="General"
                />
                <TabButton 
                  active={activeTab === 'security'} 
                  onClick={() => setActiveTab('security')}
                  icon={<FaKey />}
                  label="Seguridad"
                />
                <TabButton 
                  active={activeTab === 'storage'} 
                  onClick={() => setActiveTab('storage')}
                  icon={<FaDatabase />}
                  label="Almacenamiento"
                />
                <TabButton 
                  active={activeTab === 'notifications'} 
                  onClick={() => setActiveTab('notifications')}
                  icon={<FaEnvelope />}
                  label="Notificaciones"
                />
                <TabButton 
                  active={activeTab === 'appearance'} 
                  onClick={() => setActiveTab('appearance')}
                  icon={<FaFileAlt />}
                  label="Apariencia"
                />
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            <div className="bg-[#121217] rounded-xl border border-gray-800 p-6">
              {activeTab === 'general' && (
                <GeneralSettings />
              )}
              {activeTab === 'security' && (
                <SecuritySettings />
              )}
              {activeTab === 'storage' && (
                <StorageSettings />
              )}
              {activeTab === 'notifications' && (
                <NotificationSettings />
              )}
              {activeTab === 'appearance' && (
                <AppearanceSettings />
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-lg text-left ${
        active
          ? 'bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 text-white border-l-4 border-[#00CCFF]'
          : 'text-gray-400 hover:bg-[#1a1a23] hover:text-white'
      }`}
    >
      <span className="mr-3 text-lg">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
};

const GeneralSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Configuración General</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Nombre del sitio</label>
            <input
              type="text"
              defaultValue="TuWeb.ai"
              className="w-full px-4 py-2 bg-[#1a1a23] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">URL del sitio</label>
            <input
              type="text"
              defaultValue="https://tuwebai.com"
              className="w-full px-4 py-2 bg-[#1a1a23] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Descripción del sitio</label>
          <textarea
            rows={3}
            defaultValue="Agencia especializada en desarrollo web y servicios de marketing digital que ayuda a empresas a crecer en el entorno digital."
            className="w-full px-4 py-2 bg-[#1a1a23] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white resize-none"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Email de contacto</label>
          <input
            type="email"
            defaultValue="info@tuwebai.com"
            className="w-full px-4 py-2 bg-[#1a1a23] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Zona horaria</label>
          <select
            className="w-full px-4 py-2 bg-[#1a1a23] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
            defaultValue="Europe/Madrid"
          >
            <option value="Europe/Madrid">Europe/Madrid (UTC+01:00)</option>
            <option value="Europe/London">Europe/London (UTC+00:00)</option>
            <option value="America/New_York">America/New_York (UTC-05:00)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (UTC-08:00)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (UTC+09:00)</option>
          </select>
        </div>
        
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow flex items-center">
            <FaSave className="mr-2" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

const SecuritySettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Configuración de Seguridad</h3>
      
      <div className="space-y-6">
        <div className="bg-[#1a1a23] rounded-lg p-4 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Política de contraseñas</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Longitud mínima de contraseña</p>
                <p className="text-sm text-gray-500">Número mínimo de caracteres requeridos</p>
              </div>
              <select
                className="px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                defaultValue="8"
              >
                <option value="6">6 caracteres</option>
                <option value="8">8 caracteres</option>
                <option value="10">10 caracteres</option>
                <option value="12">12 caracteres</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="require_numbers"
                defaultChecked={true}
                className="rounded bg-[#121217] border-gray-800 text-[#00CCFF] focus:ring-[#00CCFF] focus:ring-opacity-25"
              />
              <label htmlFor="require_numbers" className="ml-2 text-gray-300">
                Requerir al menos un número
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="require_special"
                defaultChecked={true}
                className="rounded bg-[#121217] border-gray-800 text-[#00CCFF] focus:ring-[#00CCFF] focus:ring-opacity-25"
              />
              <label htmlFor="require_special" className="ml-2 text-gray-300">
                Requerir al menos un carácter especial
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="require_uppercase"
                defaultChecked={true}
                className="rounded bg-[#121217] border-gray-800 text-[#00CCFF] focus:ring-[#00CCFF] focus:ring-opacity-25"
              />
              <label htmlFor="require_uppercase" className="ml-2 text-gray-300">
                Requerir al menos una letra mayúscula
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1a1a23] rounded-lg p-4 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Sesiones</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Duración máxima de sesión</p>
                <p className="text-sm text-gray-500">Tiempo antes de cerrar sesión automáticamente</p>
              </div>
              <select
                className="px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                defaultValue="24"
              >
                <option value="1">1 hora</option>
                <option value="8">8 horas</option>
                <option value="24">24 horas</option>
                <option value="168">7 días</option>
                <option value="720">30 días</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="session_ip"
                defaultChecked={true}
                className="rounded bg-[#121217] border-gray-800 text-[#00CCFF] focus:ring-[#00CCFF] focus:ring-opacity-25"
              />
              <label htmlFor="session_ip" className="ml-2 text-gray-300">
                Validar IP para sesiones activas
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1a1a23] rounded-lg p-4 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Intentos de inicio de sesión</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Intentos máximos</p>
                <p className="text-sm text-gray-500">Antes de bloquear temporalmente</p>
              </div>
              <select
                className="px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                defaultValue="5"
              >
                <option value="3">3 intentos</option>
                <option value="5">5 intentos</option>
                <option value="10">10 intentos</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Duración del bloqueo</p>
                <p className="text-sm text-gray-500">Tiempo de espera antes de reintentar</p>
              </div>
              <select
                className="px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                defaultValue="15"
              >
                <option value="5">5 minutos</option>
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow flex items-center">
            <FaSave className="mr-2" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

const StorageSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Configuración de Almacenamiento</h3>
      
      <div className="space-y-6">
        <div className="bg-[#1a1a23] rounded-lg p-6 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Uso de almacenamiento</h4>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Espacio utilizado</span>
              <span className="text-white">2.7 GB / 10 GB</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full" style={{ width: '27%' }}></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Imágenes</span>
              <span className="text-gray-300">1.4 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Documentos PDF</span>
              <span className="text-gray-300">0.8 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vídeos</span>
              <span className="text-gray-300">0.3 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Otros archivos</span>
              <span className="text-gray-300">0.2 GB</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1a1a23] rounded-lg p-4 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Política de archivos</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Tamaño máximo de archivo</p>
                <p className="text-sm text-gray-500">Límite para subidas individuales</p>
              </div>
              <select
                className="px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                defaultValue="10"
              >
                <option value="5">5 MB</option>
                <option value="10">10 MB</option>
                <option value="20">20 MB</option>
                <option value="50">50 MB</option>
                <option value="100">100 MB</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Tipos de archivos permitidos</p>
                <p className="text-sm text-gray-500">Formatos de archivo que se pueden subir</p>
              </div>
              <button className="px-3 py-1.5 bg-[#121217] border border-gray-800 rounded-lg text-white hover:bg-[#1f1f2c] transition-colors">
                Configurar
              </button>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="optimize_images"
                defaultChecked={true}
                className="rounded bg-[#121217] border-gray-800 text-[#00CCFF] focus:ring-[#00CCFF] focus:ring-opacity-25"
              />
              <label htmlFor="optimize_images" className="ml-2 text-gray-300">
                Optimizar imágenes automáticamente
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1a1a23] rounded-lg p-4 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Respaldo y limpieza</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Programar respaldo automático</p>
                <p className="text-sm text-gray-500">Frecuencia de copia de seguridad</p>
              </div>
              <select
                className="px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                defaultValue="7"
              >
                <option value="1">Diariamente</option>
                <option value="7">Semanalmente</option>
                <option value="30">Mensualmente</option>
                <option value="0">Desactivado</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Retención de respaldos</p>
                <p className="text-sm text-gray-500">Cuánto tiempo mantener las copias</p>
              </div>
              <select
                className="px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                defaultValue="90"
              >
                <option value="30">30 días</option>
                <option value="90">90 días</option>
                <option value="180">180 días</option>
                <option value="365">1 año</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Limpiar archivos temporales</p>
                <p className="text-sm text-gray-500">Eliminar archivos no usados</p>
              </div>
              <button className="px-3 py-1.5 bg-[#121217] border border-gray-800 rounded-lg text-white hover:bg-[#1f1f2c] transition-colors">
                Limpiar ahora
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow flex items-center">
            <FaSave className="mr-2" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Configuración de Notificaciones</h3>
      
      <div className="space-y-6">
        <div className="bg-[#1a1a23] rounded-lg p-4 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Notificaciones por email</h4>
          
          <div className="space-y-4">
            <ToggleSetting 
              label="Nuevos contactos" 
              description="Recibir email cuando se envía un formulario de contacto" 
              defaultChecked={true} 
            />
            
            <ToggleSetting 
              label="Nuevas consultas" 
              description="Recibir email cuando se solicita una consulta de proyecto" 
              defaultChecked={true} 
            />
            
            <ToggleSetting 
              label="Suscriptores newsletter" 
              description="Recibir email cuando alguien se suscribe al newsletter" 
              defaultChecked={false} 
            />
            
            <ToggleSetting 
              label="Registro de usuarios" 
              description="Recibir email cuando se registra un nuevo usuario" 
              defaultChecked={true} 
            />
          </div>
        </div>
        
        <div className="bg-[#1a1a23] rounded-lg p-4 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Notificaciones de sistema</h4>
          
          <div className="space-y-4">
            <ToggleSetting 
              label="Notificaciones en panel" 
              description="Mostrar notificaciones en el panel de administración" 
              defaultChecked={true} 
            />
            
            <ToggleSetting 
              label="Resumen diario" 
              description="Recibir un resumen diario de actividad por email" 
              defaultChecked={false} 
            />
            
            <ToggleSetting 
              label="Alertas de seguridad" 
              description="Recibir notificaciones sobre intentos de acceso sospechosos" 
              defaultChecked={true} 
            />
          </div>
        </div>
        
        <div className="bg-[#1a1a23] rounded-lg p-4 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Configuración de email</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email de notificaciones</label>
              <input
                type="email"
                defaultValue="notificaciones@tuwebai.com"
                className="w-full px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nombre del remitente</label>
              <input
                type="text"
                defaultValue="TuWeb.ai Notificaciones"
                className="w-full px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Probar configuración</p>
                <p className="text-sm text-gray-500">Enviar un email de prueba</p>
              </div>
              <button className="px-3 py-1.5 bg-[#121217] border border-gray-800 rounded-lg text-white hover:bg-[#1f1f2c] transition-colors">
                Enviar prueba
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow flex items-center">
            <FaSave className="mr-2" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToggleSettingProps {
  label: string;
  description: string;
  defaultChecked: boolean;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({ label, description, defaultChecked }) => {
  const [checked, setChecked] = useState(defaultChecked);
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-300">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`text-2xl ${checked ? 'text-[#00CCFF]' : 'text-gray-600'}`}
      >
        <FaToggleOn className={`transform transition-transform ${!checked ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

const AppearanceSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Configuración de Apariencia</h3>
      
      <div className="space-y-6">
        <div className="bg-[#1a1a23] rounded-lg p-4 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Tema</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="radio"
                name="theme"
                id="theme_dark"
                defaultChecked
                className="sr-only"
              />
              <label 
                htmlFor="theme_dark"
                className="block cursor-pointer rounded-lg border-2 border-[#00CCFF] p-2"
              >
                <div className="bg-[#0a0a0f] h-20 rounded-md flex items-end p-2">
                  <div className="w-full h-4 bg-[#121217] rounded"></div>
                </div>
                <div className="mt-2 text-center text-sm">Oscuro</div>
              </label>
            </div>
            
            <div className="relative">
              <input
                type="radio"
                name="theme"
                id="theme_light"
                className="sr-only"
              />
              <label 
                htmlFor="theme_light"
                className="block cursor-pointer rounded-lg border-2 border-gray-800 hover:border-gray-700 p-2"
              >
                <div className="bg-gray-100 h-20 rounded-md flex items-end p-2">
                  <div className="w-full h-4 bg-white rounded"></div>
                </div>
                <div className="mt-2 text-center text-sm">Claro</div>
              </label>
            </div>
            
            <div className="relative">
              <input
                type="radio"
                name="theme"
                id="theme_system"
                className="sr-only"
              />
              <label 
                htmlFor="theme_system"
                className="block cursor-pointer rounded-lg border-2 border-gray-800 hover:border-gray-700 p-2"
              >
                <div className="bg-gradient-to-r from-[#0a0a0f] to-gray-100 h-20 rounded-md flex items-end p-2">
                  <div className="w-full h-4 bg-gradient-to-r from-[#121217] to-white rounded"></div>
                </div>
                <div className="mt-2 text-center text-sm">Sistema</div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1a1a23] rounded-lg p-4 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Colores principales</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Color primario</label>
              <div className="flex">
                <span className="inline-block w-10 h-10 rounded-l border border-gray-800 bg-[#00CCFF]"></span>
                <input
                  type="text"
                  defaultValue="#00CCFF"
                  className="flex-1 px-4 py-2 bg-[#121217] border border-gray-800 border-l-0 rounded-r focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Color secundario</label>
              <div className="flex">
                <span className="inline-block w-10 h-10 rounded-l border border-gray-800 bg-[#9933FF]"></span>
                <input
                  type="text"
                  defaultValue="#9933FF"
                  className="flex-1 px-4 py-2 bg-[#121217] border border-gray-800 border-l-0 rounded-r focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-[#121217] rounded-lg mb-4">
            <h5 className="text-sm font-medium mb-2">Vista previa</h5>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white">
                Botón primario
              </div>
              <div className="px-4 py-2 bg-[#1a1a23] border border-gray-800 rounded-lg text-white">
                Botón secundario
              </div>
              <div className="px-4 py-2 rounded-lg text-transparent bg-clip-text bg-gradient-to-r from-[#00CCFF] to-[#9933FF] font-bold">
                Texto con gradiente
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1a1a23] rounded-lg p-4 border border-gray-800">
          <h4 className="text-lg font-medium mb-4">Fuentes</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Familia de fuente principal</label>
              <select
                className="w-full px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                defaultValue="Inter"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Poppins">Poppins</option>
                <option value="OpenSans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Familia de fuente para títulos</label>
              <select
                className="w-full px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                defaultValue="Rajdhani"
              >
                <option value="Rajdhani">Rajdhani</option>
                <option value="Roboto">Roboto</option>
                <option value="Poppins">Poppins</option>
                <option value="OpenSans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Tamaño base de fuente</p>
                <p className="text-sm text-gray-500">Para texto normal del sitio</p>
              </div>
              <select
                className="px-4 py-2 bg-[#121217] border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white"
                defaultValue="16"
              >
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button className="px-4 py-2 bg-[#1a1a23] border border-gray-800 text-white rounded-lg hover:bg-[#252530] transition-colors flex items-center">
            <FaUndo className="mr-2" />
            Restablecer por defecto
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow flex items-center">
            <FaSave className="mr-2" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;