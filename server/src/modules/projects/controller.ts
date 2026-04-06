import { Request, Response } from 'express';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';
import {
  getAllProjects as getAllProjectsRecords,
  getProjectByUserId,
  updateProjectRecord,
} from './supabase.repository';

type ProjectDocument = {
  id?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
} & Record<string, unknown>;

const sanitizeProjectUpdatePayload = (payload: Partial<ProjectDocument>): Partial<ProjectDocument> => ({
  ...(typeof payload.name === 'string' ? { name: payload.name } : {}),
  ...(typeof payload.type === 'string' ? { type: payload.type } : {}),
  ...(typeof payload.startDate === 'string' ? { startDate: payload.startDate } : {}),
  ...(typeof payload.estimatedEndDate === 'string' ? { estimatedEndDate: payload.estimatedEndDate } : {}),
  ...(typeof payload.overallProgress === 'number' ? { overallProgress: payload.overallProgress } : {}),
  ...(payload.status === 'active' || payload.status === 'completed' || payload.status === 'on-hold'
    ? { status: payload.status }
    : {}),
  ...(Array.isArray(payload.phases) ? { phases: payload.phases } : {}),
});

export const handleUpdateProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const payload = sanitizeProjectUpdatePayload((req.body ?? {}) as Partial<ProjectDocument>);
    await updateProjectRecord(projectId, {
      ...payload,
      updatedAt: new Date().toISOString(),
    });
    return res.json({ success: true });
  } catch (error: unknown) {
    appLogger.error('public.update_project_failed', {
      error: getErrorMessage(error, 'unknown_update_project_error'),
      projectId: req.params?.projectId,
    });
    return res.status(500).json({ success: false, message: 'No se pudo actualizar el proyecto' });
  }
};

export const handleGetUserProject = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const project = await getProjectByUserId(uid);
    return res.json({ success: true, data: project });
  } catch (error: unknown) {
    appLogger.error('public.get_user_project_failed', {
      error: getErrorMessage(error, 'unknown_get_user_project_error'),
      uid: req.params?.uid,
    });
    return res.status(500).json({ success: false, message: 'No se pudo obtener el proyecto' });
  }
};

export const handleGetAllProjects = async (req: Request, res: Response) => {
  try {
    const limit = resolveOptionalLimit(req.query?.limit);
    const data = await getAllProjectsRecords(limit ?? undefined);
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_all_projects_failed', {
      error: getErrorMessage(error, 'unknown_get_all_projects_error'),
    });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener proyectos' });
  }
};
