import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { knowledge } from '../lib/guide-knowledge.js';
import { retrieveGuideSources } from '../lib/guide-retrieval.js';
import { buildSelectionRequest } from '../lib/guide-model.js';
import { metrics } from '../evaluation/ranking.js';
import { trainingGate, hashBytes } from '../evaluation/training-gate.js';

const root=new URL('../../',import.meta.url);
const questionsBytes=await readFile(new URL('../evaluation/recruiter-questions.json',import.meta.url));
const questions=JSON.parse(questionsBytes);
// Frozen single-variable candidates. Never reads or tunes against held-out labels.
const candidates=[['baseline',{}],['reviewed-vietnamese',{includeVietnamese:true}],['threshold-2',{minScore:2}]];
const reports=candidates.map(([name,config])=>{
  const rows=questions.map(q=>({...q,ids:retrieveGuideSources(q.question,{role:'Recruiter',section:'Selected work'},{},config).map(s=>s.id)}));
  const languages=Object.fromEntries(['en','vi'].map(language=>[language,metrics(rows.filter(q=>q.language===language))]));
  const unrelated=rows.filter(q=>q.expected===null);
  return {name,config,languages,unrelatedReturned:unrelated.filter(q=>q.ids.length).length,rows};
});
const baseline=reports[0];
for(const r of reports){
  r.admissible=r.languages.en.top3>=baseline.languages.en.top3&&r.unrelatedReturned<=baseline.unrelatedReturned;
  r.developmentScore=(r.languages.en.top3+r.languages.vi.top3)/2;
}
const selected=[...reports].filter(r=>r.admissible).sort((a,b)=>b.developmentScore-a.developmentScore)[0];
const evidence=knowledge.slice(0,4);
const first=buildSelectionRequest(evidence,'Recruiter',{question:'Explain the evidence',recentTurns:[]});
const repeat=buildSelectionRequest([...evidence].reverse(),'Data',{question:'Explain its limits',recentTurns:[{role:'user',text:'Earlier public question'}]});
const prefixStable=JSON.stringify(first.messages.slice(0,2))===JSON.stringify(repeat.messages.slice(0,2));
if(!prefixStable)throw Error('Stable prompt prefix regression');
const data=Object.fromEntries(await Promise.all(['train','dev','test'].map(async split=>[split,await readFile(new URL(`../evaluation/action-data/${split}.json`,import.meta.url))])));
let training=null;try{training=JSON.parse(await readFile(new URL('artifacts/action-training/training.json',root)));}catch{}
const model=JSON.parse(await readFile(new URL('../evaluation/action-model.json',import.meta.url)));
const report={kind:'offline-engineering-release-harness',dataset:'Authored development replay; not independent evaluation',providerCalls:0,
  sourceHashes:{corpus:hashBytes(JSON.stringify(knowledge)),questions:hashBytes(questionsBytes),ranker:hashBytes(await readFile(new URL('../lib/guide-retrieval.js',import.meta.url)))},
  hillclimb:{budget:2,objective:'Mean EN/VI top3; no EN top3 or unrelated-abstention regression',reports,developmentChoice:selected.name,productionPromoted:false,reason:'Independent holdout labels pending; production defaults unchanged'},
  promptCaching:{model:first.model,stablePrefix:prefixStable,prefixHash:hashBytes(JSON.stringify(first.messages.slice(0,2))),providerCacheHitShare:null,reason:'Provider counters required; prefix construction does not prove a cache hit'},
  fineTuning:{...trainingGate(training,data,model),promoted:false,model,independentReview:'pending'}};
await mkdir(new URL('artifacts/',root),{recursive:true});
await writeFile(new URL('artifacts/ai-offline-release.json',root),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({providerCalls:0,hillclimb:report.hillclimb.reports.map(({name,languages,admissible,unrelatedReturned})=>({name,languages,admissible,unrelatedReturned})),developmentChoice:selected.name,promptCaching:report.promptCaching,fineTuning:report.fineTuning},null,2));
