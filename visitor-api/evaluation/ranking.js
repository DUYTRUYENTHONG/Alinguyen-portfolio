export function rankOf(ids, expected) {
	const index = ids.indexOf(expected);
	return index < 0 ? null : index + 1;
}
export function metrics(rows) {
	const answerable = rows.filter((r) => r.expected !== null);
	const ranks = answerable.map((r) => rankOf(r.ids, r.expected));
	const n = ranks.length;
	return {
		questions: n,
		top1: n ? ranks.filter((r) => r === 1).length / n : null,
		top3: n ? ranks.filter((r) => r !== null && r <= 3).length / n : null,
		mrr3: n
			? ranks.reduce((s, r) => s + (r !== null && r <= 3 ? 1 / r : 0), 0) / n
			: null,
	};
}
export function rrf(lists, k = 60) {
	const scores = new Map();
	for (const list of lists)
		list.forEach((id, index) =>
			scores.set(id, (scores.get(id) || 0) + 1 / (k + index + 1)),
		);
	return [...scores]
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
		.map(([id]) => id);
}
