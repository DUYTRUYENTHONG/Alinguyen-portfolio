# Traffic to PostgreSQL analytics

Upstash remains the operational store. This batch pipeline exports daily aggregates, validates them, and loads PostgreSQL tables and reporting views. No browser identifiers, IPs, location records, paths or chat conversations enter the warehouse.

## Verified scope

On 2026-10-26, a seven-day production aggregate snapshot from the configured shared traffic project was loaded into **persistent local PGlite (PostgreSQL 18.6)**. One day was available; six remained unavailable. Closing and reopening the database preserved all seven records; replay applied zero changes. Actual traffic counts remain private. The legacy portfolio visitor counter is a separate collection and is not silently converted to page views.

PGlite is embedded PostgreSQL compiled to WebAssembly. These checks establish local SQL behavior and persistence. They do not verify a hosted PostgreSQL service, network authentication, TLS, concurrent server connections, backup recovery or scheduling. The `pg` adapter is prepared for that next deployment.

## Reproduce locally

From the repository root, with Node 22 or later:

```sh
npm --prefix analytics ci
npm --prefix analytics test
npm --prefix analytics run demo
```

The demo writes `docs/evidence/traffic-analytics-demo.json` using only `fixture.js`. Ten tests cover replay, corrections, stale arrivals, rollback, missing/partial data, isolation, backfills, bounded serialization retries and persistence. SQL lives in `sql/001_warehouse.sql`; migration is transactional and repeatable.

## Export an authorized project

Configure `TRAFFIC_REPORT_PROJECTS` with the existing registered project IDs, `KV_REST_API_URL` and `KV_REST_API_TOKEN` in a private environment file. Never use `NEXT_PUBLIC_` for credentials. The exporter executes one atomic read-only Lua script; Upstash's read-only token can reject EVAL, so the existing server token is required. It does not alter Redis keys.

```sh
node --env-file=artifacts/analytics-private.env visitor-api/scripts/export-analytics.mjs PROJECT_ID 2026-10-19 2026-10-26 artifacts/private-snapshot.json production
node analytics/scripts/local-sync.mjs artifacts/private-snapshot.json artifacts/private-postgres-warehouse
```

Dates are UTC, start inclusive and end exclusive, at most 31 days. The exporter uses Redis server time. Run the second command again to verify replay. `artifacts/` is ignored by Git. Restrict its Windows filesystem permissions to the operator; POSIX file modes alone do not establish Windows ACLs. Do not publish snapshots or the persistent database.

## Data meaning

- Primary key: project, environment and UTC day. Every requested date is present.
- Missing Redis view keys mean unavailable, not zero. No historical traffic is invented.
- Counts represent recorded, consenting traffic. Browsers are not people; blocked or declined tracking is absent.
- Exact replay is identified by a canonical SHA-256 batch ID. Newer snapshots replace counts; stale snapshots cannot regress them. Conflicting values with the same observation time fail the whole transaction.
- Daily unique browsers cannot be added into weekly unique people. Weekly views exclude partial UTC days and expose coverage. Missing dates outside the requested interval are not inferred; interpret totals only with the requested coverage.
- A partial day becomes closed only after a newer snapshot observes it on a later UTC date. Re-export yesterday plus today on each scheduled run.

## Move to an online PostgreSQL server after local acceptance

1. Select the provider/project and configure its connection through a secret manager or an ignored environment file as `ANALYTICS_DATABASE_URL`. Do not paste credentials into chat. Set `ANALYTICS_CA_FILE` only if the provider requires its own trusted CA. Remote connections require certificate verification; do not disable it.
2. Use a dedicated database and migration owner. Back up any existing target before migration. The migration creates only the `traffic_analytics` schema, two tables and two views; it does not modify application tables.
3. Run the commands below first against a disposable staging database. Inspect expected daily records, replay, correction, rollback and TLS failure behavior using that provider. These hosted checks have not yet been run.
4. Give the scheduled loader `USAGE` on the schema and `SELECT, INSERT, UPDATE` on its tables; give report readers `SELECT` on the views only. Keep migration credentials separate. Revoke `CREATE` from the runtime role.
5. Import an authorized aggregate snapshot into production, then repeat it and confirm `replay: true`. Reconcile counts and coverage privately with Redis. Retain the original snapshot for audit/replay.
6. Schedule one job after UTC midnight to export yesterday and today, load, and produce a private report. Alert on nonzero exit, stale `observed_at`, missing coverage and failed reconciliation. Do not claim automation until this job has run successfully.
7. Test provider backup/restore before relying on the warehouse. For rollback, stop the job and return report reads to the prior snapshot; keep Upstash unchanged. Do not drop production data as a rollback shortcut.

```sh
node --env-file=artifacts/warehouse-private.env analytics/scripts/sync.mjs artifacts/private-snapshot.json --migrate
node --env-file=artifacts/warehouse-private.env analytics/scripts/sync.mjs artifacts/private-snapshot.json
node --env-file=artifacts/warehouse-private.env analytics/scripts/report.mjs PROJECT_ID production
```

The report prints aggregates to stdout: redirect only to a private destination. No online database, scheduler or hosted warehouse is configured by this release.

### Supabase option

Supabase provides a hosted PostgreSQL database compatible with this adapter. In the project dashboard, use **Connect → Session pooler** when the runner needs IPv4; a direct connection is also suitable when reachable. Save the database URI as `ANALYTICS_DATABASE_URL` in the private environment file used above. This is a database connection, not the Supabase publishable/anon API key.

Use a dedicated project or private `traffic_analytics` schema. Do not add that schema to the Data API's exposed schemas or grant `anon`/`authenticated` access. Download the database CA certificate if required and point `ANALYTICS_CA_FILE` to it; certificate verification remains enabled. Start with the staging migration and replay checks above. Supabase deployment remains pending connection configuration.

References: [Supabase connections](https://supabase.com/docs/guides/database/connecting-to-postgres), [SSL enforcement](https://supabase.com/docs/guides/platform/ssl-enforcement).

New to Supabase? Follow the [step-by-step project setup guide](../docs/SUPABASE_SETUP.md).
