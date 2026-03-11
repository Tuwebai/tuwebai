export interface ContactFormInput {
  name: string;
  email: string;
  title?: string;
  message: string;
  source?: string;
}

export type ContactFieldErrors = Record<string, string>;
