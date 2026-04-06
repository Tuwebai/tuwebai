import type { Request, Response } from 'express';
import { sendSuccessWithMessage } from '../../core/contracts/api-response';
import { createUseCaseLogger } from '../../core/observability/use-case-logger';
import { listExtractionCandidates } from './application/extraction-candidates.service';
import { serializeExtractionCandidates } from './presentation/architecture.serializers';

export const handleGetExtractionCandidates = (_req: Request, res: Response) => {
  const logger = createUseCaseLogger({
    module: 'architecture',
    requestId: res.locals.requestId as string | undefined,
    useCase: 'list_extraction_candidates',
  });

  const candidates = listExtractionCandidates();

  logger.info('architecture.extraction_candidates_listed', {
    count: candidates.length,
  });

  return sendSuccessWithMessage(
    res,
    {
      candidates: serializeExtractionCandidates(candidates),
      recommendedStrategy: 'keep_modular_monolith',
    },
    'Evaluacion de extraccion disponible.',
  );
};
