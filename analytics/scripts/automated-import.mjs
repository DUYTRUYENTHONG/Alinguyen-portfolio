import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile, appendFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connect } from '../connection.js';
import { ingest, validateSnapshot } from '../warehouse.js';
import { importWindow, importProject, importScope, assertRestrictedLoader, reconcileSnapshot } from '../automation.js';

let client, directory;
let phase='configuration';
try {
  for (const name of ['ANALYTICS_DATABASE_URL','KV_REST_API_URL','KV_REST_API_TOKEN']) {
    if (!process.env[name]) throw Error('Missing runtime configuration');
  }
  directory=await mkdtemp(join(tmpdir(),'portfolio-analytics-'));
  if (process.env.ANALYTICS_CA_PEM) {
    process.env.ANALYTICS_CA_FILE=join(directory,'ca.crt');
    await writeFile(process.env.ANALYTICS_CA_FILE,process.env.ANALYTICS_CA_PEM,{mode:0o600});
  }
  phase='restricted-connection';
  client=await connect();
  await assertRestrictedLoader(client);
  const {start,end}=importWindow();
  const snapshotFile=join(directory,'snapshot.json');
  phase='source-export';
  const sourceEnv={...process.env,TRAFFIC_REPORT_PROJECTS:importProject};
  delete sourceEnv.ANALYTICS_DATABASE_URL;
  delete sourceEnv.ANALYTICS_CA_PEM;
  await new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[fileURLToPath(new URL('../../visitor-api/scripts/export-analytics.mjs',import.meta.url)),importProject,start,end,snapshotFile,importScope],{
      env:sourceEnv,stdio:'ignore',timeout:45000,
    });
    child.once('error',reject);
    child.once('exit',code=>code===0?resolve():reject(Error('Export failed')));
  });
  const snapshot=validateSnapshot(JSON.parse(await readFile(snapshotFile,'utf8')));
  if (snapshot.projectId!==importProject || snapshot.scope!==importScope || Date.now()-Date.parse(snapshot.observedAt)>300000
    || Date.parse(snapshot.observedAt)>Date.now()+60000) throw Error('Unexpected or stale source snapshot');
  phase='import';
  const imported=await ingest(client,snapshot);
  phase='reconciliation';
  await reconcileSnapshot(client,snapshot,imported.batchId);
  const replay=await ingest(client,snapshot);
  if (!replay.replay || replay.appliedDays!==0) throw Error('Replay check failed');
  const result={status:'passed',project:importProject,scope:importScope,start,end,observedAt:snapshot.observedAt,dayRecords:snapshot.days.length,
    availableDays:snapshot.days.filter(d=>d.available).length,replayVerified:true};
  console.log(JSON.stringify(result));
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY,
    `## Traffic import verified\n\nRestricted role, exact row reconciliation and replay checks passed.\n\nUTC window: ${start} to ${end} (exclusive). Source observation: ${snapshot.observedAt}. No visitor records or traffic counts published.\n`);
} catch {
  // Never log database errors, URLs, passwords, Redis responses or SQL parameters.
  console.error(JSON.stringify({status:'failed',phase,message:'Check private configuration and job permissions. No successful import is claimed.'}));
  process.exitCode=1;
} finally {
  try { await client?.end(); }
  catch { console.error('Connection cleanup failed.'); process.exitCode=1; }
  if (directory) {
    try { await rm(directory,{recursive:true,force:true}); }
    catch { console.error('Private temporary-file cleanup failed.'); process.exitCode=1; }
  }
}
