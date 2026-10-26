import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { fixture } from "../fixture.js";
import { migrate, ingest } from "../warehouse.js";
import { assertRestrictedLoader, reconcileSnapshot, importWindow } from '../automation.js';

test('automated import uses UTC and includes seven recovery days plus today',()=>{
  assert.deepEqual(importWindow(new Date('2026-11-01T01:30:00+07:00')),{start:'2026-10-24',end:'2026-11-01'});
});

test("restricted loader can import/replay/correct only its project and cannot delete or change schema", async () => {
  const db = new PGlite();
  try {
    await db.exec("CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;");
    await migrate(db);
    for (const file of ['002_supabase_private.sql','004_traffic_loader.sql']) {
      await db.exec(await readFile(new URL('../sql/'+file,import.meta.url),'utf8'));
    }
    await ingest(db, fixture);
    await assert.rejects(assertRestrictedLoader(db),/Restricted loader/);
    await db.exec("SET ROLE traffic_loader");
    await assertRestrictedLoader(db);
    assert.equal((await db.query("SELECT count(*)::int AS n FROM traffic_analytics.batches")).rows[0].n,0);
    const allowed={...structuredClone(fixture),projectId:'no-bloom',scope:'production'};
    const imported=await ingest(db,allowed);
    assert.equal(imported.appliedDays,4);
    await reconcileSnapshot(db,allowed,imported.batchId);
    const wrong=structuredClone(allowed); wrong.days[2].pageViews+=1;
    await assert.rejects(reconcileSnapshot(db,wrong,imported.batchId),/reconciliation failed/);
    assert.equal((await ingest(db,allowed)).replay,true);
    const newer=structuredClone(allowed); newer.observedAt='2026-10-26T13:00:00.000Z'; newer.days[2].pageViews+=2;
    assert.equal((await ingest(db,newer)).appliedDays,4);
    for (const blocked of [{...allowed,projectId:'other-site'},{...allowed,scope:'staging'}]) {
      await assert.rejects(ingest(db,blocked),/row-level security/);
    }
    for (const sql of [
      "DELETE FROM traffic_analytics.daily_counts",
      "UPDATE traffic_analytics.batches SET scope='staging'",
      "CREATE TABLE traffic_analytics.forbidden (id int)",
      "ALTER TABLE traffic_analytics.daily_counts ADD COLUMN forbidden text",
      "UPDATE traffic_analytics.daily_counts SET project_id='other-site'",
      "ALTER ROLE traffic_loader BYPASSRLS",
    ]) await assert.rejects(db.query(sql),/permission denied|must be owner|row-level security|superuser/);
    await db.exec("RESET ROLE");
    assert.equal((await db.query("SELECT count(*)::int AS n FROM traffic_analytics.daily_counts WHERE project_id='synthetic-demo'")).rows[0].n,4);
  } finally { await db.close(); }
});
