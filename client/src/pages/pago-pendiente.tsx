import PaymentReturnView from '@/components/payment/payment-return-view';

export default function PagoPendiente() {
  return (
    <PaymentReturnView
      variant="pending"
      title="Pago pendiente"
      description="Tu pago esta en proceso de acreditacion. Te notificaremos por email cuando se confirme."
      ctaLabel="Volver al inicio"
    />
  );
}
