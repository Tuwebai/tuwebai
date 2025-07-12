import React, { Suspense } from 'react';

interface LazyRouteProps {
  children: React.ReactNode;
}

/**
 * Componente wrapper para rutas con lazy loading.
 * Proporciona una visualización de carga coherente en toda la aplicación.
 */
export const LazyRoute: React.FC<LazyRouteProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">Cargando...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default LazyRoute;