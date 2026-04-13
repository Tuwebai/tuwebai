import { Link } from 'react-router-dom';

import type { ShowroomProject } from '@/features/marketing-home/components/showroom-types';

interface ShowroomProjectModalDetailsProps {
  categoryLabel: string;
  currentIndex: number;
  project: ShowroomProject;
  totalProjects: number;
}

export default function ShowroomProjectModalDetails({
  categoryLabel,
  currentIndex,
  project,
  totalProjects,
}: ShowroomProjectModalDetailsProps) {
  return (
    <div className="min-w-0 flex flex-col p-5 sm:p-6 lg:p-7 xl:p-8">
      <div className="mb-5 border-b border-[var(--border-default)] pb-5 pr-10 sm:pr-12">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="editorial-pill editorial-pill--accent px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]">
              {categoryLabel}
            </span>
            <span className="hidden text-[11px] uppercase tracking-[0.16em] text-gray-500 xl:inline-block">
              {currentIndex + 1} / {totalProjects}
            </span>
          </div>
        </div>

        <h3 className="font-rajdhani text-2xl font-bold text-white sm:text-3xl xl:text-4xl">
          {project.title}
        </h3>
        <p className="mt-3 max-w-xl break-words text-sm leading-7 text-gray-300 sm:text-base">
          {project.description}
        </p>
      </div>

      <div className="grid gap-5">
        <section className="editorial-surface-card min-w-0 rounded-2xl p-4 sm:p-5">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--signal)]">
              Lo que incluye
            </p>
          </div>
          <ul className="grid gap-3">
            {project.features.slice(0, 4).map((feature, index) => (
              <li key={`${feature}-${index}`} className="flex items-start gap-3 text-sm leading-6 text-gray-200">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--signal-glow)] text-[var(--signal)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="min-w-0 break-words">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="editorial-surface-card editorial-surface-card--accent min-w-0 rounded-2xl p-4 sm:p-5">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Impacto
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2">
            {project.results.map((result) => (
              <div key={`${project.id}-${result.label}`} className="editorial-surface-card min-w-0 rounded-xl px-4 py-4 text-left">
                <div className="break-words text-lg font-bold leading-snug text-[var(--signal)] sm:text-xl">
                  {result.value}
                </div>
                <div className="mt-2 break-words text-[10px] uppercase tracking-[0.1em] text-gray-400 sm:text-[11px]">
                  {result.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border-default)] pt-5">
        <p className="max-w-md break-words text-sm leading-6 text-gray-400">
          Si buscas una solucion con este nivel de claridad, rendimiento y foco comercial, podemos ayudarte a definir el mejor camino.
        </p>

        {project.externalUrl ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)] transition-transform duration-300 hover:scale-[1.02] sm:w-auto sm:self-start"
          >
            Ver proyecto online
          </a>
        ) : (
          <Link
            to={project.detailsUrl}
            className="inline-flex w-full items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)] transition-transform duration-300 hover:scale-[1.02] sm:w-auto sm:self-start"
          >
            Ver proyecto completo
          </Link>
        )}
      </div>
    </div>
  );
}
