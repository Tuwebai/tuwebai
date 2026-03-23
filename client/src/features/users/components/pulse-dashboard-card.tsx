import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { usePulseAccessStatus } from '@/features/users/hooks/use-pulse-access-status';
import { usePulsePreview } from '@/features/users/hooks/use-pulse-preview';
import { openPulseAccess } from '@/features/users/services/pulse.service';

interface PulseDashboardCardProps {
  email?: string;
}

function PulseLogo() {
  return (
    <svg
      aria-label="Pulse"
      className="h-11 w-11"
      role="img"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="tuwebai-pulse-card-clip">
          <circle cx="50" cy="50" r="37" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" fill="none" r="38" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
      <g clipPath="url(#tuwebai-pulse-card-clip)">
        <path
          d="M12 50 L26 50 L34 26 L44 74 L52 38 L60 50 L88 50"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <circle cx="60" cy="50" fill="#00CCFF" r="2.5" />
    </svg>
  );
}

export function PulseDashboardCard({ email }: PulseDashboardCardProps) {
  const { data, isLoading, isError } = usePulsePreview(email);
  const {
    data: pulseAccess,
    isLoading: isLoadingPulseAccess,
  } = usePulseAccessStatus(email);
  const [isOpeningPulse, setIsOpeningPulse] = useState(false);

  const isPendingActivation = pulseAccess?.status === 'pending_activation';

  const handleOpenPulse = async () => {
    setIsOpeningPulse(true);

    try {
      await openPulseAccess(email);
    } finally {
      setIsOpeningPulse(false);
    }
  };

  const previewCopy = (() => {
    if (isLoading) {
      return <Skeleton className="h-6 w-40 bg-white/10" />;
    }

    if (!isError && data?.hasData && typeof data.visits === 'number' && data.month) {
      return (
        <div className="space-y-1">
          <p className="text-sm text-cyan-100">
            <span className="font-semibold text-white">{data.visits.toLocaleString('es-AR')} visitas</span> este mes
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{data.month}</p>
        </div>
      );
    }

    return <p className="text-sm text-slate-300">Los datos aparecen despues de la entrega</p>;
  })();

  return (
    <section className="mb-6 sm:mb-8">
      <div className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_40%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(17,24,39,0.94))] shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
        <div className="flex h-full flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <PulseLogo />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-cyan-100">
                  Pulse
                </span>
                <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">by TuWebAI</span>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-white sm:text-2xl">Ver el rendimiento de tu web</h2>
                {previewCopy}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {isLoading || isLoadingPulseAccess ? (
              <Skeleton className="h-10 w-full rounded-md bg-white/10 sm:w-36" />
            ) : null}

            {isPendingActivation ? (
              <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100">
                Pendiente de activacion
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  void handleOpenPulse();
                }}
                disabled={isOpeningPulse}
                className="min-w-[170px] bg-white text-slate-950 hover:bg-cyan-100"
              >
                {isOpeningPulse ? (
                  'Abriendo Pulse...'
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    Abrir Pulse -&gt;
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
