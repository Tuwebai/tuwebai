import { Request, Response } from 'express';
import { getFirestore as getAdminFirestore } from '../../infrastructure/firebase/firestore';
import { getErrorMessage } from '../../shared/utils/error-message';
import { appLogger } from '../../utils/app-logger';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';

type ProjectDocument = {
  id?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
} & Record<string, unknown>;

export const handleUpdateProject = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { projectId } = req.params;
    const payload = (req.body ?? {}) as Partial<ProjectDocument>;
    await db.collection('projects').doc(projectId).set(
      {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
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
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { uid } = req.params;
    const snap = await db.collection('projects').where('userId', '==', uid).limit(1).get();
    if (snap.empty) return res.json({ success: true, data: null });
    const doc = snap.docs[0];
    return res.json({ success: true, data: { id: doc.id, ...(doc.data() as Record<string, unknown>) } });
  } catch (error: unknown) {
    appLogger.error('public.get_user_project_failed', {
      error: getErrorMessage(error, 'unknown_get_user_project_error'),
      uid: req.params?.uid,
    });
    return res.status(500).json({ success: false, message: 'No se pudo obtener el proyecto' });
  }
};

export const handleGetAllProjects = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const limit = resolveOptionalLimit(req.query?.limit);
    const snap = await db.collection('projects').get();
    let data: ProjectDocument[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));
    data.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: unknown) {
    appLogger.error('public.get_all_projects_failed', {
      error: getErrorMessage(error, 'unknown_get_all_projects_error'),
    });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener proyectos' });
  }
};
