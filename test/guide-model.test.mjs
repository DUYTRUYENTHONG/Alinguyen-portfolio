import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateBytes } from 'gltf-validator';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AnimationMixer, Vector3 } from 'three';
import { validateGuideAsset } from '../src/lib/tour-guide-geometry.js';

const bytes = await readFile(new URL('../public/assets/tour_guide.glb',import.meta.url));
test('real GLB is self-contained and passes Khronos structural validation',async()=>{
  const report = await validateBytes(bytes);
  assert.equal(report.issues.numErrors,0,JSON.stringify(report.issues.messages));
  assert.equal(report.issues.numWarnings,0,JSON.stringify(report.issues.messages));
  assert.ok(bytes.length < 2_000_000,'uncompressed asset budget: 2 MB');
});
test('real rig has functioning skin, mouth tracking, seven clips and in-place locomotion',async()=>{
  const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
  const mouth=validateGuideAsset(gltf);
  assert.ok(mouth.parent.isBone);
  assert.equal(gltf.animations.length,7);
  const meshes=[];gltf.scene.traverse(o=>{if(o.isSkinnedMesh)meshes.push(o);});
  assert.ok(meshes.length>0);
  assert.ok(meshes.every(m=>m.skeleton.bones.length>=20));
  const hips=gltf.scene.getObjectByName('Hips');
  const hand=gltf.scene.getObjectByName('RightHand');
  const rest=hips.position.clone();
  const mixer=new AnimationMixer(gltf.scene);
  for(const clip of gltf.animations) {
    mixer.stopAllAction(); const action=mixer.clipAction(clip).reset().play();
    mixer.update(0);gltf.scene.updateMatrixWorld(true);
    const before=hand.getWorldPosition(new Vector3());
    mixer.update(clip.duration*.35);gltf.scene.updateMatrixWorld(true);
    const after=hand.getWorldPosition(new Vector3());
    assert.ok(mouth.getWorldPosition(new Vector3()).toArray().every(Number.isFinite));
    if(clip.name==='gesture_point_left')assert.ok(before.distanceTo(after)>.2,'pointing moves the hand');
    if(clip.name.endsWith('forward'))assert.deepEqual(hips.position.toArray(),rest.toArray(),'root must stay in place');
    action.stop();
  }
  assert.equal(gltf.animations.find(c=>c.name==='idle_loop').duration,10);
});
