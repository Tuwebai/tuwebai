import fs from 'node:fs/promises';
import https from 'node:https';
import path from 'node:path';
import process from 'node:process';
import { lookup, resolve4 } from 'node:dns/promises';
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

function timedHttpsRequest(url, forcedIp) {
  const targetUrl = new URL(url);

  return new Promise((resolve, reject) => {
    const startedAt = performance.now();
    let headersAt = null;

    const request = https.request(
      {
        protocol: targetUrl.protocol,
        hostname: forcedIp,
        port: targetUrl.port || 443,
        path: `${targetUrl.pathname}${targetUrl.search}`,
        method: 'GET',
        servername: targetUrl.hostname,
        timeout: 15000,
        headers: {
          'cache-control': 'no-cache',
          host: targetUrl.hostname,
          pragma: 'no-cache',
        },
      },
      (response) => {
        headersAt = performance.now();
        const chunks = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          const completedAt = performance.now();
          resolve({
            ip: forcedIp,
            status: response.statusCode ?? 0,
            ttfbMs: Number(((headersAt ?? completedAt) - startedAt).toFixed(2)),
            totalMs: Number((completedAt - startedAt).toFixed(2)),
            contentLength: chunks.reduce((total, chunk) => total + chunk.length, 0),
          });
        });
      },
    );

    request.on('timeout', () => {
      request.destroy(new Error(`timeout after 15000ms via ${forcedIp}`));
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.end();
  });
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

async function runFrontendDnsAudit() {
  const hostname = new URL(FRONTEND_BASE_URL).hostname;

  try {
    let records = [];

    try {
      records = await resolve4(hostname);
    } catch {
      const resolved = await lookup(hostname, { all: true, family: 4 });
      records = resolved.map((entry) => entry.address);
    }
    const edgeChecks = [];

    for (const ip of records) {
      try {
        const result = await timedHttpsRequest(FRONTEND_BASE_URL, ip);
        edgeChecks.push({
          ...result,
          passed: result.status === 200 && result.ttfbMs < 5000,
          error: null,
        });
      } catch (error) {
        edgeChecks.push({
          ip,
          status: 'ERROR',
          ttfbMs: null,
          totalMs: null,
          contentLength: 0,
          passed: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      hostname,
      records,
      expectedApexIp: '75.2.60.5',
      edgeChecks,
      suspiciousRecords: records.filter((ip) => ip !== '75.2.60.5'),
      passed: edgeChecks.every((check) => check.passed),
    };
  } catch (error) {
    return {
      hostname,
      records: [],
      expectedApexIp: '75.2.60.5',
      edgeChecks: [],
      suspiciousRecords: [],
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function toMarkdown(results, dnsAudit) {
  return [
    '# Production Verification Matrix',
    '',
    `- Generated at: ${new Date().toISOString()}`,
    `- Frontend base: ${FRONTEND_BASE_URL}`,
    `- Backend base: ${BACKEND_BASE_URL}`,
    '',
    '## DNS audit',
    '',
    `- Hostname: ${dnsAudit.hostname}`,
    `- A records: ${dnsAudit.records.length > 0 ? dnsAudit.records.join(', ') : 'none'}`,
    `- Expected apex IP: ${dnsAudit.expectedApexIp}`,
    `- Suspicious records: ${dnsAudit.suspiciousRecords.length > 0 ? dnsAudit.suspiciousRecords.join(', ') : 'none'}`,
    '',
    '| Edge IP | Status | Pass | TTFB ms | Total ms | Error |',
    '| --- | ---: | --- | ---: | ---: | --- |',
    ...dnsAudit.edgeChecks.map((check) =>
      `| ${check.ip} | ${check.status} | ${check.passed ? 'yes' : 'no'} | ${check.ttfbMs ?? '-'} | ${check.totalMs ?? '-'} | ${check.error || '-'} |`,
    ),
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
  const dnsAudit = await runFrontendDnsAudit();

  for (const scenario of SCENARIOS) {
    results.push(await runScenario(scenario));
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUTPUT_DIR, 'verification-matrix.json'), JSON.stringify(results, null, 2), 'utf8');
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'verification-dns-audit.json'),
    JSON.stringify(dnsAudit, null, 2),
    'utf8',
  );
  await fs.writeFile(path.join(OUTPUT_DIR, 'verification-matrix.md'), toMarkdown(results, dnsAudit), 'utf8');

  const failed = results.filter((result) => !result.passed);
  const dnsFailed = !dnsAudit.passed;

  console.log(
    `[perf-verify] DNS ${dnsAudit.hostname}: records=${dnsAudit.records.join(', ') || 'none'} suspicious=${dnsAudit.suspiciousRecords.join(', ') || 'none'}`,
  );

  for (const check of dnsAudit.edgeChecks) {
    const summary = `${check.ip}: status=${check.status} ttfb=${check.ttfbMs ?? '-'}ms total=${check.totalMs ?? '-'}ms`;
    if (check.passed) {
      console.log(`[perf-verify] PASS edge ${summary}`);
    } else {
      console.error(`[perf-verify] FAIL edge ${summary}${check.error ? ` error=${check.error}` : ''}`);
    }
  }

  for (const result of results) {
    const summary = `${result.name}: status=${result.status} ttfb=${result.ttfbMs ?? '-'}ms total=${result.totalMs ?? '-'}ms`;
    if (result.passed) {
      console.log(`[perf-verify] PASS ${summary}`);
    } else {
      console.error(`[perf-verify] FAIL ${summary}${result.error ? ` error=${result.error}` : ''}`);
    }
  }

  if (failed.length > 0 || dnsFailed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[perf-verify] fatal', error);
  process.exitCode = 1;
});
