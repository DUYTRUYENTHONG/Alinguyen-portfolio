import { Redis } from "@upstash/redis";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { authorizedReportProject, reportingDays } from "../lib/traffic-report.js";

try {
  const [projectId, start, end, output, scope = "production"] = process.argv.slice(2);
  if (!output) throw Error("Output file required");
  const destination = resolve(output);
  if (/[\\/](public|docs|src|out)[\\/]/i.test(destination)) throw Error("Private exports must stay outside publishable folders");
  const namespace = authorizedReportProject(projectId, process.env, scope);
  const days = reportingDays(start, end);
  const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN, retry: false, signal: () => AbortSignal.timeout(10000) });
  // One atomic read; no browser memberships, paths, countries or cities leave Redis.
  // Redis TIME makes snapshot ordering independent of the operator's local clock.
  const result = await redis.eval(`local t=redis.call('TIME');local rows={};
    for i=2,#KEYS,2 do table.insert(rows,{redis.call('GET',KEYS[i]) or '',redis.call('SCARD',KEYS[i+1])}) end
    return {redis.call('GET',KEYS[1]) or '',t[1],t[2],rows}`,
    [`${namespace}:started-utc`, ...days.flatMap((day) => [`${namespace}:day:${day}:views`, `${namespace}:day:${day}:browsers`])], []);
  if (!Array.isArray(result) || result.length !== 4 || result[3].length !== days.length) throw Error("Invalid source report");
  const observedAt = new Date(Number(result[1]) * 1000 + Math.floor(Number(result[2]) / 1000)).toISOString();
  const rows = days.map((date, i) => {
    // A missing Redis key cannot distinguish zero activity from lost/expired data.
    // Preserve that uncertainty; never manufacture a zero.
    const available = Boolean(result[0] && date >= result[0].slice(0, 10) && result[3][i][0] !== "");
    const pageViews = available ? Number(result[3][i][0]) : null;
    const uniqueBrowsers = available ? Number(result[3][i][1]) : null;
    if (available && (!Number.isSafeInteger(pageViews) || !Number.isSafeInteger(uniqueBrowsers) || pageViews < uniqueBrowsers || uniqueBrowsers < 0)) throw Error("Invalid source counts");
    return { date, available, pageViews, uniqueBrowsers };
  });
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, JSON.stringify({ version: 1, projectId, scope, observedAt, start, end, days: rows }, null, 2) + "\n", { mode: 0o600 });
  console.log(`Exported ${rows.length} aggregate day records; ${rows.filter((r) => r.available).length} available. No visitor records exported.`);
} catch (error) {
  console.error(JSON.stringify({ phase: "aggregate-export", type: error.name, permission: /NOPERM|permission|not allowed|readonly|read.only/i.test(error.message), invalidDates: /dates|days/i.test(error.message), authorization: /authorized|credentials/i.test(error.message) }));
  console.error("Aggregate export failed. Check authorized project, UTC dates, private output path and Redis credentials. No credentials are printed.");
  process.exitCode = 1;
}
