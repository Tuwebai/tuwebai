import { CheckCircle2, Clock3, Sparkles } from 'lucide-react';

export function UserIntegrationsRoadmapCard() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-white">
        <Sparkles className="h-5 w-5 text-violet-300" />
        <h3 className="text-lg font-semibold">Como trabajamos esta activacion</h3>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            Diagnostico del canal
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Revisamos donde estas perdiendo consultas o seguimiento para priorizar la integracion que mas impacto puede tener.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            Definicion operativa
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Bajamos la implementacion a un flujo real: captacion, automatizacion, medicion y seguimiento comercial.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-amber-300">
            <Clock3 className="h-4 w-4" />
            Roadmap actual
          </div>
          <p className="text-sm leading-6 text-amber-200/90">
            Esta tab ya no expone funciones falsas. En esta etapa muestra capacidades reales del servicio y sirve como punto de activacion comercial. La conexion con backend y estados por cuenta queda para el siguiente slice.
          </p>
        </div>
      </div>
    </section>
  );
}
