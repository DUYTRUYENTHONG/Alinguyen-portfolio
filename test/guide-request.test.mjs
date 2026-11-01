import test from 'node:test';
import assert from 'node:assert/strict';
import { requestGuide } from '../src/app/guide-request.ts';
import { parseGuideReply } from '../src/app/guide-reply.ts';
const reply={answer:'STOS AI suggestions are planned, not live.',citations:[],suggestions:[],motion:'point'};
test('one transient network failure retries the same payload and preserves reply',async()=>{
 const calls=[];const r=await requestGuide('https://example.test', {question:'STOS'},parseGuideReply,async(_url,options)=>{calls.push(options.body);if(calls.length===1)throw TypeError('network');return Response.json(reply);});
 assert.equal(calls.length,2);assert.equal(calls[0],calls[1]);assert.equal(r.answer,reply.answer);
});
test('hung fetch and response bodies have deadlines and only one retry',async()=>{
 for(const bodyHang of [false,true]){
 let calls=0;const signals=[];
 await assert.rejects(requestGuide('https://example.test',{},parseGuideReply,async(_url,o)=>{calls++;signals.push(o.signal);if(bodyHang)return {ok:true,json:()=>new Promise(()=>{})};return new Promise(()=>{});},10));
 assert.equal(calls,2);assert.ok(signals.every(s=>s.aborted));
 }
});
test('rate limits, validation and malformed replies never retry',async()=>{
 for(const status of [400,403,415,429]){let calls=0;await assert.rejects(requestGuide('https://example.test',{},parseGuideReply,async()=>{calls++;return new Response('',{status});}));assert.equal(calls,1);}
 for(const response of [()=>Response.json({}),()=>new Response('bad json',{status:200})]){let calls=0;await assert.rejects(requestGuide('https://example.test',{},parseGuideReply,async()=>{calls++;return response();}));assert.equal(calls,1);}
});
test('temporary 503 recovers once but persistent failures stay bounded',async()=>{
 let calls=0;await requestGuide('https://example.test',{},parseGuideReply,async()=>++calls===1?new Response('',{status:503}):Response.json(reply));assert.equal(calls,2);
 calls=0;await assert.rejects(requestGuide('https://example.test',{},parseGuideReply,async()=>{calls++;return new Response('',{status:503});}));assert.equal(calls,2);
});
