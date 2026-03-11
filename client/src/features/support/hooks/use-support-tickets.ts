import {
  addTicketResponse,
  createTicket,
  getAllTickets,
  getUserTickets,
  updateTicket,
} from '../services/support.service';
import type { SupportTicket, TicketResponse } from '../types';

export const useSupportTickets = () => {
  return {
    addTicketResponse: (ticketId: string, response: Omit<TicketResponse, 'id'>) =>
      addTicketResponse(ticketId, response),
    createTicket: (ticket: Omit<SupportTicket, 'id'>) => createTicket(ticket),
    getAllTickets: (limit?: number) => getAllTickets(limit),
    getUserTickets: (userId: string, limit?: number) => getUserTickets(userId, limit),
    updateTicket: (ticketId: string, data: Partial<SupportTicket>) => updateTicket(ticketId, data),
  };
};
