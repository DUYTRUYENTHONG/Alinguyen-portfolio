import test from 'node:test';
import assert from 'node:assert/strict';
import { isTourQuestion, tourReply } from '../lib/guide-tour.js';
import { knowledge } from '../lib/guide-knowledge.js';
test('tour introduces Ali and all live products with aligned citations and limits',()=>{
 for(const name of ['Ari','Nova','Pip']){
 const r=tourReply(name,'Give me a quick tour of Ali’s work');
 assert.ok(r.answer.includes(`I’m ${name}`));
 for(const term of ['applied AI and product engineer','Growth Commerce OS','STOS','Chợ Kênh','planned','manual','aren’t claimed'])assert.ok(r.answer.includes(term),term);
 r.citations.forEach(c=>assert.equal(c.url,knowledge.find(s=>s.id===c.sourceId).url));
 assert.equal(r.citations.length,4);assert.ok(r.answer.length<1000);
 }
});
test('tour routing preserves specific product questions and supports introductions',()=>{
 for(const q of ['Give me a quick tour of Ali’s work','What does Ali do?','Introduce Ali and his products'])assert.ok(isTourQuestion(q),q);
 for(const q of ['What does STOS do?','Tour Chợ Kênh','How was KKBox evaluated?'])assert.equal(isTourQuestion(q),false);
});
