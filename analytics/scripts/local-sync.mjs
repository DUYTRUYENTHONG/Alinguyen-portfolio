import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { migrate, ingest, report } from "../warehouse.js";

const [input, directory] = process.argv.slice(2);
if (!input || !directory) throw Error("Usage: local-sync.mjs snapshot.json private-db-directory");
if (/[\\/](public|docs|src|out)[\\/]/i.test(resolve(directory))) throw Error("Use a private warehouse directory");
const snapshot = JSON.parse(await readFile(input, "utf8"));
const db = new PGlite(resolve(directory));
try {
  await migrate(db);
  const result = await ingest(db, snapshot);
  const data = await report(db, snapshot.projectId, snapshot.scope);
  console.log(JSON.stringify({ environment: "Local persistent PGlite PostgreSQL", ...result, days: data.daily.length, availableDays: data.daily.filter((r) => r.available).length, privateReport: "Query with warehouse.report; real counts are not printed or published." }));
} finally { await db.close(); }
