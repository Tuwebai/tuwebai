import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoginModal } from '../../hooks/use-login-modal';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Componente de ruta protegida para administradores
 * Verifica que el usuario esté autenticado y tenga rol de administrador
 * Si no cumple, redirige a la página principal o muestra el modal de login
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { openModal } = useLoginModal();
  const location = useLocation();

  // Si intenta acceder a ruta protegida sin estar autenticado, mostrar modal de login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openModal(location.pathname, 'login');
    }
  }, [isLoading, isAuthenticated, openModal, location.pathname]);

  // Si está cargando, mostrar un estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f] text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00CCFF] mb-4"></div>
          <p className="text-xl">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no es admin, redirigir a la página principal
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si está autenticado y es admin, mostrar el contenido protegido
  return <>{children}</>;
};

export default AdminRoute;