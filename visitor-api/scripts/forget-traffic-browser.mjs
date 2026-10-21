import { Redis } from "@upstash/redis";
import { createHmac } from "node:crypto";
import { authorizedReportProject } from "../lib/traffic-report.js";
import { projectDefinitions } from "../lib/traffic-projects.js";

try {
	const [projectId, confirmation] = process.argv.slice(2);
	if (confirmation !== "--confirm")
		throw Error("Explicit confirmation required");
	const namespace = authorizedReportProject(projectId, process.env);
	const secret = process.env[projectDefinitions[projectId].secretEnv];
	if (!secret || secret.length < 32) throw Error("Project secret required");
	let id = "";
	for await (const chunk of process.stdin) {
		id += String(chunk);
		if (id.length > 100) throw Error("Oversized ID");
	}
	id = id.trim().toLowerCase();
	if (
		!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
			id,
		)
	)
		throw Error("Valid UUID required");
	const digest = createHmac("sha256", secret)
		.update(`traffic:${projectId}:browser:v1:${id}`)
		.digest("hex");
	const today = Date.parse(
		`${new Date().toISOString().slice(0, 10)}T00:00:00Z`,
	);
	const keys = [
		`${namespace}:browsers`,
		...Array.from(
			{ length: 400 },
			(_, i) =>
				`${namespace}:day:${new Date(today - i * 86400000).toISOString().slice(0, 10)}:browsers`,
		),
	];
	const redis = new Redis({
		url: process.env.KV_REST_API_URL,
		token: process.env.KV_REST_API_TOKEN,
		retry: false,
		signal: () => AbortSignal.timeout(5000),
	});
	await redis.eval(
		`for i=1,#KEYS do local t=redis.call('TYPE',KEYS[i]).ok;if t~='none' and t~='set' then return redis.error_reply('invalid_state') end end for i=1,#KEYS do redis.call('SREM',KEYS[i],ARGV[1]) end return 1`,
		keys,
		[digest],
	);
	console.log(
		"Browser membership removed from this project. Aggregate page views remain; no browser-to-view history is stored.",
	);
} catch {
	console.error(
		"Deletion failed. Check explicit confirmation, project authorization, UUID, project secret and database.",
	);
	process.exitCode = 1;
}
