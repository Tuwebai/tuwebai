import { createPortal } from 'react-dom';
import ShowroomModalNavButton from '@/features/marketing-home/components/showroom-modal-nav-button';
import ShowroomProjectModalDetails from '@/features/marketing-home/components/showroom-project-modal-details';
import ShowroomProjectModalOverview from '@/features/marketing-home/components/showroom-project-modal-overview';
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
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-transparent p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div className="relative mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-[min(92rem,100vw-1.5rem)] items-center justify-center animate-in fade-in duration-300 sm:min-h-[calc(100dvh-2rem)] sm:max-w-[min(92rem,100vw-2rem)] md:min-h-[calc(100dvh-3rem)]">
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <ShowroomModalNavButton
            ariaLabel={prevLabel ? `Ver proyecto anterior: ${prevLabel}` : 'Ver proyecto anterior'}
            direction="prev"
            disabled={!hasPrev}
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
          />
        </div>

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
            <ShowroomModalNavButton
              ariaLabel={prevLabel ? `Ver proyecto anterior: ${prevLabel}` : 'Ver proyecto anterior'}
              compact
              direction="prev"
              disabled={!hasPrev}
              label="Anterior"
              onClick={(event) => {
                event.stopPropagation();
                onPrev();
              }}
            />

            <div className="text-center text-[11px] uppercase tracking-[0.16em] text-gray-400">
              {currentIndex + 1} / {totalProjects}
            </div>

            <ShowroomModalNavButton
              ariaLabel={nextLabel ? `Ver proyecto siguiente: ${nextLabel}` : 'Ver proyecto siguiente'}
              compact
              direction="next"
              disabled={!hasNext}
              label="Siguiente"
              onClick={(event) => {
                event.stopPropagation();
                onNext();
              }}
            />
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
            <ShowroomProjectModalOverview project={project} />
            <ShowroomProjectModalDetails
              categoryLabel={categoryLabel}
              currentIndex={currentIndex}
              project={project}
              totalProjects={totalProjects}
            />
          </div>
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <ShowroomModalNavButton
            ariaLabel={nextLabel ? `Ver proyecto siguiente: ${nextLabel}` : 'Ver proyecto siguiente'}
            direction="next"
            disabled={!hasNext}
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
