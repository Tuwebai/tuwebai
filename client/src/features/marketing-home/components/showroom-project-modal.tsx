import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import type { ShowroomProject } from './showroom-types';

interface ShowroomProjectModalProps {
  project: ShowroomProject;
  categoryLabel: string;
  onClose: () => void;
}

export default function ShowroomProjectModal({
  project,
  categoryLabel,
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
      className="fixed inset-0 z-50 overflow-y-auto bg-transparent p-4 md:p-6"
      onClick={onClose}
    >
      <motion.div
        className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-6xl items-center justify-center md:min-h-[calc(100dvh-3rem)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#121217] shadow-[0_34px_90px_rgba(0,0,0,0.55)]"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/30 p-2 text-gray-300 transition-colors hover:text-white"
            aria-label="Cerrar detalle del proyecto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)]">
            <div className="border-b border-white/10 bg-[#0d1016] lg:border-b-0 lg:border-r">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid gap-3 border-t border-white/10 p-4 sm:p-5">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00CCFF]">
                    {clientNeedLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-200">
                    {project.clientNeed}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9933FF]">
                    {solutionSummaryLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-200">
                    {project.solutionSummary}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00CCFF]">
                    {valueSummaryLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-200">
                    {project.valueSummary}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-5 sm:p-6 lg:p-7 xl:p-8">
              <div className="mb-5 border-b border-white/10 pb-5 pr-10">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#00CCFF]">
                    {categoryLabel}
                  </span>
                </div>

                <h3 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
                  {project.description}
                </p>
              </div>

              <div className="grid gap-5">
                <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00CCFF]">
                      Lo que incluye
                    </p>
                  </div>
                  <ul className="grid gap-3">
                    {project.features.slice(0, 4).map((feature, index) => (
                      <li key={`${feature}-${index}`} className="flex items-start gap-3 text-sm leading-6 text-gray-200">
                        <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00CCFF]/10 text-[#00CCFF]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9933FF]">
                      Impacto
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {project.results.map((result) => (
                      <div
                        key={`${project.id}-${result.label}`}
                        className="rounded-xl border border-white/8 bg-[#171b24] px-4 py-4 text-left"
                      >
                        <div className="text-2xl font-bold leading-none text-[#00CCFF] sm:text-3xl">{result.value}</div>
                        <div className="mt-2 text-[11px] uppercase tracking-[0.12em] text-gray-400">
                          {result.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5">
                <p className="max-w-md text-sm leading-6 text-gray-400">
                  Si buscas una solucion con este nivel de claridad, rendimiento y foco comercial, podemos ayudarte a definir el mejor camino.
                </p>

                {project.externalUrl ? (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,204,255,0.22)] transition-transform duration-300 hover:scale-[1.02] sm:w-auto sm:self-start"
                  >
                    Ver proyecto online
                  </a>
                ) : (
                  <Link
                    to={project.detailsUrl}
                    className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,204,255,0.22)] transition-transform duration-300 hover:scale-[1.02] sm:w-auto sm:self-start"
                  >
                    Ver proyecto completo
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>,
    document.body
  );
}
