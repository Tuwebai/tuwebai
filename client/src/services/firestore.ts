import { backendApi } from '@/lib/backend-api';

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

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  responses?: TicketResponse[];
}

export interface TicketResponse {
  id: string;
  message: string;
  author: string;
  authorType: 'client' | 'admin';
  createdAt: string;
}

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
  const res = await backendApi.getUserTickets(userId, limit);
  return (res?.data as SupportTicket[] | undefined) || [];
}

export async function createTicket(ticket: Omit<SupportTicket, 'id'>): Promise<string> {
  const response = await backendApi.createTicket(ticket.userId, {
    ...ticket,
    status: ticket.status || 'open',
    priority: ticket.priority || 'medium',
    responses: ticket.responses || [],
  });
  return response.id;
}

export async function updateTicket(ticketId: string, data: Partial<SupportTicket>): Promise<void> {
  let uid = data.userId;
  if (!uid) {
    const ticket = await backendApi.getTicketById(ticketId);
    uid = ticket?.data?.userId as string | undefined;
  }

  if (!uid) {
    throw new Error('No se pudo determinar el usuario del ticket');
  }

  await backendApi.updateTicket(uid, ticketId, {
    ...data,
    updatedAt: new Date().toISOString(),
  } as Record<string, unknown>);
}

export async function addTicketResponse(ticketId: string, response: Omit<TicketResponse, 'id'>): Promise<void> {
  const ticket = await backendApi.getTicketById(ticketId);
  const uid = ticket?.data?.userId as string | undefined;
  if (!uid) {
    throw new Error('No se pudo determinar el usuario del ticket');
  }
  await backendApi.addTicketResponse(uid, ticketId, {
    message: response.message,
    author: response.author,
    authorType: response.authorType,
    createdAt: response.createdAt,
  });
}

// Funciones para admin
export async function getAllProjects(limit?: number): Promise<Project[]> {
  const res = await backendApi.getAllProjects(limit);
  return (res?.data as Project[] | undefined) || [];
}

export async function getAllTickets(limit?: number): Promise<SupportTicket[]> {
  const res = await backendApi.getAllTickets(limit);
  return (res?.data as SupportTicket[] | undefined) || [];
}

export async function updateProject(projectId: string, data: Partial<Project>): Promise<void> {
  await backendApi.updateProject(projectId, {
    ...data,
    updatedAt: new Date().toISOString(),
  } as Record<string, unknown>);
} 
