import assert from "node:assert/strict";
import test from "node:test";
import { createGuideHandler } from "../api/guide.js";
import { retrieveGuideSources } from "../lib/guide-retrieval.js";

function response() {
  return { headers: {}, statusCode: 200, body: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    end(body) { this.body = body ? JSON.parse(body) : null; return this; },
  };
}

function request(question = "How was KKBox evaluated?") {
  return { method: "POST", headers: { origin: "https://duytruyenthong.github.io", "content-type": "application/json", "x-vercel-forwarded-for": "192.0.2.1" },
    body: { question, context: { page: "/", section: "Selected work", role: "Recruiter" }, recentTurns: [], interests: [] } };
}

function withTestEnv(run) {
  const names = ["GROQ_API_KEY", "KV_REST_API_URL", "KV_REST_API_TOKEN", "GUIDE_RATE_SALT"];
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  for (const name of names) process.env[name] = `test-${name}`;
  return Promise.resolve().then(run).finally(() => {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  });
}

test("optional recommendation storage failure preserves evidence retrieval and never enters the prompt", () => withTestEnv(async () => {
  const previous = process.env.PORTFOLIO_SIGNALS_ENABLED;
  process.env.PORTFOLIO_SIGNALS_ENABLED = 'true';
  try {
    let calls = 0;
    const handler = createGuideHandler({
      makeRedis: () => ({incr: async () => 1, expire: async () => 1}),
      loadSignals: async () => { calls++; throw Error('private aggregate store error'); },
      modelFetch: async (_url, options) => {
        assert.ok(!options.body.includes('private aggregate'));
        return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({answer:'Inspect the documented KKBox local holdout and its limitations.',citations:['kkbox-results'],suggestions:[],motion:'point'})}}]})};
      },
    });
    const result=response(); await handler(request(),result);
    assert.equal(calls,1);assert.equal(result.statusCode,200);assert.equal(result.body.citations[0].sourceId,'kkbox-results');
  } finally {
    if(previous===undefined) delete process.env.PORTFOLIO_SIGNALS_ENABLED; else process.env.PORTFOLIO_SIGNALS_ENABLED=previous;
  }
}));

test('recommendation privacy questions return exact approved policy without model paraphrasing',()=>withTestEnv(async()=>{
  let generated=false;
  const handler=createGuideHandler({makeRedis:()=>({incr:async()=>1,expire:async()=>1}),modelFetch:async()=>{generated=true;throw Error('must not generate policy');}});
  const result=response();await handler(request('How do optional recommendation signals work, and can I stop sharing?'),result);
  assert.equal(generated,false);assert.equal(result.statusCode,200);
  assert.match(result.body.answer,/previously aggregated counts cannot be individually removed/i);
  assert.match(result.body.answer,/aggregate counts expire 30 days/);
  assert.equal(result.body.citations[0].sourceId,'recommendation-signals');assert.equal(result.body.motion,'none');
}));

test("retrieval selects matching public evidence and does not return unrelated facts", () => {
  const results = retrieveGuideSources("How was KKBox churn evaluated?", { role: "Recruiter", section: "Selected work" });
  assert.equal(results[0].id, "kkbox-results");
  const inspectable = retrieveGuideSources("Which AI projects can I inspect?", { role: "Recruiter", section: "Highlights" });
  assert.deepEqual(inspectable.slice(0, 2).map(({ id }) => id).sort(), ["kkbox-results", "vibecode-kit"]);
  assert.equal(retrieveGuideSources("quantum banana zebras").length, 0);
});

test("guide returns only server-approved citation URLs", () => withTestEnv(async () => {
  let modelRequest;
  const handler = createGuideHandler({
    makeRedis: () => ({ incr: async () => 1, expire: async () => 1 }),
    modelFetch: async (_url, options) => {
      modelRequest = JSON.parse(options.body);
      return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify({
        answer: "The local within-cohort holdout reached 0.217324 log loss.",
        citations: ["kkbox-results", "invented-source"], suggestions: ["Show the limitations"], motion: "point",
      }) } }] }) };
    },
  });
  const res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.motion, "point");
  assert.deepEqual(res.body.citations.map(({ sourceId }) => sourceId), ["kkbox-results"]);
  assert.match(res.body.citations[0].url, /^https:\/\/github\.com\/DUYTRUYENTHONG\//);
  assert.equal(modelRequest.model, "openai/gpt-oss-20b");
  assert.equal(modelRequest.response_format.type, "json_schema");
  assert.deepEqual(modelRequest.response_format.json_schema.schema.properties.motion.enum, ["nod", "curious", "point", "none"]);
  assert.match(modelRequest.messages[0].content, /guide name is Ari/);
  assert.equal(modelRequest.messages.some(({ content }) => content.includes("192.0.2.1")), false);
  assert.match(modelRequest.messages[1].content, /\[kkbox-results\]/);
  assert.equal(JSON.parse(modelRequest.messages[2].content).visitorQuestion, "How was KKBox evaluated?");
}));

test("the selected character name is supplied by the server role mapping", () => withTestEnv(async () => {
  let systemMessage;
  const handler = createGuideHandler({
    makeRedis: () => ({ incr: async () => 1, expire: async () => 1 }),
    modelFetch: async (_url, options) => {
      systemMessage = JSON.parse(options.body).messages[0].content;
      return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify({
        answer: "The local holdout reached 0.217324 log loss.", citations: ["kkbox-results"], suggestions: [], motion: "nod",
      }) } }] }) };
    },
  });
  const req = request();
  req.body.context.role = "Data";
  const res = response();
  await handler(req, res);
  assert.equal(res.statusCode, 200);
  assert.match(systemMessage, /guide name is Ada/);
}));

test("guide rejects invented-only citations rather than showing an unsupported answer", () => withTestEnv(async () => {
  const handler = createGuideHandler({
    makeRedis: () => ({ incr: async () => 1, expire: async () => 1 }),
    modelFetch: async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify({
      answer: "Invented claim", citations: ["invented-source"], suggestions: [], motion: "point",
    }) } }] }) }),
  });
  const res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.citations, []);
  assert.equal(res.body.motion, "none");
  assert.match(res.body.answer, /can't verify/);
}));

test("a model cannot inject an arbitrary animation name", () => withTestEnv(async () => {
  const handler = createGuideHandler({
    makeRedis: () => ({ incr: async () => 1, expire: async () => 1 }),
    modelFetch: async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify({
      answer: "The local holdout reached 0.217324 log loss.", citations: ["kkbox-results"], suggestions: [], motion: "spin-forever",
    }) } }] }) }),
  });
  const res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.motion, "none");
}));

test("guide validates origin, body and per-client limit before contacting the model", () => withTestEnv(async () => {
  let called = false;
  const handler = createGuideHandler({ makeRedis: () => ({ incr: async () => 21, expire: async () => 1 }), modelFetch: async () => { called = true; } });
  const foreign = request();
  foreign.headers.origin = "https://example.com";
  const foreignRes = response();
  await handler(foreign, foreignRes);
  assert.equal(foreignRes.statusCode, 403);
  const invalid = request();
  invalid.body.question = "x".repeat(401);
  const invalidRes = response();
  await handler(invalid, invalidRes);
  assert.equal(invalidRes.statusCode, 400);
  const limitedRes = response();
  await handler(request(), limitedRes);
  assert.equal(limitedRes.statusCode, 429);
  assert.equal(called, false);
}));

test("provider failure returns an explicitly labelled approved excerpt without inventing an AI answer", () => withTestEnv(async () => {
  const handler = createGuideHandler({
    makeRedis: () => ({ incr: async () => 1, expire: async () => 1 }),
    modelFetch: async () => ({ ok: false, status: 429 }),
  });
  const res = response(); await handler(request(), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.responseMode, "source-excerpt");
  assert.match(res.body.answer, /^The AI response is unavailable/);
  assert.match(res.body.answer, /0\.217324/);
  assert.equal(res.body.citations[0].sourceId, "kkbox-results");
  assert.equal(res.body.motion, "none");
}));

test("rate-store outages remain unavailable and do not bypass admission controls", () => withTestEnv(async () => {
  let modelCalled = false;
  const handler = createGuideHandler({ makeRedis: () => ({ incr: async () => { throw Error('unavailable'); } }), modelFetch: async () => { modelCalled = true; } });
  const res = response(); await handler(request(), res);
  assert.equal(res.statusCode, 503); assert.equal(modelCalled, false);
}));
