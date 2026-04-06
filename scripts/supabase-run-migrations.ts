import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error('SUPABASE_DB_URL_MISSING');
  process.exit(1);
}

const migrationsDir = path.resolve(process.cwd(), 'supabase/migrations');
if (!fs.existsSync(migrationsDir)) {
  console.error('SUPABASE_MIGRATIONS_DIR_MISSING');
  process.exit(1);
}

const migrationFiles = fs
  .readdirSync(migrationsDir, { encoding: 'utf8' })
  .filter((file) => file.endsWith('.sql'))
  .sort((left, right) => left.localeCompare(right));

if (migrationFiles.length === 0) {
  console.log('SUPABASE_MIGRATIONS_EMPTY');
  process.exit(0);
}

for (const file of migrationFiles) {
  const fullPath = path.join(migrationsDir, file);
  console.log(`RUNNING ${file}`);

  const result = spawnSync('psql', [dbUrl, '-v', 'ON_ERROR_STOP=1', '-f', fullPath], {
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`SUPABASE_MIGRATIONS_APPLIED=${migrationFiles.length}`);
