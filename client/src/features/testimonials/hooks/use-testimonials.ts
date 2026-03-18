import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/ui/use-toast';
import { getUiErrorMessage } from '@/lib/http-client';
import { createTestimonial, getAllTestimonials } from '../services/testimonials.service';
import type { TestimonialsListItem } from '../types';

interface CreateTestimonialContext {
  previousTestimonials: TestimonialsListItem[];
}

interface UseTestimonialsOptions {
  enabled?: boolean;
}

export const useTestimonials = ({ enabled = true }: UseTestimonialsOptions = {}) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['testimonials'],
    enabled,
    queryFn: async (): Promise<TestimonialsListItem[]> => {
      try {
        const allTestimonials = await getAllTestimonials();

        return allTestimonials.map((testimonial) => ({
          name: testimonial.name,
          company: testimonial.company,
          testimonial: testimonial.testimonial,
          isNew: false,
        }));
      } catch (error) {
        console.error('Error loading testimonials:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los testimonios. Por favor, recarga la pagina.',
          variant: 'destructive',
        });
        throw error;
      }
    },
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newTestimonial: Omit<TestimonialsListItem, 'isNew'>) => {
      await createTestimonial({
        name: newTestimonial.name,
        company: newTestimonial.company,
        testimonial: newTestimonial.testimonial,
      });
      return newTestimonial;
    },
    onMutate: async (newTestimonial): Promise<CreateTestimonialContext> => {
      await queryClient.cancelQueries({ queryKey: ['testimonials'] });
      const previousTestimonials = queryClient.getQueryData<TestimonialsListItem[]>(['testimonials']) ?? [];

      queryClient.setQueryData<TestimonialsListItem[]>(['testimonials'], (current = []) => [
        {
          name: newTestimonial.name,
          company: newTestimonial.company,
          testimonial: newTestimonial.testimonial,
          isNew: true,
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
        queryClient.setQueryData<TestimonialsListItem[]>(['testimonials'], context.previousTestimonials);
      }

      console.error('Error creating testimonial:', error);
      toast({
        title: 'Error',
        description: getUiErrorMessage(
          error,
          'No se pudo enviar el testimonio. Por favor, intentalo de nuevo.'
        ),
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'], refetchType: 'inactive' });
    },
  });
};
