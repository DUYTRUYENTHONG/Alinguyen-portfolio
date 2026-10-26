import { connect } from "../connection.js";
import { report } from "../warehouse.js";
let client;
try {
  const [projectId, scope = "production"] = process.argv.slice(2);
  if (!projectId) throw Error("Project required");
  client = await connect();
  console.log(JSON.stringify(await report(client, projectId, scope), null, 2));
} catch { console.error("Analytics report unavailable; check private connection and project."); process.exitCode = 1; }
finally { await client?.end(); }
