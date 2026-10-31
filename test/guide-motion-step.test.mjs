import test from 'node:test';
import assert from 'node:assert/strict';
import { guideMotionStep } from '../src/app/guide-motion-step.ts';

test('travel is consistent on 60 Hz and 120 Hz displays', () => {
  const travel = (fps) => {
    let x = 0;
    for (let i = 0; i < fps / 4; i++) x = guideMotionStep(x, 300, 1000 / fps);
    return x;
  };
  assert.ok(Math.abs(travel(60) - travel(120)) < .01);
});

test('retargeting stays bounded and converges without overshoot', () => {
  let x = 400;
  for (let i = 0; i < 100; i++) {
    const next = guideMotionStep(x, 112, 16);
    assert.ok(next >= 112 && next <= x);
    x = next;
  }
  assert.equal(x, 112);
});

test('background-tab time gap does not cause a full-distance teleport', () => {
  assert.ok(guideMotionStep(0, 300, 30000) < 200);
  assert.equal(guideMotionStep(20, 300, 0), 20);
});
