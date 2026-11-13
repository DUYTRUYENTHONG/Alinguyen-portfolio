import test from 'node:test';
import assert from 'node:assert/strict';
import {cutoffDates,listeningEvents,snapshot} from '../src/app/evidence/cutoff-model.ts';
test('inclusive snapshot includes equality and excludes future events at every cutoff',()=>{
 for(const cutoff of cutoffDates){
  const expected=listeningEvents.filter(e=>e.date<=cutoff);
  assert.equal(snapshot(listeningEvents,cutoff).count,expected.length);
  assert.deepEqual(snapshot([...listeningEvents,{id:'future',date:'2017-03-03',seconds:9999}],cutoff),snapshot(listeningEvents,cutoff));
 }
 assert.deepEqual(snapshot(listeningEvents,'2017-02-28'),{count:3,seconds:250});
 assert.deepEqual(snapshot([],cutoffDates[0]),{count:0,seconds:0});
});
