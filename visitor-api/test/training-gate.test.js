import test from 'node:test';
import assert from 'node:assert/strict';
import {trainingGate,hashBytes} from '../evaluation/training-gate.js';
test('stale or partial adapters cannot be scored as current trained models',()=>{
 const data={train:'train',dev:'dev',test:'test'},model={name:'pinned',revision:'abc'};
 const record={base:model,meaningfulBudgetCompleted:true,completedUpdates:32,adapterSha256:'a'.repeat(64),dataHashes:Object.fromEntries(Object.entries(data).map(([k,v])=>[k,hashBytes(v)]))};
 assert.equal(trainingGate(record,data,model).eligible,true);
 assert.equal(trainingGate(record,{...data,dev:'changed'},model).eligible,false);
 assert.equal(trainingGate({...record,completedUpdates:18},data,model).eligible,false);
 assert.equal(trainingGate(record,data,{...model,revision:'other'}).eligible,false);
});
