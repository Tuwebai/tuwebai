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
  limit,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';

export interface Testimonial {
  id?: string;
  name: string;
  company: string;
  testimonial: string;
  isNew?: boolean;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Obtener todos los testimonios
 */
export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonialsRef = collection(db, 'testimonials');
    const q = query(
      testimonialsRef,
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Testimonial[];
  } catch (error) {
    console.error('Error getting testimonials:', error);
    return [];
  }
}



/**
 * Crear un nuevo testimonio
 */
export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const testimonialsRef = collection(db, 'testimonials');
    const now = new Date().toISOString();
    
    const testimonialData = {
      ...testimonial,
      isApproved: true, // Publicado directamente
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(testimonialsRef, testimonialData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw new Error('Error al crear el testimonio');
  }
}

/**
 * Actualizar un testimonio
 */
export async function updateTestimonial(testimonialId: string, data: Partial<Testimonial>): Promise<void> {
  try {
    const testimonialRef = doc(db, 'testimonials', testimonialId);
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(testimonialRef, updateData);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw new Error('Error al actualizar el testimonio');
  }
}

/**
 * Aprobar un testimonio
 */
export async function approveTestimonial(testimonialId: string): Promise<void> {
  try {
    await updateTestimonial(testimonialId, { isApproved: true });
  } catch (error) {
    console.error('Error approving testimonial:', error);
    throw new Error('Error al aprobar el testimonio');
  }
}

/**
 * Rechazar un testimonio
 */
export async function rejectTestimonial(testimonialId: string): Promise<void> {
  try {
    await updateTestimonial(testimonialId, { isApproved: false });
  } catch (error) {
    console.error('Error rejecting testimonial:', error);
    throw new Error('Error al rechazar el testimonio');
  }
}

/**
 * Eliminar un testimonio
 */
export async function deleteTestimonial(testimonialId: string): Promise<void> {
  try {
    const testimonialRef = doc(db, 'testimonials', testimonialId);
    await deleteDoc(testimonialRef);
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw new Error('Error al eliminar el testimonio');
  }
}

/**
 * Obtener un testimonio específico
 */
export async function getTestimonial(testimonialId: string): Promise<Testimonial | null> {
  try {
    const testimonialRef = doc(db, 'testimonials', testimonialId);
    const snapshot = await getDoc(testimonialRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as Testimonial;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting testimonial:', error);
    return null;
  }
}


