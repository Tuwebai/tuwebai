import type { MutableRefObject } from 'react';

interface ShowroomSectionHeaderProps {
  hasShownSubtitle: boolean;
  hasShownTitle: boolean;
  subtitleRef: MutableRefObject<HTMLDivElement | null>;
  titleRef: MutableRefObject<HTMLDivElement | null>;
}

export default function ShowroomSectionHeader({
  hasShownSubtitle,
  hasShownTitle,
  subtitleRef,
  titleRef,
}: ShowroomSectionHeaderProps) {
  return (
    <>
      <div
        ref={titleRef}
        className={`text-center transition-all duration-700 ${
          hasShownTitle ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="mb-5 inline-flex rounded-full border border-[var(--signal-border)] bg-[var(--signal-glow)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#A78BFA]">
          Proyectos reales
        </div>
        <h2 className="mb-4 text-3xl font-black md:text-5xl">
          <span className="gradient-text gradient-border inline-block pb-2">
            Lo que construimos
          </span>
        </h2>
      </div>

      <div
        ref={subtitleRef}
        className={`mb-12 text-center transition-all duration-700 ${
          hasShownSubtitle ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        <p className="mx-auto max-w-3xl text-base leading-7 text-gray-300 sm:text-xl">
          Proyectos propios y de clientes desarrollados a medida. Sin templates. Con código real.
        </p>
      </div>
    </>
  );
}
