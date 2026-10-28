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

// Availability is a complete inventory, not whichever project wins top-k retrieval.
const inventoryResponse = await fetch(endpoint, {
  method: "POST", headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ question: "Which products are live?", context: { page: "/Alinguyen-portfolio/", section: "Selected work", role: "Founder" }, recentTurns: [], interests: [] }),
  signal: AbortSignal.timeout(20000),
});
if (inventoryResponse.status !== 200) throw new Error(`Production inventory returned HTTP ${inventoryResponse.status}`);
const inventory = await inventoryResponse.json();
const expected = new Map([
  ["growth-commerce-os", "https://growth-commerce-os.vercel.app/en"],
  ["stos", "https://stosvn.vercel.app/stos"],
  ["cho-kenh", "https://growth-commerce-os.vercel.app/cho-kenh"],
]);
if (inventory.responseMode !== "approved-inventory" || inventory.citations?.length !== 3 ||
    !inventory.citations.every(({sourceId,url}) => expected.get(sourceId) === url) ||
    new Set(inventory.citations.map(({sourceId}) => sourceId)).size !== 3 ||
    !inventory.answer.includes("[3] Chợ Kênh") || !inventory.answer.includes("AI suggestions are planned")) {
  throw new Error("Production inventory is incomplete, has incorrect sources, or loses feature limitations");
}
console.log("Production live inventory: all three products, exact source URLs, and planned-feature limits passed.");

const comparisonResponse = await fetch(endpoint, {
  method: "POST", headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ question: "Compare STOS and Cho Kenh.", context: { page: "/Alinguyen-portfolio/", section: "Selected work", role: "Founder" }, recentTurns: [], interests: [] }),
  signal: AbortSignal.timeout(20000),
});
const comparison = await comparisonResponse.json();
if (comparisonResponse.status !== 200 || comparison.responseMode !== "approved-comparison" || comparison.citations?.length !== 2 ||
    !comparison.answer.includes("Automated checkout, escrow, completed transactions, and business results are not claimed")) {
  throw new Error("Production comparison did not preserve the approved project limitations");
}
console.log("Production comparison: approved summaries preserve product limitations without model paraphrasing.");
