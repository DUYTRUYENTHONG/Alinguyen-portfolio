// Counts are an optional ranking hint, never factual evidence or individual preferences.
export const signalProjects = Object.freeze(['kkbox-results', 'vibecode-kit', 'growth-commerce-os', 'stos', 'cho-kenh']);
export const signalPrefix = (env = process.env) => `portfolio:signals:v1:${env.VERCEL_ENV === 'production' ? 'production' : 'staging'}`;
export const signalDay = (now = Date.now()) => new Date(now).toISOString().slice(0, 10);

// One contribution per browser/project/UTC day. Rates, deduplication and increment are atomic.
export const recordSignalLua = `
local rate = redis.call('INCR', KEYS[1])
if rate == 1 then redis.call('EXPIRE', KEYS[1], 172800) end
local global = redis.call('INCR', KEYS[2])
if global == 1 then redis.call('EXPIRE', KEYS[2], 172800) end
if rate > 30 or global > 3000 then return -1 end
if not redis.call('SET', KEYS[3], '1', 'NX', 'EX', 172800) then return 0 end
local count = redis.call('INCR', KEYS[4])
redis.call('EXPIRE', KEYS[4], 2592000)
return 1
`;

export async function readPortfolioSignals(redis, env = process.env, now = Date.now()) {
  if (env.PORTFOLIO_SIGNALS_ENABLED !== 'true') return {};
  const days = Array.from({length: 7}, (_, i) => signalDay(now - i * 86400000));
  const keys = signalProjects.flatMap(id => days.map(day => `${signalPrefix(env)}:count:${day}:${id}`));
  const values = await redis.mget(...keys);
  if (!Array.isArray(values) || values.length !== keys.length) return {};
  const totals = Object.fromEntries(signalProjects.map((id, i) => [id, values.slice(i * 7, i * 7 + 7).reduce((sum, n) => {
    const count = n === null ? 0 : Number(n);
    return Number.isSafeInteger(count) && count >= 0 && count <= 3000 ? sum + count : sum;
  }, 0)]));
  if (Object.values(totals).reduce((a, b) => a + b, 0) < 10) return {};
  // A bounded fractional tie-break cannot beat an additional whole query match.
  return Object.fromEntries(Object.entries(totals).filter(([, n]) => n >= 5).map(([id, n]) => [id, Math.min(0.2, n / 1000)]));
}
