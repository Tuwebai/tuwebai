// Usar API REST en lugar de Firebase directo para evitar problemas de permisos

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
    const response = await fetch('/api/testimonials/');
    const result = await response.json();
    
    if (result.success) {
      return result.data || [];
    } else {
      console.error('Error getting testimonials:', result.error);
      return [];
    }
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
    const response = await fetch('/api/testimonials/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testimonial)
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result.data?.id || 'created';
    } else {
      throw new Error(result.error || 'Error al crear el testimonio');
    }
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
    const response = await fetch(`/api/testimonials/${testimonialId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error al actualizar el testimonio');
    }
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw new Error('Error al actualizar el testimonio');
  }
}

/**
 * Eliminar un testimonio
 */
export async function deleteTestimonial(testimonialId: string): Promise<void> {
  try {
    const response = await fetch(`/api/testimonials/${testimonialId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error al eliminar el testimonio');
    }
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
    const response = await fetch(`/api/testimonials/${testimonialId}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting testimonial:', error);
    return null;
  }
}


