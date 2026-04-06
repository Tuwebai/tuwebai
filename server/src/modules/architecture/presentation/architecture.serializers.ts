import type { ExtractionCandidate } from '../application/extraction-candidates.service';

export const serializeExtractionCandidates = (items: ExtractionCandidate[]) =>
  items.map((item) => ({
    blockers: item.blockers,
    candidate: item.candidate,
    decision: item.decision,
    justification: item.justification,
    ownershipReady: item.ownershipReady,
    scaleSignal: item.scaleSignal,
  }));
