import { createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";
import {
	approvedPreflightOrigin,
	getTrafficProject,
	projectDefinitions,
	sharedLimits,
} from "../lib/traffic-projects.js";
import { trafficOperation, TrafficRateLimit } from "../lib/traffic-store.js";
import { cityCategory } from "../lib/traffic-city.js";

const uuid =
	/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
class Oversized extends Error {}
async function jsonBody(request) {
	if (Number(request.headers.get("content-length") ?? 0) > 4096)
		throw new Oversized();
	const reader = request.body?.getReader();
	if (!reader) throw Error("Missing body");
	const chunks = [];
	let bytes = 0;
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			bytes += value.byteLength;
			if (bytes > 4096) {
				await reader.cancel();
				throw new Oversized();
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	return JSON.parse(
		new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)),
	);
}

export function createTrafficHandler({
	env = process.env,
	definitions = projectDefinitions,
	now = Date.now,
	overall = sharedLimits,
	makeRedis = () =>
		new Redis({
			url: env.KV_REST_API_URL,
			token: env.KV_REST_API_TOKEN,
			signal: () => AbortSignal.timeout(5000),
			retry: false,
		}),
	operation = trafficOperation,
} = {}) {
	return async (request) => {
		const origin = request.headers.get("origin") ?? "";
		const cors = approvedPreflightOrigin(origin, env, definitions);
		const headers = {
			"Cache-Control": "no-store",
			Vary: "Origin",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
			...(cors ? { "Access-Control-Allow-Origin": origin } : {}),
		};
		const respond = (body, status = 200, extra = {}) =>
			Response.json(body, { status, headers: { ...headers, ...extra } });
		if (!cors) return respond({ error: "forbidden_origin" }, 403);
		const query = new URL(request.url).searchParams;
		if (
			[...query.keys()].some((k) => k !== "projectId") ||
			query.getAll("projectId").length > 1
		)
			return respond({ error: "invalid_project" }, 400);
		if (request.method === "OPTIONS") {
			if (
				query.has("projectId") &&
				!getTrafficProject(query.get("projectId"), origin, env, definitions)
			)
				return respond({ error: "forbidden_project" }, 403);
			return new Response(null, {
				status: 204,
				headers: { ...headers, "Access-Control-Max-Age": "600" },
			});
		}
		if (!["POST", "GET"].includes(request.method))
			return respond({ error: "method_not_allowed" }, 405, {
				Allow: "GET, POST, OPTIONS",
			});
		if (request.method === "POST" && request.headers.get("sec-gpc") === "1")
			return respond({ error: "tracking_disallowed" }, 403);
		let payload = null;
		if (request.method === "POST") {
			if (
				request.headers
					.get("content-type")
					?.split(";")[0]
					.trim()
					.toLowerCase() !== "application/json"
			)
				return respond({ error: "invalid_content_type" }, 415);
			try {
				payload = await jsonBody(request);
			} catch (e) {
				return respond(
					{
						error:
							e instanceof Oversized ? "payload_too_large" : "invalid_payload",
					},
					e instanceof Oversized ? 413 : 400,
				);
			}
			if (
				!payload ||
				typeof payload !== "object" ||
				Array.isArray(payload) ||
				Object.keys(payload).length !== 4 ||
				Object.keys(payload).some(
					(k) => !["projectId", "visitorId", "eventId", "path"].includes(k),
				) ||
				typeof payload.projectId !== "string" ||
				typeof payload.visitorId !== "string" ||
				!uuid.test(payload.visitorId) ||
				typeof payload.eventId !== "string" ||
				!uuid.test(payload.eventId) ||
				typeof payload.path !== "string"
			)
				return respond({ error: "invalid_payload" }, 400);
			if (
				query.has("projectId") &&
				query.get("projectId") !== payload.projectId
			)
				return respond({ error: "invalid_project" }, 400);
		}
		const projectId = payload?.projectId ?? query.get("projectId");
		if (typeof projectId !== "string" || !Object.hasOwn(definitions, projectId))
			return respond({ error: "unknown_project" }, 400);
		const project = getTrafficProject(projectId, origin, env, definitions);
		if (!project) return respond({ error: "forbidden_project" }, 403);
		if (payload && !project.paths.includes(payload.path))
			return respond({ error: "invalid_path" }, 400);
		if (
			typeof project.secret !== "string" ||
			project.secret.length < 32 ||
			!env.KV_REST_API_URL ||
			!env.KV_REST_API_TOKEN
		)
			return respond({ error: "service_not_configured" }, 503);
		try {
			const event = payload
				? {
						digest: createHmac("sha256", project.secret)
							.update(
								`traffic:${projectId}:browser:v1:${payload.visitorId.toLowerCase()}`,
							)
							.digest("hex"),
						eventId: payload.eventId.toLowerCase(),
						path: payload.path,
						country:
							env.VERCEL === "1" &&
							/^[A-Z]{2}$/.test(
								request.headers.get("x-vercel-ip-country") ?? "",
							) &&
							request.headers.get("x-vercel-ip-country") !== "XX"
								? request.headers.get("x-vercel-ip-country")
								: "unknown",
					}
				: null;
			if (event) event.city = cityCategory(request, env, event.country);
			const totals = await operation(
				makeRedis(),
				project,
				payload ? "record" : "read",
				event,
				now(),
				overall,
			);
			return respond(payload ? { recorded: true } : totals);
		} catch (e) {
			return e instanceof TrafficRateLimit
				? respond({ error: "rate_limited" }, 429, { "Retry-After": "60" })
				: respond({ error: "temporarily_unavailable" }, 503);
		}
	};
}

const handler = createTrafficHandler();
export default { fetch: (request) => handler(request) };
