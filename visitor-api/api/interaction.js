import { createHmac } from 'node:crypto';
import { Redis } from '@upstash/redis';
import { signalProjects, signalPrefix, signalDay, recordSignalLua } from '../lib/portfolio-signals.js';

export function createInteractionHandler({ env = process.env, now = Date.now, makeRedis = () => new Redis({url: env.KV_REST_API_URL, token: env.KV_REST_API_TOKEN, retry: false, signal: () => AbortSignal.timeout(2000)}) } = {}) {
  return async (req, res) => {
    const origin = req.headers.origin;
    const allowed = origin === 'https://duytruyenthong.github.io' || (env.VERCEL_ENV !== 'production' && ['http://localhost:3000','http://localhost:3001'].includes(origin));
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (allowed) res.setHeader('Access-Control-Allow-Origin', origin);
    const send = (status, body) => res.status(status).end(body ? JSON.stringify(body) : '');
    res.setHeader('Content-Type', 'application/json');
    if (!allowed) return send(403, {error:'forbidden_origin'});
    if (req.method === 'OPTIONS') return send(204);
    if (req.method !== 'POST') return send(405, {error:'method_not_allowed'});
    if (req.headers['sec-gpc'] === '1' || req.headers.dnt === '1') return send(403, {error:'tracking_disallowed'});
    if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) return send(415, {error:'expected_json'});
    let data;
    try {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
      if (raw.length > 512) return send(413, {error:'payload_too_large'});
      data = JSON.parse(raw);
    } catch { return send(400, {error:'invalid_payload'}); }
    if (!data || Array.isArray(data) || Object.keys(data).length !== 3 || data.consent !== true || !signalProjects.includes(data.projectId) ||
      typeof data.browserId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.browserId)) return send(400, {error:'invalid_payload'});
    if (env.PORTFOLIO_SIGNALS_ENABLED !== 'true' || !env.KV_REST_API_URL || !env.KV_REST_API_TOKEN || !env.GUIDE_RATE_SALT) return send(503, {error:'signals_unavailable'});
    const day = signalDay(now());
    const prefix = signalPrefix(env);
    const digest = value => createHmac('sha256', env.GUIDE_RATE_SALT).update(`portfolio-signals:v1:${day}:${value}`).digest('hex');
    const forwarded = req.headers['x-vercel-forwarded-for'] ?? req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : 'unknown';
    try {
      const result = await makeRedis().eval(recordSignalLua, [
        `${prefix}:rate:${day}:${digest(`ip:${ip}`)}`, `${prefix}:global:${day}`,
        `${prefix}:seen:${day}:${digest(`browser:${data.browserId.toLowerCase()}`)}:${data.projectId}`,
        `${prefix}:count:${day}:${data.projectId}`,
      ], []);
      if (Number(result) < 0) return send(429, {error:'rate_limited'});
      return send(200, {accepted:true});
    } catch { return send(503, {error:'signals_unavailable'}); }
  };
}
export default createInteractionHandler();
