import { selectGuideAction, validActionState, needsProjectClarification } from "../lib/guide-actions.js";
import { namedProjectSources } from "../lib/guide-evidence.js";
import { knowledge } from "../lib/guide-knowledge.js";
import { GROQ_URL, buildSelectionRequest, parseSelection } from '../lib/guide-model.js';
import { createHash, createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";
import { retrieveGuideSources } from "../lib/guide-retrieval.js";
import { readPortfolioSignals } from "../lib/portfolio-signals.js";
import { isLiveProjectInventoryQuestion, liveProjectInventoryReply } from "../lib/guide-live-projects.js";
import { projectEvidenceRequest, evidenceReply } from '../lib/guide-evidence.js';
import { isTourQuestion, tourReply } from '../lib/guide-tour.js';
import { withDeadline } from '../lib/guide-deadline.js';

const allowedOrigins = new Set([
  "https://duytruyenthong.github.io",
  "http://localhost:3000", "http://[::1]:3000",
  "http://localhost:3001", "http://[::1]:3001",
]);
const roles = new Set(["Recruiter", "Founder", "Engineer", "Product designer", "Marketer", "Growth", "Data", "Investor", "Student", "Fellow builder", "Just curious"]);
const personaNames = { Recruiter: "Ari", Founder: "Nova", Engineer: "Kai", "Product designer": "Mira", Marketer: "Lia", Growth: "Rio", Data: "Ada", Investor: "Sol", Student: "Emi", "Fellow builder": "Sam", "Just curious": "Pip" };
const sections = new Set(["Explore the portfolio", "Choose your perspective", "What I do", "Proof of work", "Highlights", "Applied AI expertise", "From signal to decision", "Selected work", "Sales journey", "Customers", "About Ali", "Download a CV", "Build notes", "Let's talk", "Growth Commerce OS", "STOS Sales Traffic Operating System", "Chợ Kênh", "Vibecode Pro Max Kit", "KKBox customer churn baseline"]);
const interests = new Set(["AI", "commerce", "data", "admissions", "kkbox-baseline", "vibecode-kit", "stos", "cho-kenh"]);
const fallback = "I can't verify that from Ali's public portfolio. Please check the linked work or contact Ali directly.";
function send(res, status, body, origin) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (allowedOrigins.has(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  if (body?.answer && res.guideActionContext) body = {...body,actions:selectGuideAction({...res.guideActionContext,sources:(body.citations??[]).map(c=>c.sourceId),mode:body.responseMode})};
  if (body && res.guideReceipt) body = { ...body, receipt: { ...res.guideReceipt, outputMode: body.responseMode ?? (body.error ? 'error' : 'deterministic') } };
  return res.status(status).end(body === null ? "" : JSON.stringify(body));
}

function validTurns(value) {
  return Array.isArray(value) && value.length <= 4 && value.every((turn) =>
    turn && ["user", "assistant"].includes(turn.role) && typeof turn.text === "string" && turn.text.length <= 500);
}

export function createGuideHandler({ makeRedis = () => new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN, retry: false, signal: () => AbortSignal.timeout(2500) }), modelFetch = fetch,
  admissionTimeoutMs = 2500, modelTimeoutMs = 10000,
  loadSignals = () => readPortfolioSignals(new Redis({url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN, retry: false, signal: () => AbortSignal.timeout(1000)})),
} = {}) {
  return async function handler(request, res) {
  res.guideReceipt = { environment: process.env.VERCEL_ENV ?? 'development', revision: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    providerAttempted: false, providerStatus: null, returnedModel: null, selectedIds: [], latencyMs: null,
    promptTokens: null, cacheHitTokens: null, completionTokens: null };
  const origin = request.headers.origin ?? "";
  if (!allowedOrigins.has(origin)) return send(res, 403, { error: "Forbidden origin" }, origin);
  if (request.method === "OPTIONS") return send(res, 204, null, origin);
  if (request.method !== "POST") return send(res, 405, { error: "Method not allowed" }, origin);
  if (!request.headers["content-type"]?.toLowerCase().startsWith("application/json")) return send(res, 415, { error: "Expected JSON" }, origin);
  if (!process.env.GROQ_API_KEY || !process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN || !process.env.GUIDE_RATE_SALT) {
    return send(res, 503, { error: "Guide unavailable" }, origin);
  }

  let data;
  try {
    const raw = typeof request.body === "string" ? request.body : JSON.stringify(request.body ?? {});
    if (raw.length > 3500) return send(res, 413, { error: "Request too large" }, origin);
    data = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
  } catch {
    return send(res, 400, { error: "Invalid JSON" }, origin);
  }
  const { question, context, recentTurns = [], interests: remembered = [] } = data ?? {};
  if (typeof question !== "string" || !question.trim() || question.length > 400 ||
      !context || typeof context !== "object" || !sections.has(context.section) ||
      !roles.has(context.role) || !validActionState(data.actionState) || !validTurns(recentTurns) || !Array.isArray(remembered) ||
      remembered.length > 5 || !remembered.every((item) => interests.has(item))) {
    return send(res, 400, { error: "Invalid guide request" }, origin);
  }

  res.guideActionContext={question,state:data.actionState??{}};
  let sources = [];
  try {
    const redis = makeRedis();
    const forwarded = request.headers["x-vercel-forwarded-for"] ?? request.headers["x-forwarded-for"];
    const ip = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "unknown";
    const day = new Date().toISOString().slice(0, 10);
    const clientHash = createHmac("sha256", process.env.GUIDE_RATE_SALT).update(`${day}:${ip}`).digest("hex");
    const limitKey = `portfolio:guide:daily:${day}:${clientHash}`;
    const admitted = await withDeadline(async () => {
    const count = await redis.incr(limitKey);
    if (count === 1) await redis.expire(limitKey, 172800);
    if (count > 20) return 'Daily guide limit reached';
    const globalKey = `portfolio:guide:global:${day}`;
    const globalCount = await redis.incr(globalKey);
    if (globalCount === 1) await redis.expire(globalKey, 172800);
    if (globalCount > 300) return 'Guide capacity reached today';
    return null;
    }, admissionTimeoutMs);
    if (admitted) return send(res, 429, {error:admitted}, origin);
    if (/earlier you said.*guarantee/i.test(question)) return send(res,200,{answer:"That earlier claim wasn't supported. Ali's public portfolio does not establish a job guarantee.",citations:[],suggestions:[],motion:'none',responseMode:'abstention'},origin);
    if (/\b(download|read|open|send|grab).{0,25}\b(cv|resume)\b|collaborat|contact ali|hop tac|hợp tác|liên hệ/i.test(question)) return send(res,200,evidenceReply(knowledge.filter(s=>s.id==='ali-overview'),question),origin);
    if (isTourQuestion(question)) return send(res, 200, tourReply(personaNames[context.role], question), origin);

    // Inventory completeness is a data constraint, not a relevance-ranking task.
    // Keep admission controls, but do not let context, popularity or generation
    // omit a reviewed live website or introduce a planned feature.
    if (isLiveProjectInventoryQuestion(question, recentTurns)) {
      return send(res, 200, liveProjectInventoryReply(question, recentTurns), origin);
    }

    const isFollowup=/\b(it|its|they|their|what about)\b|nó|dự án đó/i.test(question);
    const priorQuestion = [...recentTurns].reverse().find(turn => turn.role === 'user')?.text ?? '';
    const currentNamed=namedProjectSources(question);
    const previousNamed=namedProjectSources(priorQuestion);
    if (!currentNamed.length && needsProjectClarification(question,previousNamed.map(s=>s.id))) return send(res,200,{answer:'Which project do you mean?',citations:[],suggestions:previousNamed.slice(0,2).map(s=>'Tell me about '+s.title.slice(0,55)),motion:'none',responseMode:'clarification'},origin);
    const resolvedQuestion = question.length < 120 && isFollowup
      ? `${priorQuestion}\n${question}` : question;
    const projectSources = projectEvidenceRequest(resolvedQuestion);
    if (projectSources.length) return send(res, 200, evidenceReply(projectSources, question), origin);
    if (/\b(salary|password|api_key|testimonial quote)\b|guarantee.*admi/i.test(question)) {
      return send(res, 200, {answer:fallback,citations:[],suggestions:[],motion:'none'},origin);
    }

    let signals = {};
    // Optional aggregate ranking must never make the guide unavailable or leak counts to the model.
    if (process.env.PORTFOLIO_SIGNALS_ENABLED === 'true') {
      try {
        signals = await withDeadline(() => loadSignals(), 1000);
      } catch { /* Preserve baseline retrieval when signals are unavailable. */ }
    }
    sources = retrieveGuideSources(isFollowup ? resolvedQuestion : question, context, signals);
    if (!sources.length) return send(res, 200, { answer: fallback, citations: [], suggestions: [], motion: "none", responseMode: "abstention" }, origin);
    // Retention and withdrawal terms must be exact, not a model paraphrase.
    if (sources[0].id === 'recommendation-signals') {
      const {id, title, text, url} = sources[0];
      return send(res, 200, {answer:`Approved recommendation policy:\n\n${text}`, citations:[{sourceId:id,label:title,url}],suggestions:[],motion:'none'},origin);
    }
    const input = JSON.stringify({ selectedRole: context.role, currentSection: context.section,
      optedInInterests: remembered, recentConversation: isFollowup ? recentTurns.filter(t=>t.role==='user').slice(-1) : [], visitorQuestion: question.trim() });
    const outbound = JSON.stringify(buildSelectionRequest(sources, { role: context.role, guideName: personaNames[context.role] }, JSON.parse(input)));
    if(process.env.VERCEL_ENV==='preview') {
      const messages=JSON.parse(outbound).messages;
      res.guideReceipt.requestHash=createHash('sha256').update(outbound).digest('hex');
      res.guideReceipt.fixedPrefixHash=createHash('sha256').update(JSON.stringify(messages[0])).digest('hex');
      res.guideReceipt.evidencePrefixHash=createHash('sha256').update(JSON.stringify(messages.slice(0,2))).digest('hex');
    }
    const started = performance.now();
    res.guideReceipt.providerAttempted = true;
    const result = await withDeadline(async (signal) => {
      const response = await modelFetch(GROQ_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: outbound,
        signal,
      });
    res.guideReceipt.providerStatus = response.status ?? null;
    res.guideReceipt.latencyMs = Math.round(performance.now() - started);
    if (!response.ok) throw Object.assign(new Error("Model request failed"), { providerStatus: response.status });
    return await response.json();
    }, modelTimeoutMs);
    res.guideReceipt.latencyMs = Math.round(performance.now() - started);
    res.guideReceipt.returnedModel = typeof result.model === 'string' && /^[a-zA-Z0-9._/-]{1,100}$/.test(result.model) ? result.model : null;
    const usageValues = {promptTokens: result.usage?.prompt_tokens, cacheHitTokens: result.usage?.prompt_tokens_details?.cached_tokens, completionTokens: result.usage?.completion_tokens};
    for (const [field,value] of Object.entries(usageValues)) res.guideReceipt[field] = Number.isSafeInteger(value) && value >= 0 ? value : null;
    const cited = parseSelection(result, sources);
    res.guideReceipt.selectedIds = cited.map(source => source.id);
    if (!cited.length) return send(res, 200, { answer: fallback, citations: [], suggestions: [], motion: "none", responseMode: "abstention" }, origin);
    // A valid citation URL does not establish entailment. Use the reviewed
    // factual text, retaining model source selection without its freeform claims.
    return send(res, 200, evidenceReply(cited, question), origin);
  } catch (error) {
    if (sources.length) {
      console.warn(JSON.stringify({ event: "guide_generation_unavailable", providerStatus: Number.isInteger(error?.providerStatus) ? error.providerStatus : null }));
      const source = sources[0];
      return send(res, 200, {
        answer: `The AI response is unavailable. Here is the approved source text:\n\n${source.text}`,
        citations: [{ sourceId: source.id, label: source.title, url: source.url }],
        suggestions: [], motion: "none", responseMode: "source-excerpt",
      }, origin);
    }
    return send(res, 503, { error: "Guide temporarily unavailable" }, origin);
  }
  };
}

export default createGuideHandler();
