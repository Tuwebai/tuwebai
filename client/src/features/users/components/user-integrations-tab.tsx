import { Globe } from 'lucide-react';

import { UserIntegrationCapabilitiesList } from '@/features/users/components/integrations/user-integration-capabilities-list';
import { UserIntegrationsActivationCard } from '@/features/users/components/integrations/user-integrations-activation-card';
import { UserIntegrationsRoadmapCard } from '@/features/users/components/integrations/user-integrations-roadmap-card';

export function UserIntegrationsTab() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-white">
          <Globe className="h-5 w-5 text-cyan-300" />
          <h2 className="text-xl font-semibold">Canales y automatizaciones</h2>
        </div>
        <p className="max-w-3xl text-sm leading-6 text-slate-300">
          Esta seccion muestra capacidades que podemos activar para mejorar la captacion, el seguimiento y la conversion de oportunidades dentro de tu negocio. No expone funciones tecnicas falsas ni conexiones que todavia no existan en produccion.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,_1.25fr)_minmax(320px,_0.85fr)]">
        <UserIntegrationCapabilitiesList />
        <div className="space-y-6">
          <UserIntegrationsActivationCard />
          <UserIntegrationsRoadmapCard />
        </div>
      </div>
    </div>
  );
}
