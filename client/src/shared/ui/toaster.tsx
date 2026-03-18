import { useEffect } from 'react';
import { X } from 'lucide-react';

import { useToast } from '@/shared/ui/use-toast';

const DEFAULT_DURATION = 5000;

const toastVariantClasses: Record<'default' | 'destructive', string> = {
  default: 'border-white/10 bg-[#10131d]/95 text-white',
  destructive: 'border-red-500/30 bg-[#2a1014]/95 text-red-50',
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  useEffect(() => {
    const timers = toasts
      .filter((toast) => toast.open !== false)
      .map((toast) =>
        window.setTimeout(() => {
          toast.onOpenChange?.(false);
          dismiss(toast.id);
        }, toast.duration ?? DEFAULT_DURATION)
      );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [dismiss, toasts]);

  const visibleToasts = toasts.filter((toast) => toast.open !== false);

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed top-4 z-[100] flex max-h-screen w-full flex-col-reverse gap-3 p-4 sm:bottom-4 sm:right-4 sm:top-auto sm:w-auto sm:max-w-[420px] sm:flex-col"
      aria-live="polite"
      aria-atomic="true"
    >
      {visibleToasts.map(({ id, title, description, action, variant = 'default', className }) => (
        <div
          key={id}
          role="status"
          className={`pointer-events-auto relative flex w-full items-start justify-between gap-4 overflow-hidden rounded-2xl border p-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-opacity ${toastVariantClasses[variant]} ${className ?? ''}`}
        >
          <div className="grid gap-1 pr-6">
            {title && <p className="text-sm font-semibold leading-5">{title}</p>}
            {description && <div className="text-sm leading-6 opacity-90">{description}</div>}
            {action && <div className="pt-2">{action}</div>}
          </div>

          <button
            type="button"
            onClick={() => {
              dismiss(id);
            }}
            className="rounded-full p-1 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Cerrar notificacion"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
