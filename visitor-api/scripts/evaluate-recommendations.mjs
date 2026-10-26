import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {retrieveGuideSources} from '../lib/guide-retrieval.js';
import {signalProjects} from '../lib/portfolio-signals.js';
const root=fileURLToPath(new URL('../../',import.meta.url));
const sourcePaths=['visitor-api/lib/guide-retrieval.js','visitor-api/lib/guide-knowledge.js','visitor-api/evaluation/cases.json'];
const labelled=JSON.parse(readFileSync(resolve(root,sourcePaths[2]),'utf8')).filter(c=>c.sources.length);
const scenarios=[['baseline',{}],...signalProjects.map(id=>[id,{[id]:0.2}])];
const rows=scenarios.map(([scenario,boost])=>{
  let complete=0,hits=0,expected=0,reciprocal=0;
  for(const c of labelled) {
    const ids=retrieveGuideSources(c.question,{role:'Recruiter',section:'Highlights'},boost).map(s=>s.id);
    const n=c.sources.filter(id=>ids.includes(id)).length;
    hits+=n;expected+=c.sources.length;if(n===c.sources.length)complete++;
    const rank=ids.findIndex(id=>c.sources.includes(id));reciprocal+=rank<0?0:1/(rank+1);
  }
  return {scenario,cases:labelled.length,completeExpectedSourceCases:complete,recallAt4:hits/expected,mrrAt4:reciprocal/labelled.length};
});
const report={kind:'authored-offline-retrieval-regression',date:new Date().toISOString().slice(0,10),
  limitations:'Synthetic ranking inputs; no model calls, production engagement, independent labels or measured recommendation uplift.',
  sourceHashes:Object.fromEntries(sourcePaths.map(p=>[p,createHash('sha256').update(readFileSync(resolve(root,p))).digest('hex')])),rows};
if(process.argv[2]) writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(rows));
if(rows.some(r=>r.completeExpectedSourceCases!==labelled.length)) process.exitCode=1;
