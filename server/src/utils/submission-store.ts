import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { appLogger } from './app-logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, '../../../logs/submissions');

const ensureDir = () => {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
};

export const storeSubmission = (
  channel: 'applications' | 'testimonials' | 'contact' | 'consulta' | 'propuesta' | 'newsletter',
  payload: unknown
) => {
  ensureDir();
  const dateKey = new Date().toISOString().split('T')[0];
  const filePath = path.join(baseDir, `${channel}-${dateKey}.jsonl`);
  const line = `${JSON.stringify({ ts: new Date().toISOString(), payload })}\n`;
  fs.appendFile(filePath, line, 'utf8', (error) => {
    if (error) {
      // Evita throw en hot path de request.
      appLogger.error('submission_store.append_failed', { error: error.message, channel });
    }
  });
};
