import { knowledge } from './guide-knowledge.js';

const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

export function isLiveProjectInventoryQuestion(question, recentTurns = []) {
  const q = normalize(question);
  const availability = /\b(live|launched|deployed|online|available now|currently available|dang hoat dong|dang chay|da trien khai|da ra mat)\b/.test(q);
  const inventory = /\b(projects?|products?|sites?|websites?|work|du an|san pham|trang web)\b/.test(q);
  const namedProject = /\b(stos|cho kenh|growth commerce|kkbox|vibecode)\b/.test(q);
  const listing = /\b(which|what|list|all|show|nhung|liet ke|tat ca|nao)\b/.test(q);
  const explicitInventory = /\b(list|all|liet ke|tat ca|which (?:live )?(?:products|projects|sites|websites)|what (?:live )?(?:products|projects|sites|websites))\b/.test(q);
  if (/\b(not live|not deployed|planned|chua|ke hoach)\b/.test(q)) return false;
  if (availability && (!namedProject || explicitInventory) && (inventory || listing || /what.*live/.test(q))) return true;
  // Only short inventory follow-ups inherit intent; a new subject must not.
  if (/^(any (others?|more)|what else|all of them|anything else|con (gi|du an nao|san pham nao) (nua)?)[?!.\s]*$/.test(q.trim())) {
    const prior = [...recentTurns].reverse().find((turn) => turn.role === 'user');
    return Boolean(prior && isLiveProjectInventoryQuestion(prior.text));
  }
  return false;
}

export function liveProjectInventoryReply(question, recentTurns = []) {
  const vietnamese = /[ăâđêôơư]|\b(du an|san pham|nao|liet ke|tat ca|dang|con gi)\b/i.test(normalize(question));
  const vi = vietnamese || (/^(any|what else|all of them)/i.test(question) && recentTurns.some((t) => t.role === 'user' && /[ăâđêôơư]/i.test(t.text)));
  const sources = knowledge.filter((source) => source.liveProject);
  if (!sources.length) throw new Error('Missing reviewed live project inventory');
  const heading = vi ? 'Các website dự án đang hoạt động được ghi nhận trong portfolio:' : 'The portfolio lists these live project websites:';
  const items = sources.map((source, index) => `${index + 1}. ${source.title} — ${source.liveProject[vi ? 'vi' : 'en']} [${index + 1}]`);
  const limits = vi ? 'Đây là trạng thái website công khai; không phải xác nhận mức độ sử dụng hay kết quả kinh doanh. AI gợi ý của STOS và thanh toán/escrow tự động của Chợ Kênh chưa được xác nhận là tính năng đang hoạt động.' : 'These are public website statuses, not verified adoption or business results. STOS AI suggestions are planned; automated checkout and escrow are not claimed for Chợ Kênh.';
  return { answer: [heading, ...items, limits].join('\n\n'), citations: sources.map(({ id, title, url }) => ({ sourceId: id, label: title, url })), suggestions: [], motion: 'point', responseMode: 'verified-inventory' };
}
