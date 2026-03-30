import { RefObject, useEffect } from 'react';

import analytics from '@/lib/analytics';

interface UseTrackSectionViewOptions {
  rootMargin?: string;
  threshold?: number;
}

export function useTrackSectionView(
  ref: RefObject<HTMLElement>,
  sectionName: string,
  options: UseTrackSectionViewOptions = {},
) {
  const { rootMargin = '0px 0px -15% 0px', threshold = 0.35 } = options;

  useEffect(() => {
    const element = ref.current;

    if (!element || typeof window === 'undefined') {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      analytics.trackSectionView(sectionName);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          analytics.trackSectionView(sectionName);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, rootMargin, sectionName, threshold]);
}

export default useTrackSectionView;
