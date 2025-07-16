import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import AnimatedShape from '../ui/animated-shape';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api';

interface ContactFormProps {
  delay: number;
}

function ContactForm({ delay }: ContactFormProps) {
  const { ref, hasIntersected } = useIntersectionObserver();
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        delay: delay * 0.15 
      } 
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formState.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formState.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Envío del formulario mediante fetch
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          source: 'sitio_web_principal',  // Identificar la fuente del contacto
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Si hay errores de validación del servidor
        if (data.errors && Array.isArray(data.errors)) {
          const serverErrors: {[key: string]: string} = {};
          data.errors.forEach((err: any) => {
            if (err.path && err.message) {
              serverErrors[err.path] = err.message;
            }
          });
          
          if (Object.keys(serverErrors).length > 0) {
            setErrors(serverErrors);
            throw new Error('Por favor corrige los errores en el formulario');
          }
        }
        
        throw new Error(data.message || 'Error al enviar el formulario');
      }
      
      // Limpiar formulario tras éxito
      setFormState({ name: '', email: '', message: '' });
      toast({
        title: "Mensaje enviado",
        description: "¡Gracias por contactar con nosotros! Nos pondremos en contacto contigo pronto.",
      });
      
      // Registrar evento de analítica (opcional)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'submit_form', {
          'event_category': 'engagement',
          'event_label': 'contact_form'
        });
      }
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      toast({
        title: "Error al enviar",
        description: error instanceof Error ? error.message : "Ha ocurrido un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="p-px bg-gradient-to-br from-[#00CCFF] to-[#9933FF] rounded-xl"
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={formVariants}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-glass backdrop-blur-md p-8 rounded-xl shadow-xl">
        <h3 className="font-rajdhani font-bold text-2xl mb-6 text-white">Solicita tu consulta estratégica gratuita</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#0a0a0f]/70 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white transition-all duration-200`}
              placeholder="Tu nombre"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email-contact" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email-contact"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#0a0a0f]/70 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white transition-all duration-200`}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 bg-[#0a0a0f]/70 border ${errors.message ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CCFF] focus:border-transparent text-white resize-none transition-all duration-200`}
              placeholder="Tu mensaje aquí..."
            />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </div>
          
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium disabled:opacity-70 shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30"
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
                Enviando...
              </div>
            ) : "Solicitar consulta gratuita"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

interface ContactInfoProps {
  delay: number;
}

function ContactInfo({ delay }: ContactInfoProps) {
  const { ref, hasIntersected } = useIntersectionObserver();

  const infoVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.6, 
        delay: delay * 0.15 
      } 
    }
  };

  return (
    <motion.div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="text-left"
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={infoVariants}
    >
      <h3 className="font-rajdhani font-bold text-2xl mb-6 text-white">Contacto directo</h3>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a href="mailto:admin@tuweb-ai.com" className="text-gray-300 hover:text-white transition-colors">
            admin@tuweb-ai.com
          </a>
        </div>
        
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <a href="https://www.tuweb.ai" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            www.tuweb.ai
          </a>
        </div>
      </div>
      
      <h4 className="font-rajdhani font-bold text-xl mb-4 text-white">¿Qué obtendrás con tu consulta gratuita?</h4>
      
      <ul className="space-y-3">
        <li className="flex items-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-[#00CCFF]"></div>
          <span className="text-gray-300">Diagnóstico personalizado de tu situación actual</span>
        </li>
        
        <li className="flex items-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-[#9933FF]"></div>
          <span className="text-gray-300">Identificación de oportunidades de mejora</span>
        </li>
        
        <li className="flex items-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-[#00CCFF]"></div>
          <span className="text-gray-300">Plan de acción concreto adaptado a tu negocio</span>
        </li>
        
        <li className="flex items-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-[#9933FF]"></div>
          <span className="text-gray-300">Estimación de resultados potenciales y ROI esperado</span>
        </li>
      </ul>
      
      <div className="mt-8 pt-4 border-t border-gray-800">
        <h5 className="font-medium text-white mb-2">¿Prefieres hablar directamente?</h5>
        <a href="https://wa.me/543571416044" className="text-[#00CCFF] hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Hablar con un asesor en WhatsApp
        </a>
      </div>
    </motion.div>
  );
}

interface ContactSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ContactSection({ setRef }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver();
  
  // Set the ref for the parent component
  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative bg-gradient-2"
    >
      <AnimatedShape type={1} className="top-[20%] left-[-150px]" delay={1} />
      <AnimatedShape type={2} className="bottom-[10%] right-[-100px]" delay={2} />
      
      <div className="container mx-auto px-4 py-16 z-10">
        <motion.div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className="text-center mb-16"
          initial="hidden"
          animate={titleVisible ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h2 className="font-rajdhani font-bold text-3xl md:text-5xl mb-6">
            <span className="gradient-text gradient-border inline-block pb-2">¿Listo para Maximizar tu Negocio Digital?</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Agenda Tu Consulta Gratuita y Descubre Cómo Podemos Ayudarte
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <ContactForm delay={1} />
          <ContactInfo delay={2} />
        </div>
      </div>
    </section>
  );
}