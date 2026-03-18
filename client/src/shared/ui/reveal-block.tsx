import type { CSSProperties, ReactNode } from 'react';

import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';

interface RevealBlockProps {
  children: ReactNode;
  className?: string;
  hiddenClassName?: string;
  visibleClassName?: string;
  delayMs?: number;
  durationMs?: number;
  threshold?: number;
  rootMargin?: string;
}

export default function RevealBlock({
  children,
  className = '',
  hiddenClassName = 'opacity-0 translate-y-8',
  visibleClassName = 'opacity-100 translate-y-0',
  delayMs = 0,
  durationMs = 700,
  threshold = 0,
  rootMargin = '0px',
}: RevealBlockProps) {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin,
  });

  const style: CSSProperties = {
    transitionDuration: `${durationMs}ms`,
    transitionDelay: `${delayMs}ms`,
  };

  return (
    <div
      ref={ref}
      className={[
        className,
        'transform-gpu transition-all ease-out will-change-transform',
        hasIntersected ? visibleClassName : hiddenClassName,
      ].join(' ').trim()}
      style={style}
    >
      {children}
    </div>
  );
}
