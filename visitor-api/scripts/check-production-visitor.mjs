import {pathToFileURL} from 'node:url';
const origin='https://duytruyenthong.github.io';
export async function checkVisitorEndpoint(endpoint, transport=fetch) {
  const preflight=await transport(endpoint,{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST'},signal:AbortSignal.timeout(10000)});
  if(preflight.status!==204||preflight.headers.get('access-control-allow-origin')!==origin||!preflight.headers.get('access-control-allow-methods')?.includes('POST'))
    throw Error(`Visitor API missing or CORS invalid: preflight HTTP ${preflight.status}`);
  // Read-only routing check; never create a synthetic production visitor.
  const route=await transport(endpoint,{method:'GET',headers:{Origin:origin},signal:AbortSignal.timeout(10000)});
  if(route.status!==405||(await route.json()).error!=='Method not allowed')
    throw Error(`Visitor API route contract failed: HTTP ${route.status}`);
  return {preflight:204,route:405,productionWrites:0};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)
  console.log(JSON.stringify(await checkVisitorEndpoint('https://ali-portfolio-visitor-api.vercel.app/api/visit')));
