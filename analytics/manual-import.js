import { createHash } from "node:crypto";
import { validateSnapshot } from "./warehouse.js";

// Operator-only SQL Editor fallback when a direct connection is unavailable.
// Output contains private aggregates: keep it in ignored artifacts, never Git.
export function manualImportSql(input) {
  const snapshot = validateSnapshot(input);
  const payload = JSON.stringify(snapshot);
  const batchId = createHash("sha256").update(payload).digest("hex");
  // The validated contract permits no quotes or dollar tags in string fields.
  const sql = `BEGIN ISOLATION LEVEL SERIALIZABLE;
DO $import$
DECLARE
  s jsonb := $payload$${payload}$payload$::jsonb;
  batch_key text := '${batchId}';
  d jsonb;
  previous traffic_analytics.daily_counts%ROWTYPE;
BEGIN
  INSERT INTO traffic_analytics.batches (batch_id, project_id, scope, observed_at, start_date, end_date, payload)
  VALUES (batch_key, s->>'projectId', s->>'scope', (s->>'observedAt')::timestamptz, (s->>'start')::date, (s->>'end')::date, s)
  ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN RETURN; END IF;
  FOR d IN SELECT value FROM jsonb_array_elements(s->'days') LOOP
    SELECT * INTO previous FROM traffic_analytics.daily_counts
    WHERE project_id = s->>'projectId' AND scope = s->>'scope' AND day = (d->>'date')::date FOR UPDATE;
    IF FOUND AND previous.observed_at = (s->>'observedAt')::timestamptz
      AND (previous.available IS DISTINCT FROM (d->>'available')::boolean
        OR previous.page_views IS DISTINCT FROM (d->>'pageViews')::bigint
        OR previous.unique_browsers IS DISTINCT FROM (d->>'uniqueBrowsers')::bigint)
    THEN RAISE EXCEPTION 'Conflicting snapshot at identical observation time'; END IF;
    INSERT INTO traffic_analytics.daily_counts (project_id, scope, day, available, page_views, unique_browsers, observed_at, batch_id)
    VALUES (s->>'projectId', s->>'scope', (d->>'date')::date, (d->>'available')::boolean,
      (d->>'pageViews')::bigint, (d->>'uniqueBrowsers')::bigint, (s->>'observedAt')::timestamptz, batch_key)
    ON CONFLICT (project_id, scope, day) DO UPDATE
      SET available=EXCLUDED.available, page_views=EXCLUDED.page_views, unique_browsers=EXCLUDED.unique_browsers,
          observed_at=EXCLUDED.observed_at, batch_id=EXCLUDED.batch_id
      WHERE EXCLUDED.observed_at > traffic_analytics.daily_counts.observed_at;
  END LOOP;
END $import$;
COMMIT;
`;
  return { sql, batchId };
}
