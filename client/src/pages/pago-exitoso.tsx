import PaymentReturnView from '@/components/payment/payment-return-view';

export default function PagoExitoso() {
  return (
    <PaymentReturnView
      variant="success"
      title="Pago realizado con exito"
      description="Tu pago fue procesado correctamente. En breve recibiras la confirmacion por email."
      ctaLabel="Volver al inicio"
    />
  );
}
