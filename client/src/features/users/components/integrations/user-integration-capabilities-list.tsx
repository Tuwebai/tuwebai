import { USER_INTEGRATION_CAPABILITIES, USER_INTEGRATION_STATUS_COPY } from '@/features/users/utils/user-integrations';

export function UserIntegrationCapabilitiesList() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="mb-5 space-y-2">
        <h3 className="text-lg font-semibold text-white">Canales y automatizaciones</h3>
        <p className="max-w-2xl text-sm leading-6 text-slate-300">
          Estas son las capacidades que podemos activar o implementar para ordenar mejor la captacion, el seguimiento y la conversion de tus leads.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {USER_INTEGRATION_CAPABILITIES.map((capability) => {
          const status = USER_INTEGRATION_STATUS_COPY[capability.status];
          const Icon = capability.icon;

          return (
            <article
              key={capability.id}
              className="rounded-xl border border-white/10 bg-slate-950/30 p-4 sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-white sm:text-base">{capability.title}</h4>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{capability.description}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
