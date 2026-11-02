import test from 'node:test';
import assert from 'node:assert/strict';
import { evidenceReply } from '../lib/guide-evidence.js';
import { knowledge } from '../lib/guide-knowledge.js';
import { summaries } from '../lib/guide-summaries.js';

test('reviewed summaries are shorter, bounded, and preserve source citations',()=>{
 for(const source of knowledge.filter(s=>summaries[s.id])){
  const reply=evidenceReply([source],'Tell me about this');
  assert.ok(summaries[source.id].en.length<source.text.length,source.id);
  assert.ok(summaries[source.id].en.split(/\s+/).length<=60,source.id);
  assert.deepEqual(reply.citations,[{sourceId:source.id,label:source.title,url:source.url}]);
  assert.ok(!reply.answer.includes('Reviewed portfolio evidence:'));
 }
});

test('short replies keep planned-feature, evidence and community limits',()=>{
 const body=id=>evidenceReply([knowledge.find(s=>s.id===id)]).answer;
 assert.match(body('stos'),/planned, not live/);
 assert.match(body('cho-kenh'),/Automated checkout, escrow and completed transactions are not claimed/);
 assert.match(body('cho-kenh'),/AI tools and courses are planned/);
 assert.match(body('kkbox-results'),/0\.217324.*0\.819295/);
 assert.match(body('kkbox-results'),/not a Kaggle.*future-cohort.*production/);
 assert.match(body('career-agent-kit'),/does not guarantee job offers/);
 assert.match(body('career-agent-kit'),/acceptance gates/);
 assert.match(body('vn-ai-content-kit'),/not generated answers/);
 assert.match(body('vn-ai-content-kit'),/trained models, automatic publishing and campaign uplift are not claimed/);
});

test('specific detail requests and exact privacy policy are not shortened away',()=>{
 for(const [id,q,phrase]of [['kkbox-results','What is the feature cutoff date?','2017-02-28'],['ali-overview','What is the contact email?','nquangd1510@gmail.com'],['traffic-analytics','Give technical details','Fourteen local analytics tests']]){
  assert.ok(evidenceReply([knowledge.find(s=>s.id===id)],q).answer.includes(phrase));
 }
 const policy=knowledge.find(s=>s.id==='recommendation-signals');assert.ok(evidenceReply([policy]).answer.includes(policy.text));
 const stos=knowledge.find(s=>s.id==='stos');assert.match(evidenceReply([stos],'Tính năng STOS đã hoạt động chưa?').answer,/chưa hoạt động/);
});
