import React from 'react';
import { useAuthState } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface DashboardRouteProps {
  children: React.ReactNode;
}

export default function DashboardRoute({ children }: DashboardRouteProps) {
  const { isAuthenticated, user } = useAuthState();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para acceder al dashboard.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    // Verificar si el usuario tiene un proyecto asignado (opcional por ahora)
    // if (!user?.projectId) {
    //   toast({
    //     title: "Sin proyecto asignado",
    //     description: "No tienes un proyecto activo. Contacta con soporte.",
    //     variant: "destructive"
    //   });
    //   navigate('/');
    //   return;
    // }
  }, [isAuthenticated, user, navigate, toast]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 
