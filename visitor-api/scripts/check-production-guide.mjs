const endpoint = "https://ali-portfolio-visitor-api.vercel.app/api/guide";
const origin = "https://duytruyenthong.github.io";

const response = await fetch(endpoint, {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({
    question: "How was KKBox evaluated?",
    context: { page: "/Alinguyen-portfolio/", section: "Highlights", role: "Recruiter" },
    recentTurns: [],
    interests: [],
  }),
  signal: AbortSignal.timeout(20000),
});

if (response.status !== 200) throw new Error(`Production guide returned HTTP ${response.status}`);
if (response.headers.get("access-control-allow-origin") !== origin) throw new Error("Production guide CORS origin mismatch");

const reply = await response.json();
if (typeof reply.answer !== "string" || reply.answer.length < 20 ||
    !Array.isArray(reply.citations) || !reply.citations.some(({ sourceId, url }) =>
      sourceId === "kkbox-results" && url === "https://github.com/DUYTRUYENTHONG/kkbox-customer-churn-prediction/blob/main/docs/RESULTS.md") ||
    !["nod", "curious", "point", "none"].includes(reply.motion)) {
  throw new Error("Production guide did not return a grounded answer with the expected citation and motion shape");
}

console.log("Production guide: grounded answer, approved citation, motion shape, and CORS passed.");

const expected = new Map([
  ['growth-commerce-os', 'https://growth-commerce-os.vercel.app/en'],
  ['stos', 'https://stosvn.vercel.app/stos'],
  ['cho-kenh', 'https://growth-commerce-os.vercel.app/cho-kenh'],
]);
for (const question of ['Which products are live?', 'Những dự án nào đang hoạt động?']) {
  const result = await fetch(endpoint, {method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({question,context:{section:'Highlights',role:'Founder'},recentTurns:[],interests:[]}),signal:AbortSignal.timeout(20000)});
  if (result.status !== 200) throw new Error(`Inventory smoke HTTP ${result.status}`);
  const inventory = await result.json();
  if (inventory.responseMode !== 'verified-inventory' || inventory.citations?.length !== expected.size ||
      new Set(inventory.citations.map(c=>c.sourceId)).size !== expected.size ||
      !inventory.citations.every(c=>expected.get(c.sourceId)===c.url) ||
      !['Growth Commerce OS','STOS','Chợ Kênh','[1]','[2]','[3]'].every(s=>inventory.answer.includes(s))) throw new Error('Incomplete live-project inventory or incorrect citation');
}
console.log('Production guide: complete English and Vietnamese inventories with three exact approved citations passed.');

for(const [question,id,required] of [
 ['Are STOS AI suggestions live today?','stos',['planned, not live']],
 ['Does Chợ Kênh provide automated checkout and escrow?','cho-kenh',['manual','not claimed','planned']],
 ['Does Vietnam Career Agent Kit guarantee job offers?','career-agent-kit',['does not guarantee','acceptance gates']],
]) {
 const r=await fetch(endpoint,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({question,context:{section:'Highlights',role:'Recruiter'},recentTurns:[],interests:[]}),signal:AbortSignal.timeout(20000)});
 const body=await r.json();
 if(r.status!==200||body.responseMode!=='reviewed-evidence'||!body.citations?.some(c=>c.sourceId===id)||!required.every(t=>body.answer.includes(t))) throw Error(`Project evidence smoke failed: ${id}`);
}
console.log('Production guide: planned features, manual marketplace limits and community-kit boundaries passed.');
