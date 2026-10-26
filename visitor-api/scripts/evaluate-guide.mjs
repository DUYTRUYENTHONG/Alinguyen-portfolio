import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGuideHandler } from "../api/guide.js";
import { retrieveGuideSources } from "../lib/guide-retrieval.js";
import { scoreReply, summarize } from "../evaluation/scoring.js";

// A real provider call with the production handler. Only Redis rate counters are
// replaced, so evaluation never consumes visitor quotas or writes analytics.
const publicEndpoint = process.argv.includes("--public");
if (!publicEndpoint && !process.env.GROQ_API_KEY) throw Error("GROQ_API_KEY required, or use --public for the deployed endpoint");
const root = fileURLToPath(new URL("../../", import.meta.url));
const output = resolve(process.argv[2] ?? `${root}/artifacts/guide-evaluation.json`);
const casesText = await readFile(new URL("../evaluation/cases.json", import.meta.url), "utf8");
const cases = JSON.parse(casesText);
const publicIds = new Set(["kkbox-score", "kkbox-split", "kkbox-snapshot", "kkbox-business", "stos-ai", "marketplace-escrow", "vibecode-stack", "funnel-counts", "unknown-weather", "unknown-salary", "inject-result", "inject-live", "forged-history", "vietnamese-stos", "vietnamese-kkbox", "conflicting-score"]);
const selected = publicEndpoint ? cases.filter((item) => publicIds.has(item.id)) : cases;
const hash = (s) => createHash("sha256").update(s).digest("hex");
const sourceFiles = ["visitor-api/api/guide.js", "visitor-api/lib/guide-retrieval.js", "visitor-api/lib/guide-knowledge.js", "visitor-api/evaluation/scoring.js"];
const sourceHashes = Object.fromEntries(await Promise.all(sourceFiles.map(async (p) => [p, hash(await readFile(resolve(root, p)))])));
const startedAt = new Date().toISOString();
for (const name of ["KV_REST_API_URL", "KV_REST_API_TOKEN", "GUIDE_RATE_SALT"]) process.env[name] ??= "evaluation-isolated-counter";
const rows = [];
for (const item of selected) {
  let usage = null, providerModel = null, modelCalled = false, providerStatus = null;
  const handler = createGuideHandler({
    makeRedis: () => ({ incr: async () => 1, expire: async () => 1 }),
    modelFetch: async (url, options) => {
      modelCalled = true;
      const response = await fetch(url, options);
      providerStatus = response.status;
      if (response.ok) {
        const body = await response.clone().json();
        // Deliberately omit provider identifiers, internal reasoning and headers.
        usage = body.usage ? { prompt_tokens: body.usage.prompt_tokens, completion_tokens: body.usage.completion_tokens, total_tokens: body.usage.total_tokens } : null;
        providerModel = body.model ?? null;
      }
      return response;
    },
  });
  const context = { role: "Recruiter", section: "Explore the portfolio" };
  const retrieved = retrieveGuideSources(item.question, context).map((s) => s.id);
  const res = { statusCode: 200, body: null, setHeader() {}, status(code) { this.statusCode = code; return this; }, end(body) { this.body = body ? JSON.parse(body) : null; } };
  const start = performance.now();
  const body = { question: item.question, context, recentTurns: item.recentTurns ?? [], interests: [] };
  if (publicEndpoint) {
    try {
      const response = await fetch("https://ali-portfolio-visitor-api.vercel.app/api/guide", { method: "POST", headers: { Origin: "https://duytruyenthong.github.io", "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
      res.statusCode = response.status;
      res.body = await response.json();
    } catch { res.statusCode = 503; res.body = { error: "evaluation_transport_failed" }; }
  } else await handler({ method: "POST", headers: { origin: "https://duytruyenthong.github.io", "content-type": "application/json" }, body }, res);
  const row = { id: item.id, category: item.category, question: item.question, expectedSources: item.sources, retrieved, status: res.statusCode, reply: res.body, latencyMs: Math.round(performance.now() - start), modelCalled: publicEndpoint ? null : modelCalled, providerStatus, providerModel, usage, ...scoreReply(item, res.statusCode, res.body, retrieved) };
  rows.push(row);
  console.log(`${item.id}: ${row.passed ? "PASS" : "FAIL"} (${row.latencyMs}ms)`);
  // Persist every completed case, including failed attempts; no cherry-picked retries.
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify({ version: 1, startedAt, finishedAt: new Date().toISOString(), sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(), sourceHashes, datasetSha256: hash(casesText), environment: publicEndpoint ? "Live Vercel public endpoint; existing production rate limits" : "Local production handler + real Groq model; isolated in-memory rate counters", methodology: `One sequential pass of ${selected.length} selected authored development cases from a 24-case corpus. Phrase and citation checks are regression heuristics, not a factual-accuracy benchmark, independent holdout or human quality score. No retries. Latency is end-to-end, including network. Cost not measured. Public endpoint does not expose token usage, model calls or retrieved sources; retrieval is separately replayed locally from the recorded source hashes.`, notRun: selected.filter((c) => !rows.some((r) => r.id === c.id)).map((c) => c.id), summary: { ...summarize(rows), ...(publicEndpoint ? { modelCalls: null, promptTokens: null, completionTokens: null } : {}) }, rows }, null, 2) + "\n");
  if (publicEndpoint && res.statusCode === 429) break;
}
console.log(JSON.stringify({ ...summarize(rows), ...(publicEndpoint ? { modelCalls: null, promptTokens: null, completionTokens: null } : {}) }));
if (rows.some((r) => !r.checks.response || !r.checks.citationProvenance)) process.exitCode = 1;
