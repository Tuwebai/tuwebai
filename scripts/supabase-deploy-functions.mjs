import 'dotenv/config';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const functionNames = [
  'public-submission-intake',
  'brevo-webhook-intake',
  'contact-intake',
  'proposal-intake',
  'application-intake',
  'checklist-intake',
  'newsletter-subscribe',
  'newsletter-confirm',
  'newsletter-unsubscribe',
  'payment-preference',
  'payment-webhook-intake',
  'password-reset-metadata',
];

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const accessToken = process.env.SUPABASE_ACCESS_TOKEN?.trim();

if (!supabaseUrl) {
  console.error('SUPABASE_URL es requerida para deploy de edge functions.');
  process.exit(1);
}

if (!accessToken) {
  console.error('SUPABASE_ACCESS_TOKEN es requerido para deploy de edge functions.');
  process.exit(1);
}

const projectRef = new URL(supabaseUrl).host.split('.')[0];

for (const functionName of functionNames) {
  const result = spawnSync(
    'pnpm',
    [
      'dlx',
      'supabase',
      'functions',
      'deploy',
      functionName,
      '--project-ref',
      projectRef,
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        SUPABASE_ACCESS_TOKEN: accessToken,
      },
      shell: process.platform === 'win32',
      stdio: 'inherit',
    },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
