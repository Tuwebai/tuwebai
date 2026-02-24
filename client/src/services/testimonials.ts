import { backendApi } from '@/lib/backend-api';

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

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await backendApi.getTestimonials(30);
    return (res?.data as Testimonial[] | undefined) || [];
  } catch (error) {
    console.error('Error getting testimonials:', error);
    return [];
  }
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const data = await backendApi.submitTestimonial(testimonial);
  return data.id || `pending-${Date.now()}`;
}

export async function updateTestimonial(testimonialId: string, data: Partial<Testimonial>): Promise<void> {
  try {
    await backendApi.updateTestimonial(testimonialId, {
      ...data,
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw new Error('Error al actualizar el testimonio');
  }
}

export async function deleteTestimonial(testimonialId: string): Promise<void> {
  try {
    await backendApi.deleteTestimonial(testimonialId);
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw new Error('Error al eliminar el testimonio');
  }
}

export async function getTestimonial(testimonialId: string): Promise<Testimonial | null> {
  try {
    const res = await backendApi.getTestimonialById(testimonialId);
    return (res?.data as Testimonial | undefined) || null;
  } catch (error) {
    console.error('Error getting testimonial:', error);
    return null;
  }
}
