import { z } from 'zod';
import type { DefaultValues } from 'react-hook-form';

export const COUNTRIES = [
  { id: 'AR', label: 'Argentina' },
  { id: 'MX', label: 'México' },
  { id: 'CO', label: 'Colombia' },
  { id: 'CL', label: 'Chile' },
  { id: 'PE', label: 'Perú' },
  { id: 'UY', label: 'Uruguay' },
  { id: 'otro', label: 'Otro país' },
] as const;

export const PROJECT_TYPES = [
  {
    id: 'web-corporativa',
    label: 'Sitio web corporativo',
    description: 'Presencia profesional, servicios y contacto.',
    icon: 'globe',
  },
  {
    id: 'ecommerce',
    label: 'Tienda online',
    description: 'Catálogo, carrito y cobros con Mercado Pago o Stripe.',
    icon: 'shopping-bag',
  },
  {
    id: 'sistema-web',
    label: 'Sistema o plataforma web',
    description: 'Paneles, reservas, CRM o lógica de negocio a medida.',
    icon: 'layout-dashboard',
  },
] as const;

export const BUDGET_RANGES = [
  { id: 'hasta-1500', label: 'Hasta USD 1.500' },
  { id: '1500-3000', label: 'USD 1.500 - 3.000' },
  { id: '3000-6000', label: 'USD 3.000 - 6.000' },
  { id: 'mas-6000', label: 'Más de USD 6.000' },
  { id: 'no-se', label: 'Aún no lo tengo claro' },
] as const;

export const DEADLINES = [
  { id: 'urgente', label: 'Lo antes posible' },
  { id: '1-2-meses', label: '1 a 2 meses' },
  { id: '2-4-meses', label: '2 a 4 meses' },
  { id: 'sin-apuro', label: 'Sin apuro' },
] as const;

export const LEAD_SOURCES = [
  { id: 'google', label: 'Google' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'recomendacion', label: 'Me lo recomendaron' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'otro', label: 'Otro' },
] as const;

export const formSchema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Ingresá un email válido'),
  pais: z.enum(COUNTRIES.map((country) => country.id) as ['AR', 'MX', 'CO', 'CL', 'PE', 'UY', 'otro'], {
    errorMap: () => ({ message: 'Seleccioná tu país' }),
  }),
  tipo_proyecto: z.enum(
    PROJECT_TYPES.map((projectType) => projectType.id) as ['web-corporativa', 'ecommerce', 'sistema-web'],
    {
      errorMap: () => ({ message: 'Seleccioná el tipo de proyecto' }),
    },
  ),
  descripcion: z.string().min(20, 'Contanos un poco más sobre tu proyecto (mín. 20 caracteres)'),
  presupuesto_rango: z
    .enum(BUDGET_RANGES.map((budgetRange) => budgetRange.id) as ['hasta-1500', '1500-3000', '3000-6000', 'mas-6000', 'no-se'])
    .optional(),
  plazo: z
    .enum(DEADLINES.map((deadline) => deadline.id) as ['urgente', '1-2-meses', '2-4-meses', 'sin-apuro'])
    .optional(),
  como_nos_encontraste: z
    .enum(LEAD_SOURCES.map((source) => source.id) as ['google', 'linkedin', 'recomendacion', 'instagram', 'otro'])
    .optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const TOTAL_STEPS = 3;

export const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ['nombre', 'email', 'pais'],
  2: ['tipo_proyecto', 'descripcion'],
  3: [],
};

export const defaultValues: DefaultValues<FormValues> = {
  nombre: '',
  email: '',
  descripcion: '',
  presupuesto_rango: undefined,
  plazo: undefined,
  como_nos_encontraste: undefined,
};
