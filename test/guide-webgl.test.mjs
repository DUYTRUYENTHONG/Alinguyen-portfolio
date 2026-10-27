import test from 'node:test';
import assert from 'node:assert/strict';
import { Group, Object3D, QuadraticBezierCurve, Vector2 } from 'three';
import { bubblePosition, clearCurve, requiredGuideClips, screenToNDC, validateGuideAsset } from '../src/lib/tour-guide-geometry.js';

test('screen center and corners map into camera NDC', () => {
  assert.deepEqual(screenToNDC(200, 400, 400, 800), {x:0,y:0});
  assert.deepEqual(screenToNDC(0, 0, 400, 800), {x:-1,y:1});
  assert.deepEqual(screenToNDC(400, 800, 400, 800), {x:1,y:-1});
});
test('asset contract rejects missing clips or mouth and permits optional poses', () => {
  const scene = new Group();
  const gltf = { scene, animations: requiredGuideClips.map(name=>({name})) };
  assert.throws(()=>validateGuideAsset(gltf), /Head_Mouth_Node/);
  const mouth = new Object3D(); mouth.name = 'Head_Mouth_Node'; scene.add(mouth);
  assert.equal(validateGuideAsset(gltf),mouth);
  gltf.animations.pop();
  assert.throws(()=>validateGuideAsset(gltf), /gesture_point_right/);
});
test('navigation checks the whole body against thin obstacles and viewport boundaries', () => {
  const curve = new QuadraticBezierCurve(new Vector2(100,300),new Vector2(300,300),new Vector2(500,300));
  const size = {width:60,height:120}, viewport={width:800,height:600};
  assert.equal(clearCurve(curve,size,viewport,[]),true);
  assert.equal(clearCurve(curve,size,viewport,[{left:301,top:180,width:1,height:120}]),false);
  assert.equal(clearCurve(curve,size,{width:400,height:600},[]),false);
});
test('projected bubbles flip below the head and remain within portrait and landscape', () => {
  for (const viewport of [{width:390,height:844},{width:956,height:440}]) {
    const result=bubblePosition({x:viewport.width-25,y:110},{width:248,height:160},viewport);
    assert.ok(result.below);
    assert.ok(result.left>=12 && result.left+248<=viewport.width-12);
    assert.ok(result.top>=96 && result.top+160<=viewport.height-12);
  }
  assert.equal(bubblePosition({x:80,y:100},{width:248,height:160},{width:200,height:200}),null);
});
