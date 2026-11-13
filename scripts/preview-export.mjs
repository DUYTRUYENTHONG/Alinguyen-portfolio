import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

// This exact loopback origin is already admitted by the production guide API.
// Do not proxy the API, forge Origin headers or widen its CORS allowlist.
export const previewOrigin = 'http://[::1]:3001';
const basePath = '/Alinguyen-portfolio';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain',
  '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

export function createExportServer(directory) {
  const root = resolve(directory);
  return http.createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
    }
    try {
      const url = new URL(request.url, previewOrigin);
      if (url.pathname === basePath) {
        response.writeHead(302, { Location: `${basePath}/${url.search}` }); response.end(); return;
      }
      if (!url.pathname.startsWith(`${basePath}/`)) {
        response.writeHead(404); response.end('Not found'); return;
      }
      const relative = decodeURIComponent(url.pathname.slice(basePath.length + 1));
      let file = resolve(root, relative);
      if (file !== root && !file.startsWith(root + sep)) {
        response.writeHead(403); response.end('Forbidden'); return;
      }
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Content-Length': body.length });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      response.writeHead(error instanceof URIError ? 400 : 404); response.end('Not found');
    }
  });
}

export function createPreviewRedirect() {
  return http.createServer((request, response) => {
    const url = new URL(request.url, previewOrigin);
    // Fixed destination; never trust an incoming absolute URL's host.
    response.writeHead(302, { Location: `${previewOrigin}${url.pathname}${url.search}`, 'Cache-Control': 'no-store' });
    response.end();
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const directory = process.argv.slice(2).find(value => !value.startsWith('--')) ?? 'out';
  await stat(resolve(directory, 'index.html')); // Fail clearly if no export exists.
  createExportServer(directory).listen(3001, '::1', () => console.log(`Portfolio preview: ${previewOrigin}${basePath}/`));
  if (process.argv.includes('--redirect-legacy')) {
    for (const port of [3034, 3037]) createPreviewRedirect().listen(port, '127.0.0.1', () => console.log(`Old preview ${port} redirects to the current build.`));
  }
}
