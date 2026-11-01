import { knowledge } from './guide-knowledge.js';
import { namedProjectSources, normalizeQuestion } from './guide-evidence.js';

export function isTourQuestion(question) {
  return !namedProjectSources(question).length && /\b(tour|introduce ali|introduce.*products|what does ali do|ali.s job|ali.s role|gioi thieu.*ali|gioi thieu.*san pham)\b/.test(normalizeQuestion(question));
}

export function tourReply(name, question) {
  const vi=/\b(gioi thieu|san pham)\b/.test(normalizeQuestion(question));
  const ids=['ali-overview','growth-commerce-os','stos','cho-kenh'];
  const answer=vi
    ? `Mình là ${name}, hướng dẫn viên portfolio của bạn. Ali là kỹ sư AI ứng dụng và sản phẩm, đồng thời sáng lập DUYTRUYENTHONG. [1]\n\nBạn có thể bắt đầu với Growth Commerce OS — website dịch vụ [2], STOS — trang bán hàng [3], hoặc Chợ Kênh — danh mục kênh TikTok. [4]\n\nAI gợi ý của STOS còn ở kế hoạch. Chợ Kênh tiếp nhận yêu cầu thủ công; chưa xác nhận checkout hay escrow tự động. Hiệu quả kinh doanh chưa được xác minh độc lập. [2][3][4]\n\nBạn muốn khám phá sản phẩm nào trước?`
    : `I’m ${name}, your portfolio guide. Ali is an applied AI and product engineer and founder of DUYTRUYENTHONG. [1]\n\nStart with Growth Commerce OS for service workflows [2], STOS for sales pages [3], or Chợ Kênh for TikTok-channel discovery. [4]\n\nSTOS AI suggestions are planned. Chợ Kênh uses manual inquiries; automated checkout and escrow aren’t claimed. Business impact isn’t independently verified. [2][3][4]\n\nWhich product would you like to explore first?`;
  return {answer,citations:ids.map(id=>{const s=knowledge.find(s=>s.id===id);return {sourceId:s.id,label:s.title,url:s.url};}),suggestions:vi?['STOS là gì?','Giới thiệu Growth Commerce OS']:['What does STOS do?','What does Growth Commerce OS do?'],motion:'point',responseMode:'guided-tour'};
}
