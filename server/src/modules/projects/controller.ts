import { Request, Response } from 'express';
import { getFirestore as getAdminFirestore } from '../../infrastructure/firebase/firestore';
import { appLogger } from '../../utils/app-logger';
import { resolveOptionalLimit } from '../../shared/utils/list-limit';

export const handleUpdateProject = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const { projectId } = req.params;
    await db.collection('projects').doc(projectId).set(
      {
        ...req.body,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return res.json({ success: true });
  } catch (error: any) {
    appLogger.error('public.update_project_failed', { error: error?.message, projectId: req.params?.projectId });
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
    return res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error: any) {
    appLogger.error('public.get_user_project_failed', { error: error?.message, uid: req.params?.uid });
    return res.status(500).json({ success: false, message: 'No se pudo obtener el proyecto' });
  }
};

export const handleGetAllProjects = async (req: Request, res: Response) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ success: false, message: 'Firestore admin no disponible' });

  try {
    const limit = resolveOptionalLimit(req.query?.limit);
    const snap = await db.collection('projects').get();
    let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    data.sort((a: any, b: any) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    if (limit !== null) {
      data = data.slice(0, limit);
    }
    return res.json({ success: true, data });
  } catch (error: any) {
    appLogger.error('public.get_all_projects_failed', { error: error?.message });
    return res.status(500).json({ success: false, message: 'No se pudieron obtener proyectos' });
  }
};
