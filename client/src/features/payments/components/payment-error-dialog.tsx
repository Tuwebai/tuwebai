import PaymentModalFrame from '@/features/payments/components/payment-modal-frame';

interface PaymentErrorDialogProps {
  open: boolean;
  message: string | null;
  onRetry: () => void;
  onClose: () => void;
}

export default function PaymentErrorDialog({
  open,
  message,
  onRetry,
  onClose,
}: PaymentErrorDialogProps) {
  return (
    <PaymentModalFrame
      open={open}
      title="Error al procesar el pago"
      onClose={onClose}
    >
      <p className="text-sm leading-6 text-gray-300">
        {message || 'No se pudo completar la operacion con Mercado Pago.'}
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-[var(--signal-border)] hover:bg-[var(--bg-subtle)]"
        >
          Cerrar
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-[image:var(--gradient-brand)] px-4 py-2 text-sm font-medium text-white shadow-[var(--glow-signal)]"
        >
          Reintentar
        </button>
      </div>
    </PaymentModalFrame>
  );
}
