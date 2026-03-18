import fs from 'node:fs/promises';
import path from 'node:path';
import { PassThrough } from 'node:stream';

import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { MemoryRouter } from 'react-router-dom';

import App from '../client/src/app/App';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');
const HOME_METADATA = {
  title: 'TuWeb.ai - Desarrollo Web Profesional para Negocios en Argentina',
  description:
    'Desarrollamos sitios web, e-commerce y sistemas web para negocios que necesitan una presencia digital profesional, confiable y preparada para vender.',
  keywords:
    'desarrollo web argentina, desarrollo web profesional, sitios web para negocios, ecommerce argentina, sistemas web, diseno web profesional, TuWeb.ai',
  url: 'https://tuweb-ai.com',
};
const REACT_SSR_WARNING_PREFIX = 'Warning: useLayoutEffect does nothing on the server';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function replaceTag(html: string, pattern: RegExp, replacement: string) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function applyHeadMetadata(html: string) {
  let nextHtml = html;

  nextHtml = replaceTag(nextHtml, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(HOME_METADATA.title)}</title>`);
  nextHtml = replaceTag(
    nextHtml,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(HOME_METADATA.description)}" />`,
  );
  nextHtml = replaceTag(
    nextHtml,
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="keywords" content="${escapeHtml(HOME_METADATA.keywords)}" />`,
  );
  nextHtml = replaceTag(
    nextHtml,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${HOME_METADATA.url}" />`,
  );
  nextHtml = replaceTag(
    nextHtml,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(HOME_METADATA.title)}" />`,
  );
  nextHtml = replaceTag(
    nextHtml,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(HOME_METADATA.description)}" />`,
  );
  nextHtml = replaceTag(
    nextHtml,
    /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:url" content="${HOME_METADATA.url}" />`,
  );
  nextHtml = replaceTag(
    nextHtml,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(HOME_METADATA.title)}" />`,
  );
  nextHtml = replaceTag(
    nextHtml,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(HOME_METADATA.description)}" />`,
  );
  nextHtml = replaceTag(
    nextHtml,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${HOME_METADATA.url}" />`,
  );

  return nextHtml;
}

async function renderHomeMarkup() {
  const queryClient = new QueryClient();
  const app = (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );

  return new Promise<string>((resolve, reject) => {
    const stream = new PassThrough();
    const chunks: Buffer[] = [];
    let didError = false;
    const originalConsoleError = console.error;

    console.error = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].startsWith(REACT_SSR_WARNING_PREFIX)) {
        return;
      }

      originalConsoleError(...args);
    };

    stream.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    stream.on('end', () => {
      console.error = originalConsoleError;

      if (didError) {
        reject(new Error('No se pudo completar el prerender real de la home.'));
        return;
      }

      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    stream.on('error', (error) => {
      console.error = originalConsoleError;
      reject(error);
    });

    const { pipe, abort } = renderToPipeableStream(app, {
      onAllReady() {
        Helmet.renderStatic();
        pipe(stream);
      },
      onError(error) {
        didError = true;
        console.error = originalConsoleError;
        reject(error);
      },
    });

    setTimeout(() => {
      console.error = originalConsoleError;
      abort();
      reject(new Error('Timeout en el prerender real de la home.'));
    }, 15000);
  });
}

async function main() {
  const indexHtml = await fs.readFile(indexHtmlPath, 'utf8');
  const renderedMarkup = await renderHomeMarkup();

  const nextHtml = applyHeadMetadata(
    indexHtml
      .replace('<div id="root">', '<div id="root" data-prerender="react-app">')
      .replace(
        /<!-- APP_PRERENDER_FALLBACK_START -->[\s\S]*?<!-- APP_PRERENDER_FALLBACK_END -->/i,
        renderedMarkup,
      ),
  );

  await fs.writeFile(indexHtmlPath, nextHtml, 'utf8');
  console.log('Prerender real de home completado.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
