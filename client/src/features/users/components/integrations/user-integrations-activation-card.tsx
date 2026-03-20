import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircleMore } from 'lucide-react';

import {
  TUWEBAI_WHATSAPP_DISPLAY,
  TUWEBAI_WHATSAPP_URL,
} from '@/shared/constants/contact';

export function UserIntegrationsActivationCard() {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/70 to-fuchsia-500/10 p-5 sm:p-6">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
          Activacion guiada
        </span>
        <h3 className="text-lg font-semibold text-white">Converti esta tab en un canal real de crecimiento</h3>
        <p className="text-sm leading-6 text-slate-300">
          Si ya tenes claro que canal queres activar, avanzamos con una propuesta concreta. Si todavia no lo definiste, te orientamos segun tu embudo, tu operativa y el tipo de cliente que queres captar.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          to="/consulta"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          Solicitar activacion
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>

        <a
          href={TUWEBAI_WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          <MessageCircleMore className="mr-2 h-4 w-4" />
          WhatsApp {TUWEBAI_WHATSAPP_DISPLAY}
        </a>
      </div>
    </section>
  );
}
