// Decorative feedback only. React/native controls remain the functional owners.
export function clipboardFeedbackState(buttonText, message) {
	if (!message?.trim()) return null;
	return buttonText?.trim() === "Copied ✓" ? "success" : "error";
}

export function nextGuideFeedback(pending, { busy, sawBusy = false, outcome }) {
	const waiting = pending || busy || sawBusy;
	return { pending: waiting && (busy || !outcome), reveal: waiting && !busy && outcome };
}

export function startJourneyFeedback(root = document) {
	const view = root.defaultView;
	if (!view?.matchMedia || !view.MutationObserver) return;
	const preference = view.matchMedia("(prefers-reduced-motion: reduce)");
	const animations = new Set();
	const knownArt = new WeakSet();
	const pendingArt = new Set();
	const copyMessages = new WeakMap();
	const artSelector = ".case-hero .mock-browser, .case-hero .project-screenshot";
	let waitingForGuide = false;
	const restored = view.performance.getEntriesByType("navigation")[0]?.type === "back_forward";

	function accent(node) {
		if (preference.matches || root.hidden || typeof node.animate !== "function") return;
		const resting = view.getComputedStyle(node).boxShadow;
		const duration = Number.parseFloat(view.getComputedStyle(root.body).getPropertyValue("--journey-panel"));
		try {
			const effect = node.animate(
				[{ boxShadow: "inset 3px 0 0 #326bff" }, { boxShadow: resting }],
				{ duration: Number.isFinite(duration) ? duration : 220, easing: "cubic-bezier(.2,.75,.25,1)" },
			);
			animations.add(effect);
			effect.onfinish = effect.oncancel = () => animations.delete(effect);
		} catch { /* Unsupported animation must never interrupt a real result. */ }
	}
	function completeArt(node) {
		node.dataset.journeyArt = "complete";
		observer?.unobserve(node);
		pendingArt.delete(node);
	}
	const observer = view.IntersectionObserver ? new view.IntersectionObserver(entries => {
		for (const entry of entries) {
			if (!entry.isIntersecting || entry.intersectionRatio < .3) continue;
			const node = entry.target;
			if (preference.matches || root.hidden || node.contains(root.activeElement)) completeArt(node);
			else {
				node.dataset.journeyArt = "running";
				observer.unobserve(node);
			}
		}
	}, { threshold: .3 }) : null;
	function scanArt(node) {
		const candidates = [...(node.querySelectorAll?.(artSelector) ?? [])];
		if (node.matches?.(artSelector)) candidates.push(node);
		for (const art of candidates) {
			if (knownArt.has(art)) continue;
			knownArt.add(art);
			if (preference.matches || restored || view.location.hash || !observer) completeArt(art);
			else {
				pendingArt.add(art);
				art.dataset.journeyArt = "waiting";
				observer.observe(art);
			}
		}
	}
	function syncCopy() {
		for (const message of root.querySelectorAll(".copy-feedback")) {
			const state = clipboardFeedbackState(message.previousElementSibling?.textContent, message.textContent);
			if (!state) { delete message.dataset.journeyState; copyMessages.delete(message); continue; }
			message.dataset.journeyState = state;
			if (copyMessages.get(message) !== message.textContent) accent(message);
			copyMessages.set(message, message.textContent);
		}
	}
	function syncGuide(sawBusy = false) {
		const busy = Boolean(root.querySelector(".guide-assistant-status"));
		const outcome = root.querySelector(".guide-assistant-error, .guide-assistant-turn-assistant[data-guide-current='true']");
		const next = nextGuideFeedback(waitingForGuide, { busy, sawBusy, outcome: Boolean(outcome) });
		waitingForGuide = next.pending;
		if (next.reveal) accent(outcome);
	}
	const mutations = new view.MutationObserver(records => {
		let sawBusy = false;
		for (const record of records) for (const node of record.addedNodes) {
			if (node.nodeType !== 1) continue;
			scanArt(node);
			if (node.matches(".guide-assistant-status") || node.querySelector(".guide-assistant-status")) sawBusy = true;
			// Only newly inserted case sections get a cue; tabs/focus never move.
			if (node.matches("#depth-panel section")) accent(node);
			else for (const section of node.querySelectorAll("#depth-panel section")) accent(section);
		}
		for (const art of pendingArt) if (!art.isConnected) { observer?.unobserve(art); pendingArt.delete(art); }
		syncCopy(); syncGuide(sawBusy);
	});
	const onPreference = () => {
		if (!preference.matches) return;
		for (const effect of [...animations]) effect.cancel();
		for (const art of pendingArt) completeArt(art);
	};
	const onAnimationEnd = event => {
		if (event.animationName === "journey-case-art" && event.target.matches(artSelector)) completeArt(event.target);
	};
	scanArt(root); syncCopy(); syncGuide();
	mutations.observe(root.body, { childList: true, characterData: true, subtree: true });
	preference.addEventListener("change", onPreference);
	root.addEventListener("animationend", onAnimationEnd);
	return () => {
		mutations.disconnect(); observer?.disconnect();
		for (const effect of [...animations]) effect.cancel();
		for (const art of pendingArt) art.dataset.journeyArt = "complete";
		preference.removeEventListener("change", onPreference);
		root.removeEventListener("animationend", onAnimationEnd);
	};
}
