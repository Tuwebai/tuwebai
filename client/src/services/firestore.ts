import { backendApi } from '@/lib/backend-api';
import {
  addTicketResponse as addSupportTicketResponse,
  createTicket as createSupportTicket,
  getAllTickets as getAllSupportTickets,
  getUserTickets as getSupportUserTickets,
  updateTicket as updateSupportTicket,
} from '@/features/support/services/support.service';
import type { SupportTicket, TicketResponse } from '@/features/support/types';

export interface User {
  uid: string;
  email: string;
  username?: string;
  name?: string;
  image?: string;
  role?: string;
  isActive?: boolean;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  newsletter: boolean;
  darkMode: boolean;
  language: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  type: string;
  startDate: string;
  estimatedEndDate: string;
  overallProgress: number;
  status: 'active' | 'completed' | 'on-hold';
  phases: ProjectPhase[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
  estimatedDate: string;
  completedDate?: string;
  progress: number;
  files?: ProjectFile[];
  comments?: Comment[];
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  authorType: 'client' | 'admin';
  createdAt: string;
}

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
  try {
    const res = await backendApi.getUser(uid);
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function setUser(user: User): Promise<void> {
  await backendApi.upsertUser(user.uid, {
    ...user,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  await backendApi.upsertUser(uid, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function getUserPreferences(uid: string): Promise<UserPreferences | null> {
  try {
    const res = await backendApi.getUserPreferences(uid);
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function setUserPreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
  await backendApi.setUserPreferences(uid, preferences);
}

// Nuevas funciones para el dashboard
export async function getUserProject(userId: string): Promise<Project | null> {
  const res = await backendApi.getUserProject(userId);
  return (res?.data as Project | null) || null;
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
  const res = await backendApi.getAllProjects(limit);
  return (res?.data as Project[] | undefined) || [];
}

export async function getAllTickets(limit?: number): Promise<SupportTicket[]> {
  return getAllSupportTickets(limit);
}

export async function updateProject(projectId: string, data: Partial<Project>): Promise<void> {
  await backendApi.updateProject(projectId, {
    ...data,
    updatedAt: new Date().toISOString(),
  } as Record<string, unknown>);
} 
