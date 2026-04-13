export type HeroMetricKey = 'years' | 'projects' | 'products';

export interface HeroMetric {
  key: HeroMetricKey;
  value: number;
  label: string;
}

export const HERO_METRICS: HeroMetric[] = [
  { key: 'years', value: 6, label: 'Años construyendo' },
  { key: 'projects', value: 6, label: 'Proyectos visibles' },
  { key: 'products', value: 1, label: 'Producto propio' },
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
