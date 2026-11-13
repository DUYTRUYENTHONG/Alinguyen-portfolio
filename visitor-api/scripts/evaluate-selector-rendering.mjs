import {readFile,writeFile} from 'node:fs/promises';
import {createGuideHandler} from '../api/guide.js';
import {retrieveGuideSources} from '../lib/guide-retrieval.js';
import {scoreReply,summarize} from '../evaluation/scoring.js';
const cases=JSON.parse(await readFile(new URL('../evaluation/cases.json',import.meta.url),'utf8'));
for(const k of ['GROQ_API_KEY','KV_REST_API_URL','KV_REST_API_TOKEN','GUIDE_RATE_SALT'])process.env[k]='synthetic';
const rows=[];
for(const item of cases){let modelCalled=false;const context={role:'Recruiter',section:'Explore the portfolio'};const retrieved=retrieveGuideSources(item.question,context).map(s=>s.id);
 const handler=createGuideHandler({makeRedis:()=>({incr:async()=>1,expire:async()=>1}),modelFetch:async()=>{modelCalled=true;return {ok:true,status:200,json:async()=>({choices:[{message:{content:JSON.stringify({citations:item.sources})}}]})}}});
 const res={setHeader(){},status(n){this.statusCode=n;return this},end(s){this.body=JSON.parse(s)}};const started=performance.now();await handler({method:'POST',headers:{origin:'https://duytruyenthong.github.io','content-type':'application/json'},body:{question:item.question,context,recentTurns:item.recentTurns||[],interests:[]}},res);
 rows.push({id:item.id,category:item.category,expectedSources:item.sources,modelCalled,latencyMs:Math.round(performance.now()-started),...scoreReply(item,res.statusCode,res.body,retrieved)});
}
const report={method:'Fake transport supplying expected source IDs. Tests routing/rendering only, NOT model selection, live latency or factual accuracy.',providerCalls:0,summary:summarize(rows),byLanguage:Object.fromEntries(["en","vi"].map(language=>[language,summarize(rows.filter(row=>(row.category==="multilingual"?"vi":"en")===language))])),rows};await writeFile(new URL('../../docs/evidence/groq-rendering-evaluation.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));
