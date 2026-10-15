import { createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";

const allowedOrigins = new Set([
  "https://duytruyenthong.github.io",
  "http://localhost:3001",
  "http://[::1]:3001",
  "http://localhost:3000",
  "http://[::1]:3000",
]);

const roles = new Set([
  "Recruiter", "Founder", "Engineer", "Product designer", "Marketer",
  "Growth", "Data", "Investor", "Student", "Fellow builder", "Just curious",
]);

// One atomic Redis operation handles first visits and later role changes.
const recordVisit = `
local previous = redis.call('HGET', KEYS[1], 'role')
local ordinal = redis.call('HGET', KEYS[1], 'ordinal')
if not ordinal then
  ordinal = redis.call('INCR', KEYS[2])
  redis.call('HSET', KEYS[1], 'ordinal', ordinal, 'role', ARGV[1], 'country', ARGV[2], 'changes', 0)
  if ARGV[1] ~= 'none' then redis.call('HINCRBY', KEYS[3], ARGV[1], 1) end
  if ARGV[2] ~= 'XX' then redis.call('HINCRBY', KEYS[4], ARGV[2], 1) end
elseif previous ~= ARGV[1] then
  local changes = tonumber(redis.call('HGET', KEYS[1], 'changes') or '0')
  if changes < 30 then
    if previous ~= 'none' then redis.call('HINCRBY', KEYS[3], previous, -1) end
    if ARGV[1] ~= 'none' then redis.call('HINCRBY', KEYS[3], ARGV[1], 1) end
    redis.call('HSET', KEYS[1], 'role', ARGV[1], 'changes', changes + 1)
  end
end
local total = redis.call('GET', KEYS[2]) or '0'
local roleCount = '0'
if ARGV[1] ~= 'none' then roleCount = redis.call('HGET', KEYS[3], ARGV[1]) or '0' end
return {ordinal, total, roleCount, redis.call('HGETALL', KEYS[4])}
`;

function response(res, body, status, origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (allowedOrigins.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.status(status).end(body === null ? "" : JSON.stringify(body));
}

export default async function handler(request, res) {
  const origin = request.headers.origin ?? "";
  if (!allowedOrigins.has(origin)) return response(res, { error: "Forbidden origin" }, 403, origin);
  if (request.method === "OPTIONS") return response(res, null, 204, origin);
  if (request.method !== "POST") return response(res, { error: "Method not allowed" }, 405, origin);
  if (!request.headers["content-type"]?.toLowerCase().startsWith("application/json")) {
    return response(res, { error: "Expected JSON" }, 415, origin);
  }
  if (!process.env.VISITOR_HASH_SALT || !process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return response(res, { error: "Counter unavailable" }, 503, origin);
  }
  try {
    const raw = typeof request.body === "string" ? request.body : JSON.stringify(request.body ?? {});
    if (raw.length > 512) return response(res, { error: "Request too large" }, 413, origin);
    const data = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    if (!data || typeof data !== "object" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.visitorId)) {
      return response(res, { error: "Invalid visitor" }, 400, origin);
    }
    if (data.role !== null && !roles.has(data.role)) return response(res, { error: "Invalid role" }, 400, origin);

    const role = data.role ?? "none";
    const reportedCountry = request.headers["x-vercel-ip-country"]?.toUpperCase() ?? "";
    const country = /^[A-Z]{2}$/.test(reportedCountry) ? reportedCountry : "XX";
    const hash = createHmac("sha256", process.env.VISITOR_HASH_SALT).update(data.visitorId).digest("hex");
    const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
    const result = await redis.eval(recordVisit, [
      `portfolio:visitor:${hash}`, "portfolio:visitor:total", "portfolio:visitor:roles", "portfolio:visitor:countries",
    ], [role, country]);
    if (!Array.isArray(result) || result.length !== 4) throw new Error("Invalid counter result");
    const [ordinal, total, roleCount, countryPairs] = result;
    const countries = [];
    if (Array.isArray(countryPairs)) {
      for (let i = 0; i < countryPairs.length; i += 2) {
        if (/^[A-Z]{2}$/.test(countryPairs[i])) countries.push({ code: countryPairs[i], count: Number(countryPairs[i + 1]) });
      }
    }
    countries.sort((a, b) => b.count - a.count || a.code.localeCompare(b.code));
    return response(res, { total: Number(total), ordinal: Number(ordinal), roleCount: Number(roleCount), countries }, 200, origin);
  } catch {
    return response(res, { error: "Counter unavailable" }, 503, origin);
  }
}
