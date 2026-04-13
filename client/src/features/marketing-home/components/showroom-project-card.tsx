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
      className={`editorial-surface-card editorial-surface-card--interactive editorial-project-card h-full cursor-pointer transition-all duration-500 ${
        hasShownProjects ? 'translate-y-0 opacity-100 hover:-translate-y-1' : 'translate-y-5 opacity-0'
      }`}
      style={{ transitionDelay: hasShownProjects ? '0ms' : `${300 + index * 100}ms` }}
      onClick={() => onOpen(project)}
    >
      <div className="editorial-project-card__media group h-52">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <span className="editorial-pill editorial-pill--muted text-[11px] font-medium uppercase tracking-[0.16em] text-white">
            Vista previa
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/60">
            {categoryLabel}
          </span>
        </div>
        {project.externalUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={(event) => onVisit(project.externalUrl!, event)}
              className="transform rounded-lg bg-[image:var(--gradient-brand)] px-4 py-2 font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[var(--glow-signal)]"
            >
              Visitar página web
            </button>
          </div>
        ) : null}
      </div>

      <div className="editorial-project-card__content">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-rajdhani text-[1.45rem] font-bold leading-none text-white">{project.title}</h3>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="editorial-pill editorial-pill--muted px-2 py-1 text-xs text-gray-400">
            {categoryLabel}
          </span>
          {project.id === 1 ? (
            <span className="editorial-pill editorial-pill--warm px-2 py-1 text-xs font-medium">
              Cliente
            </span>
          ) : null}
          {project.id === 2 ? (
            <span className="editorial-pill editorial-pill--accent px-2 py-1 text-xs font-medium">
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
