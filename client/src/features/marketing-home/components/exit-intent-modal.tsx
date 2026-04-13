import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  trackExitIntentConverted,
  trackExitIntentDismissed,
  trackExitIntentOpened,
} from '@/features/marketing-home/services/marketing-home-analytics.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

interface ExitIntentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExitIntentModal({ open, onOpenChange }: ExitIntentModalProps) {
  useEffect(() => {
    if (open) {
      trackExitIntentOpened();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[var(--bg-overlay)] p-0 text-white shadow-[var(--shadow-modal)] sm:max-w-[640px]">
        <div className="editorial-surface-panel rounded-[28px] p-8">
          <DialogHeader className="space-y-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--signal)]">
              Antes de irte
            </p>
            <DialogTitle className="font-rajdhani text-4xl font-bold leading-[0.95] text-white">
              Tu web puede estar perdiendo clientes sin que lo veas.
            </DialogTitle>
            <DialogDescription className="max-w-2xl text-base leading-7 text-gray-300">
              Revisamos tu sitio, detectamos fricción comercial y te devolvemos un diagnóstico
              claro para que entiendas qué está frenando resultados.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="editorial-surface-card rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Tiempo</p>
              <p className="mt-2 font-rajdhani text-2xl font-bold text-white">48h</p>
            </div>
            <div className="editorial-surface-card rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Formato</p>
              <p className="mt-2 font-rajdhani text-2xl font-bold text-white">Diagnóstico</p>
            </div>
            <div className="editorial-surface-card rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Foco</p>
              <p className="mt-2 font-rajdhani text-2xl font-bold text-white">Conversión</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/diagnostico-gratuito"
              onClick={() => {
                trackExitIntentConverted();
                onOpenChange(false);
              }}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]"
            >
              Ver mi diagnóstico gratis
            </Link>

            <button
              type="button"
              onClick={() => {
                trackExitIntentDismissed();
                onOpenChange(false);
              }}
              className="editorial-secondary-button min-h-12 px-6 py-3 text-sm font-medium"
            >
              Seguir explorando
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
