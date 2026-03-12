import React, { Suspense } from 'react';

import { Skeleton } from '@/shared/ui/skeleton';

interface LazyRouteProps {
  children: React.ReactNode;
}

export const LazyRoute: React.FC<LazyRouteProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0f] px-4 pt-24 pb-12">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <Skeleton className="h-10 w-56 rounded-lg bg-white/10" />
            <Skeleton className="h-6 w-80 rounded-lg bg-white/10" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-40 rounded-xl bg-white/10" />
              <Skeleton className="h-40 rounded-xl bg-white/10" />
              <Skeleton className="h-40 rounded-xl bg-white/10" />
            </div>

            <Skeleton className="h-64 rounded-xl bg-white/10" />
            <span className="sr-only">Cargando contenido de la ruta</span>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default LazyRoute;
