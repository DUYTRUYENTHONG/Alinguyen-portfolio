// Separate Cloudflare Worker for a GitHub Pages portfolio. D1 keeps only a
// random browser identifier, chosen role, country code, and visit ordinal.
const roles = new Set(["Recruiter", "Founder", "Engineer", "Product designer", "Marketer", "Growth", "Data", "Investor", "Student", "Fellow builder", "Just curious"]);

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((item) => item.trim());
    const cors = allowed.includes(origin) ? {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    } : { "Vary": "Origin" };
    const reply = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
    if (!allowed.includes(origin)) return reply({ error: "Origin not allowed" }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply({ error: "Method not allowed" }, 405);
    if (Number(request.headers.get("Content-Length") || 0) > 1024) return reply({ error: "Request too large" }, 413);
    let body;
    try {
      const raw = await request.text();
      if (raw.length > 1024) return reply({ error: "Request too large" }, 413);
      body = JSON.parse(raw);
    } catch { return reply({ error: "Invalid JSON" }, 400); }
    const visitorId = body?.visitorId;
    const role = body?.role;
    if (typeof visitorId !== "string" || !/^[0-9a-f-]{36}$/i.test(visitorId) || !roles.has(role)) return reply({ error: "Invalid visit" }, 400);

    // Hash the random ID before persistence so the identifier sent by a browser
    // is not retained verbatim. The hash remains stable for repeat visits.
    const bytes = new TextEncoder().encode(`${env.VISITOR_SALT}:${visitorId}`);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const id = Array.from(new Uint8Array(digest), (n) => n.toString(16).padStart(2, "0")).join("");
    const country = /^[A-Z]{2}$/.test(request.cf?.country || "") ? request.cf.country : null;
    try {
      const existing = await env.DB.prepare("SELECT ordinal FROM visitors WHERE id = ?").bind(id).first();
      if (existing) {
        await env.DB.prepare("UPDATE visitors SET role = ? WHERE id = ?").bind(role, id).run();
      } else {
        // D1 serializes database writes. On a rare concurrent insert collision,
        // retry after reading the newly committed maximum ordinal.
        for (let attempt = 0; attempt < 3; attempt++) {
          const next = await env.DB.prepare("SELECT COALESCE(MAX(ordinal), 0) + 1 AS ordinal FROM visitors").first();
          try {
            await env.DB.prepare("INSERT INTO visitors (id, role, country, ordinal) VALUES (?, ?, ?, ?)").bind(id, role, country, next.ordinal).run();
            break;
          } catch (cause) {
            const raced = await env.DB.prepare("SELECT ordinal FROM visitors WHERE id = ?").bind(id).first();
            if (raced) {
              await env.DB.prepare("UPDATE visitors SET role = ? WHERE id = ?").bind(role, id).run();
              break;
            }
            if (attempt === 2) throw cause;
          }
        }
      }
      const [self, total, roleCount, countries] = await Promise.all([
        env.DB.prepare("SELECT ordinal FROM visitors WHERE id = ?").bind(id).first(),
        env.DB.prepare("SELECT COUNT(*) AS value FROM visitors").first(),
        env.DB.prepare("SELECT COUNT(*) AS value FROM visitors WHERE role = ?").bind(role).first(),
        env.DB.prepare("SELECT country AS code, COUNT(*) AS count FROM visitors WHERE country IS NOT NULL GROUP BY country ORDER BY count DESC, country ASC").all(),
      ]);
      return reply({ total: total.value, ordinal: self.ordinal, roleCount: roleCount.value, countries: countries.results });
    } catch {
      return reply({ error: "Counter unavailable" }, 503);
    }
  },
};
