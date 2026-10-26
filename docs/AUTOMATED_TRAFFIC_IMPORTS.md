# Automated traffic imports

## Scope and status

The scheduled runner imports **no-bloom / production** daily aggregates from the existing Upstash source. It does not relabel those records as portfolio traffic or infer which portfolio projects visitors prefer.

On 2026-10-26 the owner activated the restricted `traffic_loader` login. The local live import passed with verified TLS using the Supabase dashboard's CA certificate, exact row reconciliation and replay verification. GitHub environment secrets were installed, the schedule gate enabled, and the first manually dispatched production runner [passed](https://github.com/DUYTRUYENTHONG/Alinguyen-portfolio/actions/runs/40283819868), including all 14 analytics tests. The first clock-triggered execution has not yet been observed. The separate manual warehouse bootstrap is documented in [hosted QA](evidence/SUPABASE_WAREHOUSE_QA.md).

## 1. Set the restricted role's password privately

In the intended Supabase project's SQL Editor, as the setup owner, run:

```sql
ALTER ROLE traffic_loader LOGIN PASSWORD 'YOUR_NEW_PRIVATE_PASSWORD';
```

Replace that placeholder yourself, using a strong password from a password manager. A random 32-character alphanumeric password avoids SQL/URI quoting issues. Do not paste a real password in a chat or commit it. Clear the editor afterward; do not save a password-containing query as a shared snippet. Do not reset the `postgres` owner's password for this task.

## 2. Save the private connection on this computer

The ignored template has been created at:

```text
C:\Users\CROSSIAN\Documents\Codex\2026-10-14\files-pasted-by-the-user-role\outputs\ai-data-ecommerce-portfolio\artifacts\warehouse-private.env
```

Replace only the password placeholder in its `ANALYTICS_DATABASE_URL` value. The Session pooler values were inspected in the project dashboard:

- User: `traffic_loader.zeuxblqgvochejktcdkk`
- Host: `aws-0-ap-northeast-2.pooler.supabase.com`
- Port: `5432`
- Database: `postgres`

URI reserved characters in passwords must be percent-encoded locally. No `NEXT_PUBLIC_` variable is used. If required for certificate verification, set `ANALYTICS_CA_FILE` to the downloaded Supabase CA file. Keep remote TLS verification enabled.

Reply **Saved** after saving; share the location, never its contents. Git ignores `artifacts/`. The scheduled runner rejects an owner/superuser connection and requires `current_user = traffic_loader` with restricted privileges.

## 3. Runtime permissions

`analytics/sql/004_traffic_loader.sql` is a one-time setup migration, run after the private warehouse migration. It intentionally fails if the role already exists rather than silently altering an unrelated role.

| Resource | Allowed |
| --- | --- |
| `traffic_analytics` schema | USAGE only |
| `batches` | SELECT, INSERT |
| `daily_counts` | SELECT, INSERT, UPDATE |
| Projects/scopes | Only `no-bloom` and `production`, enforced with RLS |
| DELETE, TRUNCATE, schema changes, role/database creation, RLS bypass | Not granted |
| Browser/API roles | Still denied |

No role membership or `BYPASSRLS` is needed. To add another legitimate source later, review its collection consent and project mapping, then use a new scoped role or explicitly reviewed RLS policies.

## 4. Verify locally and configure GitHub

Install locked dependencies and run `npm --prefix analytics test`. With source credentials and the restricted PostgreSQL URI loaded privately, run:

```powershell
node --env-file=artifacts/evidence-production.env --env-file=artifacts/warehouse-private.env analytics/scripts/automated-import.mjs
```

The existing private source environment file must contain `KV_REST_API_URL` and `KV_REST_API_TOKEN`. The atomic exporter uses a read-only Lua script, but the current Upstash token must allow EVAL plus GET, SCARD and TIME; the standard read-only token previously rejected EVAL. Source token permissions are separate from the restricted PostgreSQL role. Do not describe an owner Redis token as restricted.

Use the GitHub environment **traffic-analytics-production**, restricted to `main`. Set environment secrets through `gh secret set` stdin or GitHub's encrypted secret form:

- `ANALYTICS_DATABASE_URL`: restricted Session pooler URI.
- `ANALYTICS_CA_PEM`: CA PEM content, only if needed.
- `TRAFFIC_SOURCE_REDIS_URL`: existing Upstash endpoint.
- `TRAFFIC_SOURCE_REDIS_TOKEN`: token allowed to run the aggregate export.

The repository variable `ANALYTICS_IMPORT_ENABLED` must remain `false` until secrets and local live verification are ready. Set it to `true`, manually dispatch **Import traffic analytics**, and verify that first run before claiming automation is active. Disabling this variable pauses future jobs without deleting data or secrets.

## 5. Schedule, QA and recovery

`.github/workflows/traffic-analytics.yml` runs daily at **00:17 UTC / 07:17 Bangkok**, subject to GitHub scheduling delays. It also supports manual dispatch on `main`; it is not triggered by pull requests. It has read-only repository permissions, environment-scoped secrets and serialized execution.

Each run exports seven previous UTC days plus the current partial day, allowing a seven-day recovery window. It validates the source timestamp, imports transactionally, compares stored rows to the source snapshot, and verifies exact replay. Missing days stay null; daily unique browsers are never summed into weekly unique people. Credentials, actual traffic counts and private exports are not printed or uploaded as Actions artifacts. Temporary exports are removed after the job.

Failures produce a nonzero job result with a sanitized phase. Review the Actions run and configure your own GitHub Actions failure notifications. No external alert destination has been installed. GitHub can disable scheduled workflows in inactive public repositories; check the latest successful run periodically. Outages longer than seven days need an explicit backfill within source retention. Backups and restore testing remain separate work.

## Portfolio recommendations and RAG

The current actor retrieves approved factual documents using keyword relevance and selected role/section context. Traffic statistics are not factual evidence of project quality, business impact, or a person's interests. No-bloom traffic must not bias portfolio project recommendations without a meaningful source mapping.

The owner approved consent-based portfolio interaction signals on 2026-10-26. Implementation must still include visitor opt-in, allowlisted project/evidence IDs, aggregate-only export, freshness/volume checks and retrieval regression evaluation. The language model should receive approved evidence, not raw visitor data or private traffic totals. A ranking signal can reorder relevant evidence; it must never introduce unsupported claims or override an explicit project question. The opt-in Redis collector and bounded retrieval ranking are now implemented; see [Portfolio recommendations](PORTFOLIO_RECOMMENDATIONS.md). Exporting those separate signals into this PostgreSQL warehouse is not implemented.

References: [Supabase roles](https://supabase.com/docs/guides/database/postgres/roles), [connection options](https://supabase.com/docs/guides/database/connecting-to-postgres), [GitHub schedule behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
