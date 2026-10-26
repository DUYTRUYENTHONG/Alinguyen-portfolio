-- This dedicated schema contains aggregate counts, never event/browser records.
CREATE SCHEMA IF NOT EXISTS traffic_analytics;
CREATE TABLE IF NOT EXISTS traffic_analytics.batches (
  batch_id text PRIMARY KEY CHECK (length(batch_id) = 64),
  project_id text NOT NULL,
  scope text NOT NULL CHECK (scope IN ('production','staging','development','fixture')),
  observed_at timestamptz NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL CHECK (end_date > start_date),
  payload jsonb NOT NULL,
  imported_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS traffic_analytics.daily_counts (
  project_id text NOT NULL,
  scope text NOT NULL CHECK (scope IN ('production','staging','development','fixture')),
  day date NOT NULL,
  available boolean NOT NULL,
  page_views bigint,
  unique_browsers bigint,
  observed_at timestamptz NOT NULL,
  batch_id text NOT NULL REFERENCES traffic_analytics.batches(batch_id),
  PRIMARY KEY (project_id, scope, day),
  CHECK ((available AND page_views >= 0 AND unique_browsers >= 0 AND unique_browsers <= page_views AND page_views IS NOT NULL AND unique_browsers IS NOT NULL)
      OR (NOT available AND page_views IS NULL AND unique_browsers IS NULL))
);
CREATE OR REPLACE VIEW traffic_analytics.daily_mart AS
SELECT project_id, scope, day, available, page_views, unique_browsers,
       observed_at, batch_id,
       day < (observed_at AT TIME ZONE 'UTC')::date AS closed_day,
       CASE WHEN available AND lag(available) OVER w
                  AND day - lag(day) OVER w = 1
            THEN page_views - lag(page_views) OVER w END AS day_over_day_views
FROM traffic_analytics.daily_counts
WINDOW w AS (PARTITION BY project_id, scope ORDER BY day);
CREATE OR REPLACE VIEW traffic_analytics.weekly_mart AS
SELECT project_id, scope, date_trunc('week',day)::date AS week_start,
       sum(page_views) FILTER (WHERE available AND closed_day) AS recorded_page_views,
       count(*) FILTER (WHERE available AND closed_day) AS available_closed_days,
       count(*) FILTER (WHERE NOT available) AS unavailable_days,
       count(*) FILTER (WHERE NOT closed_day) AS open_days
FROM traffic_analytics.daily_mart
GROUP BY project_id, scope, date_trunc('week',day)::date;
-- Daily unique browsers are intentionally never summed into weekly uniques.
