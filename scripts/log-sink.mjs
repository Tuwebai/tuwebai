import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.LOG_SINK_PORT || 5055);
const HOST = process.env.LOG_SINK_HOST || '127.0.0.1';
const INGEST_PATH = process.env.LOG_SINK_PATH || '/ingest';
const API_KEY = process.env.LOG_SINK_API_KEY || '';

const LOG_DIR = path.join(process.cwd(), 'logs', 'app-sink');
const LOG_FILE = path.join(LOG_DIR, `${new Date().toISOString().slice(0, 10)}.jsonl`);

const ensureDir = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
};

const writeLine = (line) => {
  ensureDir();
  fs.appendFileSync(LOG_FILE, `${line}\n`, 'utf8');
};

const unauthorized = (res) => {
  res.statusCode = 401;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: false, error: 'unauthorized' }));
};

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== INGEST_PATH) {
    res.statusCode = 404;
    res.end();
    return;
  }

  if (API_KEY) {
    const auth = req.headers.authorization || '';
    const expected = `Bearer ${API_KEY}`;
    if (auth !== expected) {
      unauthorized(res);
      return;
    }
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString('utf8');
    if (body.length > 1_000_000) {
      req.destroy();
    }
  });

  req.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      writeLine(JSON.stringify(parsed));
      res.statusCode = 202;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: 'invalid_json' }));
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[log-sink] listening on http://${HOST}:${PORT}${INGEST_PATH}`);
});

