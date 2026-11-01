import test from 'node:test';
import assert from 'node:assert/strict';
import { guideCardAnchor } from '../src/app/guide-card-anchor.ts';

test('uses the visible selected portrait instead of a second floating actor', () => {
  assert.deepEqual(guideCardAnchor({left:40,top:150,width:100,height:132},{width:390,height:844}),{left:40,top:150,width:100,height:132});
});
test('hands off to the floating actor when the portrait has left the viewport', () => {
  for (const portrait of [null,{left:40,top:-160,width:100,height:132},{left:40,top:844,width:100,height:132}]) {
    assert.equal(guideCardAnchor(portrait,{width:390,height:844}),null);
  }
});
test('anchors to the visible portion below the navigation, including short landscape', () => {
  assert.deepEqual(guideCardAnchor({left:30,top:90,width:100,height:132},{width:390,height:844}),{left:30,top:112,width:100,height:110});
  const box=guideCardAnchor({left:30,top:0,width:100,height:132},{width:956,height:220});
  assert.equal(box.top,55);
  assert.equal(box.height,77);
});
