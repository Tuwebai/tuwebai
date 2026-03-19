import { useState } from 'react';
import { useToast } from '@/shared/ui/use-toast';
import analytics from '@/lib/analytics';
import {
  getNewsletterErrorMessage,
  subscribeToNewsletter,
} from '@/features/newsletter/services/newsletter.service';

interface NewsletterFormProps {
  source?: string;
  theme?: 'light' | 'dark';
  className?: string;
  buttonText?: string;
  inputPlaceholder?: string;
  disclaimerClassName?: string;
}

export default function NewsletterForm({
  source = 'website',
  theme = 'dark',
  className = '',
  buttonText = 'Suscribirse',
  inputPlaceholder = 'Tu email',
  disclaimerClassName = 'text-gray-500',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, introduce un email valido');
      return;
    }

    setError(null);
    const emailSnapshot = email;
    setSubmitState('submitting');

    try {
      await subscribeToNewsletter({ email: emailSnapshot, source });
      analytics.event('engagement', 'newsletter_signup', source);
      setEmail('');
      setSubmitState('sent');
      toast({
        title: 'Revisa tu email',
        description: 'Te enviamos un enlace para confirmar la suscripcion al newsletter.',
      });

      setTimeout(() => {
        setSubmitState('idle');
      }, 3000);
    } catch (submitError: unknown) {
      console.error('Error al procesar la suscripcion:', submitError);
      setSubmitState('idle');
      toast({
        title: 'Error al suscribirse',
        description: getNewsletterErrorMessage(
          submitError,
          'Ha ocurrido un problema al procesar tu suscripcion. Por favor, intentalo de nuevo.'
        ),
        variant: 'destructive',
      });
    }
  };

  const inputClasses = theme === 'dark'
    ? 'bg-[#0a0a0f]/70 border-gray-700 text-white placeholder-gray-400 focus:ring-[#00CCFF]'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500';

  const buttonClasses = theme === 'dark'
    ? 'bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={inputPlaceholder}
            disabled={submitState === 'submitting'}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${inputClasses}`}
          />
          {error && <p className="absolute -bottom-6 left-0 text-red-500 text-xs">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={submitState === 'submitting'}
          className={`px-6 py-3 rounded-lg font-medium shadow-lg disabled:opacity-70 ${buttonClasses}`}
        >
          {submitState === 'submitting' ? 'Enviando...' : submitState === 'sent' ? 'Enviado' : buttonText}
        </button>
      </div>

      <p className={`text-xs mt-3 text-center ${disclaimerClassName}`}>
        Al suscribirte, aceptas nuestra politica de privacidad.
      </p>
    </form>
  );
}
