export const trafficLua = `
local function kind(key)
 local t=redis.call('TYPE',key); if type(t)=='table' then return t.ok else return t end
end
local function validNumber(n)
 return not n or ((n=='0' or string.match(n,'^[1-9]%d*$')) and tonumber(n)<=9007199254740000)
end
local expected={'string','set','string','string','set','hash','hash','string','string','string','string','string','hash','string'}
for i=1,#KEYS do local t=kind(KEYS[i]); if t~='none' and t~=expected[i] then return redis.error_reply('invalid_counter_state') end end
for _,i in ipairs({1,4,8,9,11,12}) do if not validNumber(redis.call('GET',KEYS[i])) then return redis.error_reply('invalid_counter_state') end end
for _,pair in ipairs({{8,4},{9,5},{11,9},{12,10}}) do
 if tonumber(redis.call('GET',KEYS[pair[1]]) or '0')>=tonumber(ARGV[pair[2]]) then return {-1} end
end
for _,i in ipairs({8,11}) do redis.call('INCR',KEYS[i]);redis.call('EXPIRE',KEYS[i],120) end
for _,i in ipairs({9,12}) do redis.call('INCR',KEYS[i]);redis.call('EXPIRE',KEYS[i],172800) end
if ARGV[1]=='read' then return {tonumber(redis.call('GET',KEYS[1]) or '0'),redis.call('SCARD',KEYS[2])} end
if redis.call('EXISTS',KEYS[3])==1 then return {0} end
if redis.call('SCARD',KEYS[2])>=tonumber(ARGV[7]) and redis.call('SISMEMBER',KEYS[2],ARGV[6])==0 then return {-1} end
for _,i in ipairs({6,7}) do local field=ARGV[i==6 and 2 or 3];if not validNumber(redis.call('HGET',KEYS[i],field)) then return redis.error_reply('invalid_counter_state') end end
local city=ARGV[11]
if city~='unknown' and redis.call('HEXISTS',KEYS[13],city)==0 and redis.call('HLEN',KEYS[13])>=1000 then city='other' end
if not validNumber(redis.call('HGET',KEYS[13],city)) then return redis.error_reply('invalid_counter_state') end
redis.call('SET',KEYS[10],ARGV[8],'NX')
redis.call('SET',KEYS[14],ARGV[8],'NX')
redis.call('SET',KEYS[3],'1','EX',86400)
redis.call('INCR',KEYS[1]);redis.call('SADD',KEYS[2],ARGV[6])
redis.call('INCR',KEYS[4]);redis.call('SADD',KEYS[5],ARGV[6])
redis.call('EXPIRE',KEYS[4],34560000);redis.call('EXPIRE',KEYS[5],34560000)
redis.call('HINCRBY',KEYS[6],ARGV[2],1);redis.call('HINCRBY',KEYS[7],ARGV[3],1)
redis.call('HINCRBY',KEYS[13],city,1)
return {1}
`;

export class TrafficRateLimit extends Error {}

export async function trafficOperation(
	redis,
	project,
	mode,
	event,
	now,
	overall,
) {
	if (
		!/^traffic:[a-z0-9-]{1,48}:(production|staging|development|test-[a-z0-9-]{1,48}):v1$/.test(
			project.namespace,
		)
	)
		throw Error("Invalid namespace");
	if (project.namespace !== `traffic:${project.projectId}:${project.scope}:v1`)
		throw Error("Inconsistent namespace");
	for (const value of [
		project.minuteCap,
		project.dayCap,
		project.browserCap,
		overall.minuteCap,
		overall.dayCap,
	]) {
		if (!Number.isInteger(value) || value < 1 || value > 1000000)
			throw Error("Invalid limit");
	}
	if (!Number.isFinite(now)) throw Error("Invalid clock");
	const n = project.namespace,
		date = new Date(now).toISOString().slice(0, 10),
		minute = Math.floor(now / 60000);
	const shared = `traffic:shared:${project.scope}:v1`;
	const keys = [
		`${n}:views`,
		`${n}:browsers`,
		`${n}:event:${event?.eventId ?? "read"}`,
		`${n}:day:${date}:views`,
		`${n}:day:${date}:browsers`,
		`${n}:paths`,
		`${n}:countries`,
		`${n}:rate:minute:${minute}`,
		`${n}:rate:day:${date}`,
		`${n}:started-utc`,
		`${shared}:rate:minute:${minute}`,
		`${shared}:rate:day:${date}`,
		`${n}:cities`,
		`${n}:cities-started-utc`,
	];
	const result = await redis.eval(trafficLua, keys, [
		mode,
		event?.path ?? "/",
		event?.country ?? "unknown",
		project.minuteCap,
		project.dayCap,
		event?.digest ?? "",
		project.browserCap,
		new Date(now).toISOString(),
		overall.minuteCap,
		overall.dayCap,
		event?.city ?? "unknown",
	]);
	if (!Array.isArray(result) || result.some((v) => !Number.isSafeInteger(v)))
		throw Error("Invalid Redis result");
	if (result[0] === -1) throw new TrafficRateLimit();
	if (mode === "record") {
		if (result.length !== 1 || ![0, 1].includes(result[0]))
			throw Error("Invalid Redis result");
		return null;
	}
	if (
		result.length !== 2 ||
		result[0] < 0 ||
		result[1] < 0 ||
		result[1] > result[0]
	)
		throw Error("Invalid Redis result");
	return { pageViews: result[0], uniqueBrowsers: result[1] };
}
