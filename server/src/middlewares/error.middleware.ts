import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.config';
import { appLogger } from '../utils/app-logger';

interface DefaultError extends Error {
  status?: number;
}

export const globalErrorHandler = (
  err: DefaultError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.status || 500;
  const requestId = res.locals?.requestId;

  appLogger.error('http.unhandled_error', {
    requestId,
    method: req.method,
    path: req.path,
    statusCode,
    errorName: err.name,
    errorMessage: err.message,
    stack: env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    error: 'Error Interno del Servidor',
    message: statusCode === 500 ? 'Ha ocurrido un error inesperado al procesar la solicitud.' : err.message,
    requestId,
    ...(env.NODE_ENV === 'development' && { details: err.stack }),
  });
};

