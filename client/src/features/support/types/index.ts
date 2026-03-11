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
