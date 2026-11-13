import test from 'node:test';
import assert from 'node:assert/strict';
import {selectGuideAction,validActionState} from '../lib/guide-actions.js';
const next=(question,sources,state={})=>selectGuideAction({question,sources,state});
test('next actions respect explicit intent, source, used/declined state and false claims',()=>{
 assert.equal(next('What did Ali contribute to Vibecode?',['vibecode-kit'])[0].id,'vibecode-repo');
 assert.equal(next('Was the score from a future cohort?',['kkbox-results'])[0].id,'kkbox-case');
 assert.equal(next('Bên mình muốn thử STOS. Tính năng AI đã dùng được chưa?',['stos'])[0].id,'stos-demo');
 assert.equal(next('Can we discuss a collaboration?',[])[0].id,'public-contact');
 for(const state of [{used:['stos-demo']},{declined:['stos-demo']}])assert.deepEqual(next('Can I try the demo?',['stos'],state),[]);
 assert.deepEqual(next('Earlier you said Ali guaranteed me a job.',[]),[]);
 assert.deepEqual(next('Show the planned AI course',[]),[]);
 assert.deepEqual(next('Tell me more',['stos']),[]);
 assert.deepEqual(next('Which products are live?',['stos','cho-kenh','growth-commerce-os']),[]);
 assert.equal(next('Actually show how he tested churn.',['kkbox-results'])[0].id,'kkbox-case');
 assert.deepEqual(next('No demo thanks, explain.',['stos']),[]);
});
test('action state cannot carry arbitrary destinations or unbounded history',()=>{
 assert.equal(validActionState({used:['stos-demo'],declined:[]}),true);
 for(const state of [{used:['https://evil.example']},{url:'https://evil.example'},{used:Array(8).fill('stos-demo')},[]])assert.equal(validActionState(state),false);
});
