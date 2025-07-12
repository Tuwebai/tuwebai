import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface TestimonialFormProps {
  onAddTestimonial: (testimonial: {
    name: string;
    company: string;
    testimonial: string;
  }) => void;
}

export default function TestimonialForm({ onAddTestimonial }: TestimonialFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    testimonial: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple
    if (!formData.name || !formData.testimonial) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios (nombre y testimonio).",
        variant: "destructive"
      });
      return;
    }

    // Enviar el nuevo testimonio al componente padre
    onAddTestimonial({
      name: formData.name,
      company: formData.company || 'Cliente',
      testimonial: formData.testimonial,
    });

    // Mostrar mensaje de éxito
    toast({
      title: "¡Gracias por tu testimonio!",
      description: "Tu experiencia ha sido agregada a nuestra sección de testimonios.",
    });

    // Resetear formulario y cerrar
    setFormData({
      name: '',
      company: '',
      testimonial: '',
    });
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="mt-8 mx-auto bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
        whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 204, 255, 0.3)' }}
        whileTap={{ scale: 0.95 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        <span>Dejar testimonio</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-800 shadow-[0_0_30px_rgba(0,204,255,0.15)]"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold gradient-text">Comparte tu experiencia</h3>
                <motion.button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-gray-800 transition-colors"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <p className="text-gray-400 mb-6 text-sm">
                Nos encantaría conocer tu experiencia trabajando con nosotros. Tu testimonio nos ayuda a mejorar y a mostrar a otros clientes potenciales la calidad de nuestro trabajo.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9933FF] text-white"
                    required
                    placeholder="Escribe tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                    Empresa o cargo
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9933FF] text-white"
                    placeholder="Ej: Director, TuEmpresa"
                  />
                </div>

                <div>
                  <label htmlFor="testimonial" className="block text-sm font-medium text-gray-300 mb-1">
                    Tu testimonio *
                  </label>
                  <textarea
                    id="testimonial"
                    name="testimonial"
                    value={formData.testimonial}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9933FF] text-white resize-none"
                    required
                    placeholder="Cuéntanos tu experiencia trabajando con nosotros..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02, borderColor: '#00CCFF' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-md text-white font-medium"
                    whileHover={{ scale: 1.05, boxShadow: '0 5px 15px -5px rgba(0, 204, 255, 0.7)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Enviar testimonio
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}