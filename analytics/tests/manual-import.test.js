import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { fixture } from "../fixture.js";
import { ingest, migrate, report } from "../warehouse.js";
import { manualImportSql } from "../manual-import.js";

test("SQL Editor fallback matches loader, preserves replay/corrections and rolls back conflicts", async () => {
  const db = new PGlite();
  const reference = new PGlite();
  try {
    await migrate(db); await migrate(reference);
    const newer = structuredClone(fixture);
    newer.observedAt = "2026-10-26T13:00:00.000Z";
    newer.days[2].pageViews += 3;
    for (const snapshot of [fixture, fixture, newer, fixture]) {
      await db.exec(manualImportSql(snapshot).sql);
      await ingest(reference, snapshot);
      assert.deepEqual(await report(db, fixture.projectId, fixture.scope), await report(reference, fixture.projectId, fixture.scope));
    }
    const conflicting = structuredClone(fixture);
    conflicting.observedAt = "2026-10-26T13:00:00.000Z";
    conflicting.days[2].pageViews += 10;
    await assert.rejects(db.exec(manualImportSql(conflicting).sql), /Conflicting snapshot/);
    await db.query("ROLLBACK");
    assert.equal((await db.query("SELECT count(*)::int AS n FROM traffic_analytics.batches")).rows[0].n, 2);
    assert.deepEqual(await report(db, fixture.projectId, fixture.scope), await report(reference, fixture.projectId, fixture.scope));
    assert.throws(() => manualImportSql({...fixture, projectId:"x'$payload$"}));
  } finally { await db.close(); await reference.close(); }
});

test("Supabase hardening denies API roles, enables RLS, and uses invoker views", async () => {
  const db = new PGlite();
  try {
    await db.exec("CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;");
    await migrate(db);
    await db.exec(await readFile(new URL("../sql/002_supabase_private.sql", import.meta.url), "utf8"));
    for (const role of ["anon", "authenticated", "service_role"]) {
      const { rows } = await db.query("SELECT has_schema_privilege($1, 'traffic_analytics', 'USAGE') AS access", [role]);
      assert.equal(rows[0].access, false);
      await db.exec(`SET ROLE ${role}`);
      await assert.rejects(db.query("SELECT * FROM traffic_analytics.daily_mart"), /permission denied/);
      await db.exec("RESET ROLE");
    }
    const {rows} = await db.query("SELECT relname, relrowsecurity, reloptions FROM pg_class WHERE relnamespace='traffic_analytics'::regnamespace AND relkind IN ('r','v')");
    assert.equal(rows.length, 4);
    for (const row of rows) {
      if (row.relname.endsWith('_mart')) assert.ok(row.reloptions.includes('security_invoker=true'));
      else assert.equal(row.relrowsecurity, true);
    }
    await db.exec(manualImportSql(fixture).sql);
    const checks = await db.query(await readFile(new URL("../sql/003_verify_supabase.sql", import.meta.url), "utf8"));
    assert.equal(checks.rows.length, 9);
    assert.ok(checks.rows.every((row) => row.passed === true));
  } finally { await db.close(); }
});
