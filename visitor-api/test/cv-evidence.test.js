import test from 'node:test';
import assert from 'node:assert/strict';
import { evidenceReply, projectEvidenceRequest } from '../lib/guide-evidence.js';

test('reviewed CV employment questions cite the CV and preserve tenure and scale limits', () => {
  for (const question of ['What is his professional experience?', 'Does he have three years of AI employment?', 'What did he do at NINA?', 'Did he process a billion records daily?']) {
    const reply = evidenceReply(projectEvidenceRequest(question), question);
    assert.equal(reply.citations[0]?.sourceId, 'cv-professional-experience');
    assert.match(reply.citations[0].url, /cv-applied-ai-engineer\.pdf$/);
    assert.match(reply.answer, /in total, not daily throughput/);
    assert.match(reply.answer, /KiteMetric \| AI Engineer/);
    assert.doesNotMatch(reply.answer, /DUYTRUYENTHONG founder/);
  }
});

test('current KiteMetric duties preserve the historical title and unspecified technologies', () => {
  const reply=evidenceReply(projectEvidenceRequest('What were his MLOps duties at KiteMetric?'));
  assert.equal(reply.citations[0].sourceId,'kitemetric-mlops');
  assert.match(reply.answer,/historical title stays AI Engineer/);
  assert.match(reply.answer,/MLOps is additional responsibility/);
  assert.match(reply.answer,/No GPU model, Kubernetes, Terraform or MLflow was supplied/);
});

test('education corrections include both degrees and distinguish the unused scholarship', () => {
  const q='Give education details including Frankfurt and DAAD';
  const reply=evidenceReply(projectEvidenceRequest(q),q);
  assert.match(reply.answer,/2019–2024/);
  assert.match(reply.answer,/Frankfurt dates were not supplied/);
  assert.match(reply.answer,/was not taken due to COVID-19/);
  assert.doesNotMatch(reply.answer,/2021–2026/);
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

test('supported skills preserve personal AI assistance and omit reference-only keyword claims', () => {
  const q='Which supported skills are in the AI Engineer CV?';
  const reply=evidenceReply(projectEvidenceRequest(q),q);
  assert.equal(reply.citations[0]?.sourceId,'cv-supported-skills');
  assert.match(reply.answer,/AI-assisted personal projects/);
  assert.match(reply.answer,/USD 2,000–10,000\/month per product/);
  assert.match(reply.answer,/Claude and Codex: 10,000 hours combined use/);
  assert.doesNotMatch(reply.answer,/ControlNet|YOLO|LangGraph|Kubernetes|MLflow|Segment|Tealium/);
});
