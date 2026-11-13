import registry from "./guide-actions.json" with { type: "json" };
const normalize = (text) =>
	text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d");
export const actionIds = Object.keys(registry);
export function needsProjectClarification(question, ids) {
	return (
		new Set(ids).size > 1 &&
		/\b(it|its|they|their|what about)\b|nó|dự án đó/i.test(question)
	);
}
export function validActionState(state) {
	return (
		state === undefined ||
		(!!state &&
			!Array.isArray(state) &&
			typeof state === "object" &&
			Object.keys(state).every((k) => ["used", "declined"].includes(k)) &&
			["used", "declined"].every(
				(k) =>
					state[k] === undefined ||
					(Array.isArray(state[k]) &&
						state[k].length <= 7 &&
						state[k].every((id) => actionIds.includes(id))),
			))
	);
}
export function selectGuideAction({
	question,
	sources = [],
	state = {},
	mode,
}) {
	const q = normalize(question);
	if (
		/(?:don't|do not|no|khong|chua).{0,18}(?:cv|resume|contact|lien he)/.test(q)
	)
		return [];
	// Intent is explicit language, never an inferred identity from role or location.
	if (
		mode === "source-excerpt" ||
		mode === "abstention" ||
		/guarantee|hired by|won.*(kaggle|competition)|job promise|dam bao.*viec|earlier you said/.test(
			q,
		)
	)
		return [];
	if (
		/no (?:thanks|demo|action)|decline|khong.*(?:demo|de xuat)|dung.*de xuat/.test(
			q,
		)
	)
		return [];
	let id = null;
	if (/\b(cv|resume)\b/.test(q)) id = "master-cv";
	else if (/collaborat|contact|discuss|hop tac|lien he/.test(q))
		id = "public-contact";
	else if (sources.includes("kkbox-results")) id = "kkbox-case";
	else if (sources.includes("vibecode-kit")) id = "vibecode-repo";
	else if (/try|live|demo|thu|hoat dong|dung duoc/.test(q)) {
		const options = ["stos-demo", "cho-kenh-demo", "growth-demo"].filter((id) =>
			sources.includes(registry[id].source),
		);
		if (options.length === 1) id = options[0];
	}
	if (!id || [...(state.used || []), ...(state.declined || [])].includes(id))
		return [];
	const action = registry[id];
	if (action.source && !sources.includes(action.source)) return [];
	const vi = /[ăâđêôơư]/i.test(question);
	return [
		{
			id,
			kind: action.kind,
			url: action.url,
			label: vi ? action.vi : action.label,
		},
	];
}
