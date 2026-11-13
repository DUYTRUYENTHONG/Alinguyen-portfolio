import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
test('corrected runnable split keeps family variants and CV paraphrases together',async()=>{
 const sets=await Promise.all(['train','dev','test'].map(async split=>JSON.parse(await readFile(new URL('../evaluation/action-data/'+split+'.json',import.meta.url),'utf8'))));
 const seen=new Map(),texts=new Set();
 sets.forEach((rows,i)=>rows.forEach(row=>{if(seen.has(row.family))assert.equal(seen.get(row.family),i,row.family);seen.set(row.family,i);const text=row.current.trim().toLowerCase();assert.ok(!texts.has(text));texts.add(text);if(row.acceptable.includes('master-cv'))assert.equal(i,0,'CV paraphrase escaped training family');}));
 assert.deepEqual(sets.map(s=>s.length),[18,6,8]);
});
test('preserved original data matches the actual recorded training fingerprints',async()=>{
 const report=JSON.parse(await readFile(new URL('../../docs/evidence/action-training-local.json',import.meta.url),'utf8'));
 for(const split of ['train','dev','test']){
 const bytes=await readFile(new URL('../../docs/evidence/action-data-v1-'+split+'.json',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),report.dataHashes[split]);
 }
 assert.equal(report.completedUpdates,18);assert.equal(report.meaningfulBudgetCompleted,false);
});
