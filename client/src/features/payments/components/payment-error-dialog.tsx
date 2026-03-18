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
          className="rounded-xl border border-gray-700 bg-[#151925] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-cyan-400/40 hover:bg-[#1b2131]"
        >
          Cerrar
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,204,255,0.16)]"
        >
          Reintentar
        </button>
      </div>
    </PaymentModalFrame>
  );
}
