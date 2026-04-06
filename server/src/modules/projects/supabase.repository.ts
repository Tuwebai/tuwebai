import { supabaseAdminRestRequest } from '../../infrastructure/database/supabase/supabase-admin-rest';

type ProjectPhase = Record<string, unknown>;
type ProjectAttachment = Record<string, unknown>;

export interface ProjectRecord {
  id: string;
  userId?: string;
  ownerEmail?: string;
  name: string;
  type: string;
  description?: string;
  priority?: string;
  startDate?: string;
  estimatedEndDate?: string;
  overallProgress: number;
  status: 'active' | 'completed' | 'on-hold';
  phases: ProjectPhase[];
  attachments: ProjectAttachment[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectRow {
  id: string;
  user_id: string | null;
  owner_email: string | null;
  name: string;
  type: string;
  description: string | null;
  priority: string | null;
  start_date: string | null;
  estimated_end_date: string | null;
  overall_progress: number;
  status: 'active' | 'completed' | 'on-hold';
  phases: ProjectPhase[] | null;
  attachments: ProjectAttachment[] | null;
  created_at: string;
  updated_at: string;
}

const PROJECTS_SELECT =
  'id,user_id,owner_email,name,type,description,priority,start_date,estimated_end_date,overall_progress,status,phases,attachments,created_at,updated_at';

const normalizeString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const normalizeNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const mapProjectRow = (row: ProjectRow): ProjectRecord => ({
  id: row.id,
  userId: row.user_id ?? undefined,
  ownerEmail: row.owner_email ?? undefined,
  name: row.name,
  type: row.type,
  description: row.description ?? undefined,
  priority: row.priority ?? undefined,
  startDate: row.start_date ?? undefined,
  estimatedEndDate: row.estimated_end_date ?? undefined,
  overallProgress: row.overall_progress,
  status: row.status,
  phases: Array.isArray(row.phases) ? row.phases : [],
  attachments: Array.isArray(row.attachments) ? row.attachments : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getProjectById = async (projectId: string): Promise<ProjectRecord | null> => {
  const rows = await supabaseAdminRestRequest<ProjectRow[]>(
    `/projects?select=${PROJECTS_SELECT}&id=eq.${encodeURIComponent(projectId)}&limit=1`,
  );

  return rows[0] ? mapProjectRow(rows[0]) : null;
};

export const getProjectByUserId = async (userId: string): Promise<ProjectRecord | null> => {
  const rows = await supabaseAdminRestRequest<ProjectRow[]>(
    `/projects?select=${PROJECTS_SELECT}&user_id=eq.${encodeURIComponent(userId)}&order=updated_at.desc&limit=1`,
  );

  return rows[0] ? mapProjectRow(rows[0]) : null;
};

export const getProjectByOwnerIds = async (ownerIds: string[]): Promise<ProjectRecord | null> => {
  for (const ownerId of ownerIds) {
    const project = await getProjectByUserId(ownerId);
    if (project) {
      return project;
    }
  }

  return null;
};

export const getAllProjects = async (limit?: number): Promise<ProjectRecord[]> => {
  const rows = await supabaseAdminRestRequest<ProjectRow[]>(
    `/projects?select=${PROJECTS_SELECT}&order=created_at.desc${
      typeof limit === 'number' ? `&limit=${Math.max(1, Math.floor(limit))}` : ''
    }`,
  );

  return rows.map(mapProjectRow);
};

export const updateProjectRecord = async (
  projectId: string,
  payload: Partial<ProjectRecord>,
): Promise<void> => {
  await supabaseAdminRestRequest(`/projects?id=eq.${encodeURIComponent(projectId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...(normalizeString(payload.userId) ? { user_id: payload.userId?.trim() } : {}),
      ...(normalizeString(payload.ownerEmail) ? { owner_email: payload.ownerEmail?.trim().toLowerCase() } : {}),
      ...(normalizeString(payload.name) ? { name: payload.name?.trim() } : {}),
      ...(normalizeString(payload.type) ? { type: payload.type?.trim() } : {}),
      ...(typeof payload.description === 'string' ? { description: payload.description } : {}),
      ...(typeof payload.priority === 'string' ? { priority: payload.priority } : {}),
      ...(typeof payload.startDate === 'string' ? { start_date: payload.startDate } : {}),
      ...(typeof payload.estimatedEndDate === 'string' ? { estimated_end_date: payload.estimatedEndDate } : {}),
      ...(typeof payload.overallProgress === 'number'
        ? { overall_progress: normalizeNumber(payload.overallProgress, 0) }
        : {}),
      ...(typeof payload.status === 'string' ? { status: payload.status } : {}),
      ...(Array.isArray(payload.phases) ? { phases: payload.phases } : {}),
      ...(Array.isArray(payload.attachments) ? { attachments: payload.attachments } : {}),
      updated_at: payload.updatedAt ?? new Date().toISOString(),
    }),
  });
};
