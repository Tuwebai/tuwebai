import { useState } from 'react';

import { useCreateTestimonial } from '@/features/testimonials/hooks/use-testimonials';
import { useToast } from '@/shared/ui/use-toast';

interface TestimonialFormProps {
  onSuccess?: () => void;
}

export default function TestimonialForm({ onSuccess }: TestimonialFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    testimonial: '',
  });

  const createTestimonial = useCreateTestimonial();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.testimonial) {
      toast({
        title: 'Error',
        description: 'Por favor complete los campos obligatorios (nombre y testimonio).',
        variant: 'destructive',
      });
      return;
    }

    createTestimonial.mutate({
      name: formData.name,
      company: formData.company || 'Cliente',
      testimonial: formData.testimonial,
    });

    setFormData({
      name: '',
      company: '',
      testimonial: '',
    });
    setIsOpen(false);

    onSuccess?.();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-8 mx-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_25px_-5px_rgba(0,204,255,0.3)] active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
        <span>Dejar testimonio</span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 transition-opacity duration-200">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-[0_0_30px_rgba(0,204,255,0.15)] transition-all duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold gradient-text">Comparte tu experiencia</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-gray-400 transition-all duration-200 hover:rotate-90 hover:bg-gray-800 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="mb-6 text-sm text-gray-400">
              Nos encantaria conocer tu experiencia trabajando con nosotros. Tu testimonio nos ayuda a mejorar y a mostrar a otros clientes potenciales la calidad de nuestro trabajo.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-300">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#9933FF]"
                  required
                  placeholder="Escribe tu nombre"
                />
              </div>

              <div>
                <label htmlFor="company" className="mb-1 block text-sm font-medium text-gray-300">
                  Empresa o cargo
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#9933FF]"
                  placeholder="Ej: Director, TuEmpresa"
                />
              </div>

              <div>
                <label htmlFor="testimonial" className="mb-1 block text-sm font-medium text-gray-300">
                  Tu testimonio *
                </label>
                <textarea
                  id="testimonial"
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleChange}
                  rows={4}
                  className="w-full resize-none rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#9933FF]"
                  required
                  placeholder="Cuentanos tu experiencia trabajando con nosotros..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-gray-600 px-4 py-2 text-gray-300 transition-all duration-200 hover:border-[#00CCFF] hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-4 py-2 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_5px_15px_-5px_rgba(0,204,255,0.7)] active:scale-[0.98]"
                >
                  Enviar testimonio
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
