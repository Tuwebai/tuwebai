import React, { Suspense } from 'react';

import PageLoader from '@/shared/ui/page-loader';

interface LazyRouteProps {
  children: React.ReactNode;
}

export const LazyRoute: React.FC<LazyRouteProps> = ({ children }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
};

export default LazyRoute;
