import { z } from 'zod';

// Schema for consultation insertion
export const insertConsultationSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  empresa: z.string().optional(),
  telefono: z.string().optional(),
  tipoProyecto: z.string().optional(),
  urgente: z.boolean().default(false),
  detalleServicio: z.array(z.string()).optional(),
  secciones: z.array(z.string()).optional(),
  presupuesto: z.string().optional(),
  plazo: z.string().optional(),
  mensaje: z.string().min(1, "El mensaje es requerido"),
  comoNosEncontraste: z.string().optional()
});

// Schema for newsletter subscription
export const insertNewsletterSchema = z.object({
  email: z.string().email("Email inválido"),
  nombre: z.string().optional(),
  preferencias: z.object({
    marketing: z.boolean().default(true),
    actualizaciones: z.boolean().default(true),
    ofertas: z.boolean().default(false)
  }).optional()
});

// Schema for user registration
export const insertUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  first_name: z.string().min(1, "El nombre es requerido"),
  last_name: z.string().min(1, "El apellido es requerido"),
  role: z.enum(['user', 'admin']).default('user'),
  isActive: z.boolean().default(false),
  verificationToken: z.string().optional(),
  resetPasswordToken: z.string().optional(),
  image: z.string().optional()
});

// User preferences interface
export interface UserPreferences {
  marketing: boolean;
  actualizaciones: boolean;
  ofertas: boolean;
  notificaciones: boolean;
  tema: 'light' | 'dark' | 'auto';
  idioma: 'es' | 'en';
}

// Contact form schema
export const contactFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  asunto: z.string().min(1, "El asunto es requerido"),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres")
});

// Types derived from schemas
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>; 