export type HeroMetricKey = 'years' | 'delivery' | 'custom';

export interface HeroMetric {
  key: HeroMetricKey;
  value: number;
  label: string;
}

export const HERO_METRICS: HeroMetric[] = [
  { key: 'years', value: 6, label: 'Años construyendo' },
  { key: 'delivery', value: 30, label: 'Días máx. de entrega' },
  { key: 'custom', value: 100, label: '% código a medida' },
];

export function createInitialHeroMetricState(): Record<HeroMetricKey, number> {
  return HERO_METRICS.reduce(
    (accumulator, metric) => {
      accumulator[metric.key] = 0;
      return accumulator;
    },
    {} as Record<HeroMetricKey, number>,
  );
}
