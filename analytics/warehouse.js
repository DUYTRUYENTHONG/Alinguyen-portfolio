import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const date = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
const exactKeys = (value, keys) => value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
export function validateSnapshot(input) {
  if (!exactKeys(input, ["version", "projectId", "scope", "observedAt", "start", "end", "days"]) || input.version !== 1 || !/^[a-z0-9-]{1,48}$/.test(input.projectId) || !["production", "staging", "development", "fixture"].includes(input.scope)) throw Error("Invalid snapshot contract");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(input.observedAt) || !Number.isFinite(Date.parse(input.observedAt)) || new Date(input.observedAt).toISOString() !== input.observedAt) throw Error("Invalid UTC observation time");
  if (!date(input.start) || !date(input.end)) throw Error("Invalid UTC date");
  const count = (Date.parse(input.end) - Date.parse(input.start)) / 86400000;
  if (count < 1 || count > 31 || !Array.isArray(input.days) || input.days.length !== count || Date.parse(input.end) > Date.parse(input.observedAt.slice(0, 10)) + 86400000) throw Error("Invalid snapshot interval");
  const days = input.days.map((row, i) => {
    const expected = new Date(Date.parse(input.start) + i * 86400000).toISOString().slice(0, 10);
    if (!exactKeys(row, ["date", "available", "pageViews", "uniqueBrowsers"]) || row.date !== expected || typeof row.available !== "boolean") throw Error("Missing, duplicate or unordered day");
    if (row.available ? ![row.pageViews, row.uniqueBrowsers].every((v) => Number.isSafeInteger(v) && v >= 0) || row.uniqueBrowsers > row.pageViews : row.pageViews !== null || row.uniqueBrowsers !== null) throw Error("Invalid aggregate counts");
    return { date: row.date, available: row.available, pageViews: row.pageViews, uniqueBrowsers: row.uniqueBrowsers };
  });
  // Canonical field order gives byte-stable replay IDs; extra/private fields fail closed.
  return { version: 1, projectId: input.projectId, scope: input.scope, observedAt: input.observedAt, start: input.start, end: input.end, days };
}

export async function migrate(client) {
  const sql = await readFile(new URL("./sql/001_warehouse.sql", import.meta.url), "utf8");
  // pg and PGlite both support query; statements contain no caller input.
  await client.query("BEGIN");
  try {
    for (const statement of sql.split(";").filter((s) => s.trim())) await client.query(statement);
    await client.query("COMMIT");
  } catch (error) { await client.query("ROLLBACK"); throw error; }
}

export async function ingest(client, input) {
  const snapshot = validateSnapshot(input);
  const payload = JSON.stringify(snapshot);
  const batchId = createHash("sha256").update(payload).digest("hex");
  for (let attempt = 0; attempt < 3; attempt++) {
    await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
    try {
      const batch = await client.query(`INSERT INTO traffic_analytics.batches (batch_id,project_id,scope,observed_at,start_date,end_date,payload)
        VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING RETURNING batch_id`, [batchId, snapshot.projectId, snapshot.scope, snapshot.observedAt, snapshot.start, snapshot.end, payload]);
      if (!batch.rows.length) { await client.query("COMMIT"); return { batchId, replay: true, appliedDays: 0 }; }
      let appliedDays = 0;
      for (const row of snapshot.days) {
        const old = await client.query("SELECT * FROM traffic_analytics.daily_counts WHERE project_id=$1 AND scope=$2 AND day=$3 FOR UPDATE", [snapshot.projectId, snapshot.scope, row.date]);
        const previous = old.rows[0];
        if (previous && new Date(previous.observed_at).getTime() === Date.parse(snapshot.observedAt) && (previous.available !== row.available || (previous.page_views === null ? null : Number(previous.page_views)) !== row.pageViews || (previous.unique_browsers === null ? null : Number(previous.unique_browsers)) !== row.uniqueBrowsers)) throw Error("Conflicting snapshot at identical observation time");
        const updated = await client.query(`INSERT INTO traffic_analytics.daily_counts (project_id,scope,day,available,page_views,unique_browsers,observed_at,batch_id)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
          ON CONFLICT (project_id,scope,day) DO UPDATE SET available=EXCLUDED.available,page_views=EXCLUDED.page_views,unique_browsers=EXCLUDED.unique_browsers,observed_at=EXCLUDED.observed_at,batch_id=EXCLUDED.batch_id
          WHERE EXCLUDED.observed_at > traffic_analytics.daily_counts.observed_at RETURNING day`, [snapshot.projectId, snapshot.scope, row.date, row.available, row.pageViews, row.uniqueBrowsers, snapshot.observedAt, batchId]);
        appliedDays += updated.rows.length;
      }
      await client.query("COMMIT");
      return { batchId, replay: false, appliedDays };
    } catch (error) {
      await client.query("ROLLBACK");
      if (["40001", "40P01"].includes(error.code) && attempt < 2) { await delay(50 * (attempt + 1)); continue; }
      throw error;
    }
  }
}

export async function report(client, projectId, scope) {
  const daily = await client.query("SELECT day::text,available,page_views::text,unique_browsers::text,closed_day,day_over_day_views::text FROM traffic_analytics.daily_mart WHERE project_id=$1 AND scope=$2 ORDER BY day", [projectId, scope]);
  const weekly = await client.query("SELECT week_start::text,recorded_page_views::text,available_closed_days::text,unavailable_days::text,open_days::text FROM traffic_analytics.weekly_mart WHERE project_id=$1 AND scope=$2 ORDER BY week_start", [projectId, scope]);
  return { projectId, scope, daily: daily.rows, weekly: weekly.rows, note: "Counts are consenting recorded traffic, not all visits. Browsers are not people. Missing data is null; current UTC days are partial. Weekly views exclude partial days; weekly unique browsers are not calculated." };
}
