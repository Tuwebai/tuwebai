import { z } from 'zod';
import { PAYMENT_PLAN_VALUES } from '../constants/payment-plans';

export const contactSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'El nombre es requerido' }).min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string({ required_error: 'El email es requerido' }).email('Email invalido'),
    title: z.string().optional(),
    message: z.string({ required_error: 'El mensaje es requerido' }).min(10, 'El mensaje debe tener al menos 10 caracteres')
  })
});

export const consultationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'El nombre es requerido' }).min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string({ required_error: 'El email es requerido' }).email('Email invalido'),
    title: z.string({ required_error: 'El titulo es requerido' }).min(2, 'Titulo muy corto'),
    message: z.string({ required_error: 'El mensaje es requerido' }).min(10, 'El mensaje debe tener al menos 10 caracteres')
  })
});

export const paymentPreferenceSchema = z.object({
  body: z.object({
    plan: z.enum(PAYMENT_PLAN_VALUES, {
      required_error: "Plan requerido ('esencial', 'avanzado' o 'premium')",
      invalid_type_error: "Plan invalido ('esencial', 'avanzado' o 'premium')"
    })
  })
});

export const proposalSchema = z.object({
  body: z.object({
    nombre: z.string({ required_error: 'El nombre es requerido' }).min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string({ required_error: 'El email es requerido' }).email('Email invalido'),
    tipo_proyecto: z.string().min(2, 'El tipo de proyecto es requerido'),
    servicios: z.string().min(2, 'Debe especificar al menos un servicio').optional().default('No especificado'),
    presupuesto: z.string().min(2, 'Debe especificar un presupuesto').optional().default('No especificado'),
    plazo: z.string().min(2, 'Debe especificar un plazo').optional().default('No especificado'),
    detalles: z.string({ required_error: 'Los detalles son requeridos' }).min(10, 'Los detalles deben tener al menos 10 caracteres')
  })
});

export const newsletterSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'El email es requerido' }).email('Email invalido'),
    source: z.string().min(1, 'Source invalido').max(100).optional().default('website')
  })
});

export const authVerifyParamsSchema = z.object({
  params: z.object({
    token: z.string({ required_error: 'Token requerido' }).min(6, 'Token invalido')
  })
});

export const authDevVerifyParamsSchema = z.object({
  params: z.object({
    email: z.string({ required_error: 'Email requerido' }).email('Email invalido')
  })
});

export const paymentStatusParamsSchema = z.object({
  params: z.object({
    paymentId: z
      .string({ required_error: 'paymentId requerido' })
      .min(1, 'paymentId invalido')
      .regex(/^[a-zA-Z0-9_-]+$/, 'paymentId invalido'),
  }),
});

export const userUidParamsSchema = z.object({
  params: z.object({
    uid: z.string({ required_error: 'uid requerido' }).min(1, 'uid invalido').max(128, 'uid invalido'),
  }),
});

export const userUpdateSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalido').optional(),
    username: z.string().min(1, 'username invalido').max(120).optional(),
    name: z.string().min(1, 'name invalido').max(120).optional(),
    image: z.string().max(4000).optional(),
    role: z.string().max(50).optional(),
    isActive: z.boolean().optional(),
    projectId: z.string().max(200).optional(),
  }),
});

export const userPreferencesUpdateSchema = z.object({
  body: z.object({
    emailNotifications: z.boolean().optional(),
    newsletter: z.boolean().optional(),
    darkMode: z.boolean().optional(),
    language: z.string().min(2).max(20).optional(),
  }),
});

export const ticketIdParamsSchema = z.object({
  params: z.object({
    uid: z.string().min(1).max(128),
    ticketId: z.string().min(1).max(128),
  }),
});

export const ticketOnlyParamsSchema = z.object({
  params: z.object({
    ticketId: z.string().min(1).max(128),
  }),
});

export const projectIdParamsSchema = z.object({
  params: z.object({
    projectId: z.string().min(1).max(128),
  }),
});

export const ticketCreateSchema = z.object({
  body: z.object({
    userId: z.string().min(1).max(128),
    subject: z.string().min(2).max(300),
    message: z.string().min(2).max(5000),
    status: z.enum(['open', 'in-progress', 'resolved']).optional().default('open'),
    priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
    responses: z.array(z.any()).optional().default([]),
  }),
});

export const ticketUpdateSchema = z.object({
  body: z.object({
    subject: z.string().min(2).max(300).optional(),
    message: z.string().min(2).max(5000).optional(),
    status: z.enum(['open', 'in-progress', 'resolved']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    responses: z.array(z.any()).optional(),
  }),
});

export const ticketResponseSchema = z.object({
  body: z.object({
    message: z.string().min(2).max(5000),
    author: z.string().min(1).max(120),
    authorType: z.enum(['client', 'admin']),
    createdAt: z.string().optional(),
  }),
});

export const projectUpdateSchema = z.object({
  body: z.object({
    userId: z.string().min(1).max(128).optional(),
    name: z.string().min(1).max(300).optional(),
    type: z.string().min(1).max(120).optional(),
    startDate: z.string().optional(),
    estimatedEndDate: z.string().optional(),
    overallProgress: z.number().min(0).max(100).optional(),
    status: z.enum(['active', 'completed', 'on-hold']).optional(),
    phases: z.array(z.any()).optional(),
  }),
});

export const testimonialIdParamsSchema = z.object({
  params: z.object({
    testimonialId: z.string().min(1).max(128),
  }),
});

export const testimonialUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120).optional(),
    company: z.string().min(2).max(200).optional(),
    testimonial: z.string().min(10).max(5000).optional(),
    isNew: z.boolean().optional(),
    isApproved: z.boolean().optional(),
    status: z.string().max(60).optional(),
  }),
});

export const testimonialSubmissionSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'El nombre es requerido' }).min(2, 'Nombre demasiado corto'),
    company: z.string().min(2, 'Empresa demasiado corta').optional().default('Cliente'),
    testimonial: z.string({ required_error: 'El testimonio es requerido' }).min(10, 'Testimonio demasiado corto'),
  }),
});

export const applicationSubmissionSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'El nombre es requerido' }).min(2, 'Nombre demasiado corto'),
    email: z.string({ required_error: 'El email es requerido' }).email('Email invalido'),
    phone: z.string().max(50).optional(),
    experience: z.string().max(100).optional(),
    portfolio: z.string().max(300).optional(),
    message: z.string().max(3000).optional(),
    position: z.string({ required_error: 'La posicion es requerida' }).min(2, 'Posicion invalida'),
    department: z.string({ required_error: 'El departamento es requerido' }).min(2, 'Departamento invalido'),
    type: z.string({ required_error: 'El tipo es requerido' }).min(2, 'Tipo invalido'),
  }),
});
