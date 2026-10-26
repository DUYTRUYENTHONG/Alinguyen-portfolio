import test from 'node:test';
import assert from 'node:assert/strict';
import { guideTourForRole } from '../src/app/guide-tour.ts';

test('growth perspectives tour work, the funnel and verified evidence', () => {
  for (const role of ['Growth','Marketer','Founder']) assert.deepEqual(guideTourForRole(role).map(stop=>stop.href), ['#work','#funnel','#ai-expertise']);
});
test('community-oriented visitors can discover the free kit', () => {
  for (const role of ['Student','Fellow builder','Just curious']) assert.equal(guideTourForRole(role).at(-1).href,'#community');
});
test('other perspectives get a finite work/evidence/CV tour with local anchors', () => {
  for (const role of ['Recruiter','Engineer','Data','Investor','Product designer','unknown']) {
    const stops=guideTourForRole(role);
    assert.equal(stops.length,3);
    assert.deepEqual(stops.map(stop=>stop.href),['#work','#ai-expertise','#cvs']);
    assert.equal(new Set(stops.map(stop=>stop.href)).size,3);
    assert.ok(stops.every(stop=>stop.message.length>30));
  }
});
