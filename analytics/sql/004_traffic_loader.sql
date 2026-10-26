-- Run once as the setup owner. The role cannot connect until the owner sets
-- a private password and enables LOGIN. No secret belongs in this file.
BEGIN;
CREATE ROLE traffic_loader NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE
  NOINHERIT NOREPLICATION NOBYPASSRLS;
ALTER ROLE traffic_loader SET search_path = pg_catalog, traffic_analytics;
ALTER ROLE traffic_loader SET statement_timeout = '15s';
ALTER ROLE traffic_loader SET idle_in_transaction_session_timeout = '30s';
GRANT USAGE ON SCHEMA traffic_analytics TO traffic_loader;
GRANT SELECT, INSERT ON traffic_analytics.batches TO traffic_loader;
GRANT SELECT, INSERT, UPDATE ON traffic_analytics.daily_counts TO traffic_loader;

CREATE POLICY loader_batch_read ON traffic_analytics.batches FOR SELECT TO traffic_loader
  USING (project_id='no-bloom' AND scope='production');
CREATE POLICY loader_batch_insert ON traffic_analytics.batches FOR INSERT TO traffic_loader
  WITH CHECK (project_id='no-bloom' AND scope='production');
CREATE POLICY loader_day_read ON traffic_analytics.daily_counts FOR SELECT TO traffic_loader
  USING (project_id='no-bloom' AND scope='production');
CREATE POLICY loader_day_insert ON traffic_analytics.daily_counts FOR INSERT TO traffic_loader
  WITH CHECK (project_id='no-bloom' AND scope='production');
CREATE POLICY loader_day_update ON traffic_analytics.daily_counts FOR UPDATE TO traffic_loader
  USING (project_id='no-bloom' AND scope='production')
  WITH CHECK (project_id='no-bloom' AND scope='production');
COMMIT;
