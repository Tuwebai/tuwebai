import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Error al procesar el pago</AlertDialogTitle>
          <AlertDialogDescription>
            {message || 'No se pudo completar la operacion con Mercado Pago.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cerrar</AlertDialogCancel>
          <AlertDialogAction onClick={onRetry}>Reintentar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
