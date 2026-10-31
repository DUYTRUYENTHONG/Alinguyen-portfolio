import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/data/portfolio.ts';
import { knowledge } from '../visitor-api/lib/guide-knowledge.js';

test('API live inventory and citation URLs match every live portfolio project', () => {
  const live = projects.filter(p => p.status.startsWith('Live '));
  const sources = knowledge.filter(s => s.liveProject);
  assert.deepEqual(sources.map(s=>s.id).sort(), live.map(p=>p.id).sort());
  for (const p of live) assert.equal(sources.find(s=>s.id===p.id).url, p.link.href);
});
