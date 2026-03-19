type PrefetchLoader = () => Promise<unknown>;

const routeLoaders: Record<string, PrefetchLoader> = {
  '/consulta': () => import('@/features/proposals/components/proposal-request-page'),
  '/panel': () => import('@/features/users/components/user-dashboard-page'),
};

const inFlightPrefetch = new Map<string, Promise<unknown>>();

/**
 * Prefetch no bloqueante y deduplicado de chunks de ruta.
 * Solo precarga rutas críticas para mejorar TTI percibido al navegar.
 */
export function prefetchRoute(path: string): void {
  const loader = routeLoaders[path];
  if (!loader) return;

  if (inFlightPrefetch.has(path)) return;

  const prefetchPromise = loader().catch(() => {
    // El prefetch no debe romper UX si falla red/caché.
  }).finally(() => {
    inFlightPrefetch.delete(path);
  });

  inFlightPrefetch.set(path, prefetchPromise);
}
