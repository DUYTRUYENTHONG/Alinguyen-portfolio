-- Supabase-only hardening, applied after 001_warehouse.sql as the setup owner.
-- No browser or service API role needs access to this operator-only warehouse.
REVOKE ALL ON SCHEMA traffic_analytics FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON ALL TABLES IN SCHEMA traffic_analytics FROM PUBLIC, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA traffic_analytics REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated, service_role;
ALTER TABLE traffic_analytics.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_analytics.daily_counts ENABLE ROW LEVEL SECURITY;
ALTER VIEW traffic_analytics.daily_mart SET (security_invoker = true);
ALTER VIEW traffic_analytics.weekly_mart SET (security_invoker = true);
-- No policies: deny non-owner access. Provision a scoped loader and matching
-- policies separately before scheduling; never grant browser-role access.
