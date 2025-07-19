import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  addDoc,
  orderBy,
  limit
} from 'firebase/firestore';

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
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as User) : null;
}

export async function setUser(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    ...user,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function getUserPreferences(uid: string): Promise<UserPreferences | null> {
  const prefRef = doc(db, 'users', uid);
  const snap = await getDoc(prefRef);
  return snap.exists() && snap.data().preferences ? snap.data().preferences as UserPreferences : null;
}

export async function setUserPreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
  const prefRef = doc(db, 'users', uid);
  await setDoc(prefRef, {
    preferences: {
      ...preferences,
      updatedAt: new Date().toISOString(),
    },
  }, { merge: true });
}

// Nuevas funciones para el dashboard
export async function getUserProject(userId: string): Promise<Project | null> {
  const projectsRef = collection(db, 'projects');
  const q = query(projectsRef, where('userId', '==', userId), limit(1));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Project;
}

export async function getUserPayments(userId: string): Promise<Payment[]> {
  const paymentsRef = collection(db, 'payments');
  const q = query(paymentsRef, where('userId', '==', userId), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Payment);
}

export async function getUserTickets(userId: string): Promise<SupportTicket[]> {
  const ticketsRef = collection(db, 'support_tickets');
  const q = query(ticketsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as SupportTicket);
}

export async function createTicket(ticket: Omit<SupportTicket, 'id'>): Promise<string> {
  const ticketsRef = collection(db, 'support_tickets');
  const docRef = await addDoc(ticketsRef, {
    ...ticket,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateTicket(ticketId: string, data: Partial<SupportTicket>): Promise<void> {
  const ticketRef = doc(db, 'support_tickets', ticketId);
  await updateDoc(ticketRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function addTicketResponse(ticketId: string, response: Omit<TicketResponse, 'id'>): Promise<void> {
  const ticketRef = doc(db, 'support_tickets', ticketId);
  const ticket = await getDoc(ticketRef);
  
  if (ticket.exists()) {
    const currentResponses = ticket.data().responses || [];
    const newResponses = [...currentResponses, { id: Date.now().toString(), ...response }];
    
    await updateDoc(ticketRef, {
      responses: newResponses,
      updatedAt: new Date().toISOString(),
    });
  }
}

// Funciones para admin
export async function getAllProjects(): Promise<Project[]> {
  const projectsRef = collection(db, 'projects');
  const q = query(projectsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Project);
}

export async function getAllTickets(): Promise<SupportTicket[]> {
  const ticketsRef = collection(db, 'support_tickets');
  const q = query(ticketsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as SupportTicket);
}

export async function updateProject(projectId: string, data: Partial<Project>): Promise<void> {
  const projectRef = doc(db, 'projects', projectId);
  await updateDoc(projectRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
} 