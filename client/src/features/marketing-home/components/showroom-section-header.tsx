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
        <h2 className="mb-4 font-rajdhani text-3xl font-bold md:text-5xl">
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
        <p className="mx-auto max-w-3xl text-xl text-gray-300">
          Proyectos propios y de clientes desarrollados a medida. Sin templates. Con código real.
        </p>
      </div>
    </>
  );
}
