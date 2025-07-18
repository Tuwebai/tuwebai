// Storage functions for the backend
// This file provides basic storage operations

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  verificationToken: string | null;
  resetPasswordToken: string | null;
  image: string | null;
}

export interface Event {
  eventType: string;
  eventCategory?: string;
  eventAction: string;
  eventLabel: string;
  userId?: number;
  sessionId: string;
  path: string;
  referrer: string;
  userAgent: string;
  ipAddress: string;
}

class Storage {
  // Mock storage for development
  private users: Map<number, User> = new Map();
  private events: Event[] = [];

  async getUser(userId: number): Promise<User | null> {
    // Mock implementation - in production this would query a database
    return this.users.get(userId) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = Date.now();
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(userId: number, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async trackEvent(event: Event): Promise<void> {
    // Mock implementation - in production this would save to analytics database
    this.events.push(event);
    console.log('Event tracked:', event.eventType, event.eventAction);
  }

  async getEvents(limit: number = 100): Promise<Event[]> {
    return this.events.slice(-limit);
  }
}

export const storage = new Storage(); 