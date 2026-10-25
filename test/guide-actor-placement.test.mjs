import test from 'node:test';
import assert from 'node:assert/strict';
import { placeGuideActor } from '../src/app/guide-actor-placement.ts';
const size={width:80,height:120};
test('places complete actor in blank space above a proof ribbon',()=>{
 const result=placeGuideActor(size,{width:1224,height:604},[{left:0,top:390,width:1224,height:46}],null);
 assert.ok(result.top+size.height+10<390 || result.top>446);
});
test('keeps an existing empty pocket stable',()=>{
 assert.deepEqual(placeGuideActor(size,{width:1224,height:604},[],{x:1128,y:200}),{left:1128,top:200});
});
test('moves when content enters the previous pocket',()=>{
 const p=placeGuideActor(size,{width:390,height:844},[{left:280,top:300,width:100,height:200}],{x:294,y:350});
 assert.ok(p.left!==294||p.top<170||p.top>510);
});
for(const [width,height] of [[320,568],[390,844],[440,956],[956,440],[956,200]])test(`fits complete target at ${width}x${height} even in dense content`,()=>{
 const p=placeGuideActor({width:68,height:96},{width,height},[{left:0,top:0,width,height}],null);
 assert.ok(p.left>=16&&p.left+68<=width-16&&p.top>=16&&p.top+96<=height-24);
});
