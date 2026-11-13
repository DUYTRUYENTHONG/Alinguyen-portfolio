import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createExportServer, createPreviewRedirect, previewOrigin } from '../scripts/preview-export.mjs';

async function serve(t, server) {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

test('export root and base-path assets load; query strings do not break files', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'portfolio-preview-'));
  await writeFile(join(dir, 'index.html'), '<h1>Portfolio</h1>');
  await writeFile(join(dir, 'app.js'), 'export const ready=true;');
  t.after(async () => { await unlink(join(dir, 'index.html')); await unlink(join(dir, 'app.js')); await rmdir(dir); });
  const origin = await serve(t, createExportServer(dir));
  const home = await fetch(`${origin}/Alinguyen-portfolio/`);
  assert.equal(home.status, 200); assert.match(await home.text(), /Portfolio/);
  const asset = await fetch(`${origin}/Alinguyen-portfolio/app.js?v=1`);
  assert.match(asset.headers.get('content-type'), /javascript/);
  assert.equal(asset.headers.get('cache-control'), 'no-store');
  const head = await fetch(`${origin}/Alinguyen-portfolio/`, { method: 'HEAD' });
  assert.equal(head.status, 200); assert.equal(await head.text(), '');
  assert.equal((await fetch(`${origin}/private`)).status, 404);
  assert.equal((await fetch(`${origin}/Alinguyen-portfolio/%2e%2e%2fprivate`)).status, 403);
});

test('legacy links redirect only to the existing API-approved origin, preserving path/query', async t => {
  const origin = await serve(t, createPreviewRedirect());
  const result = await fetch(`${origin}/Alinguyen-portfolio/?for=data`, { redirect: 'manual' });
  assert.equal(result.status, 302);
  assert.equal(result.headers.get('location'), `${previewOrigin}/Alinguyen-portfolio/?for=data`);
  assert.equal(result.headers.get('cache-control'), 'no-store');
});
