import type { ReactNode } from 'react';

export const heroSurfaceClassName =
  'overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.14),transparent_32%),linear-gradient(180deg,rgba(18,18,23,0.98),rgba(10,10,15,0.98))] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] md:rounded-[32px]';

export const surfaceClassName =
  'overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.1),transparent_40%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.08),transparent_34%),linear-gradient(180deg,rgba(20,26,42,0.98),rgba(12,18,31,0.92))] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.28)] md:rounded-[32px]';

export function AboutAccentPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9BE7FF]">
      {children}
    </span>
  );
}

export function AboutMutedPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-gray-300">
      {children}
    </span>
  );
}
