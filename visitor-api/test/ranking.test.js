import test from 'node:test';
import assert from 'node:assert/strict';
import {metrics,rankOf,rrf} from '../evaluation/ranking.js';
test('rank four and missing sources cannot pass top-three; unrelated excluded',()=>{
 const result=metrics([{expected:'a',ids:['b','c','d','a']},{expected:'a',ids:['a']},{expected:'z',ids:[]},{expected:null,ids:[]}]);
 assert.equal(result.questions,3);assert.equal(result.top3,1/3);assert.equal(result.mrr3,1/3);assert.equal(rankOf(['a'],'z'),null);
});
test('RRF deduplicates sources with deterministic tie breaks',()=>assert.deepEqual(rrf([['a','b'],['b','a']]),['a','b']));
