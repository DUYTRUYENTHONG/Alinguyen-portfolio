# Supabase warehouse verification — 2026-10-26

## Verified hosted scope

- Target: the user's Alinguyen-portfolio Supabase project; PostgreSQL 17.11.
- Execution: authenticated Supabase Dashboard SQL Editor. MCP OAuth succeeded, but the tools were unavailable in the active Codex session. No MCP SQL execution is claimed.
- Created private `traffic_analytics` schema, `batches` and `daily_counts` tables, and `daily_mart` and `weekly_mart` views.
- Applied `001_warehouse.sql` and `002_supabase_private.sql` together in a transaction. No existing analytics schema was present at preflight.
- Imported the previously validated shared-traffic aggregate snapshot: one batch, seven date records, one available date. Six unavailable dates remain null. This is not the portfolio's legacy visitor counter, and no historical traffic was invented.
- Replayed identical SQL: one batch and seven records remained, with unchanged row fingerprint and original import timestamp. No double counting or timestamp rewriting was observed.
- Actual traffic counts and generated import SQL remain private and are excluded from Git.

## Hosted QA

`analytics/sql/003_verify_supabase.sql`: **9/9 passed**.

| Check | Result |
| --- | --- |
| API-role schema and table privileges | `anon`, `authenticated`, `service_role`: denied |
| Two base tables with RLS | Pass |
| Two views with `security_invoker=true` | Pass |
| No RLS allow policies | Pass: intentional owner-only stage |
| Stored rows match imported batch payloads | Pass |
| Missing days remain null | Pass |
| Daily view preserves coverage and partial-day flags | Pass |
| Weekly view excludes open days | Pass |
| Weekly unique browsers are not fabricated | Pass |

Dashboard Data API inspection confirmed `traffic_analytics` is **not** exposed; only `public` and `graphql_public` are selected. Zero of four warehouse relations are exposed. Existing global Data API settings were not changed.

Refreshed Security Advisor: **0 errors, 0 warnings**, two informational “RLS Enabled No Policy” findings for the two private tables. Those findings reflect the intentional deny-by-default design; they are not resolved by broadening access.

Local verification: the original ten PostgreSQL tests passed, plus two new tests covering the SQL Editor fallback against the regular loader (replay, newer/stale snapshots, conflict rollback) and Supabase-role hardening with all nine QA assertions. Local tests use PGlite; hosted checks above ran on Supabase PostgreSQL.

## Automation follow-up — 2026-10-26

The restricted `traffic_loader` login now authenticates through the Session pooler with full certificate verification using the CA downloaded from Supabase Database Settings. The initial `SELF_SIGNED_CERT_IN_CHAIN` failure was resolved by configuring that CA, not by disabling verification.

The local live importer passed runtime privilege assertions, exact batch/row reconciliation and replay verification over eight UTC day records. The first GitHub production import [passed](https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/actions/runs/40283819868), including all 14 analytics tests. Environment secrets are stored in `traffic-analytics-production`, limited to the `main` branch. Daily scheduling is enabled at 00:17 UTC / 07:17 Bangkok. No private counts or credentials were committed.

The owner-level nine-check SQL includes reporting views that are intentionally not granted to the loader; running it as the loader returns `42501`. The successful runtime checks and reconciliation use only the loader's approved tables. The earlier nine-check results above describe the bootstrap stage; its no-policy state predates the scoped loader policies.

## Remaining operational work

- Observe the first clock-triggered execution; only the manually dispatched production run has been observed so far.
- External stale-import alerting, backup restore and load testing remain pending.
- The source snapshot's original observation time is retained. Importing it today does not make its traffic fresh.
- No CV or frontend claims were upgraded to “automated production pipeline.”

Local screenshots (ignored): `artifacts/supabase-warehouse-2026-10-26/hosted-qa.png` and `private-schema.png`.
