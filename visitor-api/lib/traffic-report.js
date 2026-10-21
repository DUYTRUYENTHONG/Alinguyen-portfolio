import { projectDefinitions } from "./traffic-projects.js";

/** Credentials authenticate the local operator; this allowlist narrows this tool's scope. */
export function authorizedReportProject(projectId, env, scope = "production") {
	if (
		!Object.hasOwn(projectDefinitions, projectId) ||
		!(env.TRAFFIC_REPORT_PROJECTS ?? "")
			.split(",")
			.map((s) => s.trim())
			.includes(projectId)
	)
		throw Error("Project reporting is not authorized");
	if (!["production", "staging", "development"].includes(scope))
		throw Error("Invalid reporting scope");
	if (!env.KV_REST_API_URL || !env.KV_REST_API_TOKEN)
		throw Error("Owner Redis credentials required");
	return `traffic:${projectId}:${scope}:v1`;
}

export function reportingDays(start, end, now = Date.now()) {
	const utc = (d) => Date.parse(`${d}T00:00:00Z`);
	const valid = (d) =>
		/^\d{4}-\d{2}-\d{2}$/.test(d) &&
		Number.isFinite(utc(d)) &&
		new Date(utc(d)).toISOString().slice(0, 10) === d;
	const today = utc(new Date(now).toISOString().slice(0, 10));
	if (
		!valid(start) ||
		!valid(end) ||
		utc(start) >= utc(end) ||
		utc(end) - utc(start) > 31 * 86400000 ||
		utc(start) < today - 399 * 86400000 ||
		utc(end) > today + 86400000
	)
		throw Error(
			"Use half-open UTC dates: at most31 days within retained400 days",
		);
	return Array.from({ length: (utc(end) - utc(start)) / 86400000 }, (_, i) =>
		new Date(utc(start) + i * 86400000).toISOString().slice(0, 10),
	);
}

export async function readTrafficReport(redis, namespace, days) {
	const keys = [
		`${namespace}:views`,
		`${namespace}:browsers`,
		`${namespace}:started-utc`,
		`${namespace}:paths`,
		`${namespace}:countries`,
		`${namespace}:cities`,
		`${namespace}:cities-started-utc`,
		...days.flatMap((d) => [
			`${namespace}:day:${d}:views`,
			`${namespace}:day:${d}:browsers`,
		]),
	];
	const result = await redis.eval(
		`
local days={};local seen={};local distinct=0
for i=8,#KEYS,2 do
 table.insert(days,{tonumber(redis.call('GET',KEYS[i]) or '0'),redis.call('SCARD',KEYS[i+1])})
 for _,id in ipairs(redis.call('SMEMBERS',KEYS[i+1])) do if not seen[id] then seen[id]=true;distinct=distinct+1 end end
end
return {tonumber(redis.call('GET',KEYS[1]) or '0'),redis.call('SCARD',KEYS[2]),redis.call('GET',KEYS[3]) or '',redis.call('HGETALL',KEYS[4]),redis.call('HGETALL',KEYS[5]),distinct,days,redis.call('HGETALL',KEYS[6]),redis.call('GET',KEYS[7]) or ''}
`,
		keys,
		[],
	);
	if (!Array.isArray(result) || result.length !== 9)
		throw Error("Invalid report");
	const pairs = (values) =>
		Object.fromEntries(
			Array.from({ length: values.length / 2 }, (_, i) => [
				values[i * 2],
				Number(values[i * 2 + 1]),
			]),
		);
	return {
		timezone: "UTC",
		empty: !result[2],
		startedAt: result[2] || null,
		pageViews: result[0],
		approximateUniqueBrowsers: result[1],
		intervalApproximateUniqueBrowsers: result[5],
		topPaths: pairs(result[3]),
		countryPageViews: pairs(result[4]),
		cityTrackingStartedAt: result[8] || null,
		cityPageViews: Object.entries(pairs(result[7])).map(([key, pageViews]) => {
			const [country, city] =
				key === "unknown" || key === "other"
					? [null, key]
					: JSON.parse(key.slice(5));
			return { country, city, pageViews };
		}),
		daily: days.map((date, i) => {
			const available = Boolean(result[2] && date >= result[2].slice(0, 10));
			return {
				date,
				available,
				pageViews: available ? result[6][i][0] : null,
				approximateUniqueBrowsers: available ? result[6][i][1] : null,
			};
		}),
	};
}
