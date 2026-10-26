import { validateSnapshot } from './warehouse.js';

export const importProject = 'no-bloom';
export const importScope = 'production';

export function importWindow(now = new Date()) {
  const today = Date.parse(now.toISOString().slice(0,10));
  const day = 86400000;
  return { start:new Date(today-7*day).toISOString().slice(0,10), end:new Date(today+day).toISOString().slice(0,10) };
}

export async function assertRestrictedLoader(client) {
  const { rows } = await client.query(`SELECT current_user AS role,
    r.rolsuper OR r.rolcreaterole OR r.rolcreatedb OR r.rolbypassrls OR r.rolreplication AS elevated,
    has_schema_privilege(current_user,'traffic_analytics','CREATE') AS schema_create,
    has_table_privilege(current_user,'traffic_analytics.batches','UPDATE,DELETE,TRUNCATE') AS batch_mutation,
    has_table_privilege(current_user,'traffic_analytics.daily_counts','DELETE,TRUNCATE') AS day_delete,
    (SELECT bool_and(relrowsecurity) FROM pg_class WHERE oid IN ('traffic_analytics.batches'::regclass,'traffic_analytics.daily_counts'::regclass)) AS rls
    FROM pg_roles r WHERE r.rolname=current_user`);
  const r=rows[0];
  if (!r || r.role!=='traffic_loader' || r.elevated || r.schema_create || r.batch_mutation || r.day_delete || !r.rls) throw Error('Restricted loader configuration required');
}

export async function reconcileSnapshot(client, snapshot, batchId) {
  const batch = await client.query('SELECT payload FROM traffic_analytics.batches WHERE batch_id=$1',[batchId]);
  // PostgreSQL jsonb reorders keys: compare fields, not JSON serialization order.
  if (!batch.rows.length || JSON.stringify(validateSnapshot(batch.rows[0].payload))!==JSON.stringify(validateSnapshot(snapshot))) throw Error('Batch reconciliation failed');
  const { rows } = await client.query(`SELECT day::text, available, page_views::text, unique_browsers::text, observed_at
    FROM traffic_analytics.daily_counts WHERE project_id=$1 AND scope=$2 AND day >= $3 AND day < $4 ORDER BY day`,[snapshot.projectId,snapshot.scope,snapshot.start,snapshot.end]);
  if (rows.length!==snapshot.days.length) throw Error('Coverage reconciliation failed');
  rows.forEach((r,i)=>{
    const s=snapshot.days[i];
    if (r.day!==s.date || new Date(r.observed_at).toISOString()!==snapshot.observedAt || r.available!==s.available
      || r.page_views!==(s.pageViews===null?null:String(s.pageViews)) || r.unique_browsers!==(s.uniqueBrowsers===null?null:String(s.uniqueBrowsers))) throw Error('Row reconciliation failed');
  });
}
