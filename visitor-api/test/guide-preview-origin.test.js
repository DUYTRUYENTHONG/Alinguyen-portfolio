import test from 'node:test';
import assert from 'node:assert/strict';
import { createGuideHandler } from '../api/guide.js';
import { previewOrigin } from '../../scripts/preview-export.mjs';

test('the canonical preview passes API preflight without widening arbitrary local origins', async () => {
  let storageCalls = 0;
  const handler = createGuideHandler({ makeRedis: () => { storageCalls++; throw Error('Preflight must not use storage'); } });
  for (const [origin, expected] of [[previewOrigin, 204], ['http://127.0.0.1:3037', 403]]) {
    const response = { headers: {}, setHeader(key, value) { this.headers[key] = value; },
      status(value) { this.statusCode = value; return this; }, end() {} };
    await handler({ method: 'OPTIONS', headers: { origin } }, response);
    assert.equal(response.statusCode, expected);
    assert.equal(response.headers['Access-Control-Allow-Origin'], expected === 204 ? origin : undefined);
  }
  assert.equal(storageCalls, 0);
});
