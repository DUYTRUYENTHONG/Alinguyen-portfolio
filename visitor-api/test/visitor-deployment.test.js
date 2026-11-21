import test from 'node:test';
import assert from 'node:assert/strict';
import {checkVisitorEndpoint} from '../scripts/check-production-visitor.mjs';
test('counter deployment smoke rejects the observed missing-function outage',async()=>{
  await assert.rejects(checkVisitorEndpoint('https://fixture.invalid/api/visit',async()=>new Response(null,{status:404})),/preflight HTTP 404/);
});
test('counter deployment smoke verifies routing without recording fake visits',async()=>{
  const methods=[];
  const result=await checkVisitorEndpoint('https://fixture.invalid/api/visit',async(_url,options)=>{
    methods.push(options.method);
    return options.method==='OPTIONS'?new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':'https://duytruyenthong.github.io','Access-Control-Allow-Methods':'POST, OPTIONS'}}):Response.json({error:'Method not allowed'},{status:405});
  });
  assert.deepEqual(methods,['OPTIONS','GET']);
  assert.equal(result.productionWrites,0);
});
