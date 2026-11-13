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
    boundedAnswer: answer.length <= (reply?.responseMode === 'reviewed-evidence' ? 6000 : 1000),
  };
  const refused = citations.length === 0 && /can't verify|cannot verify|cannot support/i.test(answer);
  const unsupportedClaim = /Ali (?:won|wins) (?:the )?(?:Kaggle|KKBox)|guarantee(?:s|d)? (?:you |a )?(?:job|hiring)|STOS AI suggestions are (?:already )?live/i.test(answer);
  return { checks, diagnostics: {
    relevantCitations: item.sources.filter(id=>citations.some(c=>c.sourceId===id)).length,
    unsupportedClaimDetected: unsupportedClaim,
    appropriateRefusal: item.sources.length===0 && refused,
    incorrectRefusal: item.sources.length>0 && refused,
    serviceFailure: status!==200 || reply?.responseMode==='source-excerpt',
  }, passed: Object.values(checks).every(Boolean) && !unsupportedClaim };
}

export function summarize(rows) {
  const latency = rows.map((r) => r.latencyMs).sort((a, b) => a - b);
  const percentile = (p) => latency[Math.max(0, Math.ceil(p * latency.length) - 1)] ?? null;
  const totalTokens = key => rows.length && rows.every(r=>Number.isSafeInteger(r.usage?.[key])) ? rows.reduce((n,r)=>n+r.usage[key],0) : null;
  return {
    cases: rows.length, passed: rows.filter((r) => r.passed).length,
    modelCalls: rows.filter((r) => r.modelCalled).length,
    responseSuccesses: rows.filter((r) => r.checks.response).length,
    unsupportedClaimDetections: rows.filter(r=>r.diagnostics?.unsupportedClaimDetected).length,
    appropriateRefusals: rows.filter(r=>r.diagnostics?.appropriateRefusal).length,
    incorrectRefusals: rows.filter(r=>r.diagnostics?.incorrectRefusal).length,
    serviceFailures: rows.filter(r=>r.diagnostics?.serviceFailure).length,
    citationProvenancePasses: rows.filter((r) => r.checks.citationProvenance).length,
    expectedSourceCases: rows.filter((r) => r.expectedSources.length).length,
    expectedSourceRetrievalPasses: rows.filter((r) => r.expectedSources.length && r.checks.expectedRetrieval).length,
    p50LatencyMs: percentile(.5), p95LatencyMs: percentile(.95),
    promptTokens: totalTokens('prompt_tokens'),
    completionTokens: totalTokens('completion_tokens'),
    measuredCostUsd: null,
  };
}
