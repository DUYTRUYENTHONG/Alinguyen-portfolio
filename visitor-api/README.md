# Portfolio visitor counter

## Shared website traffic candidate

The project-isolated `/api/traffic` endpoint reuses this API and Redis database for NỞ. It does not change `/api/visit` or `/api/guide`. See [TRAFFIC_INTEGRATION.md](TRAFFIC_INTEGRATION.md) for registration, consent, configuration, reporting, limits, tests and the reviewed deployment sequence. Deploy the shared API with its new project secret before enabling NỞ's public configuration.

This small Vercel function records one anonymous visitor per browser for the GitHub Pages portfolio. It stores an HMAC of the browser's random UUID, a selected role, and the country code supplied by Vercel. It does not store the raw UUID or IP address. A role change updates the role counts without adding a visitor.

The API is deployed separately because GitHub Pages serves static files and cannot write visitor data. The backing Upstash Redis resource is connected to the Vercel project and provides `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Set `VISITOR_HASH_SALT` in the Vercel project's production environment. The GitHub Pages build sets `NEXT_PUBLIC_VISITOR_API_URL` to the deployed `/api/visit` URL.

To run locally, use `vercel dev` after `vercel env pull`. The function accepts POST JSON `{ "visitorId": "<UUID>", "role": "Recruiter" }`. `role` may be `null`. Its response contains `total`, `ordinal`, `roleCount`, and `countries`.

## Portfolio AI guide candidate

`POST /api/guide` is a separate, on-demand assistant endpoint for the portfolio characters. Each selected perspective has a distinct name and brief introduction; the server derives the same name from its role allowlist. The endpoint retrieves from a small, curated public knowledge set in `lib/guide-knowledge.js`, then sends the question and selected evidence to Groq's Chat Completions API using `openai/gpt-oss-20b`. The GitHub Pages site only contains the client and the public endpoint URL; it must never contain an API key.

Set these server-side Vercel environment variables: `GROQ_API_KEY` and `GUIDE_RATE_SALT` (a distinct secret for daily rate-limit hashes), plus the existing `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Do not reuse `VISITOR_HASH_SALT`. Set `NEXT_PUBLIC_GUIDE_API_URL` in the static site build to the deployed `/api/guide` URL. The endpoint returns 503 while configuration is incomplete; the panel shows links to the static portfolio pages.

The handler accepts a question, allowlisted role and section, up to four recent turns, and optional allowlisted interests. It does not store chat text, visitor identifiers, or preferences in Redis. It validates returned citation IDs against the retrieved public sources and renders no model-generated URL. Redis limits each client to 20 requests and all clients to 300 requests per UTC day; the Groq Free Plan stops at its own published limits instead of charging for overages. Rate-limit hashes are based on the daily date and request IP and expire after two days. Groq says inference content is not retained by default, with reliability and abuse exceptions. The existing visitor counter remains independent.

Run `npm test` in this directory for the retrieval, grounding, privacy, and request-boundary checks. Run `npm run smoke:production` after deploying this Vercel project and before publishing the GitHub Pages client; the Pages workflow repeats that live check. Review and update public facts in `lib/guide-knowledge.js` whenever the portfolio or linked evidence changes. The full user flow, consent policy, prompt, and release checks are in [the design draft](../docs/GUIDE_ASSISTANT_DESIGN.md).

Provider references: [Groq Free Plan limits](https://console.groq.com/docs/rate-limits), [structured JSON](https://console.groq.com/docs/structured-outputs), and [data controls](https://console.groq.com/docs/your-data). Check the limits in your own Groq console before release.

## Optional portfolio recommendation signals

`POST /api/interaction` accepts only consented, allowlisted project-link interactions. Daily hashed deduplication keys and rate limits expire after two days; aggregate counters expire after 30 days. `PORTFOLIO_SIGNALS_ENABLED=true` enables recording and bounded seven-day ranking. The guide never sends counts to the model and falls back to baseline retrieval on signal failure. See [implementation and privacy](../docs/PORTFOLIO_RECOMMENDATIONS.md) for configuration, withdrawal, testing and rollback. This namespace is separate from no-bloom traffic and is not a PostgreSQL warehouse export.

### Answer coverage

Broad supported questions such as “Which products are live?” return a curated
three-website inventory (Growth Commerce OS, STOS, Chợ Kênh), with numbered
source links and explicit planned-feature limits. This answer uses reviewed
public facts rather than model generation or popularity ranking. Specific
feature questions still use retrieval and generation.

Generated answers must cite an approved source for each recognized project they
name. Missing project citations return the verification fallback; the server does
not attach citations to unchecked claims after generation. This is a bounded
name/coverage safeguard, not semantic entailment or a factual-accuracy guarantee.
The existing rate limits, CORS, privacy policy, and provider-failure excerpt stay
in force. `npm run smoke:production` checks both a grounded KKBox answer and the
complete live inventory on the separately deployed Vercel API.
