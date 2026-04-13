import type { ShowroomProject } from '@/features/marketing-home/components/showroom-types';

interface ShowroomProjectModalOverviewProps {
  project: ShowroomProject;
}

export default function ShowroomProjectModalOverview({
  project,
}: ShowroomProjectModalOverviewProps) {
  const clientNeedLabel = project.sectionLabels?.clientNeed ?? 'Que necesitaba el cliente';
  const solutionSummaryLabel = project.sectionLabels?.solutionSummary ?? 'Que resolvimos';
  const valueSummaryLabel = project.sectionLabels?.valueSummary ?? 'Que aporta la solucion';

  return (
    <div className="min-w-0 border-b border-[var(--border-default)] bg-[var(--bg-elevated)]/70 lg:border-b-0 lg:border-r lg:border-r-[var(--border-default)]">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
      </div>

      <div className="grid gap-3 border-t border-[var(--border-default)] p-4 sm:p-5">
        <div className="editorial-surface-card editorial-surface-card--accent rounded-2xl p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--signal)]">
            {clientNeedLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-200">{project.clientNeed}</p>
        </div>

        <div className="editorial-surface-card rounded-2xl p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            {solutionSummaryLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-200">{project.solutionSummary}</p>
        </div>

        <div className="editorial-surface-card editorial-surface-card--accent rounded-2xl p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--signal)]">
            {valueSummaryLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-200">{project.valueSummary}</p>
        </div>
      </div>
    </div>
  );
}
