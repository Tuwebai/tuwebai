import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.SUPABASE_DB_URL?.trim();

if (!dbUrl) {
  console.error('SUPABASE_DB_URL_MISSING');
  process.exit(1);
}

const sql = `
begin;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

alter table public.users enable row level security;
alter table public.users force row level security;

alter table public.user_preferences enable row level security;
alter table public.user_preferences force row level security;

alter table public.user_privacy_settings enable row level security;
alter table public.user_privacy_settings force row level security;

alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_subscribers force row level security;

alter table public.newsletter_subscription_events enable row level security;
alter table public.newsletter_subscription_events force row level security;

alter table public.payments enable row level security;
alter table public.payments force row level security;

alter table public.payment_webhook_receipts enable row level security;
alter table public.payment_webhook_receipts force row level security;

alter table public.public_submissions enable row level security;
alter table public.public_submissions force row level security;

alter table public.testimonials enable row level security;
alter table public.testimonials force row level security;

alter table public.projects enable row level security;
alter table public.projects force row level security;

alter table public.support_tickets enable row level security;
alter table public.support_tickets force row level security;

commit;
`;

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tuwebai-supabase-hardening-'));
const tempFile = path.join(tempDir, 'security-hardening.sql');

try {
  fs.writeFileSync(tempFile, sql, 'utf8');

  const result = spawnSync('psql', [dbUrl, '-v', 'ON_ERROR_STOP=1', '-f', tempFile], {
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  console.log('SUPABASE_SECURITY_HARDENING_APPLIED');
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}
