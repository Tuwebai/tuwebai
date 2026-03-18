import type { ReactElement, ReactNode } from 'react';

export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'default' | 'destructive';
  duration?: number;
  className?: string;
  children?: ReactNode;
}

export type ToastActionElement = ReactElement;
