import assert from 'node:assert/strict';
import test from 'node:test';
import {validSignalConsent,signalProjectForLink} from '../src/app/portfolio-signal-policy.ts';
test('project tracking is restricted to approved destinations and handles production base paths',()=>{
  const origin='https://duytruyenthong.github.io',base='/Alinguyen-portfolio';
  assert.equal(signalProjectForLink(`${origin}${base}/work/kkbox-baseline/?private=ignored`,origin,base),'kkbox-results');
  assert.equal(signalProjectForLink('https://stosvn.vercel.app/stos',origin,base),'stos');
  for(const href of ['javascript:alert(1)','https://evil.example/Alinguyen-portfolio/work/stos','https://stosvn.vercel.app.evil.example/stos',`${origin}/other/work/stos`,`${origin}${base}/#contact`]) assert.equal(signalProjectForLink(href,origin,base),null);
});
test('consent fails closed for missing, expired, malformed and unbounded storage records',()=>{
  const now=Date.now(),valid={browserId:'d0f9843c-6774-42f8-a05b-f2696e79b267',expiresAt:now+1000};
  assert.equal(validSignalConsent(valid,now),true);
  for(const v of [null,{}, {...valid,browserId:'private'}, {...valid,expiresAt:now-1},{...valid,expiresAt:now+31*86400000}]) assert.equal(validSignalConsent(v,now),false);
});
