import { submitContactForm } from '../services/contact.service';
import type { ContactFormInput } from '../types';

export const useContactSubmission = () => {
  return {
    submitContactForm: (payload: ContactFormInput) => submitContactForm(payload),
  };
};
