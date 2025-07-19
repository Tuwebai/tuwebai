import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where
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