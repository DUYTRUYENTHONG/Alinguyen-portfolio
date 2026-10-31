import assert from "node:assert/strict";
import test from "node:test";
import { createGuideHandler } from "../api/guide.js";
import { retrieveGuideSources } from "../lib/guide-retrieval.js";
import { isLiveProjectInventoryQuestion } from '../lib/guide-live-projects.js';
import { knowledge } from '../lib/guide-knowledge.js';
import { readFileSync } from 'node:fs';

function response() {
  return { headers: {}, statusCode: 200, body: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    end(body) { this.body = body ? JSON.parse(body) : null; return this; },
  };
}

function request(question = "What is the local holdout log loss?") {
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

test('all authored evaluation cases retain citation provenance and reviewed factual wording',()=>withTestEnv(async()=>{
 const cases=JSON.parse(readFileSync(new URL('../evaluation/cases.json',import.meta.url),'utf8'));
 for(const item of cases){
  const handler=createGuideHandler({makeRedis:()=>({incr:async()=>1,expire:async()=>1}),modelFetch:async()=>({ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({answer:'FABRICATED: guaranteed offers and deployed AI with 99.9% accuracy',citations:item.sources,suggestions:[],motion:'nod'})}}]})})});
  const req=request(item.question);req.body.recentTurns=item.recentTurns??[];const res=response();await handler(req,res);
  assert.equal(res.statusCode,200,item.id);assert.ok(!res.body.answer.includes('FABRICATED'),item.id);
  for(const id of item.sources) assert.ok(res.body.citations.some(c=>c.sourceId===id),item.id+': '+id);
  for(const c of res.body.citations) assert.equal(c.url,knowledge.find(s=>s.id===c.sourceId)?.url,item.id);
 }
}));

test('comparisons, plans, community and follow-ups include complete project evidence',()=>withTestEnv(async()=>{
 const handler=createGuideHandler({makeRedis:()=>({incr:async()=>1,expire:async()=>1}),modelFetch:async()=>{throw Error('project facts must not need generation');}});
 for(const [q,ids] of [
  ['Compare STOS and Chợ Kênh',['stos','cho-kenh']],
  ['Which projects can I inspect?',['growth-commerce-os','stos','cho-kenh','vibecode-kit','kkbox-results','career-agent-kit']],
  ['Which features are planned?',['stos','cho-kenh','career-agent-kit']],
  ['Does Vietnam Career Agent Kit guarantee job offers?',['career-agent-kit']],
  ['Are STOS AI suggestions live?',['stos']],
  ['Can I inspect the private STOS source code?',['stos','recruiter-brief']],
 ]){
  const res=response();await handler(request(q),res);assert.deepEqual(res.body.citations.map(c=>c.sourceId).sort(),[...ids].sort(),q);
  assert.ok(res.body.answer.length<=6000,q);
  ids.forEach((id,i)=>assert.ok(res.body.answer.includes(`[${i+1}]`),id));
 }
 const req=request('What about its AI suggestions?');req.body.recentTurns=[{role:'user',text:'What does STOS do?'}];const res=response();await handler(req,res);assert.match(res.body.answer,/planned, not live/);
}));

test('live inventories are complete across roles, sections, languages and model outages', () => withTestEnv(async () => {
  const handler = createGuideHandler({makeRedis:()=>({incr:async()=>1,expire:async()=>1}),modelFetch:async()=>{throw Error('inventory must not depend on generation');}});
  for (const role of ['Recruiter','Founder','Engineer','Data','Just curious']) {
    for (const question of ['Which products are live?', 'List all live projects including STOS', 'What is live?', 'Những dự án nào đang hoạt động?', 'Liệt kê tất cả sản phẩm đã triển khai']) {
      const req=request(question); req.body.context={role,section:'Download a CV'};
      const res=response(); await handler(req,res);
      assert.equal(res.statusCode,200);
      assert.equal(res.body.responseMode,'verified-inventory');
      assert.deepEqual(res.body.citations.map(c=>c.sourceId),['growth-commerce-os','stos','cho-kenh']);
      for(const name of ['Growth Commerce OS','STOS','Chợ Kênh']) assert.ok(res.body.answer.includes(name));
      assert.match(res.body.answer,/\[1\]/); assert.match(res.body.answer,/\[2\]/); assert.match(res.body.answer,/\[3\]/);
      assert.ok(res.body.answer.length<=1000);
    }
  }
  const req=request('Any others?');req.body.recentTurns=[{role:'user',text:'Which projects are live?'},{role:'assistant',text:'Only Growth Commerce OS.'}];
  const res=response();await handler(req,res);assert.equal(res.body.citations.length,3);
}));

test('inventory intent preserves specific-project, privacy, planned-feature and unrelated questions', () => {
  for(const q of ['Is STOS live?', 'How was KKBox evaluated?', 'Which projects are not live?', 'What is planned for STOS?', 'How do recommendation signals work?']) assert.equal(isLiveProjectInventoryQuestion(q),false,q);
  assert.equal(isLiveProjectInventoryQuestion('Any others?',[{role:'user',text:'How was KKBox evaluated?'}]),false);
});

test('inventory answers still enforce rate and origin controls',()=>withTestEnv(async()=>{
 const handler=createGuideHandler({makeRedis:()=>({incr:async()=>21,expire:async()=>1})});
 const res=response();await handler(request('Which products are live?'),res);assert.equal(res.statusCode,429);
 const req=request('Which products are live?');req.headers.origin='https://example.com';const forbidden=response();await handler(req,forbidden);assert.equal(forbidden.statusCode,403);
}));

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
  assert.equal(JSON.parse(modelRequest.messages[2].content).visitorQuestion, "What is the local holdout log loss?");
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
  assert.equal(res.body.motion, "point");
  assert.equal(res.body.responseMode, 'reviewed-evidence');
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
