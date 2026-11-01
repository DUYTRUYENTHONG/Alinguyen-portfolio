import test from 'node:test';
import assert from 'node:assert/strict';
import { placeGuideActor } from '../src/app/guide-actor-placement.ts';

test('pins the complete desktop actor to the bottom-right corner',()=>{
  assert.deepEqual(placeGuideActor({width:80,height:120},{width:1224,height:604}),{left:1128,top:460});
});
test('respects device bottom and right safe areas',()=>{
  assert.deepEqual(placeGuideActor({width:68,height:96},{width:440,height:956},{right:20,bottom:34}),{left:340,top:814});
});
for(const [width,height] of [[320,568],[390,844],[440,956],[956,440],[956,200]])test(`keeps the corner target inside ${width}x${height}`,()=>{
 const p=placeGuideActor({width:68,height:96},{width,height});
 assert.ok(p.left>=12&&p.left+68<=width-16);
 assert.equal(p.top+96,height-24);
 assert.equal(p.left+68,width-(width>height?64:16));
});
