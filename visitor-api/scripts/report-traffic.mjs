import { Redis } from "@upstash/redis";
import {
	authorizedReportProject,
	reportingDays,
	readTrafficReport,
} from "../lib/traffic-report.js";

try {
	const [projectId, startArg, endArg, ...options] = process.argv.slice(2);
	const scope =
		options.find((v) => v.startsWith("--scope="))?.slice(8) ?? "production";
	const namespace = authorizedReportProject(projectId, process.env, scope);
	const today = new Date().toISOString().slice(0, 10),
		utc = Date.parse(`${today}T00:00:00Z`);
	const start =
			startArg ?? new Date(utc - 6 * 86400000).toISOString().slice(0, 10),
		end = endArg ?? new Date(utc + 86400000).toISOString().slice(0, 10);
	const days = reportingDays(start, end);
	const redis = new Redis({
		url: process.env.KV_REST_API_URL,
		token: process.env.KV_REST_API_TOKEN,
		retry: false,
		signal: () => AbortSignal.timeout(5000),
	});
	const report = await readTrafficReport(redis, namespace, days);
	console.log(
		JSON.stringify(
			{
				projectId,
				scope,
				interval: { startInclusive: start, endExclusive: end },
				...report,
				note: "Consenting recorded traffic. Browsers are not people; country counts are page views. Interval uniques are distinct memberships, never summed daily uniques.",
			},
			null,
			2,
		),
	);
} catch {
	console.error(
		"Report unavailable. Check project authorization, owner credentials, UTC dates and Redis availability.",
	);
	process.exitCode = 1;
}
