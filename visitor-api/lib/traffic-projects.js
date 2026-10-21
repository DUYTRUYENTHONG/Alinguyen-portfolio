/** Public IDs select server-owned configuration, never a caller-supplied prefix. */
export const projectDefinitions = Object.freeze({
	"no-bloom": Object.freeze({
		origins: ["https://duytruyenthong.github.io"],
		localOrigins: ["http://localhost:3100"],
		paths: ["/", "/credits"],
		secretEnv: "TRAFFIC_NO_BLOOM_HASH_SALT",
		minuteCap: 60,
		dayCap: 500,
		browserCap: 100000,
	}),
});

export const sharedLimits = Object.freeze({ minuteCap: 120, dayCap: 1000 });

export function getTrafficProject(
	projectId,
	origin,
	env = process.env,
	definitions = projectDefinitions,
) {
	if (typeof projectId !== "string" || !Object.hasOwn(definitions, projectId))
		return null;
	const definition = definitions[projectId];
	const production = env.VERCEL_ENV === "production";
	const local =
		!production &&
		env.TRAFFIC_ALLOW_LOCAL === "true" &&
		definition.localOrigins.includes(origin);
	if (!definition.origins.includes(origin) && !local) return null;
	const scope = production ? "production" : local ? "development" : "staging";
	return {
		...definition,
		projectId,
		secret: env[definition.secretEnv],
		scope,
		namespace: `traffic:${projectId}:${scope}:v1`,
	};
}

export function approvedPreflightOrigin(
	origin,
	env = process.env,
	definitions = projectDefinitions,
) {
	return Object.values(definitions).some(
		(p) =>
			p.origins.includes(origin) ||
			(env.VERCEL_ENV !== "production" &&
				env.TRAFFIC_ALLOW_LOCAL === "true" &&
				p.localOrigins.includes(origin)),
	);
}
