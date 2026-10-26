import { knowledge } from "../lib/guide-knowledge.js";

export function scoreReply(item, status, reply, retrieved) {
  const answer = typeof reply?.answer === "string" ? reply.answer : "";
  const citations = Array.isArray(reply?.citations) ? reply.citations : [];
  const checks = {
    response: status === 200 && answer.length > 10,
    citationProvenance: citations.every((c) => retrieved.includes(c.sourceId) && knowledge.some((s) => s.id === c.sourceId && s.url === c.url)),
    expectedRetrieval: item.sources.every((id) => retrieved.includes(id)),
    expectedCitation: item.sources.every((id) => citations.some((c) => c.sourceId === id)),
    requiredPhrases: item.checks.every((pattern) => new RegExp(pattern, "iu").test(answer)),
    boundedAnswer: answer.length <= 1000,
  };
  return { checks, passed: Object.values(checks).every(Boolean) };
}

export function summarize(rows) {
  const latency = rows.map((r) => r.latencyMs).sort((a, b) => a - b);
  const percentile = (p) => latency[Math.max(0, Math.ceil(p * latency.length) - 1)] ?? null;
  return {
    cases: rows.length, passed: rows.filter((r) => r.passed).length,
    modelCalls: rows.filter((r) => r.modelCalled).length,
    responseSuccesses: rows.filter((r) => r.checks.response).length,
    citationProvenancePasses: rows.filter((r) => r.checks.citationProvenance).length,
    expectedSourceCases: rows.filter((r) => r.expectedSources.length).length,
    expectedSourceRetrievalPasses: rows.filter((r) => r.expectedSources.length && r.checks.expectedRetrieval).length,
    p50LatencyMs: percentile(.5), p95LatencyMs: percentile(.95),
    promptTokens: rows.reduce((n, r) => n + (r.usage?.prompt_tokens ?? 0), 0),
    completionTokens: rows.reduce((n, r) => n + (r.usage?.completion_tokens ?? 0), 0),
    measuredCostUsd: null,
  };
}
