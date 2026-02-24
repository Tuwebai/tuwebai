import PaymentReturnView from '@/components/payment/payment-return-view';

export default function PagoFallido() {
  return (
    <PaymentReturnView
      variant="failure"
      title="Pago fallido"
      description="No pudimos procesar tu pago. Revisa tus datos y vuelve a intentarlo."
      ctaLabel="Volver e intentar"
    />
  );
}
