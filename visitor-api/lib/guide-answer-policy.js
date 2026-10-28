import { knowledge } from "./guide-knowledge.js";

const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
const projects = [
  { id: "growth-commerce-os", name: /\bgrowth commerce(?: os)?\b/ },
  { id: "stos", name: /\bstos\b/ },
  { id: "cho-kenh", name: /\bcho kenh\b/ },
  { id: "kkbox-results", name: /\bkkbox\b/ },
  { id: "vibecode-kit", name: /\bvibecode\b/ },
  { id: "career-agent-kit", name: /\b(?:vietnam career|career agent kit)\b/ },
];

// Curated product availability is an inventory question, not a top-k ranking.
// Narrow intent matching avoids replacing specific feature or project questions.
export function liveProductInventory(question) {
  const query = normalize(question).replace(/[?!.]/g, "").trim();
  const english = /^(?:please )?(?:(?:which|what) (?:of ali's |of your )?(?:products|projects|websites) (?:are |is )?(?:live|deployed|available)(?: right now| now| today)?|(?:show|list)(?: me)? (?:the |all |your |ali's )?(?:live|deployed) (?:products|projects|websites)|what can i try live)$/;
  const vietnamese = /^(?:nhung |cac )?(?:san pham|du an|website) nao (?:dang |da )?(?:hoat dong|truc tuyen|trien khai)(?: hien nay)?$/;
  if (!english.test(query) && !vietnamese.test(query)) return null;
  const ids = ["growth-commerce-os", "stos", "cho-kenh"];
  const sources = ids.map((id) => knowledge.find((source) => source.id === id));
  const answer = vietnamese.test(query)
    ? "Ba website đang hoạt động:\n\n[1] Growth Commerce OS — website dịch vụ với các liên kết demo công khai.\n\n[2] STOS — website sản phẩm trang bán hàng; gợi ý AI mới ở kế hoạch.\n\n[3] Chợ Kênh — danh mục kênh TikTok với liên hệ và quy trình trung gian thủ công; không tuyên bố có thanh toán hay ký quỹ tự động.\n\nWebsite đang hoạt động không đồng nghĩa với kết quả kinh doanh đã được đo lường."
    : "Three public websites are live:\n\n[1] Growth Commerce OS — a service website with public demo links.\n\n[2] STOS — a sales-page product website; AI suggestions are planned.\n\n[3] Chợ Kênh — a TikTok-channel catalog with inquiry paths and manual intermediary information; automated checkout and escrow are not claimed.\n\nLive availability does not establish measured adoption or business impact.";
  return { answer, citations: sources.map(({ id, title, url }) => ({ sourceId: id, label: title, url })), suggestions: [], motion: "point", responseMode: "approved-inventory" };
}

// Direct comparisons quote approved summaries so valid citations cannot mask
// invented commercial claims. More specific questions retain normal retrieval.
export function approvedProjectComparison(question) {
  let remainder = normalize(question).trim();
  if (!remainder.startsWith("compare ")) return null;
  remainder = remainder.slice(8);
  const matches = projects.filter(({ name }) => name.test(remainder));
  if (matches.length < 2) return null;
  for (const { name } of matches) remainder = remainder.replace(name, "");
  if (remainder.replace(/\b(?:and|with|versus|vs)\b/g, "").replace(/[\s,.;?!]/g, "")) return null;
  const sources = matches.map(({ id }) => knowledge.find((source) => source.id === id));
  return {
    answer: "From the approved project summaries:\n\n" + sources.map((source, index) => `[${index + 1}] ${source.title}\n${source.text}`).join("\n\n"),
    citations: sources.map(({ id, title, url }) => ({ sourceId: id, label: title, url })),
    suggestions: [], motion: "point", responseMode: "approved-comparison",
  };
}

// Do not attach a citation after the fact to an unchecked generated claim.
export function hasProjectCitationCoverage(answer, cited) {
  const text = normalize(answer);
  return projects.every(({ id, name }) => !name.test(text) || cited.some((source) => source.id === id));
}
