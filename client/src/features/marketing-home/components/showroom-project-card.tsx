import type { MouseEvent } from 'react';

import type { ShowroomProject } from '@/features/marketing-home/components/showroom-types';

interface ShowroomProjectCardProps {
  categoryLabel: string;
  hasShownProjects: boolean;
  index: number;
  onOpen: (project: ShowroomProject) => void;
  onVisit: (url: string, event: MouseEvent) => void;
  project: ShowroomProject;
}

export default function ShowroomProjectCard({
  categoryLabel,
  hasShownProjects,
  index,
  onOpen,
  onVisit,
  project,
}: ShowroomProjectCardProps) {
  return (
    <div
      className={`card-hover relative h-full cursor-pointer overflow-hidden rounded-[28px] border border-white/5 bg-[var(--bg-surface)] ${
        hasShownProjects ? 'translate-y-0 opacity-100 hover:border-[var(--signal-border)]' : 'translate-y-5 opacity-0'
      }`}
      style={{
        transitionDelay: hasShownProjects ? '0ms' : `${300 + index * 100}ms`,
        transitionDuration: hasShownProjects ? '180ms' : '500ms',
      }}
      onClick={() => onOpen(project)}
    >
      <div className="group relative h-52 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur">
            Vista previa
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/60">
            {categoryLabel}
          </span>
        </div>
        {project.externalUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <button
              onClick={(event) => onVisit(project.externalUrl!, event)}
              className="transform rounded-lg bg-[image:var(--gradient-brand)] px-4 py-2 font-medium text-white transition-all duration-150 hover:scale-105 hover:shadow-[var(--glow-signal)]"
            >
              Visitar página web
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex h-[calc(100%-13rem)] flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-[1.45rem] font-black leading-none text-white">{project.title}</h3>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300">
            {categoryLabel}
          </span>
          {project.id === 1 ? (
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-200">
              Cliente
            </span>
          ) : null}
          {project.id === 2 ? (
            <span className="rounded-full border border-[var(--signal-border)] bg-[var(--signal-glow)] px-2 py-1 text-xs font-medium text-[#DDD6FE]">
              Producto propio
            </span>
          ) : null}
        </div>

        <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-300">{project.description}</p>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onOpen(project);
          }}
          className="mt-auto flex items-center text-sm font-medium text-[var(--signal)] transition-colors hover:text-white"
        >
          <span>Ver detalles</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
