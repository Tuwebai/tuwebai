import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('5000'),
    SESSION_SECRET: z.string().min(10, 'SESSION_SECRET debe tener al menos 10 caracteres'),
    ALLOWED_ORIGINS: z
      .string()
      .default('http://localhost:5173,http://localhost:3000,https://tuweb-ai.com,https://www.tuweb-ai.com')
      .transform((str) => str.split(',').map((s) => s.trim())),
    FRONTEND_URL: z.string().url('FRONTEND_URL debe ser una URL valida').default('https://tuweb-ai.com'),
    BACKEND_URL: z.string().url('BACKEND_URL debe ser una URL valida').optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_HOST: z.string().default('smtp.gmail.com'),
    SMTP_PORT: z.string().transform(Number).default('465'),
    SMTP_SECURE: z
      .string()
      .optional()
      .transform((v) => v !== 'false'),
    MERCADOPAGO_ACCESS_TOKEN: z
      .string()
      .min(1, 'MERCADOPAGO_ACCESS_TOKEN es requerido para produccion')
      .optional(),
    MERCADOPAGO_WEBHOOK_SECRET: z
      .string()
      .min(1, 'MERCADOPAGO_WEBHOOK_SECRET es requerido para produccion')
      .optional(),
    FIREBASE_PROJECT_ID: z.string().optional(),
    FIREBASE_SERVICE_ACCOUNT_KEY: z.string().optional(),
    FIREBASE_SERVICE_ACCOUNT_JSON: z.string().optional(),
    ENFORCE_FIREBASE_AUTH: z
      .string()
      .optional()
      .transform((v) => v === 'true'),
    LOG_SINK_URL: z.string().url('LOG_SINK_URL debe ser una URL valida').optional(),
    LOG_SINK_API_KEY: z.string().optional(),
    LOG_SINK_TIMEOUT_MS: z.string().transform(Number).default('2000'),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production') {
      if (!data.SMTP_USER?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'SMTP_USER es requerido en produccion para envio de emails',
          path: ['SMTP_USER'],
        });
      }
      if (!data.SMTP_PASS?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'SMTP_PASS es requerido en produccion para envio de emails',
          path: ['SMTP_PASS'],
        });
      }
    }
  });

export type EnvConfig = z.infer<typeof envSchema>;

let envVariables: EnvConfig;

try {
  console.log('Validando variables de entorno...');
  envVariables = envSchema.parse(process.env);
  console.log('Variables de entorno validadas correctamente.');
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Error critico: fallo la validacion de las variables de entorno:');
    error.errors.forEach((err) => {
      console.error(`  - [${err.path.join('.')}] ${err.message}`);
    });
    process.exit(1);
  } else {
    console.error('Error desconocido validando variables de entorno:', error);
    process.exit(1);
  }
}

export const env = envVariables;
