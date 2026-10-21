/** Only platform metadata, never a client payload or an external IP lookup. */
export function cityCategory(request, env, country) {
	if (env.VERCEL !== "1" || country === "unknown") return "unknown";
	try {
		const raw = request.headers.get("x-vercel-ip-city");
		if (!raw || raw.length > 768) return "unknown";
		const decoded = decodeURIComponent(raw);
		if (/[\p{Cc}\p{Cf}]/u.test(decoded)) return "unknown";
		const city = decoded.normalize("NFC").trim();
		if (
			!city ||
			city.length > 96 ||
			!/^[\p{L}\p{M}\p{N} .,'’()-]+$/u.test(city)
		)
			return "unknown";
		return `city:${JSON.stringify([country, city])}`;
	} catch {
		return "unknown";
	}
}
