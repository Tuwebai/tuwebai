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

export interface TestimonialsListItem {
  name: string;
  company: string;
  testimonial: string;
  isNew?: boolean;
}

export type CreateTestimonialInput = Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>;
