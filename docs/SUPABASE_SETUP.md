# Set up Supabase for portfolio traffic analytics

This guide creates a **new Supabase project for the analytics warehouse**. Your existing Vercel API and Upstash Redis keep collecting traffic. The local loader copies daily aggregates into Supabase PostgreSQL. It does not move the visitor counter, store chat messages, or replace Redis.

Status (2026-10-26): the hosted schema and one manual aggregate import were verified through Supabase SQL Editor. All nine hosted QA checks passed, including access restrictions and data reconciliation; exact replay left the data unchanged. The automated direct-connection loader, scheduled import and backup recovery remain **unverified**. See [hosted verification](evidence/SUPABASE_WAREHOUSE_QA.md).

## 1. Create the project

1. Sign in at [Supabase Dashboard](https://supabase.com/dashboard).
2. Choose **New project**, then your organization.
3. Suggested project name: **ali-portfolio-analytics**.
4. Generate a strong database password and save it in your password manager. This is different from your Supabase account password.
5. Choose a region appropriate for the future job runner. Check the plan, quotas and any charges displayed before confirming creation.
6. Wait until the database is ready. Keep the project name and project reference for your records; these are safe to share when requesting setup help.

Supabase supplies the PostgreSQL database. You do not need to create an additional database per portfolio project. The loader uses the private `traffic_analytics` schema; `project_id` and `scope` keep each project's records separate. Database access is currently operator-only, not a multi-tenant customer-facing API.

## 2. Keep this warehouse private

This pipeline uses a server-side PostgreSQL connection, so it does not need the browser Data API. In this **new warehouse-only project**, disable the Data API if you do not need it. If you leave it enabled, do not include `traffic_analytics` in its exposed schemas and do not grant `anon` or `authenticated` access. Do not change settings in an existing application project by mistake. [Supabase API security](https://supabase.com/docs/guides/api/securing-your-api)

You do not need a publishable/anon key or service-role API key for this loader. Never put the database URI into a `NEXT_PUBLIC_` variable, a GitHub file, or a browser form in the portfolio.

## 3. Obtain the PostgreSQL connection

1. Open the project's **Connect** panel.
2. Choose **Session pooler** and the URI format. This supports IPv4 connections, including local machines that cannot reach the direct IPv6 endpoint.
3. Copy the exact host, username, port and database shown. Do not guess the region hostname or omit the project reference from the username.
4. Replace the password placeholder privately with your saved database password. If it contains URI-reserved characters, percent-encode the password portion only. Do not paste it into an online encoding website.

A direct connection is also appropriate when your runner can reach it. Use session mode for this guide; keep the dashboard's connection parameters. [Supabase connection options](https://supabase.com/docs/guides/database/connecting-to-postgres)

## 4. Save it in the existing local repository

Repository folder on this computer:

```text
C:\Users\CROSSIAN\Documents\Codex\2026-10-14\files-pasted-by-the-user-role\outputs\ai-data-ecommerce-portfolio
```

In your editor, create **`artifacts/warehouse-private.env`** under that folder. Enter the real value locally:

```dotenv
ANALYTICS_DATABASE_URL="PASTE_YOUR_SUPABASE_POSTGRESQL_URI_HERE"
```

If certificate verification requires the project CA, download it from Supabase's database SSL settings, save it as `artifacts/supabase-ca.crt`, and add:

```dotenv
ANALYTICS_CA_FILE="artifacts/supabase-ca.crt"
```

The loader requires verified TLS for remote connections. Do not solve a certificate error by disabling verification. The project can also enforce SSL for all database clients in its database settings. [Supabase SSL instructions](https://supabase.com/docs/guides/platform/ssl-enforcement)

`artifacts/` and `.env*` are ignored by Git. Confirm that before continuing:

```powershell
git check-ignore artifacts/warehouse-private.env
```

Expected output is the file path. Restrict file access to your Windows account. **You can stop here and ask me to finish the hosted verification. Share only the project name and this file path, not its contents.**

## 5. Run the existing local checks

Open PowerShell in the repository folder. Node 22 or later is required.

```powershell
npm --prefix analytics ci
npm --prefix analytics test
```

Expected: fourteen tests pass. These are local PostgreSQL checks, not confirmation that Supabase is reachable.

## 6. Create the schema and import a snapshot

An existing private aggregate snapshot was produced during this task:

```text
artifacts/private-traffic-snapshot.json
```

It contains the configured shared traffic project's daily aggregates. It is **not** a reconstruction of the portfolio's legacy visitor counter and does not contain visitor IDs. Do not rename its project ID to make the traffic appear to belong to a different project. A newly registered project needs its own genuine snapshot; no historical counts are fabricated.

Use this file only on your intended new warehouse project:

```powershell
node --env-file=artifacts/warehouse-private.env analytics/scripts/sync.mjs artifacts/private-traffic-snapshot.json --migrate
```

The command creates the `traffic_analytics` schema, `batches` and `daily_counts` tables, and `daily_mart` and `weekly_mart` views. Before importing to a new Supabase target, apply `analytics/sql/001_warehouse.sql` followed by `analytics/sql/002_supabase_private.sql` together in a transaction as the setup owner. The second file revokes API-role access, enables RLS with no allow policies, and makes both views security-invoker views. The Node `--migrate` flag applies only the portable first file; it does not apply Supabase-specific hardening. On a new target, expect `replay: false` and seven applied day records for this snapshot. Missing days remain unavailable. If the command fails, stop and resolve the connection or migration error; do not assume tables were created successfully.

### SQL Editor fallback

When a direct PostgreSQL connection is unavailable, `analytics/manual-import.js` exports `manualImportSql(snapshot)`. It uses the same strict snapshot validator and canonical batch hash as the Node loader, and emits a transactional, replay-safe SQL block for the authenticated owner to run in Supabase SQL Editor. Save generated SQL only under ignored `artifacts/`: it contains the private source aggregates. It is not a public RPC or an automated ingestion endpoint. A serialization failure requires retrying the complete block; the direct Node loader handles bounded retries automatically.

After importing, run `analytics/sql/003_verify_supabase.sql`. All nine rows must report `passed = true`. Re-run the same import and compare batch count, row count, row fingerprint and original import timestamp. Supabase Security Advisor may show two informational "RLS Enabled No Policy" items: these are expected while the warehouse is owner-only. Do not add browser policies to silence them.

## 7. Verify replay and inspect the hosted records

Run the same snapshot again without migration:

```powershell
node --env-file=artifacts/warehouse-private.env analytics/scripts/sync.mjs artifacts/private-traffic-snapshot.json
```

Expected: **`replay: true` and `appliedDays: 0`**. In Supabase's SQL Editor, run these read-only queries:

```sql
select project_id, scope, count(*) as days,
       count(*) filter (where available) as available_days,
       max(observed_at) as latest_snapshot
from traffic_analytics.daily_counts
group by project_id, scope;

select project_id, scope, day, available, page_views,
       unique_browsers, closed_day
from traffic_analytics.daily_mart
order by project_id, scope, day;

select * from traffic_analytics.weekly_mart
order by project_id, scope, week_start;
```

Compare privately with the source snapshot. Weekly views exclude partial days. Missing days are not zeros, daily unique browsers are not additive, and incomplete coverage is not a full-week traffic total. Keep actual counts out of public screenshots and Git commits.

Check browser-role access as well:

```sql
select role_name,
       has_schema_privilege(role_name, 'traffic_analytics', 'USAGE') as schema_access,
       has_table_privilege(role_name, 'traffic_analytics.daily_counts', 'SELECT') as read_counts
from (values ('anon'), ('authenticated')) as roles(role_name);
```

Both privileges should be false for both roles. If they are true, stop before loading more data and review grants and exposed schemas.

## 8. Prepare regular imports after the first hosted check

The restricted role and scheduled runner are active. Follow [Automated traffic imports](AUTOMATED_TRAFFIC_IMPORTS.md) for private credential locations, verification evidence and GitHub activation gates. A deployed workflow alone does not prove a successful import; check its execution result.

The initial database owner is for setup only. The restricted `traffic_loader` role and project-scoped RLS policies have been applied. Login activation, encrypted runner credentials and the first live restricted import were verified on 2026-10-26. The loader has no DELETE, schema creation or BYPASSRLS privileges. A future reporting role requires its own reviewed grants and policies.

The enabled workflow exports seven previous UTC days plus the current partial day at 00:17 UTC daily. Its first manually dispatched production run passed; the first clock-triggered run remains to be observed. Configure failure notifications; backup and restore testing remain separate requirements.

The exporter and exact environment variables are documented in [the pipeline runbook](../analytics/README.md). Each additional site must first be registered in the shared traffic API with its legitimate origin and project ID. One warehouse can hold their isolated aggregate records.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Host unreachable | Use the session pooler URI; confirm project readiness and network access. |
| Password authentication failed | Database password, full pooler username and password URI encoding. |
| Certificate error | Correct project CA and hostname; retain TLS verification. |
| Permission denied | Intended migration owner versus restricted runtime role; do not broaden browser-role access. |
| No traffic available | Project registration, source snapshot dates and consented traffic; do not insert invented views. |
| Exact replay applies zero rows | Expected behavior; it prevents double counting. |
| Hosted checks pass but portfolio says local | Publish a new dated hosted verification record, then update the CV and evidence page. Do not change the claim before checking. |

For help, send the project name/reference, environment-file path and a redacted error code. Never send passwords, database URIs or API tokens.
