import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { Redis } from '@upstash/redis';
import {recordSignalLua} from '../lib/portfolio-signals.js';

// Isolated, explicitly named QA keys. Never insert fixture counts into production ranking.
const prefix=`qa:portfolio-signals:${randomUUID()}`;
const keys=['rate','global','seen','count'].map(k=>`${prefix}:${k}`);
const redis=new Redis({url:process.env.KV_REST_API_URL,token:process.env.KV_REST_API_TOKEN,retry:false,signal:()=>AbortSignal.timeout(5000)});
try {
  const results=await Promise.all(Array.from({length:10},()=>redis.eval(recordSignalLua,keys,[])));
  assert.equal(results.filter(n=>Number(n)===1).length,1);
  assert.equal(Number(await redis.get(keys[3])),1);
  assert.ok(await redis.ttl(keys[2])>0);assert.ok(await redis.ttl(keys[3])>0);
  await redis.set(keys[0],30,{ex:60});
  assert.equal(Number(await redis.eval(recordSignalLua,keys,[])),-1);
  assert.equal(Number(await redis.get(keys[3])),1);
  console.log('Isolated Redis QA passed: concurrent deduplication, retention and rate denial. No production signal counts written.');
} finally { await redis.del(...keys); }
