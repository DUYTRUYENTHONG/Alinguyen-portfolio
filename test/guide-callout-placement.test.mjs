import test from 'node:test';
import assert from 'node:assert/strict';
import { placeGuideCallout } from '../src/app/guide-callout-placement.ts';

const actor = { left: 100, top: 300, width: 54, height: 82 };
const bubble = { width: 170, height: 80 };
const viewport = { width: 1224, height: 604 };

test('uses nearby clear space without covering the actor', () => {
  assert.deepEqual(placeGuideCallout(actor, bubble, viewport, []), { left: 66, top: 1 });
});
test('moves to the other side when essential content blocks the right', () => {
  const result = placeGuideCallout({ ...actor, left: 400 }, bubble, viewport, [{ left: 460, top: 250, width: 250, height: 200 }]);
  assert.ok(result.left < 0);
});
test('does not show a bubble over an entirely occupied viewport', () => {
  assert.equal(placeGuideCallout(actor, bubble, viewport, [{ left: 0, top: 0, width: 1224, height: 604 }]), null);
});
test('keeps a right-edge actor bubble inside the viewport', () => {
  const rightActor = { ...actor, left: 1160 };
  const result = placeGuideCallout(rightActor, bubble, viewport, []);
  assert.ok(result.left < 0);
  assert.ok(rightActor.left + result.left + bubble.width <= viewport.width - 12);
});
test('omits artwork that cannot fit a narrow or short viewport', () => {
  assert.equal(placeGuideCallout(actor, bubble, { width: 100, height: 604 }, []), null);
  assert.equal(placeGuideCallout(actor, bubble, { width: 1224, height: 160 }, []), null);
});

test('touch portrait and landscape bubbles stay within the viewport', () => {
  for (const viewport of [{width:390,height:844},{width:956,height:440},{width:320,height:568}]) {
    const actor = {left:viewport.width-80,top:180,width:68,height:96};
    const result = placeGuideCallout(actor,{width:200,height:110},viewport,[]);
    assert.ok(result);
    assert.ok(actor.left+result.left>=12);
    assert.ok(actor.left+result.left+200<=viewport.width-12);
    assert.ok(actor.top+result.top+110<=viewport.height-12);
  }
});
