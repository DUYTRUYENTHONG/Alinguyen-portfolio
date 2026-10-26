import pg from "pg";
import { readFile } from "node:fs/promises";

export async function connect() {
  const value = process.env.ANALYTICS_DATABASE_URL;
  if (!value) throw Error("ANALYTICS_DATABASE_URL required");
  const url = new URL(value);
  if (!["postgres:", "postgresql:"].includes(url.protocol)) throw Error("PostgreSQL URL required");
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  // Do not permit connection-string options to silently weaken TLS verification.
  for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert", "ssl", "uselibpqcompat"]) url.searchParams.delete(key);
  const ca = process.env.ANALYTICS_CA_FILE ? await readFile(process.env.ANALYTICS_CA_FILE, "utf8") : undefined;
  const client = new pg.Client({ connectionString: url.toString(), ssl: local ? false : { rejectUnauthorized: true, ...(ca ? { ca } : {}) }, connectionTimeoutMillis: 10000, statement_timeout: 15000, application_name: "portfolio-traffic-analytics" });
  await client.connect();
  return client;
}
