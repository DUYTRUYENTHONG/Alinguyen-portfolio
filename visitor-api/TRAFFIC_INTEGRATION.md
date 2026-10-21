# Shared website traffic

## Architecture and review status

NỞ (`no-bloom`) remains a Next.js static export on GitHub Pages, base path `/no-bloom/`. It calls the existing `ali-portfolio-visitor-api` project at `https://ali-portfolio-visitor-api.vercel.app/api/traffic`. That API reuses the existing `ali-portfolio-visitors` Redis connection through `KV_REST_API_URL` and `KV_REST_API_TOKEN`. No new account, database or API project is needed.

This integration passed local review and the owner authorized commit/deployment on2026-10-21. The new server variable `TRAFFIC_NO_BLOOM_HASH_SALT` is configured independently of existing secrets. Release this API before enabling the NỞ frontend variables. `/api/visit`, `/api/guide`, portfolio secrets, `portfolio:*` keys and portfolio frontend configuration are preserved.

## Registration and secrets

Edit `lib/traffic-projects.js` to register a reviewed lowercase ID. Each entry owns exact origins, a finite path allowlist, a distinct `secretEnv`, request limits and browser capacity. The registry, not the request, determines the namespace. Register another site by adding an entry and a new independently generated server secret, then repeat isolation/origin tests. Never reuse `VISITOR_HASH_SALT`, `GUIDE_RATE_SALT` or another project's secret.

NỞ production origin: `https://duytruyenthong.github.io`. Its sole local origin is `http://localhost:3100`, and is permitted only when `TRAFFIC_ALLOW_LOCAL=true` **and** `VERCEL_ENV` is not production. Production, staging and development use different keys. Preview deployments use staging keys even when called from a production website origin. There are no arbitrary localhost ports, wildcard origins or caller-selected namespaces.

Project IDs are public. CORS restricts browsers and does not authenticate scripts. Sites on GitHub Pages share a host origin; paths do not create separate browser security origins. A caller can fabricate allowed origins/IDs outside a browser. This feature estimates recorded traffic; it does not prove identity or defeat bots.

## Browser integration

NỞ public build variables:

```dotenv
NEXT_PUBLIC_COUNTER_ENABLED=true
NEXT_PUBLIC_COUNTER_ENDPOINT=https://ali-portfolio-visitor-api.vercel.app/api/traffic
NEXT_PUBLIC_COUNTER_PROJECT_ID=no-bloom
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

POST JSON is exactly `{projectId,visitorId,eventId,path}`. The acknowledgement is only `{recorded:true}`. A successful POST is followed by `GET /api/traffic?projectId=no-bloom`, exposing only `{pageViews,uniqueBrowsers}` for the approved project/origin. No public report endpoint or dashboard exists. OPTIONS checks approved origins; the actual request always validates its project/origin pair.

Use native fetch with omitted credentials and bounded retries. NỞ preserves its optional consent control, GPC override, visible-page gating, single tracker across React remounts and BFCache restoration, and no hash-only counts. New page instances/reloads and deliberate eligible pathname navigation get new event IDs. Retries reuse the event ID for at most30 seconds/3 attempts. No offline queue or pre-consent backfill exists.

After consent, cryptographic UUIDs use `no-bloom-visitor-id`, independently of personalization, consent and every other project. Browser storage has a30-day expiry and a temporary in-memory fallback. Withdrawal cancels requests/retries and clears only this identity. Previously recorded server data is not automatically deleted. Paths are only `/` and `/credits`; names, greetings, query strings, share tokens, full URLs, IPs and user agents never enter the traffic payload or tables.

## Atomic storage, limits and retention

One Lua EVAL checks state, consumes per-project/shared budgets, deduplicates the event, registers the browser and updates aggregates. Server HMAC-SHA256 includes the project ID and its unique server secret. Trusted Vercel country metadata supplies a two-letter country; missing/untrusted metadata is `unknown`. Country totals are **page views**, not browsers. Dates come from the server in UTC; reports use explicit half-open UTC intervals.

Every project key begins `traffic:<project-id>:<scope>:v1:`:

| Suffix | Data | Retention |
|---|---|---|
| `views`, `started-utc` | Total recorded views and first-event timestamp | Persistent |
| `browsers` | Set of HMAC browser IDs | Persistent, matching lifetime estimated-browser metric |
| `day:YYYY-MM-DD:views`, `day:YYYY-MM-DD:browsers` | Daily views and browser membership |400 days for both |
| `event:<UUID>` | Idempotency marker |24 hours |
| `paths`, `countries` | Allowlisted path views; country page views | Persistent |
| `rate:minute:<bucket>`, `rate:day:<date>` | Request budgets |120 seconds /2 days |

The shared budgets use `traffic:shared:<scope>:v1:rate:*`. They cover all projects on **the new `/api/traffic` endpoint**, including reads/retries; old `/api/visit` and `/api/guide` retain their existing behavior/limits. Initial NỞ limits are60 requests/minute and500/day; shared limits are120/minute and1000/day. A normal view plus aggregate read consumes two requests. Lifetime browser capacity is100000/project. Additional browsers at capacity are refused; existing members may continue. Path cardinality is finite. TTL handles cleanup without a scheduler. Event replay after24 hours can count again; normal retries finish well inside that window.

These controls reserve capacity rather than guarantee a provider bill cap. Existing portfolio requests, other database clients, Redis commands inside Lua, hosting invocations and plan quotas remain shared. Review real account usage before raising budgets or adding sites. An outage or exhausted shared budget affects all new traffic projects; gifts and portfolio functionality have independent fallbacks. There is no plan upgrade, automatic database reset or migration of `portfolio:*`.

## Private reports and deletion

The local operator needs the existing Redis credentials **and** an explicit `TRAFFIC_REPORT_PROJECTS=no-bloom` allowlist. An unknown/unapproved project fails before database access. Redis credentials themselves can grant database-wide authority; this local tool does not turn them into restricted credentials. Use provider ACLs/independent credentials before delegating access to someone who must not access other projects.

```powershell
node --env-file=.env.local scripts/report-traffic.mjs no-bloom 2026-10-01 2026-10-22
```

Reports return total views, lifetime estimated browsers, daily trends, top paths, country page views and **distinct** interval browsers. Daily uniques are not summed. Each request covers at most31 days within the400-day daily window. Empty data is labelled empty; pre-collection dates are unavailable. Redis/configuration failure exits with unavailable, not a zero report. No individual HMAC membership leaves Redis in report output. Store exports privately outside public repositories.

To remove a known browser's membership, supply its UUID via stdin, with the project's secret available locally:

```powershell
Get-Content -LiteralPath PRIVATE_UUID_FILE | node --env-file=.env.local scripts/forget-traffic-browser.mjs no-bloom --confirm
```

This removes only that project's lifetime and retained daily memberships. Aggregate page views remain because no browser-to-view history is stored. Provider logs/backups have separate retention. Cleared storage, ID expiry, multiple devices/shared browsers, refusal, blockers, failures and fabricated/bot requests affect accuracy. HMAC IDs are pseudonymous, not guaranteed anonymous; browsers are not verified people and country is approximate.

## Verification and release

`npm test` runs mock tests only, including legacy guide/visit regressions. The explicit isolated Redis command is:

```powershell
node --env-file=.env.traffic-test.local scripts/test-traffic-redis.mjs
```

It uses only random `traffic:*:test-<UUID>:v1:*` prefixes and checks every EVAL key. It tests concurrent retries/unique events, returning browsers, project isolation, UTC midnight, interval distinct counts, country/path totals, retention, shared/project budgets and corrupt-state handling. Cleanup scans/deletes only its own verified random prefixes, never production keys or FLUSHDB. Do not run automated production visits.

Before release, review both repository diffs. Generate the NỞ secret once into an ignored file, configure **only** `TRAFFIC_NO_BLOOM_HASH_SALT` on the existing API's Production environment, and preserve it across deployments. Do not print secrets or rotate the portfolio secrets. Run the API tests, `vercel pull --environment production`, then `vercel build --prod`; the latter builds locally without publishing. After release authorization, deploy this existing API directory, verify its new route using isolated staging data and production-safe GET, then set the three public NỞ variables and rebuild/publish Pages. Verify the gift with consent refused and one separately authorized consenting production event. Another frontend deployment must leave the same Redis history intact.

After review/release authorization, from this API directory, generate once without displaying the secret (exclusive file creation prevents silent rotation):

```powershell
node -e "require('node:fs').writeFileSync('.env.traffic-secret.local','TRAFFIC_NO_BLOOM_HASH_SALT='+require('node:crypto').randomBytes(32).toString('hex')+'\n',{flag:'wx'})"
node --env-file=.env.traffic-secret.local -e "process.stdout.write(process.env.TRAFFIC_NO_BLOOM_HASH_SALT)" | vercel env add TRAFFIC_NO_BLOOM_HASH_SALT production --yes
vercel deploy --prod
```

Do not overwrite an existing secret or reuse the generated value for another project. For local private reporting, set `TRAFFIC_REPORT_PROJECTS=no-bloom` in the ignored local environment, alongside the existing Redis credentials. Optional report scope is `--scope=staging` or `--scope=development` after both date arguments.

Rollback: disable the public NỞ flag and rebuild Pages first. Restore the prior shared API deployment if needed, preserving all existing server variables and Redis keys. No destructive migration or key deletion is part of deployment. The earlier `no-bloom-counter` service is superseded and remains unused; no additional deployment should target it.

## Observed verification (2026-10-21)

- Shared API: `npm test`16/16, including the original guide tests and a new unchanged-visit contract regression. New API/report scripts pass the existing Biome linter. `vercel build --prod` succeeds locally and contains all three routes; only `/api/traffic` has the new10-second limit.
- Portfolio frontend: existing typecheck, lint and production build all pass. No portfolio frontend source changed.
- NỞ: typecheck,3 name tests,30 TypeScript tests and the3 historical embedded SQL suites pass. The project-ID configuration/storage guard also passes its targeted rerun. Both the enabled test export and restored normal Pages export build successfully.
- Actual Redis: concurrent duplicates/unique requests, returning identities, cross-project isolation, UTC midnight, interval distinct counts, retention, global/project limits and corruption checks pass using random test namespaces, then cleanup verifies/deletes only those prefixes.
- Actual browser vertical slice: the exported NỞ frontend passes consent/GPC, lost-response retry, reload/navigation/hash, separate browsers, storage failure, withdrawal,320px axe/layout and gift-failure isolation using the **actual shared API handler and Redis**, through a local HTTP fixture with random test namespaces. The fixture overrides only its loopback origin and sandbox namespace; production registry configuration is unchanged. Production statistics were not inflated.

The cross-repository browser mode uses `TRAFFIC_SHARED_API_TEST_PATH` pointing to this `visitor-api` directory, the ignored connection env file, and NỞ's `scripts/test-exported-counter.mjs`. Build NỞ first with the three public project variables, `NEXT_PUBLIC_COUNTER_TEST_MODE=true` and loopback endpoint `http://127.0.0.1:3205/api/traffic`. Restore the normal Pages export after this test. Do not set test mode in a production build.

The review stage used no cloud deployment or production configuration change. The owner subsequently authorized release; deployment must be verified against the published API and Pages artifact. Production-safe aggregate reads can confirm readiness without adding test visits. References: [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js), [function duration](https://vercel.com/docs/functions/configuring-functions/duration).

## Compact counter and city aggregates (2026-10-21)

NỞ shows only the page-view number in the header, with a localized accessible label. Loading uses an ellipsis and failure a dash; no fake zero. Browser estimates remain available privately. Consent copy discloses approximate city/country.

The ingestion route reads Vercel's x-vercel-ip-city header only on the hosting platform with a valid country. It safely percent-decodes bounded Unicode city names; malformed, absent or untrusted values become unknown. No IP, GPS, coordinates, per-event location record or browser-to-city mapping is stored. Cities are aggregate page views grouped by country and city, not verified people or residence. VPNs, mobile networks and IP databases can produce inaccurate cities.

Private report-traffic.mjs output now includes cityPageViews and cityTrackingStartedAt. These are lifetime aggregates from that timestamp, independent of the requested daily interval. Earlier views remain in existing totals and cannot be backfilled. Missing city history returns an empty array/null start, never invented city totals. The persistent cities hash is capped at 1000 named categories plus unknown/other buckets; new categories after capacity go to other without dropping page views. Event deduplication covers city increments atomically. Public GET still exposes only pageViews/uniqueBrowsers.

Use the existing authorized report command with TRAFFIC_REPORT_PROJECTS=no-bloom and private Redis credentials; keep output private. References: [Vercel geolocation headers](https://vercel.com/docs/headers/request-headers).
