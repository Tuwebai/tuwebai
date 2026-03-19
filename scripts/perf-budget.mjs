import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DIST_ASSETS_DIR = path.join(process.cwd(), 'dist', 'assets');
const OUTPUT_DIR = path.join(process.cwd(), 'outputs', 'performance-baseline');

const BUDGETS = [
  { name: 'entry-js', pattern: /^index-.*\.js$/, maxBytes: 335_000, required: true },
  { name: 'entry-css', pattern: /^index-.*\.css$/, maxBytes: 113_500, required: true },
  { name: 'motion-vendor', pattern: /^motion-.*\.js$/, maxBytes: 132_500, required: true },
  { name: 'radix-vendor', pattern: /^radix-react-primitive-.*\.js$/, maxBytes: 287_000, required: true },
  { name: 'firebase-vendor', pattern: /^firebase--.*\.js$/, maxBytes: 430_000, required: true },
];

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(2)} KiB`;
}

async function getAssets() {
  const entries = await fs.readdir(DIST_ASSETS_DIR, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const filePath = path.join(DIST_ASSETS_DIR, entry.name);
    const stats = await fs.stat(filePath);
    files.push({ name: entry.name, bytes: stats.size, mtimeMs: stats.mtimeMs });
  }

  return files;
}

function evaluateBudget(assets, budget) {
  const matches = assets
    .filter((asset) => budget.pattern.test(asset.name))
    .sort((a, b) => b.mtimeMs - a.mtimeMs || b.bytes - a.bytes);
  const asset = matches[0] || null;

  if (!asset) {
    return {
      name: budget.name,
      status: budget.required ? 'missing' : 'skipped',
      maxBytes: budget.maxBytes,
      asset: null,
    };
  }

  return {
    name: budget.name,
    status: asset.bytes <= budget.maxBytes ? 'pass' : 'fail',
    maxBytes: budget.maxBytes,
    asset,
  };
}

function toMarkdown(results) {
  return [
    '# Performance Build Budget',
    '',
    '| Budget | Status | Asset | Actual | Max |',
    '| --- | --- | --- | ---: | ---: |',
    ...results.map((result) => {
      const actual = result.asset ? formatKiB(result.asset.bytes) : '-';
      const assetName = result.asset?.name || '-';
      return `| ${result.name} | ${result.status} | ${assetName} | ${actual} | ${formatKiB(result.maxBytes)} |`;
    }),
    '',
  ].join('\n');
}

async function main() {
  const assets = await getAssets();
  const results = BUDGETS.map((budget) => evaluateBudget(assets, budget));
  const hasFailure = results.some((result) => result.status !== 'pass');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'build-budget.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        results,
      },
      null,
      2,
    ),
    'utf8',
  );
  await fs.writeFile(path.join(OUTPUT_DIR, 'build-budget.md'), toMarkdown(results), 'utf8');

  for (const result of results) {
    if (!result.asset) {
      console.error(`[perf-budget] ${result.name}: missing`);
      continue;
    }

    const summary = `${result.asset.name} ${formatKiB(result.asset.bytes)} / max ${formatKiB(result.maxBytes)}`;
    if (result.status === 'pass') {
      console.log(`[perf-budget] PASS ${result.name}: ${summary}`);
    } else {
      console.error(`[perf-budget] FAIL ${result.name}: ${summary}`);
    }
  }

  if (hasFailure) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[perf-budget] error', error);
  process.exitCode = 1;
});
