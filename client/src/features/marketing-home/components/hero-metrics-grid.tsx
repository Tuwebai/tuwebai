import type { MutableRefObject } from 'react';

import {
  HERO_METRICS,
  type HeroMetricKey,
} from '@/features/marketing-home/content/hero-metrics';

interface HeroMetricsGridProps {
  animatedStats: Record<HeroMetricKey, number>;
  statsRef: MutableRefObject<HTMLDivElement | null>;
}

export default function HeroMetricsGrid({
  animatedStats,
  statsRef,
}: HeroMetricsGridProps) {
  return (
    <div
      ref={statsRef}
      className="mx-auto mb-7 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
    >
      {HERO_METRICS.map((stat) => (
        <article
          key={stat.key}
          className="editorial-surface-card editorial-surface-card--compact px-3 py-4 text-center"
        >
          <p className="editorial-surface-card__value font-rajdhani">
            {animatedStats[stat.key]}
          </p>
          <p className="editorial-surface-card__label mt-2">
            {stat.label}
          </p>
        </article>
      ))}
    </div>
  );
}
