import { appLogger } from '../../utils/app-logger';

type UseCaseLogMeta = Record<string, unknown>;

interface UseCaseLoggerOptions {
  module: string;
  requestId?: string;
  useCase: string;
}

const buildMeta = (
  options: UseCaseLoggerOptions,
  meta?: UseCaseLogMeta,
): UseCaseLogMeta => ({
  module: options.module,
  useCase: options.useCase,
  ...(options.requestId ? { requestId: options.requestId } : {}),
  ...(meta ?? {}),
});

export const createUseCaseLogger = (options: UseCaseLoggerOptions) => ({
  error: (event: string, meta?: UseCaseLogMeta) => appLogger.error(event, buildMeta(options, meta)),
  info: (event: string, meta?: UseCaseLogMeta) => appLogger.info(event, buildMeta(options, meta)),
  warn: (event: string, meta?: UseCaseLogMeta) => appLogger.warn(event, buildMeta(options, meta)),
});
