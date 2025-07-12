export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: Date | string;
  read: boolean;
}

export interface Consultation {
  id: number;
  name: string;
  email: string;
  phone: string;
  business: string;
  budget: string;
  projectType: string;
  deadline: string;
  message: string;
  createdAt: Date | string;
  processed: boolean;
  serviceDetails?: string[];
  sections?: string[];
}

export interface Newsletter {
  id: number;
  email: string;
  name?: string;
  source: string;
  active: boolean;
  createdAt: Date | string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date | string;
  lastLogin?: Date | string;
  isVerified: boolean;
}

export interface UserPreferences {
  id: number;
  userId: number;
  darkMode: boolean;
  emailNotifications: boolean;
  language: string;
  newsletter: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalContacts: number;
  totalConsultations: number;
  totalNewsletterSubscribers: number;
  activeNewsletterSubscribers: number;
  resourceDownloads: number;
  recentContacts: Contact[];
  recentConsultations: Consultation[];
  contactsPerDay: {date: string; count: number}[];
  consultationsPerDay: {date: string; count: number}[];
}