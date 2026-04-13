import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import type { ShowroomProject } from './showroom-types';

interface ShowroomProjectModalProps {
  project: ShowroomProject;
  categoryLabel: string;
  currentIndex: number;
  totalProjects: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevLabel?: string;
  nextLabel?: string;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export default function ShowroomProjectModal({
  project,
  categoryLabel,
  currentIndex,
  totalProjects,
  hasPrev,
  hasNext,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  onClose,
}: ShowroomProjectModalProps) {
  const clientNeedLabel = project.sectionLabels?.clientNeed ?? 'Que necesitaba el cliente';
  const solutionSummaryLabel = project.sectionLabels?.solutionSummary ?? 'Que resolvimos';
  const valueSummaryLabel = project.sectionLabels?.valueSummary ?? 'Que aporta la solucion';

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-transparent p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div className="relative mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-[min(92rem,100vw-1.5rem)] items-center justify-center animate-in fade-in duration-300 sm:min-h-[calc(100dvh-2rem)] sm:max-w-[min(92rem,100vw-2rem)] md:min-h-[calc(100dvh-3rem)]">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPrev();
          }}
          disabled={!hasPrev}
          aria-label={prevLabel ? `Ver proyecto anterior: ${prevLabel}` : 'Ver proyecto anterior'}
          className="absolute left-2 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-overlay)] text-white shadow-[var(--shadow-elevated)] transition-all hover:border-[var(--signal-border)] hover:text-[var(--signal)] disabled:cursor-not-allowed disabled:opacity-30 xl:flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          className="editorial-surface-panel relative w-full max-w-6xl overflow-hidden shadow-[var(--shadow-modal),0_0_0_1px_var(--signal-glow)] animate-in fade-in zoom-in-95 duration-300 sm:rounded-[28px]"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-full border border-[var(--border-default)] bg-[var(--bg-overlay)] p-2 text-gray-300 transition-colors hover:text-white"
            aria-label="Cerrar detalle del proyecto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5 xl:hidden">
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-overlay)] px-3 py-2 text-xs font-medium text-white transition-colors hover:border-[var(--signal-border)] hover:text-[var(--signal)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <div className="text-center text-[11px] uppercase tracking-[0.16em] text-gray-400">
              {currentIndex + 1} / {totalProjects}
            </div>

            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-overlay)] px-3 py-2 text-xs font-medium text-white transition-colors hover:border-[var(--signal-border)] hover:text-[var(--signal)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Siguiente
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
            <div className="min-w-0 border-b border-[var(--border-default)] bg-[var(--bg-elevated)]/70 lg:border-b-0 lg:border-r lg:border-r-[var(--border-default)]">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid gap-3 border-t border-[var(--border-default)] p-4 sm:p-5">
                <div className="editorial-surface-card editorial-surface-card--accent rounded-2xl p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--signal)]">
                    {clientNeedLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-200">
                    {project.clientNeed}
                  </p>
                </div>

                <div className="editorial-surface-card rounded-2xl p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                    {solutionSummaryLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-200">
                    {project.solutionSummary}
                  </p>
                </div>

                <div className="editorial-surface-card editorial-surface-card--accent rounded-2xl p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--signal)]">
                    {valueSummaryLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-200">
                    {project.valueSummary}
                  </p>
                </div>
              </div>
            </div>

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
                      <div
                        key={`${project.id}-${result.label}`}
                        className="editorial-surface-card min-w-0 rounded-xl px-4 py-4 text-left"
                      >
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
          </div>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNext();
          }}
          disabled={!hasNext}
          aria-label={nextLabel ? `Ver proyecto siguiente: ${nextLabel}` : 'Ver proyecto siguiente'}
          className="absolute right-2 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-overlay)] text-white shadow-[var(--shadow-elevated)] transition-all hover:border-[var(--signal-border)] hover:text-[var(--signal)] disabled:cursor-not-allowed disabled:opacity-30 xl:flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}
