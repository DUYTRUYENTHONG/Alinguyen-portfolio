import test from 'node:test';
import assert from 'node:assert/strict';
import { startAtHeader } from '../src/app/guide-entry-policy.ts';

test('fresh entries and reloads of a stale Work URL start at the header', () => {
  assert.equal(startAtHeader('', 'navigate', false), true);
  assert.equal(startAtHeader('#top', 'reload', true), true);
  assert.equal(startAtHeader('#work', 'navigate', false), true);
  assert.equal(startAtHeader('#work', 'reload', true), true);
});
test('preserves deliberate CV, case-study return and browser history navigation', () => {
  assert.equal(startAtHeader('#cvs', 'navigate', false), false);
  assert.equal(startAtHeader('#work', 'navigate', true), false);
  assert.equal(startAtHeader('#work', 'back_forward', false), false);
  assert.equal(startAtHeader('', 'back_forward', false), false);
});
