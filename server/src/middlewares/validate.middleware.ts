import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { appLogger } from '../utils/app-logger';

const isUserUpsertRoute = (req: Request) =>
  req.method === 'PUT' && /^\/api\/users\/[^/]+$/.test(req.path);

export const validatePayload = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        appLogger.warn('http.validation_failed', {
          route: req.path,
          method: req.method,
          issues: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
        });
        if (isUserUpsertRoute(req)) {
          appLogger.warn('users.upsert.validation_failed', {
            route: req.path,
            method: req.method,
            uid: req.params?.uid,
            bodyKeys: Object.keys((req.body ?? {}) as Record<string, unknown>),
            issues: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
          });
        }
        return res.status(400).json({
          error: "Solicitud Inválida",
          details: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
        });
      }
      return res.status(400).json({ error: "Solicitud Inválida" });
    }
  };
