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
      className={`editorial-surface-card editorial-surface-card--interactive h-full cursor-pointer rounded-xl transition-all duration-500 ${
        hasShownProjects ? 'translate-y-0 opacity-100 hover:-translate-y-1' : 'translate-y-5 opacity-0'
      }`}
      style={{ transitionDelay: hasShownProjects ? '0ms' : `${300 + index * 100}ms` }}
      onClick={() => onOpen(project)}
    >
      <div className="group relative h-48 overflow-hidden">
        <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
          <span className="text-sm font-medium text-white">Vista previa</span>
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

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-rajdhani text-xl font-bold text-white">{project.title}</h3>
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

        <p className="mb-4 line-clamp-3 text-sm text-gray-400">{project.description}</p>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onOpen(project);
          }}
          className="flex items-center text-sm font-medium text-[var(--signal)] transition-colors hover:text-white"
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
