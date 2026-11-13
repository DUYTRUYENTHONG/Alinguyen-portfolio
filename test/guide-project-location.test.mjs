import test from 'node:test';
import assert from 'node:assert/strict';
import { updateProjectVisibility } from '../src/app/project-location.ts';

test('a partial observer batch does not replace a more visible unchanged project', () => {
  const first = updateProjectVisibility(new Map(), [{id:'a',visible:true,ratio:.8}], ['a','b']);
  const next = updateProjectVisibility(first.visibility, [{id:'b',visible:true,ratio:.1}], ['a','b']);
  assert.equal(next.active, 'a');
  const exit = updateProjectVisibility(next.visibility, [{id:'a',visible:false,ratio:0}], ['a','b']);
  assert.equal(exit.active, 'b');
});

test('equal visibility follows the latest role order and unknown projects cannot become current', () => {
  const next = updateProjectVisibility(new Map(), [
    {id:'a',visible:true,ratio:.5}, {id:'b',visible:true,ratio:.5}, {id:'unknown',visible:true,ratio:1},
  ], ['b','a']);
  assert.equal(next.active, 'b');
  assert.equal(next.visibility.has('unknown'), false);
});
