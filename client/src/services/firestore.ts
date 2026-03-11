import { backendApi } from '@/lib/backend-api';
import {
  getAllProjects as getAllFeatureProjects,
  getUserProject as getFeatureUserProject,
  updateProject as updateFeatureProject,
} from '@/features/projects/services/projects.service';
import {
  addTicketResponse as addSupportTicketResponse,
  createTicket as createSupportTicket,
  getAllTickets as getAllSupportTickets,
  getUserTickets as getSupportUserTickets,
  updateTicket as updateSupportTicket,
} from '@/features/support/services/support.service';
import type { SupportTicket, TicketResponse } from '@/features/support/types';
import {
  getUser as getFeatureUser,
  getUserPreferences as getFeatureUserPreferences,
  setUser as setFeatureUser,
  setUserPreferences as setFeatureUserPreferences,
  updateUser as updateFeatureUser,
} from '@/features/users/services/users.service';
import type { User, UserPreferences } from '@/features/users/types';
import type { Project } from '@/features/projects/types';

export type { User, UserPreferences } from '@/features/users/types';
export type { Project, ProjectPhase, ProjectFile, Comment } from '@/features/projects/types';

export interface Payment {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  invoiceUrl?: string;
}

export type { SupportTicket, TicketResponse } from '@/features/support/types';

// Funciones existentes
export async function getUser(uid: string): Promise<User | null> {
  return getFeatureUser(uid);
}

export async function setUser(user: User): Promise<void> {
  return setFeatureUser(user);
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  return updateFeatureUser(uid, data);
}

export async function getUserPreferences(uid: string): Promise<UserPreferences | null> {
  return getFeatureUserPreferences(uid);
}

export async function setUserPreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
  return setFeatureUserPreferences(uid, preferences);
}

// Nuevas funciones para el dashboard
export async function getUserProject(userId: string): Promise<Project | null> {
  return getFeatureUserProject(userId);
}

export async function getUserPayments(userId: string, limit?: number): Promise<Payment[]> {
  const res = await backendApi.getUserPayments(userId, limit);
  return (res?.data as Payment[] | undefined) || [];
}

export async function getUserTickets(userId: string, limit?: number): Promise<SupportTicket[]> {
  return getSupportUserTickets(userId, limit);
}

export async function createTicket(ticket: Omit<SupportTicket, 'id'>): Promise<string> {
  return createSupportTicket(ticket);
}

export async function updateTicket(ticketId: string, data: Partial<SupportTicket>): Promise<void> {
  return updateSupportTicket(ticketId, data);
}

export async function addTicketResponse(ticketId: string, response: Omit<TicketResponse, 'id'>): Promise<void> {
  return addSupportTicketResponse(ticketId, response);
}

// Funciones para admin
export async function getAllProjects(limit?: number): Promise<Project[]> {
  return getAllFeatureProjects(limit);
}

export async function getAllTickets(limit?: number): Promise<SupportTicket[]> {
  return getAllSupportTickets(limit);
}

export async function updateProject(projectId: string, data: Partial<Project>): Promise<void> {
  return updateFeatureProject(projectId, data);
} 
