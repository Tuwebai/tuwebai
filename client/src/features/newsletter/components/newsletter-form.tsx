import { useState } from 'react';
import { motion } from 'framer-motion';
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
}

export default function NewsletterForm({
  source = 'website',
  theme = 'dark',
  className = '',
  buttonText = 'Suscribirse'
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'sent'>('idle');
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
    setSubmitState('sent');
    setEmail('');

    setTimeout(() => {
      setSubmitState('idle');
    }, 3000);

    void subscribeToNewsletter({ email: emailSnapshot, source })
      .then(() => {
        analytics.event('engagement', 'newsletter_signup', source);
        toast({
          title: 'Revisa tu email',
          description: 'Te enviamos un enlace para confirmar la suscripcion al newsletter.',
        });
      })
      .catch((submitError: unknown) => {
        console.error('Error al procesar la suscripcion:', submitError);
        setEmail(emailSnapshot);
        setSubmitState('idle');
        toast({
          title: 'Error al suscribirse',
          description: getNewsletterErrorMessage(
            submitError,
            'Ha ocurrido un problema al procesar tu suscripcion. Por favor, intentalo de nuevo.'
          ),
          variant: 'destructive',
        });
      });
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
            placeholder="Tu email"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${inputClasses}`}
          />
          {error && <p className="absolute -bottom-6 left-0 text-red-500 text-xs">{error}</p>}
        </div>

        <motion.button
          type="submit"
          className={`px-6 py-3 rounded-lg font-medium shadow-lg disabled:opacity-70 ${buttonClasses}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {submitState === 'sent' ? 'Enviado' : buttonText}
        </motion.button>
      </div>

      <p className="text-gray-500 text-xs mt-3 text-center">
        Al suscribirte, aceptas nuestra politica de privacidad.
      </p>
    </form>
  );
}
