import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllTestimonials, createTestimonial } from '@/services/testimonials';
import { useToast } from '@/hooks/use-toast';
import { getUiErrorMessage } from '@/lib/http-client';

export interface Testimonial {
  name: string;
  company: string;
  testimonial: string;
  isNew?: boolean;
}

export const useTestimonials = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async (): Promise<Testimonial[]> => {
      try {
        const allTestimonials = await getAllTestimonials();
        
        // Convertir testimonios de Firestore al formato local
        return allTestimonials.map(t => ({
          name: t.name,
          company: t.company,
          testimonial: t.testimonial,
          isNew: false
        }));
      } catch (error) {
        console.error('Error loading testimonials:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los testimonios. Por favor, recarga la página.",
          variant: "destructive"
        });
        throw error;
      }
    }
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newTestimonial: Omit<Testimonial, 'isNew'>) => {
      await createTestimonial({
        name: newTestimonial.name,
        company: newTestimonial.company,
        testimonial: newTestimonial.testimonial
      });
      return newTestimonial;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });

      toast({
        title: "Testimonio recibido",
        description: "Tu testimonio quedó pendiente de revisión y será publicado luego de validarlo.",
      });
    },
    onError: (error) => {
      console.error('Error creating testimonial:', error);
      toast({
        title: "Error",
        description: getUiErrorMessage(
          error,
          "No se pudo enviar el testimonio. Por favor, intentalo de nuevo."
        ),
        variant: "destructive"
      });
    }
  });
};

