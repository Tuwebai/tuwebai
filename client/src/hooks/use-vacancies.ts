import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { backendApi } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';

interface Vacancy {
  title: string;
  department: string;
  type: string;
}

interface Application {
  name: string;
  email: string;
  phone: string;
  experience: string;
  portfolio: string;
  message: string;
}

interface ApplicationVariables {
  application: Application;
  vacancy: Vacancy;
}

export const useApplyVacancy = () => {
  return useMutation({
    mutationFn: async ({ application, vacancy }: ApplicationVariables) => {
      await backendApi.submitApplication({
        ...application,
        position: vacancy.title,
        department: vacancy.department,
        type: vacancy.type,
      });
    },
    onSuccess: () => {
      toast({
        title: "¡Aplicación enviada con éxito!",
        description: "Te contactaremos pronto.",
        variant: "default"
      });
    },
    onError: (error) => {
      console.error('Error submitting application:', error);
      toast({
        title: "Error al enviar la aplicación",
        description: getUiErrorMessage(error, "Intenta nuevamente."),
        variant: "destructive"
      });
    }
  });
};

