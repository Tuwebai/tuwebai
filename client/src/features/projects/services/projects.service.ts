import { backendApi } from '@/lib/backend-api';
import type { Project } from '../types';

export async function getUserProject(userId: string): Promise<Project | null> {
  const res = await backendApi.getUserProject(userId);
  return (res?.data as Project | null) || null;
}

export async function getAllProjects(limit?: number): Promise<Project[]> {
  const res = await backendApi.getAllProjects(limit);
  return (res?.data as Project[] | undefined) || [];
}

export async function updateProject(projectId: string, data: Partial<Project>): Promise<void> {
  await backendApi.updateProject(projectId, {
    ...data,
    updatedAt: new Date().toISOString(),
  } as Record<string, unknown>);
}
