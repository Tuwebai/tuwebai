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

interface CreateTestimonialContext {
  previousTestimonials: Testimonial[];
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
          title: 'Error',
          description: 'No se pudieron cargar los testimonios. Por favor, recarga la pagina.',
          variant: 'destructive'
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
    onMutate: async (newTestimonial): Promise<CreateTestimonialContext> => {
      await queryClient.cancelQueries({ queryKey: ['testimonials'] });
      const previousTestimonials = queryClient.getQueryData<Testimonial[]>(['testimonials']) ?? [];

      queryClient.setQueryData<Testimonial[]>(['testimonials'], (current = []) => [
        {
          name: newTestimonial.name,
          company: newTestimonial.company,
          testimonial: newTestimonial.testimonial,
          isNew: true
        },
        ...current,
      ]);

      return { previousTestimonials };
    },
    onSuccess: () => {
      toast({
        title: 'Testimonio recibido',
        description: 'Tu testimonio quedo pendiente de revision y sera publicado luego de validarlo.',
      });
    },
    onError: (error, _variables, context) => {
      if (context) {
        queryClient.setQueryData<Testimonial[]>(['testimonials'], context.previousTestimonials);
      }

      console.error('Error creating testimonial:', error);
      toast({
        title: 'Error',
        description: getUiErrorMessage(
          error,
          'No se pudo enviar el testimonio. Por favor, intentalo de nuevo.'
        ),
        variant: 'destructive'
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'], refetchType: 'inactive' });
    }
  });
};
