interface ShowroomModalNavButtonProps {
  ariaLabel: string;
  direction: 'prev' | 'next';
  disabled: boolean;
  label?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  compact?: boolean;
}

export default function ShowroomModalNavButton({
  ariaLabel,
  direction,
  disabled,
  label,
  onClick,
  compact = false,
}: ShowroomModalNavButtonProps) {
  const isPrev = direction === 'prev';
  const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" className={compact ? 'h-4 w-4' : 'h-6 w-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.2}
        d={isPrev ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
      />
    </svg>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={
        compact
          ? 'editorial-secondary-button gap-2 px-3 py-2 text-xs font-medium'
          : 'editorial-icon-button absolute top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 shadow-[var(--shadow-elevated)] xl:flex'
      }
    >
      {compact && isPrev ? icon : null}
      {label}
      {!compact ? icon : null}
      {compact && !isPrev ? icon : null}
    </button>
  );
}
