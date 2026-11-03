import test from 'node:test';
import assert from 'node:assert/strict';
import { evidenceReply, projectEvidenceRequest } from '../lib/guide-evidence.js';

test('reviewed CV employment questions cite the CV and preserve tenure and scale limits', () => {
  for (const question of ['What is his professional experience?', 'Does he have three years of AI employment?', 'What did he do at NINA?', 'Did he process a billion records daily?']) {
    const reply = evidenceReply(projectEvidenceRequest(question), question);
    assert.equal(reply.citations[0]?.sourceId, 'cv-professional-experience');
    assert.match(reply.citations[0].url, /cv-applied-ai-engineer\.pdf$/);
    assert.match(reply.answer, /in total, not daily throughput/);
    assert.match(reply.answer, /do not establish continuous professional AI employment/);
  }
});

test('LoRA questions preserve the one-step fictional CPU experiment boundary', () => {
  const reply = evidenceReply(projectEvidenceRequest('Was Qwen3-8B LoRA training successful?'));
  assert.equal(reply.citations[0]?.sourceId, 'cv-lora-experiment');
  assert.match(reply.answer, /one-step CPU Qwen3-0\.6B/);
  assert.match(reply.answer, /fictional fixtures/);
  assert.match(reply.answer, /not successful Qwen3-8B training/);
  assert.match(reply.answer, /or demonstrated quality improvement/);
});

test('career retrieval questions retain the lexical and execution-authority boundaries', () => {
  const question = 'Does Career Agent Kit use a vector database or LCEL?';
  const reply = evidenceReply(projectEvidenceRequest(question), question);
  assert.match(reply.answer, /FTS5\/BM25 retrieval is lexical, not a vector database/);
  assert.match(reply.answer, /does not grant account or execution authority/);
});
