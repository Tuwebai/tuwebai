import { AlertCircle, Globe } from 'lucide-react';

const CONNECTED_SERVICES = [
  {
    name: 'Google',
    status: 'No conectado',
    accentClassName: 'bg-red-500',
    badge: 'G',
  },
  {
    name: 'Facebook',
    status: 'No conectado',
    accentClassName: 'bg-blue-500',
    badge: 'F',
  },
  {
    name: 'GitHub',
    status: 'No conectado',
    accentClassName: 'bg-black',
    badge: 'G',
  },
];

export function UserIntegrationsTab() {
  return (
    <div className="space-y-6">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
        <Globe className="h-5 w-5" />
        Integraciones y conexiones
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 text-lg font-medium text-white">Servicios conectados</h3>
          <div className="space-y-4">
            {CONNECTED_SERVICES.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between rounded-lg bg-white/5 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${service.accentClassName}`}
                  >
                    <span className="text-sm font-bold text-white">{service.badge}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{service.name}</p>
                    <p className="text-sm text-gray-400">{service.status}</p>
                  </div>
                </div>
                <button className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white transition-all hover:bg-blue-600">
                  Conectar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 text-lg font-medium text-white">API keys</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-white/5 p-3">
              <p className="mb-2 text-sm text-gray-300">API key de desarrollo</p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value="••••••••••••••••••••••••••••••••"
                  className="flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white"
                  readOnly
                />
                <button className="rounded-lg bg-gray-600 px-3 py-2 text-sm text-white transition-all hover:bg-gray-700">
                  Copiar
                </button>
              </div>
            </div>
            <button className="w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-all hover:bg-blue-600">
              Generar nueva API key
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-6">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-medium text-yellow-400">
          <AlertCircle className="h-5 w-5" />
          Proximamente
        </h3>
        <p className="text-sm text-yellow-300">
          Las integraciones con servicios externos estaran disponibles proximamente. Esto te
          permitira conectar tu cuenta con otras plataformas y servicios.
        </p>
      </div>
    </div>
  );
}
