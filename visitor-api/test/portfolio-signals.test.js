import test from 'node:test';
import assert from 'node:assert/strict';
import {createInteractionHandler} from '../api/interaction.js';
import {readPortfolioSignals, signalProjects} from '../lib/portfolio-signals.js';
import {retrieveGuideSources} from '../lib/guide-retrieval.js';

const env={VERCEL_ENV:'production', PORTFOLIO_SIGNALS_ENABLED:'true', GUIDE_RATE_SALT:'test-only-salt', KV_REST_API_URL:'test',KV_REST_API_TOKEN:'test'};
const body={consent:true,projectId:'stos',browserId:'d0f9843c-6774-42f8-a05b-f2696e79b267'};
function req(data=body) {return {method:'POST',headers:{origin:'https://duytruyenthong.github.io','content-type':'application/json','x-vercel-forwarded-for':'192.0.2.1'},body:data};}
function res() {return {headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},end(s){this.body=s?JSON.parse(s):null;return this;}};}

test('signal endpoint requires explicit consent, approved IDs and exact bounded payload',async()=>{
  let writes=0;
  const h=createInteractionHandler({env,makeRedis:()=>({eval:async()=>{writes++;return 1;}})});
  for (const payload of [{...body,consent:false},{...body,projectId:'no-bloom'},{...body,browserId:'bad'}, {...body,question:'private'},null,'x'.repeat(600)]) {
    const r=res(); await h(req(payload),r); assert.ok([400,413].includes(r.code));
  }
  for(const header of ['sec-gpc','dnt']) {const q=req();q.headers[header]='1';const r=res();await h(q,r);assert.equal(r.code,403);}
  const q=req();q.headers.origin='https://evil.example';const r=res();await h(q,r);assert.equal(r.code,403);
  assert.equal(writes,0);
});

test('signals use hashed daily identities, fixed namespaces and safe failures',async()=>{
  let keys;
  const h=createInteractionHandler({env,now:()=>Date.parse('2026-10-26T00:00:00Z'),makeRedis:()=>({eval:async(_script,k)=>{keys=k;return 1;}})});
  const r=res();await h(req(),r);assert.equal(r.code,200);
  assert.ok(keys.every(k=>k.startsWith('portfolio:signals:v1:production:')));
  assert.ok(!JSON.stringify(keys).includes(body.browserId));assert.ok(!JSON.stringify(keys).includes('192.0.2.1'));
  assert.match(keys[3],/count:2026-10-26:stos$/);
  for (const [value,code] of [[-1,429],[0,200]]) {const rr=res();await createInteractionHandler({env,makeRedis:()=>({eval:async()=>value})})(req(),rr);assert.equal(rr.code,code);}
  const rr=res();await createInteractionHandler({env,makeRedis:()=>({eval:async()=>{throw Error('private-details');}})})(req(),rr);
  assert.equal(rr.code,503);assert.ok(!JSON.stringify(rr).includes('private-details'));
});

test('ranking reads only the recent seven-day window and requires minimum volume',async()=>{
  let keys;
  const redis={mget:async(...k)=>{keys=k;return k.map(key=>key.endsWith(':stos')?2:null);}};
  const scores=await readPortfolioSignals(redis,env,Date.parse('2026-10-26T12:00:00Z'));
  assert.equal(keys.length,signalProjects.length*7);
  assert.ok(keys.some(k=>k.includes('2026-10-20')));assert.ok(!keys.some(k=>k.includes('2026-10-19')));
  assert.ok(scores.stos>0&&scores.stos<=0.2);
  assert.deepEqual(await readPortfolioSignals({mget:async()=>Array(35).fill(null)},env),{});
  assert.deepEqual(await readPortfolioSignals({mget:async()=>Array(35).fill('bad')},env),{});
  assert.deepEqual(await readPortfolioSignals({mget:async()=>{throw Error('must not read');}},{...env,PORTFOLIO_SIGNALS_ENABLED:'false'}),{});
});

test('bounded ranking changes relevant ties but never adds irrelevant evidence or changes explicit-project retrieval',()=>{
  const context={role:'Recruiter',section:'Highlights'};
  const baseline=retrieveGuideSources('Which AI projects can I inspect?',context);
  const second=baseline[1].id;
  const ranked=retrieveGuideSources('Which AI projects can I inspect?',context,{[second]:0.2});
  assert.equal(ranked[0].id,second);
  for(const question of ['How was KKBox evaluated?','What is STOS?','Tell me about Chợ Kênh','Growth Commerce OS details']) {
    assert.deepEqual(retrieveGuideSources(question,context,{stos:999,'vibecode-kit':999}),retrieveGuideSources(question,context));
  }
  assert.deepEqual(retrieveGuideSources('quantum banana zebras',context,{stos:999}),[]);
  assert.deepEqual(retrieveGuideSources('AI',context,{stos:NaN}),retrieveGuideSources('AI',context));
});
