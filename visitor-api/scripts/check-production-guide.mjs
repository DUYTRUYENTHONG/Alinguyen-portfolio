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
