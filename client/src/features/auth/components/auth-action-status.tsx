interface AuthActionStatusProps {
  title: string;
  description: string;
  tone?: 'success' | 'error' | 'info';
  ctaLabel?: string;
  onCtaClick?: () => void;
}

const toneClasses: Record<NonNullable<AuthActionStatusProps['tone']>, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  error: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
};

export function AuthActionStatus({
  title,
  description,
  tone = 'info',
  ctaLabel,
  onCtaClick,
}: AuthActionStatusProps) {
  return (
    <div className={`rounded-2xl border p-5 text-center ${toneClasses[tone]}`}>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-200">{description}</p>

      {ctaLabel && onCtaClick && (
        <button
          type="button"
          onClick={onCtaClick}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
