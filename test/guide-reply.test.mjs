import test from 'node:test';
import assert from 'node:assert/strict';
import { guideRequestSection, parseGuideReply, recentGuideTurns } from '../src/app/guide-reply.ts';
import { evidenceReply, projectEvidenceRequest } from '../visitor-api/lib/guide-evidence.js';

test('complete project evidence keeps all six citations through the chat parser',()=>{
 const reply=evidenceReply(projectEvidenceRequest('List all projects'));
 const parsed=parseGuideReply(reply);
 assert.equal(parsed.citations.length,6);
 assert.equal(parsed.answer,reply.answer);
 assert.ok(parsed.citations.some(c=>c.sourceId==='career-agent-kit'));
});

test('community chat uses a supported API context without changing project contexts', () => {
  assert.equal(guideRequestSection('Shared with the community'), 'Explore the portfolio');
  assert.equal(guideRequestSection('KKBox customer churn baseline'), 'KKBox customer churn baseline');
});

test('long source excerpts remain readable but cannot break the next chat request', () => {
  const turns = Array.from({ length: 6 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', text: String(i).repeat(1400) }));
  const recent = recentGuideTurns(turns);
  assert.equal(recent.length, 4);
  assert.ok(recent.every(turn => turn.text.length <= 500));
  assert.equal(recent[0].text[0], '2');
  assert.equal(turns[0].text.length, 1400);
});

test('invalid suggestion and citation values never reach React rendering', () => {
  const citation = { sourceId: 'work', label: 'Work', url: 'https://duytruyenthong.github.io/Alinguyen-portfolio/work/' };
  const reply = parseGuideReply({ answer: 'Inspect the public work.', citations: [null, {}, { ...citation, label: {} }, { ...citation, url: 'javascript:alert(1)' }, citation], suggestions: [null, {}, '', 'Show the limits', 'Show the limits', 'Which source?', 'Extra'], motion: 'invented' });
  assert.deepEqual(reply.citations, [citation]);
  assert.deepEqual(reply.suggestions, ['Show the limits', 'Which source?']);
  assert.equal(reply.motion, 'none');
  for (const value of [null, {}, { answer: {} }, { answer: ' ' }]) assert.throws(() => parseGuideReply(value));
});
