import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, TrendingUp, Zap } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import { useTrackSectionView } from '@/core/hooks/use-track-section-view';
import {
  createInitialHeroMetricState,
  HERO_METRICS,
} from '@/features/marketing-home/content/hero-metrics';
import {
  trackHeroConsultClick,
  trackHeroDiagnosticClick,
} from '@/features/marketing-home/services/marketing-home-analytics.service';

interface HeroSectionProps {
  setRef: (ref: HTMLElement | null) => void;
  children?: React.ReactNode;
}

export default function HeroSection({ setRef, children }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [animatedStats, setAnimatedStats] = useState(createInitialHeroMetricState);
  useTrackSectionView(sectionRef, 'hero');
  const { ref: statsRef, hasIntersected: hasShownStats } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.35,
  });
  const heroMessage = useMemo(
    () =>
      'Código a medida para negocios que quieren clientes reales, no solo una web bonita. Con métricas incluidas para saber si está funcionando.',
    [],
  );
  const heroServicePills = useMemo(() => ['Sitios corporativos', 'E-commerce', 'Sistemas web'], []);

  useEffect(() => {
    if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
      setRef(sectionRef.current);
      sectionRef.current.setAttribute('data-ref-set', 'true');
    }
  }, [setRef]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) {
          ticking = false;
          return;
        }

        const rect = section.getBoundingClientRect();
        const sectionHeight = Math.max(section.offsetHeight, 1);
        const progress = Math.min(Math.max((-rect.top) / sectionHeight, 0), 1);
        const nextOpacity = Math.max(0, 1 - progress * 2);
        setHeroOpacity((prev) => (Math.abs(prev - nextOpacity) < 0.005 ? prev : nextOpacity));
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!hasShownStats) {
      return;
    }

    const durationMs = 800;
    const start = window.performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);

      setAnimatedStats(
        HERO_METRICS.reduce((accumulator, metric) => {
          accumulator[metric.key] = Math.round(metric.value * progress);
          return accumulator;
        }, createInitialHeroMetricState()),
      );

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    };

    const frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [hasShownStats]);

  return (
    <section
      id="intro"
      ref={sectionRef}
      className="landing-anchor-section relative flex items-start justify-center overflow-hidden bg-[var(--bg-base)] pt-28 sm:pt-32 md:pt-36 lg:pt-40"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(124,58,237,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute left-[-5%] top-20 h-48 w-48 rounded-full bg-[var(--signal)]/18 blur-3xl" />
        <div className="absolute right-[-4%] top-1/3 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-8 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[var(--signal)]/12 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bg-base)] to-transparent" />
      </div>

      <div
        className="container mx-auto z-10 px-4 pb-14 sm:pb-16 lg:pb-20"
        style={{ opacity: heroOpacity }}
      >
        <div className="grid items-center gap-12 text-center lg:grid-cols-2 lg:gap-16 lg:text-left">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--signal-border)] bg-[var(--signal-glow)] px-4 py-2 text-sm font-medium text-[#A78BFA]">
              <Zap size={14} className="fill-[var(--signal)] text-[var(--signal)]" />
              Código a medida para negocios argentinos
            </div>

            <h1 className="max-w-4xl text-[2.8rem] font-black leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
              <span className="text-white">Webs que venden.</span>
              <br />
              <span className="gradient-text">No que decoran.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              {heroMessage}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
              <RouterLink
                to="/consulta"
                onClick={trackHeroConsultClick}
                className="glow-violet inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-7 py-3 text-center font-semibold text-white transition-transform duration-300 hover:scale-[1.02]"
              >
                Contar mi proyecto
              </RouterLink>

              <ScrollLink
                to="showroom"
                spy={true}
                smooth={true}
                offset={-90}
                duration={900}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-white/20 px-7 py-3 text-center font-medium text-white transition-colors hover:border-[var(--signal-border)] hover:bg-white/5"
              >
                Ver proyectos reales
              </ScrollLink>
            </div>

            <RouterLink
              to="/diagnostico-gratuito"
              onClick={trackHeroDiagnosticClick}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#C4B5FD] transition-colors hover:text-white"
            >
              Pedí tu diagnóstico gratuito
              <span aria-hidden="true">→</span>
            </RouterLink>

            <div
              ref={statsRef}
              className="mt-8 flex flex-col gap-4 border-y border-white/10 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6"
            >
              {HERO_METRICS.map((stat, index) => (
                <div key={stat.key} className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-black leading-none text-white sm:text-3xl">
                      {animatedStats[stat.key]}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
                  </div>
                  {index < HERO_METRICS.length - 1 ? (
                    <span className="hidden h-10 w-px bg-white/10 sm:block" aria-hidden="true" />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {heroServicePills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-full border border-[var(--signal-border)] bg-[var(--signal-glow)] px-4 py-2 text-sm text-[#DDD6FE]"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="animate-float relative w-full max-w-[520px]">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[var(--bg-surface)] shadow-[0_24px_80px_rgba(124,58,237,0.18)]">
                <div className="flex items-center gap-2 border-b border-white/5 bg-[var(--bg-elevated)] px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/60" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                    <div className="h-3 w-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 rounded-full bg-white/5 px-4 py-1 text-center text-xs text-gray-500">
                    tuweb.ai
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="rounded-2xl border border-[var(--signal-border)] bg-gradient-to-br from-[var(--signal)]/20 to-[var(--bg-surface)] p-5">
                    <div className="mb-2 h-3 w-2/3 rounded-full bg-white/30" />
                    <div className="mb-4 h-3 w-1/2 rounded-full bg-white/15" />
                    <div className="h-9 w-32 rounded-full bg-[var(--signal)]" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/5 bg-white/5 p-3">
                        <div className="mb-2 h-9 w-9 rounded-xl bg-[var(--signal)]/25" />
                        <div className="mb-1 h-2 w-full rounded-full bg-white/20" />
                        <div className="h-2 w-2/3 rounded-full bg-white/10" />
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <div className="mb-3 flex items-end gap-2">
                        {[48, 72, 58, 88, 100].map((height) => (
                          <div
                            key={height}
                            className="w-full rounded-t-xl bg-gradient-to-t from-[var(--signal)] to-[#C084FC]"
                            style={{ height: `${height}px` }}
                          />
                        ))}
                      </div>
                      <div className="h-2 w-1/2 rounded-full bg-white/10" />
                    </div>
                    <div className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="rounded-xl border border-white/5 bg-black/10 p-3">
                          <div className="mb-2 h-2 w-1/2 rounded-full bg-white/20" />
                          <div className="h-2 w-4/5 rounded-full bg-white/10" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 -top-4 rounded-2xl border border-[var(--signal-border)] bg-[var(--bg-surface)] px-4 py-3 shadow-[0_18px_40px_rgba(124,58,237,0.2)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500">
                    <Check size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Proyecto lanzado</p>
                    <p className="text-xs text-gray-400">Checklist completo</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-3 rounded-2xl border border-white/10 bg-[var(--bg-surface)] px-4 py-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--signal)]/20">
                    <TrendingUp size={16} className="text-[var(--signal)]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Conversiones</p>
                    <p className="text-sm font-bold text-[#C4B5FD]">+65% este mes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {children ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20">
          <div className="container mx-auto pointer-events-auto px-4">{children}</div>
        </div>
      ) : null}
    </section>
  );
}
import { Link as ScrollLink } from 'react-scroll';
