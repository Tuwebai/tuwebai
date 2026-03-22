import type { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';

interface AppQueryProviderProps {
  children: ReactNode;
}

export function AppQueryProvider({ children }: AppQueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
