import { PGlite } from "@electric-sql/pglite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { migrate, ingest, report } from "../warehouse.js";
import { fixture } from "../fixture.js";

const output = resolve(process.argv[2] ?? "../docs/evidence/traffic-analytics-demo.json");
const db = new PGlite();
try {
  await migrate(db);
  const first = await ingest(db, fixture);
  const replay = await ingest(db, fixture);
  const correction = structuredClone(fixture);
  correction.observedAt = "2026-10-26T13:00:00.000Z";
  correction.days[2].pageViews = 23;
  const corrected = await ingest(db, correction);
  const stale = structuredClone(fixture);
  stale.observedAt = "2026-10-26T11:00:00.000Z";
  const ignoredStale = await ingest(db, stale);
  const result = await report(db, fixture.projectId, fixture.scope);
  const engine = (await db.query("SELECT version() AS version")).rows[0].version;
  const sourceHashes = Object.fromEntries(await Promise.all(["warehouse.js", "sql/001_warehouse.sql", "fixture.js"].map(async (path) => [path, createHash("sha256").update(await readFile(new URL(`../${path}`, import.meta.url))).digest("hex")])));
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify({ generatedAt: new Date().toISOString(), environment: "Local PGlite embedded PostgreSQL; not an online database deployment", dataset: "Synthetic fixture only; not customer traffic", engine, sourceHashes, first, replay, corrected, ignoredStale, result }, null, 2) + "\n");
  console.log("Demo: initial load, exact replay, late correction and stale replay completed. Synthetic output written.");
} finally { await db.close(); }
