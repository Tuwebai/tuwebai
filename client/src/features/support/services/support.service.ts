import { backendApi } from '@/lib/backend-api';
import type { SupportTicket, TicketResponse } from '../types';

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

export async function getAllTickets(limit?: number): Promise<SupportTicket[]> {
  const res = await backendApi.getAllTickets(limit);
  return (res?.data as SupportTicket[] | undefined) || [];
}
