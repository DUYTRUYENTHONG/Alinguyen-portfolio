import { knowledge } from "./guide-knowledge.js";
import { retrieveGuideSources } from "./guide-retrieval.js";
import { evidenceReply } from "./guide-evidence.js";
export function verifyGuideReceipt({
	status,
	result,
	fixture,
	revision,
	environment,
}) {
	const r = result?.receipt;
	if (
		status !== 200 ||
		r?.environment !== environment ||
		r?.revision !== revision ||
		r?.providerAttempted !== fixture.provider
	)
		return false;
	if (!result.citations?.some((c) => c.sourceId === fixture.source))
		return false;
	if (!fixture.provider)
		return r.providerStatus === null && r.returnedModel === null;
	if (
		r.providerStatus !== 200 ||
		typeof r.returnedModel !== "string" ||
		!/^deepseek[-\w./]*$/.test(r.returnedModel) ||
		result.responseMode !== "reviewed-evidence" ||
		!Array.isArray(r.selectedIds) ||
		!r.selectedIds.includes(fixture.source)
	)
		return false;
	const allowed = new Set(
		retrieveGuideSources(fixture.question, {
			role: "Recruiter",
			section: "Selected work",
		}).map((s) => s.id),
	);
	if (
		new Set(r.selectedIds).size !== r.selectedIds.length ||
		r.selectedIds.some((id) => !allowed.has(id))
	)
		return false;
	const sources = r.selectedIds.map((id) => knowledge.find((s) => s.id === id));
	const expected = evidenceReply(sources, fixture.question);
	return (
		result.answer === expected.answer &&
		JSON.stringify(result.citations) === JSON.stringify(expected.citations)
	);
}
