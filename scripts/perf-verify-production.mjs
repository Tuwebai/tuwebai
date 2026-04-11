import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { performance } from 'node:perf_hooks';

const FRONTEND_BASE_URL = process.env.PERF_BASE_URL || 'https://tuweb-ai.com';
const BACKEND_BASE_URL = process.env.PERF_API_URL || 'https://tuwebai-backend.onrender.com';
const OUTPUT_DIR = path.join(process.cwd(), 'outputs', 'performance-baseline');

const SCENARIOS = [
  { name: 'home.cold', url: '/', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'home.warm', url: '/', base: 'frontend', cacheBypass: false, followRedirects: true, expectStatus: [200] },
  { name: 'solutions.corporativos.direct', url: '/corporativos', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'solutions.uxui.direct', url: '/uxui', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'solutions.ecommerce.direct', url: '/ecommerce', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'blog.index.direct', url: '/blog', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'blog.article.direct', url: '/blog/landing-page-negocios-locales', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'service.web.direct', url: '/servicios/desarrollo-web', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'legal.privacy.direct', url: '/politica-privacidad', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'legal.privacy.legacy-redirect', url: '/politica-de-privacidad', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'faq.direct', url: '/faq', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'contact.direct', url: '/contacto', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'legacy.marketing.legacy-entry', url: '/servicios/consultoria-estrategica', base: 'frontend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
  { name: 'backend.health', url: '/api/health', base: 'backend', cacheBypass: true, followRedirects: true, expectStatus: [200] },
];

function resolveBase(base) {
  return base === 'backend' ? BACKEND_BASE_URL : FRONTEND_BASE_URL;
}

function normalizeUrl(baseUrl, route) {
  return new URL(route, baseUrl).toString();
}

function pickHeaders(headers, keys) {
  return Object.fromEntries(keys.map((key) => [key, headers.get(key) || '']));
}

async function timedFetch(url, init = {}) {
  const startedAt = performance.now();
  const response = await fetch(url, {
    redirect: init.redirect || 'follow',
    signal: AbortSignal.timeout(30000),
    headers: init.headers,
  });
  const headersAt = performance.now();
  await response.text();
  const completedAt = performance.now();

  return {
    status: response.status,
    ok: response.ok,
    redirected: response.redirected,
    location: response.headers.get('location') || '',
    ttfbMs: Number((headersAt - startedAt).toFixed(2)),
    totalMs: Number((completedAt - startedAt).toFixed(2)),
    headers: pickHeaders(response.headers, ['cache-control', 'content-type', 'etag', 'age', 'content-encoding', 'location']),
  };
}

async function runScenario(scenario) {
  const url = normalizeUrl(resolveBase(scenario.base), scenario.url);
  const headers = scenario.cacheBypass
    ? { 'cache-control': 'no-cache', pragma: 'no-cache' }
    : undefined;

  try {
    const result = await timedFetch(url, {
      headers,
      redirect: scenario.followRedirects ? 'follow' : 'manual',
    });

    const passed = scenario.expectStatus.includes(result.status);

    return {
      ...scenario,
      url,
      passed,
      ...result,
      error: null,
    };
  } catch (error) {
    return {
      ...scenario,
      url,
      passed: false,
      status: 'ERROR',
      redirected: false,
      location: '',
      ttfbMs: null,
      totalMs: null,
      headers: {},
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function toMarkdown(results) {
  return [
    '# Production Verification Matrix',
    '',
    `- Generated at: ${new Date().toISOString()}`,
    `- Frontend base: ${FRONTEND_BASE_URL}`,
    `- Backend base: ${BACKEND_BASE_URL}`,
    '',
    '| Scenario | Status | Pass | TTFB ms | Total ms | Redirected | Location | Cache-Control |',
    '| --- | ---: | --- | ---: | ---: | --- | --- | --- |',
    ...results.map((result) =>
      `| ${result.name} | ${result.status} | ${result.passed ? 'yes' : 'no'} | ${result.ttfbMs ?? '-'} | ${result.totalMs ?? '-'} | ${result.redirected ? 'yes' : 'no'} | ${result.location || '-'} | ${result.headers['cache-control'] || '-'} |`,
    ),
    '',
  ].join('\n');
}

async function main() {
  const results = [];

  for (const scenario of SCENARIOS) {
    results.push(await runScenario(scenario));
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUTPUT_DIR, 'verification-matrix.json'), JSON.stringify(results, null, 2), 'utf8');
  await fs.writeFile(path.join(OUTPUT_DIR, 'verification-matrix.md'), toMarkdown(results), 'utf8');

  const failed = results.filter((result) => !result.passed);

  for (const result of results) {
    const summary = `${result.name}: status=${result.status} ttfb=${result.ttfbMs ?? '-'}ms total=${result.totalMs ?? '-'}ms`;
    if (result.passed) {
      console.log(`[perf-verify] PASS ${summary}`);
    } else {
      console.error(`[perf-verify] FAIL ${summary}${result.error ? ` error=${result.error}` : ''}`);
    }
  }

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[perf-verify] fatal', error);
  process.exitCode = 1;
});
