import { BarChart3, Bot, CreditCard, MessageCircleMore, type LucideIcon } from 'lucide-react';

export type UserIntegrationCapabilityStatus = 'disponible' | 'requiere-implementacion' | 'proximamente';

export type UserIntegrationCapability = {
  id: string;
  title: string;
  description: string;
  status: UserIntegrationCapabilityStatus;
  icon: LucideIcon;
};

export const USER_INTEGRATION_CAPABILITIES: UserIntegrationCapability[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp comercial',
    description: 'Centraliza conversaciones, capta consultas y acelera la respuesta a leads desde un canal directo.',
    status: 'disponible',
    icon: MessageCircleMore,
  },
  {
    id: 'automation',
    title: 'Automatizaciones de seguimiento',
    description: 'Definimos secuencias para responder, calificar y ordenar oportunidades sin perder tiempo operativo.',
    status: 'requiere-implementacion',
    icon: Bot,
  },
  {
    id: 'analytics',
    title: 'Analitica y medicion',
    description: 'Conecta reportes y objetivos para entender de donde vienen los leads y que canales convierten mejor.',
    status: 'requiere-implementacion',
    icon: BarChart3,
  },
  {
    id: 'payments',
    title: 'Cobros y reservas',
    description: 'Preparamos integraciones de pago o reserva para negocios que necesiten validar intentos de compra o turnos.',
    status: 'proximamente',
    icon: CreditCard,
  },
];

export const USER_INTEGRATION_STATUS_COPY: Record<
  UserIntegrationCapabilityStatus,
  { label: string; className: string }
> = {
  disponible: {
    label: 'Disponible para activacion',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
  'requiere-implementacion': {
    label: 'Requiere definicion',
    className: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  },
  proximamente: {
    label: 'Proximamente',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  },
};
