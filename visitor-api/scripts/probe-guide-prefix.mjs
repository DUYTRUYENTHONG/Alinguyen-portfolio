import {createHash} from 'node:crypto';
import {createGuideHandler} from '../api/guide.js';
const live=process.argv.includes('--provider');
if(live&&(!process.env.GROQ_API_KEY||process.env.GROQ_PROBE_MAX_CALLS!=='4'))throw Error('Configure server-side GROQ_API_KEY and GROQ_PROBE_MAX_CALLS=4.');
for(const key of ['GROQ_API_KEY','KV_REST_API_URL','KV_REST_API_TOKEN','GUIDE_RATE_SALT'])process.env[key]??='offline-public-fixture';
const fixtures=[{id:'first',role:'Recruiter',question:'What is the local holdout log loss?',history:[]},{id:'repeat',role:'Recruiter',question:'What is the local holdout log loss?',history:[]},{id:'role-change',role:'Engineer',question:'What is the local holdout log loss?',history:[]},{id:'history-change',role:'Recruiter',question:'What are its evaluation limitations?',history:[{role:'user',text:'What is the local holdout log loss?'}]}];
const hash=x=>createHash('sha256').update(x).digest('hex');const records=[];
for(const f of fixtures){let captured=null,transportError=false;const started=performance.now();
 const handler=createGuideHandler({makeRedis:()=>({incr:async()=>1,expire:async()=>1}),modelFetch:async(url,options)=>{
  const body=JSON.parse(options.body);captured={route:'inference-selection',model:body.model,completionCap:body.max_completion_tokens,requestHash:hash(options.body),fixedPrefixHash:hash(JSON.stringify(body.messages[0])),evidencePrefixHash:hash(JSON.stringify(body.messages.slice(0,2))),evidenceIds:JSON.parse(body.messages[1].content).reviewedEvidence.map(s=>s.id)};
  if(!live)return{ok:true,status:200,json:async()=>({choices:[{message:{content:'{"citations":[]}'}}]})};
  try{return await fetch(url,options);}catch{transportError=true;throw Error('Probe transport unavailable');}
 }});
 const res={setHeader(){},status(n){this.code=n;return this},end(s){this.body=JSON.parse(s)}};
 await handler({method:'POST',headers:{origin:'https://duytruyenthong.github.io','content-type':'application/json'},body:{question:f.question,context:{role:f.role,section:'Selected work'},recentTurns:f.history,interests:[]}},res);
 const receipt=res.body?.receipt;
 const record={fixture:f.id,...captured,providerCalled:live&&!!captured,providerStatus:live?receipt?.providerStatus??null:null,returnedModel:live?receipt?.returnedModel??null:null,selectedIds:live?receipt?.selectedIds??[]:[],outputMode:!live?'offline-construction':transportError?'transport-or-json-failure':receipt?.providerStatus!==200?'provider-error':res.body?.responseMode??'unknown',promptTokens:live?receipt?.promptTokens??null:null,cachedTokens:live?receipt?.cacheHitTokens??null:null,completionTokens:live?receipt?.completionTokens??null:null,latencyMs:live?Math.round(performance.now()-started):null};records.push(record);
 if(!captured||(live&&(transportError||receipt?.providerStatus!==200||res.body?.responseMode==='source-excerpt')))break;
}
const observed=records.length&&records.every(r=>Number.isSafeInteger(r.cachedTokens)&&Number.isSafeInteger(r.promptTokens));const promptTotal=observed?records.reduce((n,r)=>n+r.promptTokens,0):0;
console.log(JSON.stringify({mode:live?'real-provider':'offline-handler-boundary',fixedPrefixStable:records.every(r=>r.fixedPrefixHash)&&new Set(records.map(r=>r.fixedPrefixHash)).size===1,identicalRepeat:records.length>1?records[0].requestHash===records[1].requestHash:null,providerCalls:records.filter(r=>r.providerCalled).length,aggregateHitShare:observed&&promptTotal>0?records.reduce((n,r)=>n+r.cachedTokens,0)/promptTotal:null,records,cost:'Not measured; existing account plan unchanged.'},null,2));
