import test from 'node:test';
import assert from 'node:assert/strict';
import { clipboardFeedbackState, nextGuideFeedback } from '../src/lib/journey-feedback.js';

test('clipboard feedback follows the resolved component state, never the click', () => {
  assert.equal(clipboardFeedbackState('Copy email', ''), null);
  assert.equal(clipboardFeedbackState('Copy email', 'Copy unavailable. Select the email address above.'), 'error');
  assert.equal(clipboardFeedbackState('Copied ✓', 'Email address copied.'), 'success');
  assert.equal(clipboardFeedbackState('Copied ✓', ''), null);
});
test('busy, close and reopen do not manufacture completion or replay old answers', () => {
  assert.deepEqual(nextGuideFeedback(false, {busy:false,outcome:true}), {pending:false,reveal:false});
  assert.deepEqual(nextGuideFeedback(false, {busy:true,outcome:false}), {pending:true,reveal:false});
  assert.deepEqual(nextGuideFeedback(true, {busy:false,outcome:false}), {pending:true,reveal:false});
  assert.deepEqual(nextGuideFeedback(true, {busy:false,outcome:true}), {pending:false,reveal:true});
  assert.deepEqual(nextGuideFeedback(false, {busy:false,outcome:true}), {pending:false,reveal:false});
});
test('a fast status insertion and removal in one DOM batch still reveals its result once', () => {
  assert.deepEqual(nextGuideFeedback(false, {busy:false,sawBusy:true,outcome:true}), {pending:false,reveal:true});
  assert.deepEqual(nextGuideFeedback(true, {busy:true,outcome:true}), {pending:true,reveal:false});
});
