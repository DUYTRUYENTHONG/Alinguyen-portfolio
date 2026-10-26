-- Read-only QA. No private traffic counts are returned.
WITH roles AS (
  SELECT oid, rolname FROM pg_roles WHERE rolname IN ('anon','authenticated','service_role')
), objects AS (
  SELECT oid, relkind, relrowsecurity, reloptions FROM pg_class
  WHERE relnamespace='traffic_analytics'::regnamespace AND relkind IN ('r','v')
), expected AS (
  SELECT b.project_id,b.scope,b.observed_at,b.batch_id,d.*
  FROM traffic_analytics.batches b,
  LATERAL jsonb_to_recordset(b.payload->'days') AS d(date date,available boolean,"pageViews" bigint,"uniqueBrowsers" bigint)
), latest AS (
  SELECT DISTINCT ON (project_id,scope,date) * FROM expected
  ORDER BY project_id,scope,date,observed_at DESC,batch_id
)
SELECT 'api_roles_denied' AS check_name,
  (SELECT count(*)=3 AND bool_and(NOT has_schema_privilege(oid,'traffic_analytics','USAGE')) FROM roles)
  AND (SELECT NOT bool_or(has_table_privilege(r.oid,o.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')) FROM roles r CROSS JOIN objects o) AS passed
UNION ALL SELECT 'two_tables_with_rls', (SELECT count(*)=2 AND bool_and(relrowsecurity) FROM objects WHERE relkind='r')
UNION ALL SELECT 'two_invoker_views', (SELECT count(*)=2 AND bool_and(reloptions @> ARRAY['security_invoker=true']) FROM objects WHERE relkind='v')
UNION ALL SELECT 'no_unapproved_rls_roles', NOT EXISTS (
  SELECT 1 FROM pg_policies WHERE schemaname='traffic_analytics'
  AND NOT (roles <@ ARRAY['traffic_loader']::name[]))
UNION ALL SELECT 'imported_data_matches_batch_payloads',
  EXISTS (SELECT 1 FROM latest) AND NOT EXISTS (
    SELECT 1 FROM latest e FULL JOIN traffic_analytics.daily_counts d
    ON d.project_id=e.project_id AND d.scope=e.scope AND d.day=e.date
    WHERE e.project_id IS NULL OR d.project_id IS NULL
    OR d.available IS DISTINCT FROM e.available
    OR d.page_views IS DISTINCT FROM e."pageViews"
    OR d.unique_browsers IS DISTINCT FROM e."uniqueBrowsers"
    OR d.observed_at IS DISTINCT FROM e.observed_at)
UNION ALL SELECT 'missing_days_remain_null', NOT EXISTS (
  SELECT 1 FROM traffic_analytics.daily_counts WHERE NOT available AND (page_views IS NOT NULL OR unique_browsers IS NOT NULL))
UNION ALL SELECT 'daily_view_preserves_coverage',
  (SELECT count(*) FROM traffic_analytics.daily_mart)=(SELECT count(*) FROM traffic_analytics.daily_counts)
  AND NOT EXISTS (SELECT 1 FROM traffic_analytics.daily_mart WHERE closed_day IS DISTINCT FROM (day < (observed_at AT TIME ZONE 'UTC')::date))
UNION ALL SELECT 'weekly_excludes_open_days', NOT EXISTS (
  SELECT 1 FROM traffic_analytics.weekly_mart w
  WHERE w.recorded_page_views IS DISTINCT FROM (
    SELECT sum(d.page_views) FROM traffic_analytics.daily_counts d
    WHERE d.project_id=w.project_id AND d.scope=w.scope AND date_trunc('week',d.day)::date=w.week_start
    AND d.available AND d.day < (d.observed_at AT TIME ZONE 'UTC')::date))
UNION ALL SELECT 'weekly_uniques_not_fabricated', NOT EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='traffic_analytics' AND table_name='weekly_mart' AND column_name LIKE '%unique%')
ORDER BY check_name;
