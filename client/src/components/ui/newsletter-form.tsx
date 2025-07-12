import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, introduce un email válido');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar la suscripción');
      }
      
      // Limpiar formulario tras éxito
      setEmail('');
      
      // Mostrar mensaje de éxito
      toast({
        title: "Suscripción exitosa",
        description: "¡Gracias por suscribirte a nuestro newsletter!",
      });
      
      // Registrar evento de analítica (opcional)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'newsletter_signup', {
          'event_category': 'engagement',
          'event_label': source
        });
      }
      
    } catch (error) {
      console.error('Error al procesar la suscripción:', error);
      
      // Mostrar mensaje de error
      toast({
        title: "Error al suscribirse",
        description: error instanceof Error ? error.message : "Ha ocurrido un problema al procesar tu suscripción. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clases según el tema
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
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${inputClasses}`}
          />
          {error && <p className="absolute -bottom-6 left-0 text-red-500 text-xs">{error}</p>}
        </div>
        
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg font-medium shadow-lg disabled:opacity-70 ${buttonClasses}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </div>
          ) : buttonText}
        </motion.button>
      </div>
      
      <p className="text-gray-500 text-xs mt-3 text-center">
        Al suscribirte, aceptas nuestra política de privacidad.
      </p>
    </form>
  );
}