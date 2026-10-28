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

test('a fresh visit starts with the owner introduction even with an incoming section fragment', () => {
  for (const hash of ['#visitor', '#work', '#cvs', '#contact', '']) {
    assert.equal(startAtHeader(hash, 'navigate', false, true), true);
  }
  assert.equal(startAtHeader('#visitor', 'reload', true, true), true);
  assert.equal(startAtHeader('#visitor', 'navigate', true, false), false);
  assert.equal(startAtHeader('#visitor', 'back_forward', true, true), false);
});
