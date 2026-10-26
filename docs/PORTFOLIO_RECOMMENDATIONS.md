# Consent-based portfolio recommendation signals

## What is implemented

The guide can use seven UTC days of aggregate project-link interactions as a **small tie-break between relevant reviewed documents**. This is not per-person personalization, vector search, model training or evidence of recommendation-quality improvement.

The client starts with collection off. In the actor chat, expand **Help improve project recommendations**, then opt in. Unchecking stops future collection, aborts pending requests where possible and removes the local ID. An already accepted aggregate cannot be individually removed. Browser GPC and DNT preferences disable collection.

## Data flow and privacy

1. A 30-day consent record with a random browser UUID is stored locally only after opt-in. Blocked storage fails closed.
2. A trusted click on an approved project case/source/product link sends only `consent`, an allowlisted `projectId` and the UUID to `POST /api/interaction`. Query strings, chat text, role and visited URL are not sent. Requests omit credentials and referrers and never delay navigation.
3. The server validates the origin, method, body size, consent flag, privacy headers and exact payload. A daily HMAC replaces the browser UUID before persistence. A separate domain-separated daily IP HMAC is used for rate limiting. Raw UUIDs/IPs are not written to Redis by this implementation; infrastructure providers can independently process request metadata.
4. A Lua operation atomically limits requests and permits one contribution per browser/project/UTC day. Deduplication/rate keys expire after two days; daily aggregate keys expire 30 days after their last increment. Limits are 30 requests per IP/day and 3,000 globally/day. They mitigate abuse but do not prove human identity or prevent all fabricated engagement.
5. Retrieval reads only the latest seven UTC dates, requiring at least 10 contributions overall and 5 for an eligible project. Contributions are browser-project-days, **not unique people across the week**. Each eligible source receives at most 0.2 additional relevance points. An extra whole query match is therefore more important than this signal.
6. Explicit KKBox, Vibecode, STOS, Chợ Kênh and Growth Commerce questions bypass the boost. Documents with no query match cannot become candidates. Sparse/missing data gives no boost; signal-store failure falls back to normal retrieval. The model receives approved evidence only, not counts or tracking identifiers.

When the recommendation-policy document is the highest-ranked source, the guide returns its exact approved English text instead of model-generated policy wording. This fixes a live check in which the model incorrectly said no data was retained. A follow-up live check matched the approved text and citation exactly. Other generated answers still require evidence review; this is not a universal hallucination guarantee.

The signal collection lives under `portfolio:signals:v1:production` (or `staging` outside production) in Redis. It **does not use the no-bloom aggregates** and is not imported into Supabase in this release. The existing restricted PostgreSQL loader remains scoped to no-bloom; no database privileges were widened. A future warehouse signal export requires a separate schema/role migration and verified snapshot semantics.

## Source map

| File | Responsibility |
| --- | --- |
| `src/app/portfolio-signals.tsx` | Consent UI, local expiry, withdrawal and click collection |
| `src/app/portfolio-signal-policy.ts` | Consent validation and approved link mapping |
| `visitor-api/api/interaction.js` | Request boundaries and daily identity hashing |
| `visitor-api/lib/portfolio-signals.js` | Atomic counters, retention and bounded signal computation |
| `visitor-api/lib/guide-retrieval.js` | Relevant-only ranking and explicit-question protection |
| `visitor-api/api/guide.js` | Optional signal retrieval with a one-second storage timeout |

## Configuration and release

Set server-side `PORTFOLIO_SIGNALS_ENABLED=true` on the existing Vercel API, alongside its existing Redis credentials and `GUIDE_RATE_SALT`. Hash inputs are domain-separated from guide rate keys. No new client secret is required. The client derives `/api/interaction` from the existing public guide endpoint.

Deploy the API before publishing the Pages frontend. To disable both recording and signal ranking, set the flag to `false` and redeploy the API. The client then receives a safe unavailable response; existing guide retrieval continues. Counts expire without a destructive cleanup. The public endpoint has no count-reading operation.

## QA and evidence

```sh
npm --prefix visitor-api test
npm run test:guide
npm run typecheck
npm run lint
node --env-file=artifacts/evidence-production.env visitor-api/scripts/test-portfolio-signals.mjs
node visitor-api/scripts/evaluate-recommendations.mjs artifacts/recommendation-regression.json
```

The final command uses uniquely named `qa:portfolio-signals:*` keys, tests concurrent deduplication, expiry and rate denial, then deletes only those test keys. It does not seed production ranking.

Regression checks cover invalid/oversized payloads, privacy preferences, expiry, foreign destinations, no-bloom rejection, sparse/corrupt data, relevance ties, explicit project questions and signal-storage failure. The authored retrieval corpus is replayed with baseline and maximal per-project boosts; this is a regression check, not an independently labelled recommendation benchmark.

The [recorded regression](evidence/recommendation-retrieval-regression.json) preserved expected sources in all 19 labelled cases across six scenarios (114 combinations). Recall@4 and MRR@4 were 1 on this small authored corpus. These synthetic checks establish no live recommendation uplift. See [release QA](evidence/RECOMMENDATIONS_QA_2026-10-26.md) for the live-policy correction and verification limits.

Browser checks verified opt-in and withdrawal. Narrow and short viewport geometry checks are emulation evidence only; real iPhone Safari keyboard behavior is not newly certified. Production must initially use ordinary retrieval until genuine consented contributions meet the thresholds. No synthetic engagement is inserted to make the feature look active.
