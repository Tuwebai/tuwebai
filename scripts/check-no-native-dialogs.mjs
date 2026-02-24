import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = ['client/src'];
const ALLOWED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);
const FORBIDDEN_PATTERNS = [/\balert\s*\(/g, /\bconfirm\s*\(/g, /\bprompt\s*\(/g];

const violations = [];

function walk(dirPath) {
  const entries = readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const info = statSync(fullPath);
    if (info.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!ALLOWED_EXTENSIONS.has(extname(fullPath))) continue;
    const content = readFileSync(fullPath, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      FORBIDDEN_PATTERNS.forEach((pattern) => {
        if (pattern.test(line)) {
          violations.push({
            file: fullPath.replace(ROOT + '\\', '').replace(ROOT + '/', ''),
            line: index + 1,
            source: line.trim(),
          });
        }
        pattern.lastIndex = 0;
      });
    });
  }
}

for (const relativeDir of TARGET_DIRS) {
  walk(join(ROOT, relativeDir));
}

if (violations.length > 0) {
  console.error('Native browser dialogs are forbidden in client/src:');
  violations.forEach((v) => {
    console.error(`- ${v.file}:${v.line} -> ${v.source}`);
  });
  process.exit(1);
}

console.log('OK: no native dialogs found in client/src');
