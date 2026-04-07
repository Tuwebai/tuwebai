import { Request, Response } from 'express';
import { sendError } from '../../core/contracts/api-response';
import { relayEdgeFunction } from '../../infrastructure/supabase/supabase-edge-relay';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';

export { handleContact, handleConsulta, handleTestEmail } from '../../controllers/contact.controller';

export const handlePropuesta = async (req: Request, res: Response) => {
  try {
    const edgeResult = await relayEdgeFunction<{ message?: string; success?: boolean }>('proposal-intake', {
      body: req.body,
      requestId: res.locals.requestId as string | undefined,
    });

    if (edgeResult) {
      return res.status(edgeResult.status).json(edgeResult.body);
    }

    return sendError(res, 503, 'La solicitud de propuesta no esta disponible en este momento.');
  } catch (error: unknown) {
    appLogger.error('public.propuesta_failed', {
      error: getErrorMessage(error, 'unknown_propuesta_error'),
      route: req.path,
      method: req.method,
    });
    return sendError(res, 500, 'No se pudo procesar la solicitud en este momento.');
  }
};

export const handleApplicationSubmission = async (req: Request, res: Response) => {
  try {
    const edgeResult = await relayEdgeFunction<{ message?: string; success?: boolean }>('application-intake', {
      body: req.body,
      requestId: res.locals.requestId as string | undefined,
    });

    if (edgeResult) {
      return res.status(edgeResult.status).json(edgeResult.body);
    }

    return sendError(res, 503, 'La aplicacion no esta disponible en este momento.');
  } catch (error: unknown) {
    appLogger.error('public.application_submission_failed', {
      error: getErrorMessage(error, 'unknown_application_submission_error'),
      route: req.path,
      method: req.method,
    });

    return sendError(res, 500, 'No se pudo registrar la aplicacion.');
  }
};
