import { readFile } from "node:fs/promises";
import { connect } from "../connection.js";
import { migrate, ingest } from "../warehouse.js";

let client;
try {
  const input = process.argv[2];
  if (!input) throw Error("Snapshot file required");
  client = await connect();
  if (process.argv.includes("--migrate")) await migrate(client);
  console.log(JSON.stringify(await ingest(client, JSON.parse(await readFile(input, "utf8")))));
} catch (error) {
  console.error(`Analytics sync failed (${error.code ?? "validation/connection"}). Check the snapshot and database configuration; the transaction was not acknowledged as successful.`);
  process.exitCode = 1;
} finally { await client?.end(); }
