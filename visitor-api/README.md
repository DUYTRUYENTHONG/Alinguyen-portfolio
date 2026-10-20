# Portfolio visitor counter

This small Vercel function records one anonymous visitor per browser for the GitHub Pages portfolio. It stores an HMAC of the browser's random UUID, a selected role, and the country code supplied by Vercel. It does not store the raw UUID or IP address. A role change updates the role counts without adding a visitor.

The API is deployed separately because GitHub Pages serves static files and cannot write visitor data. The backing Upstash Redis resource is connected to the Vercel project and provides `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Set `VISITOR_HASH_SALT` in the Vercel project's production environment. The GitHub Pages build sets `NEXT_PUBLIC_VISITOR_API_URL` to the deployed `/api/visit` URL.

To run locally, use `vercel dev` after `vercel env pull`. The function accepts POST JSON `{ "visitorId": "<UUID>", "role": "Recruiter" }`. `role` may be `null`. Its response contains `total`, `ordinal`, `roleCount`, and `countries`.

## Portfolio AI guide candidate

`POST /api/guide` is a separate, on-demand assistant endpoint for the portfolio characters. Each selected perspective has a distinct name and brief introduction; the server derives the same name from its role allowlist. The endpoint retrieves from a small, curated public knowledge set in `lib/guide-knowledge.js`, then sends the question and selected evidence to Groq's Chat Completions API using `openai/gpt-oss-20b`. It is a local release candidate until an owner-approved preview and provider configuration are complete. The GitHub Pages site only contains the client and the public endpoint URL; it must never contain an API key.

Set these server-side Vercel environment variables: `GROQ_API_KEY` and `GUIDE_RATE_SALT` (a distinct secret for daily rate-limit hashes), plus the existing `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Do not reuse `VISITOR_HASH_SALT`. Set `NEXT_PUBLIC_GUIDE_API_URL` in the static site build to the deployed `/api/guide` URL. The endpoint returns 503 while configuration is incomplete; the panel shows links to the static portfolio pages.

The handler accepts a question, allowlisted role and section, up to four recent turns, and optional allowlisted interests. It does not store chat text, visitor identifiers, or preferences in Redis. It validates returned citation IDs against the retrieved public sources and renders no model-generated URL. Redis limits each client to 20 requests and all clients to 300 requests per UTC day; the Groq Free Plan stops at its own published limits instead of charging for overages. Rate-limit hashes are based on the daily date and request IP and expire after two days. Groq says inference content is not retained by default, with reliability and abuse exceptions. The existing visitor counter remains independent.

Run `npm test` in this directory for the retrieval, grounding, privacy, and request-boundary checks. Review and update public facts in `lib/guide-knowledge.js` whenever the portfolio or linked evidence changes. The full user flow, consent policy, prompt, and release checks are in [the design draft](../docs/GUIDE_ASSISTANT_DESIGN.md).

Provider references: [Groq Free Plan limits](https://console.groq.com/docs/rate-limits), [structured JSON](https://console.groq.com/docs/structured-outputs), and [data controls](https://console.groq.com/docs/your-data). Check the limits in your own Groq console before release.
