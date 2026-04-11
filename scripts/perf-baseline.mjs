import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { performance } from 'node:perf_hooks';

const FRONTEND_BASE_URL = process.env.PERF_BASE_URL || 'https://tuweb-ai.com';
const BACKEND_BASE_URL = process.env.PERF_API_URL || 'https://tuwebai-backend.onrender.com';
const OUTPUT_DIR = path.join(process.cwd(), 'outputs', 'performance-baseline');

const ROUTES = [
  '/',
  '/corporativos',
  '/uxui',
  '/ecommerce',
  '/blog',
  '/blog/landing-page-negocios-locales',
  '/servicios/desarrollo-web',
  '/politica-privacidad',
];

const jsonHeaders = {
  'cache-control': 'no-cache',
  pragma: 'no-cache',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeUrl(baseUrl, route) {
  return new URL(route, baseUrl).toString();
}

function pickHeaders(headers, keys) {
  return Object.fromEntries(keys.map((key) => [key, headers.get(key) || '']));
}

async function timedFetch(url, init = {}) {
  const start = performance.now();

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(30000),
      ...init,
    });
    const headersReceivedAt = performance.now();
    const body = await response.text();
    const completedAt = performance.now();

    return {
      url,
      status: response.status,
      ok: response.ok,
      ttfbMs: Number((headersReceivedAt - start).toFixed(2)),
      totalMs: Number((completedAt - start).toFixed(2)),
      bytes: Buffer.byteLength(body, 'utf8'),
      headers: response.headers,
      body,
      error: null,
    };
  } catch (error) {
    const completedAt = performance.now();

    return {
      url,
      status: 'ERROR',
      ok: false,
      ttfbMs: null,
      totalMs: Number((completedAt - start).toFixed(2)),
      bytes: null,
      headers: new Headers(),
      body: '',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function extractCriticalAssets(html, pageUrl) {
  const assetRefs = new Set();
  const scriptRegex = /<script[^>]+src="([^"]+)"[^>]*>/gi;
  const cssRegex = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/gi;

  for (const regex of [scriptRegex, cssRegex]) {
    let match;
    while ((match = regex.exec(html)) !== null) {
      assetRefs.add(new URL(match[1], pageUrl).toString());
    }
  }

  return Array.from(assetRefs).slice(0, 6);
}

async function measurePage(route, passName) {
  const pageUrl = normalizeUrl(FRONTEND_BASE_URL, route);
  try {
    const page = await timedFetch(pageUrl, { headers: passName === 'cold' ? jsonHeaders : {} });
    const criticalAssets = extractCriticalAssets(page.body, pageUrl);

    const assets = [];
    for (const assetUrl of criticalAssets) {
      try {
        const asset = await timedFetch(assetUrl, {
          headers: passName === 'cold' ? jsonHeaders : {},
        });
        assets.push({
          url: assetUrl,
          status: asset.status,
          ttfbMs: asset.ttfbMs,
          totalMs: asset.totalMs,
          bytes: asset.bytes,
          headers: pickHeaders(asset.headers, ['cache-control', 'content-type', 'etag', 'age', 'content-encoding']),
        });
      } catch (error) {
        assets.push({
          url: assetUrl,
          status: 'ERROR',
          ttfbMs: null,
          totalMs: null,
          bytes: null,
          error: error instanceof Error ? error.message : String(error),
          headers: {},
        });
      }
    }

    return {
      route,
      page: {
        url: pageUrl,
        status: page.status,
        ttfbMs: page.ttfbMs,
        totalMs: page.totalMs,
        bytes: page.bytes,
        headers: pickHeaders(page.headers, ['cache-control', 'content-type', 'etag', 'age', 'content-encoding']),
      },
      assets,
    };
  } catch (error) {
    return {
      route,
      page: {
        url: pageUrl,
        status: 'ERROR',
        ttfbMs: null,
        totalMs: null,
        bytes: null,
        error: error instanceof Error ? error.message : String(error),
        headers: {},
      },
      assets: [],
    };
  }
}

async function measureBackend(passName) {
  const healthUrl = normalizeUrl(BACKEND_BASE_URL, '/api/health');
  try {
    const result = await timedFetch(healthUrl, { headers: passName === 'cold' ? jsonHeaders : {} });

    return {
      url: healthUrl,
      status: result.status,
      ttfbMs: result.ttfbMs,
      totalMs: result.totalMs,
      bytes: result.bytes,
      headers: pickHeaders(result.headers, ['cache-control', 'content-type', 'etag', 'age', 'content-encoding']),
    };
  } catch (error) {
    return {
      url: healthUrl,
      status: 'ERROR',
      ttfbMs: null,
      totalMs: null,
      bytes: null,
      error: error instanceof Error ? error.message : String(error),
      headers: {},
    };
  }
}

function toMarkdown(report) {
  const lines = [
    '# Production Baseline Snapshot',
    '',
    `- Generated at: ${report.generatedAt}`,
    `- Frontend base: ${report.frontendBaseUrl}`,
    `- Backend base: ${report.backendBaseUrl}`,
    '- Note: warm pass measures warmed network/CDN/backend, not browser cache reuse.',
    '',
    '## Backend Health',
    '',
    '| Pass | Status | TTFB ms | Total ms | Bytes | Cache-Control | Content-Encoding |',
    '| --- | --- | ---: | ---: | ---: | --- | --- |',
    ...report.backend.map((entry) =>
      `| ${entry.pass} | ${entry.status} | ${entry.ttfbMs ?? '-'} | ${entry.totalMs ?? '-'} | ${entry.bytes ?? '-'} | ${entry.headers['cache-control'] || '-'} | ${entry.headers['content-encoding'] || '-'} |`,
    ),
    '',
    '## Route Snapshot',
    '',
    '| Route | Pass | Status | TTFB ms | Total ms | Bytes | Cache-Control |',
    '| --- | --- | ---: | ---: | ---: | ---: | --- |',
    ...report.routes.flatMap((entry) =>
      entry.measurements.map((measurement) =>
        `| ${entry.route} | ${measurement.pass} | ${measurement.page.status} | ${measurement.page.ttfbMs ?? '-'} | ${measurement.page.totalMs ?? '-'} | ${measurement.page.bytes ?? '-'} | ${measurement.page.headers['cache-control'] || '-'} |`,
      ),
    ),
    '',
    '## Critical Asset Snapshot',
    '',
  ];

  for (const routeEntry of report.routes) {
    lines.push(`### ${routeEntry.route}`);
    lines.push('');
    for (const measurement of routeEntry.measurements) {
      lines.push(`#### ${measurement.pass}`);
      lines.push('');
      lines.push('| Asset | Status | TTFB ms | Total ms | Bytes | Cache-Control | Encoding |');
      lines.push('| --- | ---: | ---: | ---: | ---: | --- | --- |');
      for (const asset of measurement.assets) {
        lines.push(
          `| ${asset.url} | ${asset.status} | ${asset.ttfbMs ?? '-'} | ${asset.totalMs ?? '-'} | ${asset.bytes ?? '-'} | ${asset.headers['cache-control'] || '-'} | ${asset.headers['content-encoding'] || '-'} |`,
        );
      }
      if (measurement.page.error) {
        lines.push('');
        lines.push(`- Page error: ${measurement.page.error}`);
      }
      const erroredAssets = measurement.assets.filter((asset) => asset.error);
      for (const asset of erroredAssets) {
        lines.push(`- Asset error (${asset.url}): ${asset.error}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

async function main() {
  const report = {
    generatedAt: new Date().toISOString(),
    frontendBaseUrl: FRONTEND_BASE_URL,
    backendBaseUrl: BACKEND_BASE_URL,
    backend: [],
    routes: [],
  };

  for (const pass of ['cold', 'warm']) {
    if (pass === 'warm') {
      await sleep(2000);
    }

    const backendMeasurement = await measureBackend(pass);
    report.backend.push({ pass, ...backendMeasurement });

    for (const route of ROUTES) {
      const measurement = await measurePage(route, pass);
      const routeEntry = report.routes.find((entry) => entry.route === route);

      if (routeEntry) {
        routeEntry.measurements.push({ pass, ...measurement });
      } else {
        report.routes.push({
          route,
          measurements: [{ pass, ...measurement }],
        });
      }
    }
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUTPUT_DIR, 'latest.json'), JSON.stringify(report, null, 2), 'utf8');
  await fs.writeFile(path.join(OUTPUT_DIR, 'latest.md'), toMarkdown(report), 'utf8');

  console.log(`[perf-baseline] snapshot saved to ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error('[perf-baseline] fatal:', error);
  process.exitCode = 1;
});
