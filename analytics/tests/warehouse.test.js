import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { fixture } from "../fixture.js";
import { ingest, migrate, report, validateSnapshot } from "../warehouse.js";

const copy = () => structuredClone(fixture);
async function withDb(run) { const db = new PGlite(); try { await migrate(db); await run(db); } finally { await db.close(); } }

test("snapshot contract rejects private fields, impossible counts, missing days and invalid dates", () => {
  for (const change of [
    (v) => { v.browserId = "private"; },
    (v) => { v.days[0].pageViews = 0; },
    (v) => { v.days[1].uniqueBrowsers = 100; },
    (v) => { v.days[1].pageViews = -1; },
    (v) => { v.days[1].date = v.days[0].date; },
    (v) => { v.days.pop(); },
    (v) => { v.start = "2026-02-30"; },
    (v) => { v.observedAt = "not-a-date"; },
  ]) { const data = copy(); change(data); assert.throws(() => validateSnapshot(data)); }
});
test("initial load and exact replay are idempotent in PostgreSQL", () => withDb(async (db) => {
  assert.equal((await ingest(db, copy())).appliedDays, 4);
  assert.equal((await ingest(db, copy())).replay, true);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM traffic_analytics.daily_counts")).rows[0].n, 4);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM traffic_analytics.batches")).rows[0].n, 1);
}));
test("late corrections replace snapshots instead of adding traffic twice; stale arrivals cannot regress counts", () => withDb(async (db) => {
  await ingest(db, copy());
  const newer = copy(); newer.observedAt = "2026-10-26T13:00:00.000Z"; newer.days[2].pageViews = 23;
  await ingest(db, newer);
  const older = copy(); older.observedAt = "2026-10-26T11:00:00.000Z";
  assert.equal((await ingest(db, older)).appliedDays, 0);
  const data = await report(db, fixture.projectId, fixture.scope);
  assert.equal(data.daily[2].page_views, "23");
  assert.equal(data.daily[2].day_over_day_views, "11");
  assert.equal(data.weekly[0].recorded_page_views, "35");
}));
test("missing dates stay null, partial days are excluded from weekly totals, and uniques are never summed", () => withDb(async (db) => {
  await ingest(db, copy());
  const data = await report(db, fixture.projectId, fixture.scope);
  assert.equal(data.daily[0].page_views, null);
  assert.equal(data.daily[1].day_over_day_views, null);
  assert.equal(data.daily[3].closed_day, false);
  assert.equal(data.weekly[0].recorded_page_views, "32");
  assert.equal(data.weekly[1].recorded_page_views, null);
  assert.ok(!Object.keys(data.weekly[0]).some((k) => /unique/.test(k)));
}));
test("conflicting equal-time snapshots roll back the whole batch", () => withDb(async (db) => {
  await ingest(db, copy());
  const conflicting = copy(); conflicting.days[2].pageViews = 44;
  await assert.rejects(ingest(db, conflicting), /Conflicting snapshot/);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM traffic_analytics.batches")).rows[0].n, 1);
  assert.equal((await report(db, fixture.projectId, fixture.scope)).daily[2].page_views, "20");
}));
test("database constraint failure rolls back earlier rows and the batch", () => withDb(async (db) => {
  await db.query("ALTER TABLE traffic_analytics.daily_counts ADD CONSTRAINT test_failure CHECK (page_views < 15)");
  await assert.rejects(ingest(db, copy()));
  assert.equal((await db.query("SELECT count(*)::int AS n FROM traffic_analytics.batches")).rows[0].n, 0);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM traffic_analytics.daily_counts")).rows[0].n, 0);
}));
test("project and environment boundaries remain separate", () => withDb(async (db) => {
  await ingest(db, copy());
  const other = copy(); other.projectId = "second-demo"; other.scope = "development"; other.days[1].pageViews = 99;
  await ingest(db, other);
  assert.equal((await report(db, fixture.projectId, fixture.scope)).daily[1].page_views, "12");
  assert.equal((await report(db, other.projectId, other.scope)).daily[1].page_views, "99");
  assert.equal((await report(db, "' OR 1=1 --", "fixture")).daily.length, 0);
}));
test("repeated migrations preserve data and overlapping backfills update only their dates", () => withDb(async (db) => {
  await ingest(db, copy()); await migrate(db);
  const backfill = copy(); backfill.observedAt = "2026-10-27T12:00:00.000Z"; backfill.end = "2026-10-25"; backfill.days = backfill.days.slice(0, 2); backfill.days[1].pageViews = 18;
  await ingest(db, backfill);
  const data = await report(db, fixture.projectId, fixture.scope);
  assert.equal(data.daily.length, 4); assert.equal(data.daily[1].page_views, "18"); assert.equal(data.daily[2].page_views, "20");
}));
test("serialization conflicts retry a bounded number of transactions", async () => {
  let starts = 0, rollbacks = 0;
  const db = { query: async (sql) => {
    if (sql.startsWith("BEGIN")) { starts++; return {}; }
    if (sql === "ROLLBACK") { rollbacks++; return {}; }
    throw Object.assign(Error("serialization"), { code: "40001" });
  } };
  await assert.rejects(ingest(db, copy()), /serialization/);
  assert.equal(starts, 3); assert.equal(rollbacks, 3);
});
test("local PostgreSQL warehouse persists across close and reopen", async () => {
  const dir = await mkdtemp(join(tmpdir(), "portfolio-pg-test-"));
  let db;
  try {
    db = new PGlite(dir); await migrate(db); await ingest(db, copy()); await db.close();
    db = new PGlite(dir);
    assert.equal((await report(db, fixture.projectId, fixture.scope)).daily.length, 4);
    assert.equal((await ingest(db, copy())).replay, true);
  } finally {
    await db?.close();
    const target = resolve(dir);
    assert.equal(dirname(target), resolve(tmpdir()));
    assert.ok(basename(target).startsWith("portfolio-pg-test-"));
    await rm(target, { recursive: true, force: true });
  }
});
