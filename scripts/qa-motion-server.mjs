// Local, visibly labelled fixtures for motion QA. Never forwards to an AI provider.
import http from 'node:http';
import { createExportServer } from './preview-export.mjs';

const origin = 'http://[::1]:3041';
const counts = new Map();
http.createServer(async (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Cache-Control', 'no-store');
  if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
  if (request.url === '/api/visit') { response.writeHead(503); response.end('{}'); return; }
  if (request.url !== '/api/guide' || request.method !== 'POST') { response.writeHead(404); response.end('{}'); return; }
  let raw = '';
  for await (const part of request) { raw += part; if (raw.length > 3500) { response.writeHead(413); response.end('{}'); return; } }
  let question;
  try { question = JSON.parse(raw).question ?? ''; }
  catch { response.writeHead(400); response.end('{}'); return; }
  const scenario = /failure/i.test(question) ? 'failure' : /delayed|close/i.test(question) ? 'delayed' : 'fast';
  counts.set(scenario, (counts.get(scenario) ?? 0) + 1);
  console.log(JSON.stringify({scenario, attempts:counts.get(scenario), providerCalls:0}));
  const finish = () => {
    if (response.destroyed) return;
    if (scenario === 'failure') { response.writeHead(503); response.end('{}'); return; }
    response.end(JSON.stringify({
      answer:'Local motion QA fixture: STOS is a live sales-page product. AI suggestions remain planned.',
      citations:[{sourceId:'stos',label:'STOS product website (QA fixture)',url:'https://stosvn.vercel.app/stos'}],
      suggestions:[], motion:'nod',
    }));
  };
  if (scenario === 'delayed') {
    const timer = setTimeout(finish, 5000);
    response.on('close', () => clearTimeout(timer));
  } else finish();
}).listen(3040, '127.0.0.1', () => console.log('Motion QA fake transport: 127.0.0.1:3040; no external calls.'));
createExportServer(process.argv[2] ?? 'out').listen(3041, '::1', () => console.log(`Motion QA fixtures: ${origin}/Alinguyen-portfolio/`));
